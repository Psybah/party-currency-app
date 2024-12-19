from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer,MerchantSerializer
from.models import CustomUser as User,Merchant
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
@api_view(["POST"])
def login(request):
    user = get_object_or_404(User,username=request.data["email"])
    if not user.check_password(request.data["password"]):
        return Response({"message":"user not found"},status.HTTP_404_NOT_FOUND)
    token,created = Token.objects.get_or_create(user=user)
    return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number
            }
        }, status=status.HTTP_202_ACCEPTED)
# Create your views here.
@api_view(["POST"])
def signupUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
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
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number
            }
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number,
                "Type":user.business_type,
                "location":user.country+"/"+user.state+"/"+user.city,
            }
        }, status=status.HTTP_201_CREATED)

    # Return validation errors
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import permission_classes,authentication_classes
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test(request):
    return Response({"Message":" passed for "+ request.user.username})