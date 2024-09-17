from django.db import models
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Inactive', 'Inactive'),
    ('Dropped_out', 'Dropped Out'),
]

    
    studentID = models.CharField(max_length=10, unique=True)
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
