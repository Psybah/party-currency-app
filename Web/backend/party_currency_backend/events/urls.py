from django.urls import path
from .views import  EventCreate,EventUpdate,EventDelete,EventList,EventDetail

urlpatterns = [
    path("create", EventCreate, name="eventCreate"),
    path("list", EventList, name="eventList"),
    path("get/<str:id>", EventDetail, name="eventDetail"),
    path("update/<str:id>", EventUpdate, name="eventUpdate"),
    path("delete/<str:id>", EventDelete, name="eventDelete"),

    
]