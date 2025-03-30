from django.shortcuts import render
from  rest_framework.decorators import api_view,authentication_classes,permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive
from authentication.models import CustomUser
from django.core.files.storage import default_storage
import os
from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

# Add these classes for custom throttling
class UserThrottle(UserRateThrottle):
    scope = 'user'

class AnonThrottle(AnonRateThrottle):
    scope = 'anon'

# Create your views here.

@api_view(["GET"])
@throttle_classes([UserThrottle])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication,TokenAuthentication])
def fetchUser(request):
    user=request.user
    if (user.type == "user"):
         return Response({
              "type":"User",
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number
               
            })
    elif (user.type == "merchant"):
         return Response({
              "type":"Merchant:"+user.business_type,
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number,
                "location":user.country+"/"+user.state+"/"+user.city,
               
            })
    elif (user.is_superuser):
         return Response({
              "type":"Admin",
                "username": user.username,
                "email": user.email,
                "firstname":user.first_name,
                "lastname":user.last_name,
                "phonenumber":user.phone_number,

         })


@api_view(["PUT"])
@throttle_classes([UserThrottle])
@permission_classes([IsAuthenticated])
def edit_user(request):
     user = request.user
     if (user.type == "user"):
         if "firstname" in request.data:
             user.firstname=request.data["firstname"]
         if "lastname" in request.data:
             user.firstname=request.data["lastname"]
         if "phonenumber" in request.data:
             user.phonenumber=request.data["phonenumber"]
     elif (user.type == "merchant"):
         if "business_type" in request.data:
             user.business_type=request.data["business_type"]
         if "location" in request.data:
             user.location=request.data["location"]
         if "firstname" in request.data:
             user.firstname=request.data["firstname"]
         if "lastname" in request.data:
             user.firstname=request.data["lastname"]
         if "phonenumber" in request.data:
             user.phonenumber=request.data["phonenumber"]
        
     user.save()    
     return Response({
          "message":"edited"
     }) 

     
@api_view(["PUT"])
@throttle_classes([UserThrottle])
def upload_picture(request):
    user = request.user
    # Check if a file is provided in the request
    if 'profile_picture' not in request.FILES:
        return Response({"error": "No profile picture provided"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        profile_picture = request.FILES['profile_picture']
        # Save the file temporarily
        file_name = f"{user.email}_profile_picture{os.path.splitext(profile_picture.name)[1]}"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(profile_picture.read()))
        # Upload the file to Google Drive
        folder_id = '1xg-UFjBtNMUeX3RbLsyOsBsmDOJzj2Sk'  # Replace with your folder ID
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        # Update the user's profile picture field
        user.profile_picture = file_id
        user.save()
        # Clean up the temporary file
        default_storage.delete(file_path)
        return Response({"message": "Profile picture updated successfully", "profile_picture":f"https://drive.google.com/file/d/{file_id}"}, status=status.HTTP_200_OK)
    except Exception as e:
        # Handle any errors during the process
        print("others")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@throttle_classes([AnonThrottle, UserThrottle])
def get_picture(request):
    user = request.user
    if not user.profile_picture:
        return Response({"profile_picture": "https://drive.google.com/file/d/1f0umstb0KjrMoDqK-om2jrzyKsI2RhGx"}, status=200)
    
    return Response({
        "profile_picture":f"https://drive.google.com/file/d/{user.profile_picture}"
    })


