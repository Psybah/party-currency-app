from rest_framework import serializers
from .models import Currency

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = [
            'currency_id',
            'currency_author',
            'denomination',
            'event_id',
            'created_at',
            'updated_at',
            'currency_name',
            'front_celebration_text',
            'front_image',
            'back_image',
            'back_celebration_text'
        ]
        
        read_only_fields = ['currency_id', 'created_at', 'updated_at'] 