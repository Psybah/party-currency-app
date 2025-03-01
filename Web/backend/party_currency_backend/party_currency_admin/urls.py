from django.urls import path
from .views import get_users, suspend_user, activate_user

urlpatterns = [
    path('get-users', get_users, name='get_users'),
    path('suspend-user/<str:user_id>', suspend_user, name='suspend_user'),
    path('activate-user/<str:user_id>', activate_user, name='activate_user'),

]