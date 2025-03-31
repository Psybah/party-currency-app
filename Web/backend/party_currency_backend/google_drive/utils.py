import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import json
from dotenv import load_dotenv

load_dotenv()
# Path to your service account JSON key file

# Load the service account info from environment variable
service_account_str = os.getenv('GOOGLE_SERVICE_ACCOUNT')

try:
    service_account_info = json.loads(service_account_str)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")

# Define the scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive']

# Authenticate using the service account
def authenticate():
    creds = service_account.Credentials.from_service_account_info(
        service_account_info, scopes=SCOPES
    )
    return creds

# Upload a file to Google Drive
def upload_file_to_drive(file_path, file_name, folder_id=None):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': file_name,
        'parents': [folder_id] if folder_id else []  # Optional: Specify a folder ID
    }
    media = MediaFileUpload(file_path, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    return file.get('id')


