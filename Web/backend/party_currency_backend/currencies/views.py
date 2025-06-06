from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Currency
from .serializers import CurrencySerializer
from django.utils import timezone
from datetime import datetime
import pytz
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive, download_file_from_drive  # Added download function import
from authentication.models import CustomUser
from django.core.files.storage import default_storage
import os
import re  # Added for regex pattern matching
from django.core.files.base import ContentFile
from django.http import FileResponse, HttpResponse  # Added for file response
from rest_framework import status
from dotenv import load_dotenv
import random
import string
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from events.models import Events

# Load environment variables
load_dotenv()

class UserThrottle(UserRateThrottle):
    scope = 'user'

class AnonThrottle(AnonRateThrottle):
    scope = 'anon'


def generate_currency_id():
    """Generate a unique currency ID"""
    id = 'CUR' + ''.join(random.choices(string.ascii_letters + string.digits, k=5))
    if Currency.objects.filter(currency_id=id).exists():
        return generate_currency_id()
    return id


def upload_image(image_file, currency_id, image_type):
    """Helper function to upload images to Google Drive"""
    file_path = None
    try:
        file_name = f"{currency_id}_{image_type}{os.path.splitext(image_file.name)[1]}"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(image_file.read()))
        
        # Upload the file to Google Drive
        folder_id = os.getenv('GOOGLE_DRIVE_FOLDER_ID')
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        
        # Clean up the temporary file
        if file_path and default_storage.exists(file_path):
            default_storage.delete(file_path)
        
        return f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"
    except Exception as e:
        # Clean up the temporary file in case of error
        if file_path and default_storage.exists(file_path):
            default_storage.delete(file_path)
        raise e


def extract_file_id_from_url(drive_url):
    """Extract file ID from Google Drive URL"""
    if not drive_url:
        return None
    
    # Pattern to match Google Drive file URLs
    pattern = r'https://drive\.google\.com/file/d/([^/]+)'
    match = re.search(pattern, drive_url)
    
    if match:
        return match.group(1)
    return None


@api_view(["POST"])
@throttle_classes([UserThrottle])
@permission_classes([IsAuthenticated])
def save_currency(request):
    user = request.user
    currency_id = generate_currency_id()
    currency_name = request.data.get("currency_name")
    currency_author = user.username
    event_id = request.data.get("event_id", "no_event")
    front_celebration_text = request.data.get("front_celebration_text")
    back_celebration_text = request.data.get("back_celebration_text")
    # Get denomination from request data
    denomination = request.data.get("denomination")
    
    front_image_url = None
    back_image_url = None
    
    # Process front image if provided
    front_image = request.data.get("front_image")
    if front_image:
        try:
            front_image_url = upload_image(front_image, currency_id, "front_image")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Process back image if provided
    back_image = request.data.get("back_image")
    if back_image:
        try:
            back_image_url = upload_image(back_image, currency_id, "back_image")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Create currency object
    currency = Currency.objects.create(
        currency_id=currency_id,
        currency_name=currency_name,
        currency_author=currency_author,
        event_id=event_id,
        front_celebration_text=front_celebration_text,
        front_image=front_image_url,
        back_image=back_image_url,
        back_celebration_text=back_celebration_text,
        denomination=denomination  # Added denomination field
    )
    event = Events.objects.get(event_id=event_id)
    event.currency_id=currency_id
    currency.save()
   
    return Response({"message": "Currency saved successfully","currency_id":currency_id,"event":event.event_name}, status=status.HTTP_200_OK)


@api_view(["GET"])
@throttle_classes([AnonThrottle])
@permission_classes([IsAuthenticated])
def get_all_currency(request):
    user = request.user
    currency = Currency.objects.filter(currency_author=user.username)
    serializer = CurrencySerializer(currency, many=True)
    return Response({"currencies":serializer.data}, status=status.HTTP_200_OK)


