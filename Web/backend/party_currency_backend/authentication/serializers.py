from .models import CustomUser as User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ["email","password","first_name","last_name","phone_number"]