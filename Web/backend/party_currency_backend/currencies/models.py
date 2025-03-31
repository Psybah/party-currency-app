from django.db import models

# Create your models here.
class Currency(models.Model):
        currency_id = models.CharField(max_length=255, unique=True, primary_key=True)
        currency_author = models.CharField(max_length=255, default="user")
        event_id = models.CharField(max_length=255)
        created_at = models.DateTimeField(auto_now_add=True)  # Changed to proper timestamp
        updated_at = models.DateTimeField(auto_now=True)
        currency_name=models.CharField(max_length=255, default="Party Currency")
        front_celebration_text=models.CharField(max_length=255, default="Party Currency")
        front_image=models.TextField( null=True)
        back_image=models.TextField( null=True)
        back_celebration_text=models.CharField(max_length=255 ,default="Party Currency")

        class Meta:
            ordering = ['-created_at']



