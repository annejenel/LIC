# Generated by Django 4.2.5 on 2024-10-06 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0003_alter_staff_password_alter_student_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$600000$f8rf8b6OKhA53ziZty8kjW$vLi1pW5nKqAqe3ib5V1l/4YWyimN8FfoOv3FumBUACs=', max_length=128),
        ),
        migrations.AlterField(
            model_name='student',
            name='password',
            field=models.CharField(max_length=128),
        ),
    ]
