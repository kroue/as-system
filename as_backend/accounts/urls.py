from django.urls import path
from .views import RegisterView, LoginView, LogoutView, VerifyEmailView, SessionCheckView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('session/', SessionCheckView.as_view(), name='session-check'),
]