@api_view(["GET"])
@throttle_classes([AnonThrottle])
@permission_classes([IsAuthenticated])
def get_currency_by_id(request, id):
    try:
        currency = Currency.objects.get(currency_id=id)
        serializer = CurrencySerializer(currency)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Currency.DoesNotExist:
        return Response({"error": "Currency not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["GET"])
@throttle_classes([AnonThrottle])
@permission_classes([IsAuthenticated])
def download_image_from_drive(request):
    
    # Get the Google Drive URL from request data
    image_url = request.query_params.get("url")
    if not image_url:
        return Response(
            {"error": "No URL provided in request data"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get optional filename from request
    custom_filename = request.data.get("filename", "downloaded_image")
    
    # Extract file ID from the Google Drive URL
    file_id = extract_file_id_from_url(image_url)
    if not file_id:
        return Response(
            {"error": "Invalid Google Drive URL format"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create temporary directory if it doesn't exist
    tmp_dir = os.path.join(default_storage.location, 'tmp')
    os.makedirs(tmp_dir, exist_ok=True)
    
    # Generate a temporary file path
    temp_file_path = os.path.join(tmp_dir, f"temp_download_{file_id}")
    
    try:
        # Download the file from Google Drive
        file_path = download_file_from_drive(file_id, temp_file_path)
        
        # Determine the file extension and MIME type
        with open(file_path, 'rb') as f:
            # Read first few bytes to determine file type
            header = f.read(8)
            f.seek(0)  # Reset file pointer
            
            # Get file content
            file_content = f.read()
        
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Determine content type based on file header
        content_type = "application/octet-stream"  # Default
        if header.startswith(b'\xFF\xD8'):
            content_type = "image/jpeg"
            extension = ".jpg"
        elif header.startswith(b'\x89PNG'):
            content_type = "image/png"
            extension = ".png"
        elif header.startswith(b'GIF87a') or header.startswith(b'GIF89a'):
            content_type = "image/gif"
            extension = ".gif"
        elif header.startswith(b'%PDF'):
            content_type = "application/pdf"
            extension = ".pdf"
        else:
            extension = ""
        
        # Create the response with the file content
        response = HttpResponse(file_content, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{custom_filename}{extension}"'
        
        return response
        
    except Exception as e:
        # Clean up in case of error
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["PUT"])
@throttle_classes([UserThrottle])
@permission_classes([IsAuthenticated])
def update_currency(request, id):
    user = request.user
    try:
        currency = Currency.objects.get(currency_id=id, currency_author=user.username)
    except Currency.DoesNotExist:
        return Response({"error": "Currency not found or you are not authorized to update this currency"}, status=status.HTTP_404_NOT_FOUND)
    
    # Create a copy of request.data to modify
    data = request.data.copy()
    
    # Set default event_id if not provided
    if not data.get("event_id"):
        data["event_id"] = "no_event"
    
    # Process front image if provided
    front_image = request.data.get("front_image")
    if front_image:
        try:
            front_image_url = upload_image(front_image, currency.currency_id, "front_image")
            data["front_image"] = front_image_url
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Process back image if provided
    back_image = request.data.get("back_image")
    if back_image:
        try:
            back_image_url = upload_image(back_image, currency.currency_id, "back_image")
            data["back_image"] = back_image_url
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Handle denomination update
    if "denomination" in data:
        try:
            # Convert to integer if provided as string
            if data["denomination"] is not None:
                data["denomination"] = int(data["denomination"])
        except ValueError:
            return Response({"error": "Invalid denomination value. Must be 100, 200, 500, or 1000."}, 
                            status=status.HTTP_400_BAD_REQUEST)
    
    # Update the currency
    serializer = CurrencySerializer(currency, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@throttle_classes([UserThrottle])
@permission_classes([IsAuthenticated])
def delete_currency(request, id):
    try:
        currency = Currency.objects.get(currency_id=id)
        currency.currency_author = "archived"
        currency.event_id = "null"
        currency.save()
        return Response({"message": "Currency deleted successfully"}, status=status.HTTP_200_OK)
    except Currency.DoesNotExist:
        return Response({"error": "Currency not found"}, status=status.HTTP_404_NOT_FOUND)