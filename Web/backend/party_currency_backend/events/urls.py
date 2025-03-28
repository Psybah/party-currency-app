from django.urls import path
from .views import  EventCreate,EventUpdate,EventDelete,EventList,EventDetail,save_currency,get_currency

urlpatterns = [
    path("create", EventCreate, name="eventCreate"),
    path("list", EventList, name="eventList"),
    path("get/<str:id>", EventDetail, name="eventDetail"),
    path("update/<str:id>", EventUpdate, name="eventUpdate"),
    path("delete/<str:id>", EventDelete, name="eventDelete"),
    path("save_currency", save_currency, name="save_currency"),
    path("get_currency", get_currency, name="get_currency"),


    
]