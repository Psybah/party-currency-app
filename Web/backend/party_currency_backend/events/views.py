from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import EventSerializer, EventSerializerFull
from .models import Events
from currencies.models import Currency
from django.utils import timezone
from datetime import datetime, timedelta
import pytz
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive
from authentication.models import CustomUser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import random
import string
from currencies.serializers import CurrencySerializer
from payment.serializers import TransactionSerializer
from payment.models import Transaction
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
        'city', 'street_address', 'LGA', 'state', 'reconciliation_service','postal_code'
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
            # Parse dates and handle timezone consistently
            # Use date objects instead of datetime with UTC timezone
            start_date_str = request.data["start_date"]
            end_date_str = request.data["end_date"]
            
            # Parse dates without timezone to avoid shifts
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

            if end_date < start_date:
                return Response(
                    {"error": "End date cannot be before start date"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError as e:
            return Response(
                {"error": "Invalid date format. Please use YYYY-MM-DD format"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create event with shorter ID
        event = Events.objects.create(
            event_name=request.data["event_name"],
            event_description=request.data["event_type"],
            event_author=request.user.username,
            start_date=start_date,  # Store as date without timezone
            end_date=end_date,      # Store as date without timezone
            city=request.data["city"],
            street_address=request.data["street_address"],
            LGA=request.data["LGA"],
            state=request.data["state"],
            postal_code=request.data["postal_code"],
            event_id=generate_short_event_id(request.user.username),
            created_at=current_time,
            reconciliation=request.data["reconciliation_service"],
        )
        
        return Response({
            "message": f"Event {event.event_name} created successfully",
            "event": {
                "event_id": event.event_id,
                "event_name": event.event_name,
                "start_date": start_date.isoformat(),  # No need for .date() since it's already a date
                "end_date": end_date.isoformat()       # No need for .date() since it's already a date
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
        serializer = EventSerializerFull(events, many=True)
        
        # Fix serialized data to ensure dates are correct
        # This is only needed if your serializer doesn't handle dates correctly
        # events_data = serializer.data
        # for event in events_data:
        #     if 'start_date' in event and event['start_date']:
        #         event['start_date'] = event['start_date']  # Format or adjust if needed
        #     if 'end_date' in event and event['end_date']:
        #         event['end_date'] = event['end_date']      # Format or adjust if needed
                
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
        
        # No need to manually adjust dates if the serializer is updated
        
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
def EventUpdate(request, id):
    try:
        current_time = timezone.now()
        event = Events.objects.get(event_id=id)
        
        if "event_name" in request.data and request.data["event_name"]:
            event.event_name = request.data["event_name"]
        if "event_type" in request.data and request.data["event_type"]:
            event.event_description = request.data["event_type"]
        if "start_date" in request.data and request.data["start_date"]:
            # Parse date as date object without timezone
            event.start_date = datetime.strptime(request.data["start_date"], '%Y-%m-%d').date()
        if "end_date" in request.data and request.data["end_date"]:
            # Parse date as date object without timezone
            event.end_date = datetime.strptime(request.data["end_date"], '%Y-%m-%d').date()
        if "city" in request.data and request.data["city"]:
            event.city = request.data["city"]
        if "street_address" in request.data and request.data["street_address"]:
            event.street_address = request.data["street_address"]  # Fixed field name
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
                    "start_date": event.start_date.isoformat(),  # Already a date object
                    "end_date": event.end_date.isoformat(),      # Already a date object
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

# Rest of your code remains the same...
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
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response(
                {"error": "Missing event_id parameter"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        event = Events.objects.get(event_id=event_id)
        currency = Currency.objects.filter(event_id=event_id)
        serializer=CurrencySerializer(currency,many=True)
        return Response({"message":"Currency retrieved successfully","event_id":event_id,"currency":serializer.data},status=status.HTTP_200_OK)
    except Events.DoesNotExist:
        return Response({"error":"Event not found"},status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error":f"Failed to retrieve currency: {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_transaction(request):
    try:
        event_id = request.GET.get('event_id')
        event = Events.objects.get(event_id=event_id)
        if not event.event_author == request.user.username:
            return Response({'error': 'Access denied. Superuser privileges required.'}, status=403)
        transaction = Transaction.objects.get(event_id=event_id)
        serializer = TransactionSerializer(transaction)
        return Response({'message': 'Event transaction retrieved successfully', 'transaction': serializer.data}, status=200)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=500)
    
                