from django.urls import path
from .views import getCurrency

urlpatterns = [
    path("get",getCurrency)
]