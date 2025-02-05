# Generated by Django 5.1.4 on 2025-01-12 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('customer_name', models.CharField(blank=True, max_length=255)),
                ('customer_email', models.EmailField(max_length=254)),
                ('payment_reference', models.CharField(max_length=255, unique=True)),
                ('payment_description', models.TextField(blank=True)),
                ('currency_code', models.CharField(default='NGN', max_length=3)),
                ('contract_code', models.CharField(max_length=255)),
                ('redirect_url', models.URLField(blank=True)),
                ('transaction_reference', models.CharField(blank=True, max_length=255)),
                ('status', models.CharField(default='pending', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
