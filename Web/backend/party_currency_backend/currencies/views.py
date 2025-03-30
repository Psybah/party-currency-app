from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Currency  # Fix the import
from django.utils import timezone
from datetime import datetime
import pytz
from google_drive.models import GoogleDriveFile
from google_drive.utils import upload_file_to_drive
from authentication.models import CustomUser
from django.core.files.storage import default_storage
import os
from django.core.files.base import ContentFile
from rest_framework import status
from dotenv import load_dotenv
import random
import string



