"""
URL configuration for party_currency_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path,include
from django.contrib import admin

urlpatterns = [
    path('admin/', include('party_currency_admin.urls')),
    path('auth/', include("authentication.urls")),
    path('test/', include("testapp.urls")),
    path("users/", include("users.urls")),
    path("accounts/", include("allauth.urls")),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('events/', include("events.urls")),
    path('payments/', include("payment.urls")),
    path("merchant/",include("merchant.urls")),
    path("currencies/",include("currencies.urls")),
]
