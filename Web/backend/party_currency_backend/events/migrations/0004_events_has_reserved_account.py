# Generated by Django 5.1.7 on 2025-04-03 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0003_remove_events_currency_image_100_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='events',
            name='has_reserved_account',
            field=models.BooleanField(default=False),
        ),
    ]
