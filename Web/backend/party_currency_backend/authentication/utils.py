from django.core.cache import cache
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.conf import settings

class PasswordResetCodeManager:
    CODE_LENGTH = 6
    EXPIRY_MINUTES = 5
    PREFIX = "pwd_reset_"
    
    @classmethod
    def generate_code(cls, email):
        """
        Generate a random 6-digit code and store it in cache with 5-minute expiration
        """
        # Generate random code
        code = ''.join(random.choices(string.digits, k=cls.CODE_LENGTH))
        
        # Create cache key
        cache_key = f"{cls.PREFIX}{email}"
        
        # Store in cache with expiration
        cache.set(
            cache_key, 
            code,
            timeout=cls.EXPIRY_MINUTES * 60  # Convert minutes to seconds
        )
        
        return code

    @classmethod
    def validate_code(cls, email, code):
        """
        Validate the provided code against stored code
        """
        cache_key = f"{cls.PREFIX}{email}"
        stored_code = cache.get(cache_key)
        
        # Check if code exists and matches
        if stored_code and stored_code == code:
            return True
        return False

    @classmethod
    def invalidate_code(cls, email, code=None):
        """
        Explicitly invalidate a code before expiration
        Code parameter is optional but can be used for additional validation
        """
        cache_key = f"{cls.PREFIX}{email}"
        
        if code:
            # If code is provided, only invalidate if it matches
            stored_code = cache.get(cache_key)
            if stored_code and stored_code == code:
                cache.delete(cache_key)
                return True
            return False
        
        # If no code provided, just invalidate
        cache.delete(cache_key)
        return True

