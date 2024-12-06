from django.urls import path
from .views import login,signup,test 
urlpatterns = [
    path("login",login , name= "dbLogin"),
    path("signup",signup , name= "dbSignup"),
    path("test",test , name= "dbTest")


]