from django.urls import path
from .views import get_users, suspend_user, activate_user, delete_user, get_admin_statistics, get_events, get_pending_events, get_user, change_event_status, get_transactions, get_event_transaction


urlpatterns = [
    path('get-users', get_users, name='get_users'),
    path('suspend-user/<str:user_id>', suspend_user, name='suspend_user'),
    path('activate-user/<str:user_id>', activate_user, name='activate_user'),
    path('delete-user/<str:user_id>', delete_user, name='delete_user'),
    path('get-admin-statistics', get_admin_statistics, name='get_admin_statistics'),
    path('get-events', get_events, name='get_events'),
    path('get-pending-event', get_pending_events, name='get_events_offset'),
    path('get-user', get_user, name='get_user'),
    path('change-event-status', change_event_status, name='change_event_status'),
    path('get-all-transactions', get_transactions, name='get_all_successful_transactions'),
    path('get-event-transaction', get_event_transaction, name='get_event_transaction'),
]


