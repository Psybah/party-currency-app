from django.db import models

class GoogleDriveFile(models.Model):
    name = models.CharField(max_length=255)
    google_drive_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name