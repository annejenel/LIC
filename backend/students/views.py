from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Student, Transaction, Staff, Session, StaffActivityLog, ActivityLog, log_staff_activity
from .serializers import StudentSerializer, TransactionSerializer, StaffSerializer, UserLoginSerializer, StaffLoginSerializer, StaffUserSerializer, StaffStatusSerializer, SessionSerializer, StaffActivityLogSerializer, ActivityLogSerializer
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from django.conf import settings 
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import AllowAny 
from django.contrib.auth.models import User
import json
from rest_framework.decorators import api_view
import logging
from django.utils import timezone



logger = logging.getLogger(__name__)

class StudentViewSet(ModelViewSet):
    
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'studentID'  # Use studentID as the lookup field instead of pk

    def get_object(self):
        student_id = self.kwargs['studentID']
        # Try to find the student by formatted studentID first
        try:
            return Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            # If studentID format fails, try without the format (or handle case)
            return Student.objects.get(studentID=student_id.replace('-', ''))  
        

class ResetPasswordView(APIView):

    def post(self, request, studentID):
        try:
            # Fetch the student by studentID
            student = Student.objects.get(studentID=studentID)
            default_password = '123456'

            # Check if the current password is already the default
            if check_password(default_password, student.password):
                return Response({"message": "Current password is already the default."}, status=status.HTTP_400_BAD_REQUEST)

            # Reset the password
            student.password = make_password(default_password)
            student.save()

            # Log the password reset action
            staff_username = request.user.username  # The username of the staff performing the reset
            
            # Log activity
            log_data = {
                "username": staff_username,
                "action": f"Reset password for student {studentID}",
                "timestamp": timezone.now()  # Auto-generate the timestamp here
            }
            log_activity(request._request)  # Pass the raw Django request object

            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

class TransactionCreateView(APIView):
    
    def post(self, request, *args, **kwargs):
        # Retrieve data from the request
        reference_number = request.data.get('reference_number')
        student_id = request.data.get('student_id')
        hours_to_add = request.data.get('hours')
        receipt_image = request.FILES.get('receipt')  # Retrieve the uploaded receipt image

        # Validate required fields
        if not reference_number or not student_id or not hours_to_add:
            return Response({"error": "Reference number, hours, and student ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the student exists
        try:
            student = Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the reference number has already been used
        if Transaction.objects.filter(reference_number=reference_number).exists():
            return Response({"error": "This reference number has already been used"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new transaction
        transaction = Transaction.objects.create(
            student=student,
            reference_number=reference_number,
            receipt_image=receipt_image  # Save the image file in the transaction
        )

        # Update student's time_left (convert hours to minutes and add)
        student.time_left += int(hours_to_add) * 60  # Adding hours in minutes
        student.save()

        # Serialize and return the created transaction
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class TransactionListView(generics.ListAPIView):
    
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class StaffLoginView(generics.GenericAPIView):
    serializer_class = StaffLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        staff = serializer.validated_data['staff']

        # Log the login action (already implemented)
        log_staff_activity(staff, "Logged in")

        return Response({
            'status': 'success',
            'user_id': staff.id,
            'username': staff.username
        }, status=status.HTTP_200_OK)


    
class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'status': 'success',
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_200_OK) 
    
class LogoutView(APIView):
    # Remove or comment this out to allow unauthenticated access
    # permission_classes = [IsAuthenticated]  

    def post(self, request):
        try:
            token = request.auth  # Get the user's token
            print(token)
            if token is None:
                # If there is no token, just return a success message
                return Response({"message": "No token found. Successfully logged out."}, status=status.HTTP_200_OK)

            # Delete the token to log out
            token.delete()  
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class StaffCreateView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone

    def post(self, request, *args, **kwargs):
        serializer = StaffUserSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            # Create the user with the default values for is_staff and is_superuser
            password = '123456'
            staff = User.objects.create(
                username=serializer.validated_data['username'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name'],
                is_staff=True,  # Default to staff
                is_superuser=False  # Default to non-superuser
            )
            staff.set_password(password)  # Hash the password
            staff.save()

            return Response({
                "message": "User created successfully",
                "data": StaffUserSerializer(staff).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StaffListView(generics.ListAPIView):
    queryset = User.objects.filter(is_staff=True)  # Filter for staff users
    serializer_class = StaffUserSerializer
   
class UpdateStaffStatusView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = StaffStatusSerializer

    def get_object(self):
        username = self.kwargs.get("username")
        return generics.get_object_or_404(User, username=username)

    def patch(self, request, *args, **kwargs):
        # Retrieve the user instance based on the username
        user = self.get_object()
        return self.update(request, *args, **kwargs)

class ImportStudentView(APIView):
    def post(self, request, *args, **kwargs):
        student_data = request.data  # Expecting JSON data (list of students)

        # Check if the data is a list (multiple student records)
        if not isinstance(student_data, list):
            return Response({"error": "Invalid data format. Expected a list."}, status=status.HTTP_400_BAD_REQUEST)

        inserted_students = []
        duplicate_students = []

        for student_info in student_data:
            # Check if the student already exists based on studentID
            if Student.objects.filter(studentID=student_info.get('studentID')).exists():
                duplicate_students.append(student_info)  # Track duplicate records
            else:
                serializer = StudentSerializer(data=student_info)
                if serializer.is_valid():
                    serializer.save()
                    inserted_students.append(serializer.data)  # Track inserted records
                else:
                    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Construct response messages
        response_message = {
            "message": "Students imported successfully",
            "inserted": inserted_students,
            "duplicates": duplicate_students,
        }

        # Return a message that indicates success but also lists duplicates
        return Response(response_message, status=status.HTTP_201_CREATED)

class SessionListByStudentID(generics.ListAPIView):
    serializer_class = SessionSerializer

    def get_queryset(self):
        studentID = self.kwargs['studentID']
        print(studentID)
        # Filter sessions based on the foreign key's studentID
        return Session.objects.filter(parent_id=studentID)
    

class ActivityLogView(APIView):
    def get(self, request, username):
        try:
            logs = ActivityLog.objects.filter(username=username).order_by('-timestamp')

            if not logs.exists():
                return Response({'message': 'No logs found for this user.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ActivityLogSerializer(logs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching logs for {username}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class StaffLogsView(APIView):
    def get(self, request, username=None):
        logs = ActivityLog.objects.filter(user__username=username).order_by('-timestamp')
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)




class StaffLoginView(generics.GenericAPIView):
    serializer_class = StaffLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        staff = serializer.validated_data['staff']
        
        # Log the login action
        StaffActivityLog.objects.create(staff=staff, action="Logged in")

        return Response({
            'status': 'success',
            'user_id': staff.id,
            'username': staff.username
        }, status=status.HTTP_200_OK)

    

@api_view(['POST'])
def log_activity(request):
    username = request.data.get('username')
    action = request.data.get('action')

    if not username or not action:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Save the log entry to the database with current timestamp
        ActivityLog.objects.create(
            username=username, 
            action=action, 
            timestamp=timezone.now()  # Ensure correct timestamp assignment
        )
        return Response({"message": "Activity logged"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['POST'])
def reset_password(request, studentID):
    try:
        student = Student.objects.get(id=studentID)
        
        # Check if the password is already the default
        if student.is_default_password():
            logger.info(f"Password reset attempted for {studentID}, but password is already default.")
            ActivityLog.objects.create(username=student.username, action="Attempted password reset (already default)", timestamp=timezone.now())
            return Response({"message": "Current password is already the default."}, status=400)
        
        # Reset password logic
        student.reset_password()  # Assuming this method exists
        logger.info(f"Password reset successful for {studentID}")
        
        # Log the activity
        try:
            ActivityLog.objects.create(username=student.username, action="Password reset", timestamp=timezone.now())
        except Exception as e:
            logger.error(f"Failed to log activity for {student.username}: {e}")

        return Response({"message": "Password reset successful"}, status=200)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)


def log_staff_activity(staff, action):
    StaffActivityLog.objects.create(
        staff=staff, 
        action=action, 
        timestamp=timezone.now()  # Explicitly pass the current timestamp
    )
