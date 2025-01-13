from django.urls import path
from .views import  EventCreate,EventUpdate,EventDelete,EventList,EventDetail

urlpatterns = [
    path("create", EventCreate, name="eventCreate"),
    path("list", EventList, name="eventList"),
    path("detail", EventDetail, name="eventDetail"),
    path("update", EventUpdate, name="eventUpdate"),
    path("delete", EventDelete, name="eventDelete"),
    
]