from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100, blank=True, null=True)  # Add max_length and optional parameters
    country = models.CharField(max_length=100, blank=True, null=True)  # Add max_length and optional parameters
    state = models.CharField(max_length=100, blank=True, null=True)  # Add max_length and optional parameters
    business_type = models.CharField(max_length=100, blank=True, null=True)  # Add max_length and optional parameters
    type = models.CharField(max_length=50, default="user")
    
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Add related_name
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions '
                   'granted to each of their groups.'),
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # Add related_name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

class Merchant(CustomUser):
    def save(self, *args, **kwargs):
        # Automatically set 'type' to 'merchant' for Merchant objects
        self.type = "merchant"
        super().save(*args, **kwargs)
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'business_type']