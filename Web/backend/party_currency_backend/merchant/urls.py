from django.urls import path
from .views import getAllTransaction,createReservedAccount
urlpatterns = [
    path("/transactions",getAllTransaction,name="list transactions"),
    path("/create-reserved-account",createReservedAccount,name="create reserved account")

]