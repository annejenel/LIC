from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Student, Transaction, Staff
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.contrib.auth.models import User

class StudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Student
        fields = ['studentID', 'name', 'course', 'time_left', 'password', 'status', 'is_logged_in']

    def create(self, validated_data):
        # Set a default password if not provided
        if 'password' in validated_data:
            validated_data['password'] = '123456'
        
        validated_data['password'] = make_password(validated_data['password'])
        return super(StudentSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        # Update password only if provided
        if 'password' in validated_data:
            # Check if the password is already set to default
            if validated_data['password'] == 'your_default_password':  # Replace with your actual default password
                instance.password = make_password('your_default_password')  # Keep it as the default password
            else:
                validated_data['password'] = make_password(validated_data['password'])
        return super(StudentSerializer, self).update(instance, validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    student_id = serializers.ReadOnlyField(source='student.studentID')  

    class Meta:
        model = Transaction
        fields = ['id', 'student', 'student_id', 'reference_number', 'timestamp','receipt_image']

class StaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Staff
        fields = ['username', 'name', 'password'] 

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = 'licstaff'

        validated_data['password'] = make_password(validated_data['password'])
        return super(StaffSerializer, self).create(validated_data)
    
class StaffStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_staff']  # Specify the fields to be updated

    def update(self, instance, validated_data):
        # You can perform additional validation here if needed
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.save()
        return instance

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        
        attrs['user'] = user
        return attrs
    
class StaffLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        # Check if the username exists in the database
        try:
            staff = Staff.objects.get(username=username)
        except Staff.DoesNotExist:
            raise serializers.ValidationError("Username not found.")

        is_validpassword = check_password(password, staff.password)
        # Verify the password
        if not is_validpassword:  # Use the check_password method
            raise serializers.ValidationError("Invalid credentials")
        
        attrs['staff'] = staff  # Store the user in the validated data
        return attrs

# Adding of Staff
class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'is_active']  # Include only these fields

class StaffStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']  # Make sure this field is included