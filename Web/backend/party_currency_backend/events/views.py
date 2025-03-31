from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import EventSerializer, EventSerializerFull
from .models import Events
from currencies.models import Currency
from django.utils import timezone
from datetime import datetime
import pytz
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive
from authentication.models import CustomUser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import random
import string
from currencies.serializers import CurrencySerializer

# Create your views here.

def generate_short_event_id(username):
    id = 'EVT' + ''.join(random.choices(string.ascii_letters + string.digits, k=5))
    if Events.objects.filter(event_id=id).exists():
        return generate_short_event_id(username)
    return id

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
            # Parse dates as naive datetime objects first (no timezone)
            start_date_naive = datetime.strptime(request.data["start_date"], '%Y-%m-%d')
            end_date_naive = datetime.strptime(request.data["end_date"], '%Y-%m-%d')
            
            # Create timezone aware datetime by properly localizing them
            # This sets the time to midnight in UTC, preserving the exact date
            start_date = pytz.UTC.localize(start_date_naive)
            end_date = pytz.UTC.localize(end_date_naive)

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
@permission_classes([IsAuthenticated])
def EventList(request):
    try:
        events = Events.objects.filter(event_author=request.user.username)
        serializer = EventSerializer(events, many=True)
        return Response({"message": "Event list retrieved successfully", "events": serializer.data}, 
                      status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "error": f"Failed to retrieve events: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([AllowAny])
def EventDetail(_, id):
    try:
        event = Events.objects.get(event_id=id)
        serializer = EventSerializerFull(event)
        return Response({"message": "Event details retrieved successfully",
                        "event": serializer.data}, status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Failed to retrieve event details: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def EventUpdate(request, id):
    try:
        event = Events.objects.get(event_id=id)
        current_time = timezone.now()
        
        if "event_name" in request.data and request.data["event_name"]:
            event.event_name = request.data["event_name"]
        
        if "event_type" in request.data and request.data["event_type"]:
            event.event_description = request.data["event_type"]
        
        if "start_date" in request.data and request.data["start_date"]:
            try:
                # Parse date as naive datetime object first (no timezone)
                start_date_naive = datetime.strptime(request.data["start_date"], '%Y-%m-%d')
                # Create timezone aware datetime by properly localizing it
                event.start_date = pytz.UTC.localize(start_date_naive)
            except ValueError:
                return Response(
                    {"error": "Invalid start date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if "end_date" in request.data and request.data["end_date"]:
            try:
                # Parse date as naive datetime object first (no timezone)
                end_date_naive = datetime.strptime(request.data["end_date"], '%Y-%m-%d')
                # Create timezone aware datetime by properly localizing it
                event.end_date = pytz.UTC.localize(end_date_naive)
            except ValueError:
                return Response(
                    {"error": "Invalid end date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Validate dates after potential updates
        if event.end_date < event.start_date:
            return Response(
                {"error": "End date cannot be before start date"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if "city" in request.data and request.data["city"]:
            event.city = request.data["city"]
        
        if "street_address" in request.data and request.data["street_address"]:
            event.street_address = request.data["street_address"]
        
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
    
    except Events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            "error": f"Failed to update event: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def EventArchive(request, id):
    try:
        event = Events.objects.get(event_id=id)
        event.event_author = "archive"
        event.save()
        return Response({"message": "Event archived successfully."}, status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Failed to archive event: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# TODO: view archived event by admin or superuser

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def save_currency(request):
    user=request.user
    currency_id=request.data.get("currency_id")
    event_id=request.data.get("event_id")
    if not currency_id:
        return Response({"error":"Missing currency_id parameter"},status=status.HTTP_400_BAD_REQUEST)
    if not event_id:
        return Response({"error":"Missing event_id parameter"},status=status.HTTP_400_BAD_REQUEST)
    if not Currency.objects.filter(currency_id=currency_id).exists():
        return Response({"error":"Currency not found"},status=status.HTTP_404_NOT_FOUND)
    if not Events.objects.filter(event_id=event_id).exists():
        return Response({"error":"Event not found"},status=status.HTTP_404_NOT_FOUND)
    event=Events.objects.get(event_id=event_id)
    event.currency_id=currency_id
    event.save()
    return Response({"message":"Currency saved successfully"},status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_currency(request):
    try:
        event_id = request.data.get("event_id")
        if not event_id:
            return Response(
                {"error": "Missing event_id parameter"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        event = Events.objects.get(event_id=event_id)
        currency=Currency.objects.get(currency_id=event.currency_id)
        serializer=CurrencySerializer(currency)
        return Response({"message":"Currency retrieved successfully","currency":serializer.data},status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error":"Event not found"},status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error":f"Failed to retrieve currency: {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)