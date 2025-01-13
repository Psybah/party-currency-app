from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer
from datetime import datetime

# Create your views here.
@api_view(["POST"])
def EventCreate(request):
    current_time = datetime.now()
    event = Event.objects.create(
        event_name=request.data["event_name"],
        event_description=request.data["event_description"],
        event_date=request.data["event_date"],
        event_author=request.user.username,
        address=request.data["address"],
        delivery_address=request.data["delivery_address"],
        created_at=current_time.strftime('%Y-%m-%d %H:%M:%S'),
        updated_at=current_time.strftime('%Y-%m-%d %H:%M:%S'),
        event_id = f"event_{request.user.username}_{int(current_time.timestamp())}"
    )
    return Response({
        "message": f"Event {event.event_name} created successfully",
        "event": {
            "event_id": event.event_id,
            "event_name": event.event_name
        }
    }, status=status.HTTP_201_CREATED)
@api_view(["GET"])
def EventList(request):
    events = Event.objects.filter(event_author=request.user.username)
    serializer = EventSerializer(events, many=True)
    return Response({"events": serializer.data, "message":"Event list retrieved successfully"}, status=status.HTTP_200_OK)
    return Response({"events": events, "message":"Event list retrieved successfully"}, status=status.HTTP_200_OK)

@api_view(["GET"])
def EventDetail(request):
    event = Event.objects.get(event_id=request.data["event_id"])
    return Response({"message":"Event details retrieved successfully",
                     "event":event},status=status.HTTP_302_FOUND)

@api_view(["PUT"])
def EventUpdate(request):
    return Response({"message":"Event updated successfully"},status=status.HTTP_200_OK)

@api_view(["DELETE"])
def EventDelete(request):
    return Response({"message":"Event deleted successfully"},status=status.HTTP_200_OK)