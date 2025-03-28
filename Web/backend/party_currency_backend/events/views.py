from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import EventSerializer,EventSerializerFull,currencySerializer 
from .models import Events  # Fix the import
from django.utils import timezone
from datetime import datetime
import pytz
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive
from authentication.models import CustomUser
from django.core.files.storage import default_storage
import os
from django.core.files.base import ContentFile
from rest_framework import status
from dotenv import load_dotenv
import random
import string

# Create your views here.

def generate_short_event_id(username):
    timestamp = int(timezone.now().timestamp())
    # Take last 4 digits of timestamp
    timestamp_short = str(timestamp)[-4:]
    # Generate 3 random characters
    random_chars = ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
    # Combine first 3 chars of username, timestamp and random chars
    return f"{username[:3]}{timestamp_short}{random_chars}"

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def EventCreate(request):
    required_fields = [
        'event_name', 'event_type', 'start_date', 'end_date',
        'city', 'street_address', 'LGA', 'state', 'reconciliation_service'
    ]

    # Validate required fields
    for field in required_fields:
        if field not in request.data:
            return Response(
                {"error": f"Missing required field: {field}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    try:
        current_time = timezone.now()
        
        # Parse and validate dates
        try:
            start_date = timezone.datetime.strptime(
                request.data["start_date"], 
                '%Y-%m-%d'
            ).replace(tzinfo=pytz.UTC)
            
            end_date = timezone.datetime.strptime(
                request.data["end_date"], 
                '%Y-%m-%d'
            ).replace(tzinfo=pytz.UTC)

            if end_date < start_date:
                return Response(
                    {"error": "End date cannot be before start date"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )
        

        # Create event with shorter ID
        event = Events.objects.create(
            event_name=request.data["event_name"],
            event_description=request.data["event_type"],
            event_author=request.user.username,
            start_date=start_date,
            end_date=end_date,
            city=request.data["city"],
            street_address=request.data["street_address"],
            LGA=request.data["LGA"],
            state=request.data["state"],
            event_id=generate_short_event_id(request.user.username),
            created_at=current_time,
            reconciliation=request.data["reconciliation_service"],
        )
        
        return Response({
            "message": f"Event {event.event_name} created successfully",
            "event": {
                "event_id": event.event_id,
                "event_name": event.event_name,
                "start_date": start_date.date().isoformat(),
                "end_date": end_date.date().isoformat()
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            "error": f"Failed to create event: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
def EventList(request):
    events = Events.objects.filter(event_author=request.user.username)
    serializer = EventSerializer(events, many=True)
    return Response({"message":"Event list retrieved successfully","events": serializer.data}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([AllowAny])
def EventDetail(_,id):
    try:
        event = Events.objects.get(event_id=id)
        serializer=EventSerializerFull(event)
        return Response({"message":"Event details retrieved successfully",
                        "event":serializer.data},status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
def EventUpdate(request,id):
    current_time = timezone.now()
    event = Events.objects.get(event_id=id)
    
    if "event_name" in request.data and request.data["event_name"]:
        event.event_name = request.data["event_name"]
    if "event_type" in request.data and request.data["event_type"]:
        event.event_description = request.data["event_type"]
    if "start_date" in request.data and request.data["start_date"]:
        event.start_date = timezone.datetime.strptime(
            request.data["start_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
    if "end_date" in request.data and request.data["end_date"]:
        event.end_date = timezone.datetime.strptime(
            request.data["end_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
    if "city" in request.data and request.data["city"]:
        event.city = request.data["city"]
    if "street_address" in request.data and request.data["street_address"]:
        event.address = request.data["street_address"]
    if "state" in request.data and request.data["state"]:
        event.state = request.data["state"]
    if "LGA" in request.data and request.data["LGA"]:
        event.LGA = request.data["LGA"]
    if "delivery_address" in request.data and request.data["delivery_address"]:
        event.delivery_address = request.data["delivery_address"]
    
    event.updated_at = current_time
    event.save()
    return Response({
            "message": f"Event {event.event_name} updated successfully",
            "event": {
                "event_id": event.event_id,
                "event_name": event.event_name,
                "start_date": event.start_date.date().isoformat(),
                "end_date": event.end_date.date().isoformat(),
                "event_author": event.event_author,
                "event_description": event.event_description,
                "city": event.city,
                "street_address": event.street_address,
                "LGA": event.LGA,
                "state": event.state,
                
            }
        }, status=status.HTTP_202_ACCEPTED)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def EventDelete(request, id):
    try:
        event = Events.objects.get(event_id=id)
        event.event_author = "archive"
        event.save()
        return Response({"message":"Event deleted from list successfully."},status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


#TODO  view archived event by admin or superuser


@api_view(["PUT"])
def save_currency(request):
    event = Events.objects.get(event_id=request.data["event_id"])
    user=request.user
    folder_id = '1xg-UFjBtNMUeX3RbLsyOsBsmDOJzj2Sk'
    if 'currency_image_1000' in request.FILES: 
        file_name = f"{user.email}_event_picture_1000"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(request.FILES['currency_image_1000'].read()))
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        event.currency_image_1000 = file_id
        event.save()
        default_storage.delete(file_path)
    if 'currency_image_500' in request.FILES: 
        file_name = f"{user.email}_event_picture_500"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(request.FILES['currency_image_500'].read()))
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        event.currency_image_500 = file_id
        event.save()
        default_storage.delete(file_path)   
    if 'currency_image_200' in request.FILES: 
        file_name = f"{user.email}_event_picture_200"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(request.FILES['currency_image_200'].read()))
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        event.currency_image_200 = file_id
        event.save()
        default_storage.delete(file_path)   
    if 'currency_image_100' in request.FILES: 
        file_name = f"{user.email}_event_picture_100"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(request.FILES['currency_image_100'].read()))
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        event.currency_image_100 = file_id
        event.save()
        default_storage.delete(file_path)   
    if 'currency_image_50' in request.FILES: 
        file_name = f"{user.email}_event_picture_50"
        file_path = default_storage.save(f'tmp/{file_name}', ContentFile(request.FILES['currency_image_50'].read()))
        file_id = upload_file_to_drive(file_path, file_name, folder_id)
        event.currency_image_50 = file_id
        event.save()
        default_storage.delete(file_path)     
    return Response({"message": "Currency images updated successfully"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_currency(request):
    event = Events.objects.get(event_id=request.data["event_id"])
    serializer = currencySerializer(event)
    return Response({"message": "Currency images retrieved successfully", "event": serializer.data}, status=status.HTTP_200_OK)

