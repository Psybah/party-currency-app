from django.urls import path
from .views import login,signupUser,test,signupMerchant
urlpatterns = [
    path("login",login , name= "dbLogin"),
    path("signup/user",signupUser , name= "userSignup"),
    path("signup/merchant",signupMerchant , name= "merchantSignup"),
    path("test",test , name= "dbTest")


]