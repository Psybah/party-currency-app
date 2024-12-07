from .models import CustomUser as User,Merchant
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ["email","password","first_name","last_name","phone_number"]


class MerchantSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Merchant
        fields = ["email","password","first_name","last_name","phone_number","country","state","city","business_type"]