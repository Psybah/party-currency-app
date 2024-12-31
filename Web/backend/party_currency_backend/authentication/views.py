from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer,MerchantSerializer
from.models import CustomUser as CUser,Merchant
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
@api_view(["POST"])
def login(request):
    user = get_object_or_404(CUser,username=request.data["email"])
    if not user.check_password(request.data["password"]):
        return Response({"message":"user not found"},status.HTTP_404_NOT_FOUND)
    token,created = Token.objects.get_or_create(user=user)
    return Response({
                    "Message":"Login successful. use api/users/profile to get userdetails passing this token as an authorization, ",
            "token": token.key
        }, status=status.HTTP_202_ACCEPTED)
# Create your views here.
@api_view(["POST"])
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
def signupMerchant(request):
    serializer = MerchantSerializer(data=request.data)
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
