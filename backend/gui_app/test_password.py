# Create a new file named test_password.py in your Django project
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LIC_Connect.settings')
django.setup()

from students.models import Student
from django.contrib.auth.hashers import make_password, check_password

import os
import sys
from pathlib import Path

# Get the absolute path to the directory containing manage.py
DJANGO_PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Add both the project root and its parent to the Python path
sys.path.append(str(DJANGO_PROJECT_ROOT))
sys.path.append(str(DJANGO_PROJECT_ROOT.parent))

# Print debug information
print(f"Current working directory: {os.getcwd()}")
print(f"Project root added to path: {DJANGO_PROJECT_ROOT}")
print(f"Python path: {sys.path}")

try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LIC_Connect.settings')
    import django
    django.setup()
    print("Django setup successful")
except Exception as e:
    print(f"Error during Django setup: {e}")
    sys.exit(1)

# Rest of the test script remains the same
def test_password_verification():
    # Test data
    test_student_id = "test123"
    test_password = "password123"
    
    # 1. First, let's create a test hash
    test_hash = make_password(test_password)
    print(f"1. Generated test hash: {test_hash}")
    
    # 2. Verify our test hash works
    verify_result = check_password(test_password, test_hash)
    print(f"2. Verification of test hash: {verify_result}")
    
    try:
        # 3. Try to find our student
        student = Student.objects.get(studentID=test_student_id)
        print(f"3. Found student in database")
        
        # 4. Print stored hash
        print(f"4. Stored hash in database: {student.password}")
        
        # 5. Try to verify against stored hash
        db_verify_result = check_password(test_password, student.password)
        print(f"5. Verification against database hash: {db_verify_result}")
        
        # 6. Compare the two hashes
        print(f"6. Are the hashes same format? {student.password.startswith('pbkdf2_sha256$') == test_hash.startswith('pbkdf2_sha256$')}")
        
    except Student.DoesNotExist:
        print(f"Student with ID {test_student_id} not found")

if __name__ == "__main__":
    test_password_verification()