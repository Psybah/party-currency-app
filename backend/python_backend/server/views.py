from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .serializers import UserSerializer
import re

def validate_password_strength(password):
   
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not re.search(r"[0-9]", password):
        raise ValidationError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValidationError("Password must contain at least one special character")

@api_view(['POST'])
def login(request):
   
    try:
        if not request.data.get('username') or not request.data.get('password'):
            return Response(
                {"error": "Both username and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, username=request.data['username'])
        
        if not user.check_password(request.data['password']):
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "Account is disabled"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        
        response = Response({
            "token": token.key,
            "user": serializer.data
        })
        
        # Add security headers
        response["X-Content-Type-Options"] = "nosniff"
        response["X-Frame-Options"] = "DENY"
        response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

    except Exception as e:
        return Response(
            {"error": "An error occurred during login"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def signup(request):
    
    try:
        data = request.data.copy()
        
        # Validate email
        try:
            validate_email(data.get('email'))
        except ValidationError:
            return Response(
                {"error": "Invalid email address"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email already exists
        if User.objects.filter(email=data.get('email')).exists():
            return Response(
                {"error": "Email already registered"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate password strength
        try:
            validate_password_strength(data.get('password'))
        except ValidationError as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        data['username'] = data['email']
        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data["password"])
            user.save()
            
            token = Token.objects.create(user=user)
            
            response = Response({
                "token": token.key,
                "user": serializer.data
            })
            
            # Add security headers
            response["X-Content-Type-Options"] = "nosniff"
            response["X-Frame-Options"] = "DENY"
            response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
            
            return response
            
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {"error": "An error occurred during signup"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
   
    try:
        return Response({
            "email": request.user.email,
            "username": request.user.username
        })
    except Exception as e:
        return Response(
            {"error": "An error occurred"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )