from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, RegisterSerializer
import random
from django.core.mail import send_mail

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate a verification code
            verification_code = random.randint(100000, 999999)
            user.userprofile.verification_code = verification_code  # Use user.userprofile
            user.userprofile.save()

            # Send verification email
            try:
                send_mail(
                    'Verify Your Email',
                    f'Your verification code is: {verification_code}',
                    'kroue4444@gmail.com',  # Replace with your email
                    [user.email],
                    fail_silently=False,
                )
                return Response({'message': 'User registered successfully. Verification email sent.'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        verification_code = request.data.get('verification_code')

        if not email or not verification_code:
            return Response({'error': 'Email and verification code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if user.userprofile.verification_code == verification_code:
                user.userprofile.verification_code = None  # Clear the verification code
                user.userprofile.save()
                return Response({'message': 'Email verified successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class SessionCheckView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'authenticated': True, 'email': request.user.email, 'name': request.user.get_full_name(), 'id': request.user.id})
        return Response({'authenticated': False}, status=401)