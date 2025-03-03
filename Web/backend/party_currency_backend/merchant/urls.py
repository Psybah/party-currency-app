from django.urls import path
from .views import getAllTransaction,getEvents
urlpatterns = [
    path("transactions",getAllTransaction,name="list transactions"),
    path("events",getEvents,name="get events")

]