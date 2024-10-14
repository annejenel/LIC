from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TransactionCreateView, TransactionListView, ResetPasswordView, UserLoginView, LogoutView, ImportStudentView

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
    path('students/<str:studentID>/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('import-student/', ImportStudentView.as_view(), name='import-student'),
]
