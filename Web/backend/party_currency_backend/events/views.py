from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import EventSerializer,EventSerializerFull
from .models import Events  # Fix the import
from django.utils import timezone
from datetime import datetime
import pytz

# Create your views here.
@api_view(["POST"])
def EventCreate(request):
    try:
        current_time = timezone.now()
        start_date = timezone.datetime.strptime(
            request.data["start_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
        end_date = timezone.datetime.strptime(
            request.data["end_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
        event = Events.objects.create(
        event_name=request.data["event_name"],
        event_description=request.data["event_type"],
        start_date=start_date,
        end_date=end_date,
        city=request.data["city"],
        street_address=request.data["street_address"],
        LGA=request.data["LGA"],
        state=request.data["state"],
        event_id=f"event_{request.user.username}_{int(current_time.timestamp())}",
        created_at=current_time,
        reconciliation=request.data["reconciliation_service"],
        )
        
        return Response({
            "message": f"Event {event.event_name} created successfully",
            "event": {
                "event_id": event.event_id,
                "event_name": event.event_name
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_204_NO_CONTENT)
@api_view(["GET"])
def EventList(request):
    events = Events.objects.filter(event_author=request.user.email)
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
                "event_name": event.event_name
            }
        }, status=status.HTTP_202_ACCEPTED)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def EventDelete(request, id):
    event = Events.objects.get(event_id=id)
    event.event_author = "archive"
    event.save()
    return Response({"message":"Event deleted from list successfully."},status=status.HTTP_200_OK)


#TODO  view archived event by admin or superuser