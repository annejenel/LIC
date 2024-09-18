from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
        ('Dropped_out', 'Dropped Out'),
    ]

    # Adjust studentID field
    studentID = models.CharField(
        max_length=15,  # Increased length to accommodate format
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
        default=make_password('123456')  # Default hashed password
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='Active'  # Default to 'active' for existing and new records
    )

    def __str__(self):
        return self.name
