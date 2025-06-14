
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
from payment.serializers import TransactionSerializer
from payment.models import Transaction

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
                "phonenumber":user.phone_number,
                "total_amount_spent":user.total_amount_spent
               
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
    """
    Update user profile information based on user type.
    
    Args:
        request: The HTTP request containing user data
    
    Returns:
        Response: A success message or error details
    """
    try:
        user = request.user
        
        # Check if user is authenticated
        if not user.is_authenticated:
            return Response({
                "error": "Authentication required"
            }, status=401)
        
        # Map request field names to model field names
        field_mapping = {
            # Common fields - map request names to model names
            "firstname": "first_name",
            "lastname": "last_name",
            "phonenumber": "phone_number",
            "email": "email",
            "city": "city",
            "country": "country",
            "state": "state"
        }
        
        # Additional merchant-specific fields
        merchant_fields = ["business_type"]
        
        # Validate user type
        if user.type not in ["user", "merchant"]:
            return Response({
                "error": f"Invalid user type: {user.type}"
            }, status=400)
        
        # Update user fields
        updated_fields = []
        for request_field, model_field in field_mapping.items():
            if request_field in request.data:
                setattr(user, model_field, request.data[request_field])
                updated_fields.append(request_field)
        
        # Handle merchant-specific fields
        if user.type == "merchant":
            for field in merchant_fields:
                if field in request.data:
                    setattr(user, field, request.data[field])
                    updated_fields.append(field)
        
        # Save changes only if fields were updated
        if updated_fields:
            user.save()
            return Response({
                "message": "Profile updated successfully",
                "updated_fields": updated_fields
            }, status=200)
        else:
            return Response({
                "message": "No changes made"
            }, status=200)
            
    except Exception as e:
        return Response({
            "error": f"An error occurred: {str(e)}"
        }, status=500)

     
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_transactions(request):
    user = request.user
    transactions = Transaction.objects.filter(customer_email=user.email)
    serializer = TransactionSerializer(transactions, many=True)
    return Response({'message': 'User transactions retrieved successfully', 'transactions': serializer.data}, status=200)