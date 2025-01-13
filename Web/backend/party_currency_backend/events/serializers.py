from rest_framework import serializers
from models import event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = event
        fields = ['name', 'address', 'description', 'event_date', 
                  'delivery_address',
                    'currency_image', 'reconciliation', 'transcation_id',]
