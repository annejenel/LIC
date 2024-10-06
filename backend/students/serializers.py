from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Student, Transaction, Staff

class StudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Student
        fields = ['studentID', 'name', 'course', 'time_left', 'password', 'status']  # Added status

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(StudentSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(StudentSerializer, self).update(instance, validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    student_id = serializers.ReadOnlyField(source='student.studentID')  

    class Meta:
        model = Transaction
        fields = ['id', 'student', 'student_id', 'reference_number', 'timestamp']

class StaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Staff
        fields = ['staffID', 'name', 'password'] 

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(StaffSerializer, self).create(validated_data)
