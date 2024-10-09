from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Student, Transaction, Staff
from .serializers import StudentSerializer, TransactionSerializer, StaffSerializer
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from django.conf import settings 
from django.contrib.auth.hashers import make_password, check_password




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

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    lookup_field = 'username'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        username = request.data.get('username')
        if Staff.objects.filter(username=username).exists():
            return Response({
                "alert": {
                    "type": "error",
                    "message": f"Username '{username}' already exists."
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "alert": {
                    "type": "success",
                    "message": "Staff member created successfully!",
                },
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "alert": {
                "type": "error",
                "message": "Error: " + str(serializer.errors), 
            }
        }, status=status.HTTP_400_BAD_REQUEST)