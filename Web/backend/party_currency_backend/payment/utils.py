# utils.py
import base64
import requests
from django.conf import settings
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class MonnifyAuth:
    @staticmethod
    def generate_basic_auth():
        api_key = os.getenv('MONIFY_API_KEY')
        secret_key = os.getenv('MONIFY_SECRET_KEY')  
        
        if not api_key or not secret_key:
            raise ValueError("Monnify API credentials not found in environment variables")
            
        auth_string = f"{api_key}:{secret_key}"
        encoded_auth = base64.b64encode(auth_string.encode()).decode()
        print(encoded_auth)
        return f"Basic {encoded_auth}"

    @staticmethod
    def get_access_token():
        """Get access token from Monnify API"""
        headers = {
            'Authorization': MonnifyAuth.generate_basic_auth(),
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(
                f'{os.getenv('MONIFY_BASE_URL')}/auth/login',
                headers=headers,
                json={}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('requestSuccessful'):
                    return {
                        'success': True,
                        'token': data['responseBody']['accessToken'],
                        'expires_in': data['responseBody']['expiresIn']
                    }
               
            
            return {
                'success': False,
                'error': 'Failed to get access token'
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e)
            }
# payment/admin.py