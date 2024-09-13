from django.db import models

class Student(models.Model):
    studentID = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    time_left = models.PositiveIntegerField()  # Time left in minutes

    def __str__(self):
        return self.name
