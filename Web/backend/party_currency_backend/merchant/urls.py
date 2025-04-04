from django.urls import path
from .views import getAllTransaction,createReservedAccount,deleteReservedAccount
urlpatterns = [
    path("transactions",getAllTransaction,name="list transactions"),
    path("create-reserved-account",createReservedAccount,name="create reserved account"),
    path("delete-reserved-account",deleteReservedAccount,name="delete reserved account")
    
]