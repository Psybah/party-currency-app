from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer, GoogleLoginSerializer
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
import os


class PasswordResetThrottle(AnonRateThrottle):
    rate = '3/hour'


@api_view(["GET"])
@permission_classes([AllowAny])
def google_login(request):
    oauthurl = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={os.getenv('GOOGLE_CLIENT_ID')}&redirect_uri={os.getenv('GOOGLE_OAUTH2_REDIRECT_URI')}&response_type=code&scope=email profile"
    from django.http import HttpResponseRedirect
    return HttpResponseRedirect(oauthurl)
    # return Response({"oauthurl": oauthurl}, status=status.HTTP_200_OK)

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def google_callback(request):
    # Check for code in both request.data (POST body) and request.GET (URL parameters)
    code = request.data.get("code") if request.method == "POST" else None
    if not code and request.method == "GET":
        code = request.GET.get("code")
    
    if not code:
        return Response({"message": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Exchange authorization code for access token
        token_url = "https://oauth2.googleapis.com/token"
        
        # Get client ID and redirect URI
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        redirect_uri = os.getenv("GOOGLE_OAUTH2_REDIRECT_URI")
       
        import urllib.parse
        redirect_uri = redirect_uri.strip()
        
        token_payload = {
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        }
       
        
        # Import requests at the top of your file
        import requests
        
       
        
        token_response = requests.post(token_url, data=token_payload)
        
        token_data = token_response.json()
        
        if "error" in token_data:
            error_message = token_data.get("error")
            error_description = token_data.get("error_description", "")
            return Response({
                "message": f"Error in token exchange: {error_message}",
                "description": error_description,
                "payload_sent": {
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                    
                    # Don't include code or client_secret for security
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user info with the access token
        access_token = token_data.get("access_token")
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        user_info_response = requests.get(
            user_info_url, 
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_info_response.json()
        
        # Extract relevant user information
        email = user_info.get("email")
        if not email:
            return Response({"message": "Email not found in Google profile"},
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists, otherwise create a new one
        try:
            user = CUser.objects.get(email=email)
        except CUser.DoesNotExist:
            # Create a new user
            user = CUser.objects.create_user(
                username=email,
                email=email,
                first_name=user_info.get("given_name", ""),
                last_name=user_info.get("family_name", ""),
                # Set a random password since the user will use Google login
                password=os.urandom(32).hex(),
            )
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        # Create or get token for the user
        token, _ = Token.objects.get_or_create(user=user)
        
        # Decide how to return based on request method
        if request.method == "GET":
            # For GET requests, redirect to frontend with token
            frontend_url = os.getenv("FRONTEND_URL", "/")
           
            redirect_url = f"{frontend_url}/google/auth?token={token.key}&user={user.type}"
            from django.http import HttpResponseRedirect
            return HttpResponseRedirect(redirect_url)
        else:
            # For POST requests, return JSON
            return Response({
                "message": "Google login successful",
                "token": token.key,
                "user": user.type
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        import traceback
        trace = traceback.format_exc()
        return Response({
            "message": f"An error occurred: {str(e)}",
            "trace": trace
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")
    
    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = CUser.objects.get(username=email)
        if not user.check_password(password):
            return Response({"message": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        if user.is_superuser:
            return Response({"message": "Admin Login, Use api/users/profile to get user details passing this token as authorization, use api/admin for admin operations",
                             "token": token.key,
                             "user":"Admin"}, status=status.HTTP_200_OK)
       
        return Response({
            "message": "Login successful. Use api/users/profile to get user details passing this token as authorization",
            "token": token.key,
            "user":user.type
        }, status=status.HTTP_200_OK)
    except CUser.DoesNotExist:
        return Response({"message": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(["POST"])
@permission_classes([AllowAny])
def signupUser(request):
    request.data['email'] = request.data['email'].strip().lower()
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = CUser.objects.create_user(
            username=request.data.get("email").strip().lower(),  
            email=request.data.get("email").strip().lower(),
            password=request.data.get("password"),
            first_name=request.data.get("first_name"),
            last_name=request.data.get("last_name"),
            phone_number=request.data.get("phone_number"),
                # Password is hashed here
        )
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "Message":"Login successful. use api/users/profile to get userdetails passing this token as an authorization, ",
            "token": token.key,
            "type":"User"
    
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def signupMerchant(request):
    request.data['email'] = request.data['email'].strip().lower()
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = Merchant.objects.create_user(
            username=request.data.get("email").strip().lower(),  
            email=request.data.get("email").strip().lower(),
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
            "token": token.key,
            "type":"Merchant"
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from django.utils import timezone

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