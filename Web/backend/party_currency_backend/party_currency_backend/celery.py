import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'party_currency_backend.settings')

app = Celery('party_currency_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# Configure the periodic tasks
app.conf.beat_schedule = {
    'check-and-delete-reserved-accounts': {
        'task': 'merchant.tasks.check_and_delete_reserved_accounts_task',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
} 