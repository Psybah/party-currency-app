from django.urls import path
from .views import get_users

urlpatterns = [
    path('get-users', get_users, name='get_users'),

]