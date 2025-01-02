from django.urls import path
from .views import login, signupUser, signupMerchant
from .views import GoogleLogin
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("login", login, name="dbLogin"),
    path("signup/user", signupUser, name="userSignup"),
    path("signup/merchant", signupMerchant, name="merchantSignup"),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
]