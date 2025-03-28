from django.urls import path
from .views import login, signupUser, signupMerchant,change_password,generate_password_reset_code,get_password_reset_token,reset_password, google_callback, google_login_callback
from .views import GoogleLogin
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("login", login, name="dbLogin"),
    path("signup/user", signupUser, name="userSignup"),
    path("signup/merchant", signupMerchant, name="merchantSignup"),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('google/callback', google_callback, name='google_callback'),
    path('google/login/callback', google_login_callback, name='google_login_callback'),

    path('password/change',change_password, name="pasword_change"),
    path('password/reset',reset_password, name="pasword_reset"),
    path('password/token',get_password_reset_token, name="pasword_reset_token"),
     path('password/code',generate_password_reset_code, name="pasword_reset_code"),



]