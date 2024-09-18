from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, TransactionCreateView

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('transactions/', TransactionCreateView.as_view(), name='transaction-create'),
]
