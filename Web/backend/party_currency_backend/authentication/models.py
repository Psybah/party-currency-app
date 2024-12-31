from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=50, default="user")
    
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',  # Changed related_name
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Changed related_name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='custom_user',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'custom_user'  # Explicit table name


class Merchant(CustomUser):
    def save(self, *args, **kwargs):
        # Automatically set 'type' to 'merchant' for Merchant objects
        self.type = "merchant"
        super().save(*args, **kwargs)
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'business_type']