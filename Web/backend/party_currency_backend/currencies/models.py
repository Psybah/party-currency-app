from django.db import models

# Create your models here.
class Currency(models.Model):
    # Define denomination choices as class variables
    DENOMINATION_CHOICES = [
        (1000, '1000'),
        (500, '500'),
        (200, '200'),
        (100, '100'),
    ]
    
    currency_id = models.CharField(max_length=255, unique=True, primary_key=True)
    currency_author = models.CharField(max_length=255, default="user")
    event_id = models.CharField(max_length=255)  # Removed trailing comma
    denomination = models.IntegerField(choices=DENOMINATION_CHOICES,null=True)  # Added denomination field with choices
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    currency_name = models.CharField(max_length=255, default="Party Currency")
    front_celebration_text = models.CharField(max_length=255, default="Party Currency")
    front_image = models.TextField(null=True)
    back_image = models.TextField(null=True)
    back_celebration_text = models.CharField(max_length=255, default="Party Currency")

    class Meta:
        ordering = ['-created_at']