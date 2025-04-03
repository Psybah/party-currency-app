from celery import shared_task
from .scheduler import check_and_delete_reserved_accounts

@shared_task
def check_and_delete_reserved_accounts_task():
    """
    Celery task that runs the check_and_delete_reserved_accounts function.
    This task is scheduled to run daily at midnight.
    """
    check_and_delete_reserved_accounts() 