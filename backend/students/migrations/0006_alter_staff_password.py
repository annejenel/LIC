# Generated by Django 4.2.5 on 2024-10-13 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0005_alter_staff_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='password',
            field=models.CharField(default='pbkdf2_sha256$600000$mQAQVROMheWoN5k1qExfqc$PVwjR2/VzNOCbz14Hi6nZ1O8s0X8lLwmbKWomHNnmNI=', max_length=128),
        ),
    ]
