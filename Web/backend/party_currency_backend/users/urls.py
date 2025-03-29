from django.urls import path
from .views import fetchUser,upload_picture,get_picture,edit_user

urlpatterns = [
    path("profile",fetchUser),
    path("upload-picture",upload_picture),
    path("get-picture",get_picture),
    path("update-profile",edit_user)
]