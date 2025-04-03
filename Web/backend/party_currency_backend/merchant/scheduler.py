from django.utils import timezone
from events.models import Events
from .views import deleteReservedAccount
import requests
import os
from datetime import datetime, timedelta
from payment.utils import MonnifyAuth

def check_and_delete_reserved_accounts():
    """
    Daily scheduler to check for concluded events and delete their reserved accounts.
    This function should be called by a task scheduler (e.g., Celery, Django-Q, or cron).
    """
    today = timezone.now().date()
    
    # Get all events that have ended and have a reserved account
    concluded_events = Events.objects.filter(
        end_date__lt=today,
        has_reserved_account=True
    )
    
    for event in concluded_events:
        try:
            # Call the deleteReservedAccount function
            response = deleteReservedAccount(None, account_reference=event.event_id)
            
            # If the deletion was successful, update the event
            if response.status_code == 200:
                event.has_reserved_account = False
                event.save()
                print(f"Successfully deleted reserved account for event {event.event_id}")
            else:
                print(f"Failed to delete reserved account for event {event.event_id}: {response.data}")
                
        except Exception as e:
            print(f"Error deleting reserved account for event {event.event_id}: {str(e)}")
            
    print(f"Completed checking {concluded_events.count()} concluded events for reserved account deletion") 