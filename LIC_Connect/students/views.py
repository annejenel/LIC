from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Student, Transaction
from .serializers import StudentSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import viewsets
from .models import Staff
from .serializers import StaffSerializer



class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'studentID'  

    def get_object(self):
        student_id = self.kwargs['studentID']
        try:
            return Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Student.objects.get(studentID=student_id.replace('-', '')) 

class TransactionCreateView(APIView):
    def post(self, request, *args, **kwargs):
        reference_number = request.data.get('reference_number')
        student_id = request.data.get('student_id')
        hours_to_add = request.data.get('hours')

        print(f"Received data: reference_number={reference_number}, student_id={student_id}, hours_to_add={hours_to_add}")

        if not reference_number or not student_id or not hours_to_add:
            return Response({"error": "Reference number, hours, and student ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(studentID=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        if Transaction.objects.filter(reference_number=reference_number).exists():
            return Response({"error": "This reference number has already been used"}, status=status.HTTP_400_BAD_REQUEST)

    
        transaction = Transaction.objects.create(
            student=student,
            reference_number=reference_number
        )
        student.time_left += int(hours_to_add) * 60
        student.save()

        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class TransactionListView(generics.ListAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    lookup_field = 'staffID'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        staff_id = request.data.get('staffID')
        if Staff.objects.filter(staffID=staff_id).exists():
            return Response({
                "alert": {
                    "type": "error",
                    "message": f"Error: Staff ID '{staff_id}' already exists."
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