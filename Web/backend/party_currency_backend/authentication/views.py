from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer
from.models import CustomUser as CUser,Merchant
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes,throttle_classes
from .utils import generate_code,validate_code
from django.core.mail import send_mail
from rest_framework.throttling import AnonRateThrottle


class PasswordResetThrottle(AnonRateThrottle):
    rate = '3/hour'


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    user = get_object_or_404(CUser, username=request.data["email"].strip().lower())
    if not user.check_password(request.data["password"]):
        return Response({"message":"user not found or incorrect password"},status.HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
                    "Message":"Signup successful. use api/users/profile to get userdetails passing this token as an authorization, ",
            "token": token.key
        }, status=status.HTTP_202_ACCEPTED)



@api_view(["POST"])
@permission_classes([AllowAny])
def signupUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = CUser.objects.create_user(
            username=request.data.get("email"),  
            email=request.data.get("email"),
            password=request.data.get("password"),
            first_name=request.data.get("first_name"),
            last_name=request.data.get("last_name"),
            phone_number=request.data.get("phone_number"),
                # Password is hashed here
        )
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "Message":"Login successful. use api/users/profile to get userdetails passing this token as an authorization, ",
            "token": token.key
    
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def signupMerchant(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = Merchant.objects.create_user(
            username=request.data.get("email"),  
            email=request.data.get("email"),
            password=request.data.get("password"),
            first_name=request.data.get("first_name"),
            last_name=request.data.get("last_name"),
            phone_number=request.data.get("phone_number"),
            country=request.data.get("country"),
            state = request.data.get("state"),
            city = request.data.get("city"),
            business_type = request.data.get("business_type"),
                
        )

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "Message":"Login successful. use api/users/profile to get userdetails passing this token as an authorization, ",
            "token": token.key
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def generate_password_reset_code(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response(
                {"message": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = CUser.objects.get(email=email)
        code = generate_code(email)
        send_mail(
            'Password Reset Code',
            f'Your password reset code is: {code}',
            'from@yourdomain.com',
            [email],
            fail_silently=False,
        )
        return Response(
            {"message": "Reset code has been sent to your email"},
            status=status.HTTP_200_OK
        )
    except CUser.DoesNotExist:
        # Use same message to prevent email enumeration
        return Response(
            {"message": "If this email exists, a reset code has been sent"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"message": "An error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )




KOhws this password reset flow @api_view(['POST'])
@permission_classes([AllowAny])
def generate_password_reset_code(request):
    email = request.data['email']
    try:
        user = CUser.objects.get(email=email)
        code = generate_code(email)
        return Response(
            {
                "message": f"code generated for user {email}",
                "code": code
            }, status=status.HTTP_201_CREATED
        )
    except CUser.DoesNotExist:
        return Response(
            {
                "message": "User with this email does not exist"
            }, status=status.HTTP_404_NOT_FOUND
        )@api_view(['POST'])
@permission_classes([AllowAny])
def get_password_reset_token(request):
    email=request.data['email']
    code=request.data['code']
    if validate_code(email,code):
        user = CUser.objects.get(email=email)
        token =Token.objects.get_or_create(user=user)
        return Response({"message":"code validated,use token to reset password",
                         "token":token.key
                         },status=status.HTTP_200_OK)
    else:
        return Response ({"message":"wrong or expired code"},status=status.HTTP_400_BAD_REQUEST)   @api_view(["POST"])
def reset_password(request):
    user = request.user
    new_password = request.data['password']
    user.set_password(new_password)
    user.save()
    return Response (
        {
            'message':"password reset successfully"
        },status=status.HTTP_202_ACCEPTED
    )EditI'll analyze this password reset flow. While the basic structure is there, there are several security and implementation concerns that should be addressed:
Security Issues:

The first endpoint returns the verification code in the response, which is a security risk. The code should only be sent via email/SMS.
There's no rate limiting on code generation or validation attempts, which makes it vulnerable to brute force attacks.
The reset_password endpoint doesn't verify the current password. While this is optional for a password reset flow, you should document this decision.

Implementation Issues:

In get_password_reset_token:

pythonCopytoken =Token.objects.get_or_create(user=user)
This returns a tuple (token, created). You need to handle it like:
pythonCopytoken, _ = Token.objects.get_or_create(user=user)

Error handling is incomplete. Many operations could raise exceptions.

Here's an improved version:
pythonCopyfrom django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail

class PasswordResetThrottle(AnonRateThrottle):
    rate = '3/hour'

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def generate_password_reset_code(request):
    try:
        email = request.data.get('email')
        if not email:
            return Response(
                {"message": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = CUser.objects.get(email=email)
        code = generate_code(email)
        
        # Send code via email
        send_mail(
            'Password Reset Code',
            f'Your password reset code is: {code}',
            'from@yourdomain.com',
            [email],
            fail_silently=False,
        )

        return Response(
            {"message": "Reset code has been sent to your email"},
            status=status.HTTP_200_OK
        )
    except CUser.DoesNotExist:
        # Use same message to prevent email enumeration
        return Response(
            {"message": "If this email exists, a reset code has been sent"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"message": "An error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def get_password_reset_token(request):
    try:
        email = request.data.get('email')
        code = request.data.get('code')
        if not all([email, code]):
            return Response(
                {"message": "Email and code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if validate_code(email, code):
            user = CUser.objects.get(email=email)
            token, _ = Token.objects.get_or_create(user=user)
            invalidate_code(email, code)
            return Response({
                "message": "Code validated. Use token to reset password",
                "token": token.key
            }, status=status.HTTP_200_OK)
        return Response(
            {"message": "Invalid or expired code"},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": "An error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def reset_password(request):
    try:
        new_password = request.data.get('password')
        if not new_password:
            return Response(
                {"message": "New password is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(new_password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters long"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user
        user.set_password(new_password)
        user.save()
        Token.objects.filter(user=user).delete()

        return Response({
            'message': "Password reset successfully, login again"
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": "An error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )