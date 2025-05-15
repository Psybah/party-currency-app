import os
import io
from typing import Optional, Union, Dict, Any
from pathlib import Path
import logging

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import json
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("google_drive_utils")

# Load environment variables
load_dotenv()

# Define the scopes for Google Drive API
# Consider using more specific scopes if you don't need full access
SCOPES = ['https://www.googleapis.com/auth/drive']

def get_service_account_info() -> Dict[str, Any]:
    """
    Load the service account information from environment variable.
    
    Returns:
        Dict[str, Any]: The service account information as a dictionary
        
    Raises:
        ValueError: If the environment variable is not set or invalid
    """
    service_account_str = os.getenv('GOOGLE_SERVICE_ACCOUNT')
    
    if not service_account_str:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT environment variable is not set")
    
    try:
        service_account_info = json.loads(service_account_str)
        return service_account_info
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding service account JSON: {e}")
        raise ValueError(f"Invalid service account JSON: {e}")

def authenticate():
    """
    Authenticate with Google Drive API using service account credentials.
    
    Returns:
        google.oauth2.service_account.Credentials: The authenticated credentials
    """
    try:
        service_account_info = get_service_account_info()
        creds = service_account.Credentials.from_service_account_info(
            service_account_info, scopes=SCOPES
        )
        logger.info("Successfully authenticated with service account")
        return creds
    except Exception as e:
        logger.error(f"Authentication failed: {e}")
        raise

def get_drive_service():
    """
    Build and return a Google Drive service object.
    
    Returns:
        googleapiclient.discovery.Resource: The Drive service object
    """
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)
    return service

def upload_file_to_drive(
    file_path: Union[str, Path], 
    file_name: Optional[str] = None, 
    folder_id: Optional[str] = None,
    mime_type: Optional[str] = None
) -> str:
    """
    Upload a file to Google Drive.
    
    Args:
        file_path (Union[str, Path]): Path to the file to upload
        file_name (Optional[str]): Name to give the file in Drive (defaults to original filename)
        folder_id (Optional[str]): ID of the folder to upload to (if None, uploads to root)
        mime_type (Optional[str]): MIME type of the file (if None, autodetects)
        
    Returns:
        str: The ID of the uploaded file
        
    Raises:
        FileNotFoundError: If the file does not exist
        Exception: For other errors during upload
    """
    file_path = Path(file_path)
    
    # Check if file exists
    if not file_path.exists():
        logger.error(f"File not found: {file_path}")
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Use original filename if not specified
    if file_name is None:
        file_name = file_path.name
    
    try:
        service = get_drive_service()
        
        file_metadata = {
            'name': file_name,
        }
        
        # Add folder if specified
        if folder_id:
            file_metadata['parents'] = [folder_id]
        
        media = MediaFileUpload(
            str(file_path), 
            mimetype=mime_type, 
            resumable=True
        )
        
        # Upload with retry (3 attempts)
        retry_count = 0
        max_retries = 3
        while retry_count < max_retries:
            try:
                logger.info(f"Uploading file: {file_name} (Attempt {retry_count + 1}/{max_retries})")
                file = service.files().create(
                    body=file_metadata,
                    media_body=media,
                    fields='id'
                ).execute()
                file_id = file.get('id')
                logger.info(f"File uploaded successfully. File ID: {file_id}")
                return file_id
            except Exception as e:
                retry_count += 1
                if retry_count >= max_retries:
                    raise
                logger.warning(f"Upload attempt {retry_count} failed: {e}. Retrying...")
        
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise

def download_file_from_drive(
    file_id: str, 
    destination_path: Optional[Union[str, Path]] = None
) -> Union[bytes, str]:
    """
    Download a file from Google Drive.
    
    Args:
        file_id (str): The ID of the file to download
        destination_path (Optional[Union[str, Path]]): Path where the file should be saved
                                                      If None, returns the file content as bytes
        
    Returns:
        Union[bytes, str]: 
            - If destination_path is provided: The path to the saved file
            - If destination_path is None: The file content as bytes
            
    Raises:
        Exception: If there's an error downloading the file
    """
    try:
        service = get_drive_service()
        
        # Get file metadata to get the filename
        file_metadata = service.files().get(fileId=file_id).execute()
        filename = file_metadata.get('name', f'downloaded_file_{file_id}')
        
        # Create a BytesIO object to store the downloaded file
        request = service.files().get_media(fileId=file_id)
        file_content = io.BytesIO()
        downloader = MediaIoBaseDownload(file_content, request)
        
        # Download the file with progress reporting
        done = False
        while not done:
            status, done = downloader.next_chunk()
            logger.info(f"Download progress: {int(status.progress() * 100)}%")
        
        # Reset the file pointer to the beginning
        file_content.seek(0)
        
        # If destination path is provided, save the file
        if destination_path:
            destination_path = Path(destination_path)
            
            # If destination is a directory, use the original filename
            if destination_path.is_dir():
                destination_path = destination_path / filename
            
            # Create parent directories if they don't exist
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write the file
            with open(destination_path, 'wb') as f:
                f.write(file_content.read())
            
            logger.info(f"File downloaded and saved to: {destination_path}")
            return str(destination_path)
        
        # If no destination path, return the file content
        logger.info(f"File '{filename}' downloaded to memory")
        return file_content.getvalue()
        
    except Exception as e:
        logger.error(f"Error downloading file: {e}")
        raise

def list_files_in_drive(
    folder_id: Optional[str] = None,
    query: Optional[str] = None,
    page_size: int = 100
) -> list:
    """
    List files in Google Drive, optionally filtered by folder or query.
    
    Args:
        folder_id (Optional[str]): ID of the folder to list files from
        query (Optional[str]): Search query (see Google Drive API documentation)
        page_size (int): Maximum number of files to return
        
    Returns:
        list: List of file metadata dictionaries
    """
    try:
        service = get_drive_service()
        
        # Build the query
        q_parts = []
        if folder_id:
            q_parts.append(f"'{folder_id}' in parents")
        if query:
            q_parts.append(query)
        
        # Combine query parts
        q = " and ".join(q_parts) if q_parts else None
        
        # Execute the query
        results = service.files().list(
            q=q,
            pageSize=page_size,
            fields="nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, size)"
        ).execute()
        
        files = results.get('files', [])
        logger.info(f"Found {len(files)} files in Drive")
        
        return files
        
    except Exception as e:
        logger.error(f"Error listing files: {e}")
        raise

