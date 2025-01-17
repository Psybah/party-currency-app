# Generated by Django 5.1.4 on 2025-01-12 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_event_event_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_author',
            field=models.CharField(default='user', max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='created_at',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='updated_at',
            field=models.CharField(max_length=255),
        ),
    ]
