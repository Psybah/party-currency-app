from .models import CustomUser as User,Merchant
from rest_framework import serializers
import re
import jwt
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ["email","password","first_name","last_name","phone_number","type"]
    def validate(self, data):
        errors = {}
        
        # Email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            errors["email"] = "Invalid email format"

        # Password validation
        password_errors = []
        if len(data['password']) < 8:
            password_errors.append("Password must be at least 8 characters long")
        if not re.search(r'[0-9]', data['password']):
            password_errors.append("Password must contain at least one number")
        if not re.search(r'[a-zA-Z]', data['password']):
            password_errors.append("Password must contain at least one letter")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', data['password']):
            password_errors.append("Password must contain at least one special character")
        if password_errors:
            errors["password"] = password_errors

        # Name validation
        name_pattern = r'^[a-zA-Z\s]+$'
        name_errors = []
        if not re.match(name_pattern, data['first_name']):
            name_errors.append("First name should only contain letters")
        if not re.match(name_pattern, data['last_name']):
            name_errors.append("Last name should only contain letters")
        if name_errors:
            errors["name"] = name_errors

        # Phone validation
        phone_pattern = r'^\+234[789][01]\d{8}$'
        if not re.match( phone_pattern,data['phone_number']):
                errors["phone_number"] = "Invalid Nigerian phone number format. Use +234xxxxxxxxxx"
        
        if errors:
            raise serializers.ValidationError(errors)
        return data
        return data

class MerchantSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Merchant
        fields = ["email","password","first_name","last_name","phone_number","country","state","city","business_type","type"]
    def validate(self, data):
        errors = {}
        
        # Email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            errors["email"] = "Invalid email format"

        # Password validation
        password_errors = []
        if len(data['password']) < 8:
            password_errors.append("Password must be at least 8 characters long")
        if not re.search(r'[0-9]', data['password']):
            password_errors.append("Password must contain at least one number")
        if not re.search(r'[a-zA-Z]', data['password']):
            password_errors.append("Password must contain at least one letter")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', data['password']):
            password_errors.append("Password must contain at least one special character")
        if password_errors:
            errors["password"] = password_errors

        # Name validation
        name_pattern = r'^[a-zA-Z\s]+$'
        name_errors = []
        if not re.match(name_pattern, data['first_name']):
            name_errors.append("First name should only contain letters")
        if not re.match(name_pattern, data['last_name']):
            name_errors.append("Last name should only contain letters")
        if name_errors:
            errors["name"] = name_errors

        # Phone validation
        
        phone_pattern = r'^\+234[789][01]\d{7}$'
        if not re.match( phone_pattern,data['phone_number']):
                errors["phone_number"] = "Invalid Nigerian phone number format. Use +234xxxxxxxxxx"
        
        if errors:
            raise serializers.ValidationError(errors)
        return data
            
        return data
    
class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    def validate_token(self, token):
        try:
            payload = jwt.decode(token, os.getenv("GOOGLE_SECRET_KEY"), algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise serializers.ValidationError("Token has expired")
        except jwt.InvalidTokenError:
            raise serializers.ValidationError("Invalid token")
class UserSerializer2(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ["email","first_name","last_name","phone_number","type"]