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
from .utils import PasswordResetCodeManager as prcm
from django.core.mail import send_mail
from rest_framework.throttling import AnonRateThrottle
from .utils import PasswordResetCodeManager as prcm


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
        code = prcm.generate_code(email)
        send_mail(
            subject='Password Reset Code',
            message=f'Your password reset code is: {code}',
            from_email='from@partycurrency.com',
            recipient_list=[email],
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
            {"message": f"An error occurred {e}"},
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

        if prcm.validate_code(email, code):
            user = CUser.objects.get(email=email)
            token, _ = Token.objects.get_or_create(user=user)
            
            prcm.invalidate_code(email, code)
            
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

        # Add password validation
        if len(new_password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters long"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user.set_password(new_password)
        user.save()

        # Optionally invalidate all tokens after password reset
        Token.objects.filter(user=user).delete()

        return Response({
            'message': "Password reset successfully"
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": "An error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def change_password(request):
    user = request.user
    if not request.data['confirmpassword'] ==  request.data['newpassword']:
        return Response ({
            "message":"passwords don't match"
        },status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(request.data['oldpassword']):
        return Response ({
            "message":"incorrect password"
        },status=status.HTTP_400_BAD_REQUEST)
    if not (len(request.data['newpassword']) >= 8 and any(c.isdigit() for c in request.data['newpassword'])):
        return Response({
            "message": "Password must be at least 8 characters and contain at least one number"
        }, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(request.data['confirmpassword'])
    user.save()
    return Response ({
            "message":"password changed successfully"
        },status=status.HTTP_200_OK)