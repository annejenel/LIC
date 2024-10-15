from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Student, Transaction, Staff
from .serializers import StudentSerializer, TransactionSerializer, StaffSerializer, UserLoginSerializer, StaffLoginSerializer, StaffUserSerializer, StaffStatusSerializer
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
            # Retrieve the student instance
            student = Student.objects.get(studentID=studentID)

            # Define your default password
            default_password = '123456'  # Replace with your actual default password

            # Check if the current password is already the default
            is_valid = check_password(default_password, student.password)
                
            if(is_valid == True):
                return Response({"message": "Current password is already the default."}, status=status.HTTP_400_BAD_REQUEST)

            # Reset the password to the default password
            student.password = make_password(default_password)  # Directly set it to the default password
            student.save()

            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
    

class TransactionCreateView(APIView):
   
    def post(self, request, *args, **kwargs):
        reference_number = request.data.get('reference_number')
        student_id = request.data.get('student_id')
        hours_to_add = request.data.get('hours')
        receipt_image = request.FILES.get('receipt')

        # Print received data for debugging
        print(f"Received data: reference_number={reference_number}, student_id={student_id}, hours_to_add={hours_to_add}")

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
        student.time_left += int(hours_to_add) * 60
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
        serializer.is_valid(raise_exception=True)  # Validate the data

        staff = serializer.validated_data['staff']  # Get the authenticated user

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