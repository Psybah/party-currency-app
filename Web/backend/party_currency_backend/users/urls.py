from django.urls import path
from .views import fetchUser,update_picture

urlpatterns = [
    path("profile",fetchUser),
    path("update_picture",update_picture)
]