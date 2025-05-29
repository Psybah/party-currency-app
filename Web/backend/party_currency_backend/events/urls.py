from django.urls import path
from .views import  EventCreate,EventUpdate,EventArchive,EventList,EventDetail,save_currency,get_currency,get_event_transaction

urlpatterns = [
    path("create", EventCreate, name="eventCreate"),
    path("list", EventList, name="eventList"),
    path("get/<str:id>", EventDetail, name="eventDetail"),
    path("update/<str:id>", EventUpdate, name="eventUpdate"),
    path("delete/<str:id>", EventArchive, name="eventDelete"),
    path("save-currency", save_currency, name="save_currency"),
    path("get-currency", get_currency, name="get_currency"),
    path("get-event-transaction", get_event_transaction, name="get_event_transaction"),

    
]