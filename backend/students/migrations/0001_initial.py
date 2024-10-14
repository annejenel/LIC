# Generated by Django 4.2.5 on 2024-10-12 00:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=15, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('studentID', models.CharField(max_length=15, unique=True, validators=[django.core.validators.RegexValidator(code='invalid_studentID', message='Student ID must be in the format XX-XXXX-XXX', regex='^\\d{2}-\\d{4}-\\d{3}$')])),
                ('name', models.CharField(max_length=100)),
                ('course', models.CharField(max_length=100)),
                ('time_left', models.PositiveIntegerField()),
                ('password', models.CharField(max_length=128)),
                ('status', models.CharField(choices=[('Student', 'Student'), ('Alumnus', 'Alumnus')], default='Student', max_length=15)),
                ('is_logged_in', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reference_number', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('receipt_image', models.ImageField(blank=True, null=True, upload_to='receipts/')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.student')),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.CharField(max_length=255)),
                ('date', models.DateField(auto_now_add=True)),
                ('loginTime', models.TimeField(auto_now_add=True)),
                ('logoutTime', models.TimeField(blank=True, null=True)),
                ('consumedTime', models.IntegerField(blank=True, null=True)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions_as_parent', to='students.student')),
            ],
        ),
    ]
