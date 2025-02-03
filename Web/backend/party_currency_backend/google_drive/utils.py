import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import json

# Path to your service account JSON key file

SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'key.json')

# Define the scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive']

# Authenticate using the service account
def authenticate():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
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