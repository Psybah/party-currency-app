from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_id','event_name']

class EventSerializerFull(serializers.ModelSerializer):
    class Meta:
        model=Event
        fields =[
            'event_id','event_name','event_author','address'
            ,'event_date','delivery_address',"created_at",'updated_at',
            'currency_image','reconciliation','transaction_id',
            'delivery_status'
        ]