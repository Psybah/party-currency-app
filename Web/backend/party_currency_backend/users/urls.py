from django.urls import path
from .views import fetchUser

urlpatterns = [
    path("profile",fetchUser)
]