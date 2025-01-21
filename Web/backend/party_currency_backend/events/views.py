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
            event_author=request.user.username,
            address=f"{request.data["street_address"]} ,{request.data["city"]},{request.data["state"]} postal code :{request.data["post_code"]}",
            delivery_address=request.data["street_address"],
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
    events = Events.objects.filter(event_author=request.user.username)
    serializer = EventSerializer(events, many=True)
    return Response({"events": serializer.data, "message":"Event list retrieved successfully"}, status=status.HTTP_200_OK)

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
    start_date = timezone.datetime.strptime(
            request.data["start_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
    end_date = timezone.datetime.strptime(
            request.data["end_date"], 
            '%Y-%m-%d'
        ).replace(tzinfo=pytz.UTC)
    event = Events.objects.get(event_id=id)
    event.event_name=request.data["event_name"]
    event.event_description=request.data["event_type"]
    event.start_date=start_date
    event.end_date=end_date
    event.address=f"{request.data["street_address"]} ,{request.data["city"]},{request.data["country"]} postal code :{request.data["post_code"]}",
    event.delivery_address=request.data["delivery_address"]
    event.updated_at=current_time
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