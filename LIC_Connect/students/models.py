from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Dropped_out', 'Dropped Out'),
    ]

    studentID = models.CharField(
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{2}-\d{4}-\d{3}$',
                message='Student ID must be in the format XX-XXXX-XXX',
                code='invalid_studentID'
            )
        ]
    )
    name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    time_left = models.PositiveIntegerField()
    password = models.CharField(
        max_length=128,
        default=make_password('123456')
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='Active'
    )

    def __str__(self):
        return self.name

class Transaction(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    reference_number = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.reference_number} for {self.student.name}"
