
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    city = models.CharField()
    country = models.CharField()
    state = models.CharField()
    business_type = models.CharField()
    type = models.CharField(max_length=50, default="user")  # In `CustomUser`
    # Optional: Specify which field to use for authentication (default is 'username')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']  # Optional: add 'email' if needed

# Create your models here.

class Merchant(CustomUser):
    def save(self, *args, **kwargs):
        # Automatically set 'type' to 'merchant' for Merchant objects
        self.type = "merchant"
        super().save(*args, **kwargs)
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name','business_type']