# models.py
from django.db import models

class Transaction(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    customer_name = models.CharField(max_length=255, blank=True)
    customer_email = models.EmailField()
    payment_reference = models.CharField(max_length=255, unique=True)
    payment_description = models.TextField(blank=True)
    currency_code = models.CharField(max_length=3, default='NGN')
    contract_code = models.CharField(max_length=255)
    redirect_url = models.URLField(blank=True)
    transaction_reference = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)