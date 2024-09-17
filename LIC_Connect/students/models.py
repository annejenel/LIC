from django.db import models
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('dropped_out', 'Dropped Out'),
    ]
    
    studentID = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    time_left = models.PositiveIntegerField()  # Time left in minutes
    password = models.CharField(
        max_length=128,
        default=make_password('changeme')  # Default hashed password
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active'  # Default to 'active' for existing and new records
    )

    def __str__(self):
        return self.name
