from django.urls import path
from .views import get_users, suspend_user, activate_user, delete_user, get_admin_statistics

urlpatterns = [
    path('get-users', get_users, name='get_users'),
    path('suspend-user/<str:user_id>', suspend_user, name='suspend_user'),
    path('activate-user/<str:user_id>', activate_user, name='activate_user'),
    path('delete-user/<str:user_id>', delete_user, name='delete_user'),
    path('get-admin-statistics', get_admin_statistics, name='get_admin_statistics'),

]