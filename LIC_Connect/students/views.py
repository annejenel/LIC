from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Student, Transaction
from .serializers import StudentSerializer, TransactionSerializer
from rest_framework.views import APIView

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
            return Student.objects.get(studentID=student_id.replace('-', ''))  # Adjust for no format

class TransactionCreateView(APIView):
    def post(self, request, *args, **kwargs):
        reference_number = request.data.get('reference_number')
        student_id = request.data.get('student_id')
        hours_to_add = request.data.get('hours')  # Get hours from the request

        print(f"Received data: reference_number={reference_number}, student_id={student_id}, hours_to_add={hours_to_add}")

        if not reference_number or not student_id or not hours_to_add:
            return Response({"error": "Reference number, hours, and student ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a transaction
        transaction = Transaction.objects.create(
            student=student,
            reference_number=reference_number
        )

        # Update student's time_left (convert hours to minutes and add)
        student.time_left += int(hours_to_add) * 60
        student.save()

        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
