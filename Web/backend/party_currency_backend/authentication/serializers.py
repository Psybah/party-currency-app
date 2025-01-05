from .models import CustomUser as User,Merchant
from rest_framework import serializers
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ["email","password","first_name","last_name","phone_number","type"]
    def validate(self,data):
        # Email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            raise serializers.ValidationError("Invalid email format") 
        # Password validation (min 8 chars, at least one number and special char)
        if len(data['password']) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        if not re.search(r'[0-9]', data['password']):
            raise serializers.ValidationError("Password must contain at least one number")
        if not re.search(r'[a-zA-Z]', data['password']):
            raise serializers.ValidationError("Password must contain at least one letter")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', data['password']):
            raise serializers.ValidationError("Password must contain at least one special character") 
        # Name validation (only letters and spaces)
        name_pattern = r'^[a-zA-Z\s]+$'
        if not re.match(name_pattern, data['first_name']):
            raise serializers.ValidationError("First name should only contain letters")
        if not re.match(name_pattern, data['last_name']):
            raise serializers.ValidationError("Last name should only contain letters")
            
        # Nigerian phone number validation (format: +234xxxxxxxxxx)
        phone_pattern = r'^\+234[0-9]{10}$'
        if not re.match(phone_pattern, data['phone_number']):
            raise serializers.ValidationError("Invalid Nigerian phone number format. Use +234xxxxxxxxxx")
            
        return data

class MerchantSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Merchant
        fields = ["email","password","first_name","last_name","phone_number","country","state","city","business_type","type"]
    def validate(self,data):
        # Email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            raise serializers.ValidationError("Invalid email format") 
        # Password validation (min 8 chars, at least one number and special char)
        if len(data['password']) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        if not re.search(r'[0-9]', data['password']):
            raise serializers.ValidationError("Password must contain at least one number")
        if not re.search(r'[a-zA-Z]', data['password']):
            raise serializers.ValidationError("Password must contain at least one letter")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', data['password']):
            raise serializers.ValidationError("Password must contain at least one special character") 
        # Name validation (only letters and spaces)
        name_pattern = r'^[a-zA-Z\s]+$'
        if not re.match(name_pattern, data['first_name']):
            raise serializers.ValidationError("First name should only contain letters")
        if not re.match(name_pattern, data['last_name']):
            raise serializers.ValidationError("Last name should only contain letters")
            
        # Nigerian phone number validation (format: +234xxxxxxxxxx)
        phone_pattern = r'^\+234[0-9]{10}$'
        if not re.match(phone_pattern, data['phone_number']):
            raise serializers.ValidationError("Invalid Nigerian phone number format. Use +234xxxxxxxxxx")
            
        return data