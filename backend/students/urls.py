from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TransactionCreateView, TransactionListView, ResetPasswordView, UserLoginView, LogoutView, StaffLoginView, StaffCreateView, StaffListView, UpdateStaffStatusView, ImportStudentView

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('login-admin/', UserLoginView.as_view(), name='login-admin'),
    path('login-staff/', StaffLoginView.as_view(), name='login-staff'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
    path('students/<str:studentID>/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('create-user/', StaffCreateView.as_view(), name='create_user'),
    path('staffview/', StaffListView.as_view(), name='staff-list'),
    path('update-status/<str:username>/', UpdateStaffStatusView.as_view(), name='update-status'),
    path('import-student/', ImportStudentView.as_view(), name='import-student'),
]
