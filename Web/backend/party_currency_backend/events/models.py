from django.db import models
from datetime import date

class Events(models.Model):
    event_id = models.CharField(max_length=255, unique=True, primary_key=True)
    event_name = models.CharField(max_length=255)  
    event_author = models.CharField(max_length=255, default="user")
    street_address = models.TextField(default="Nigeria") 
    city = models.CharField(max_length=255 , default ="")
    state = models.CharField(max_length=255 , default=" ")
    LGA = models.CharField(max_length=255 , default=" ")
    postal_code = models.IntegerField( default=100001)
    event_description = models.TextField(default="owanbe")
    start_date = models.DateField()
    end_date = models.DateField()
    delivery_address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)  # Changed to proper timestamp
    updated_at = models.DateTimeField(auto_now=True)      # Changed to proper timestamp
    currency_id = models.CharField(max_length=255, null=True)
    reconciliation = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)  # Fixed typo
    delivery_status = models.CharField(
        max_length=50,
        default='pending',
        choices=[
            ('pending', 'Pending'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled')
        ]
    )

    def __str__(self):
        return f"{self.event_name} - {self.event_id}"

    class Meta:
        ordering = ['-created_at']