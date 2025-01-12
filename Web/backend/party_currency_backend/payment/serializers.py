# serializers.py
from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    payment_methods = serializers.ListField(child=serializers.CharField(), required=False)
    
    class Meta:
        model = Transaction
        fields = ['amount', 'customer_name', 'customer_email', 'payment_reference',
                 'payment_description', 'currency_code', 'contract_code',
                 'redirect_url', 'payment_methods']