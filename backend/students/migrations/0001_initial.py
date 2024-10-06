# Generated by Django 4.2.5 on 2024-10-06 06:38

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
                ('staffID', models.CharField(max_length=15, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('password', models.CharField(default='pbkdf2_sha256$600000$E4QnsAV4JeuTvwz1biUSfO$xjDtchKdk4gMaKpax8O42yEriVfpQWWeeF1as+bsdwQ=', max_length=128)),
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
                ('password', models.CharField(default='pbkdf2_sha256$600000$lVElpzKxYQjzr9pX1retlP$NDNs1nfEJLL75A8vp6gS4fjXtBhzbL+rAzSaLnquD+U=', max_length=128)),
                ('status', models.CharField(choices=[('Student', 'Student'), ('Alumnus', 'Alumnus')], default='Student', max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reference_number', models.CharField(max_length=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.student')),
            ],
        ),
    ]
