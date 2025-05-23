from rest_framework import serializers
from .models import Events

class EventSerializer(serializers.ModelSerializer):
       class Meta:
        model = Events
        fields = ['event_id','event_name']

class EventSerializerFull(serializers.ModelSerializer):
    
    class Meta:
        model=Events
        fields =[
            'event_id','event_name','event_description','event_author','street_address','city',"LGA",'state','postal_code'
            ,'start_date','end_date','delivery_address',"created_at",'updated_at',
           'reconciliation','transaction_id','payment_status',
            'delivery_status','currency_id'
           
        ]