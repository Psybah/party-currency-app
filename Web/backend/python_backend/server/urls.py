
from django.urls import re_path,path,include
from . import views 
urlpatterns = [

    re_path('login',views.login),
    re_path('signup',views.signup),
    re_path('test_token',views.test_token),
    re_path('update',views.update),
    path("",include("googleauthentication.urls")),
    path("accounts/",include("allauth .urls"))
    path("/",include("users.url"))





]
