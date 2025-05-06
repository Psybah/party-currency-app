from django.urls import path
from .views import getAllTransaction,createReservedAccount,deleteReservedAccount,get_active_reserved_account
urlpatterns = [
    path("transactions",getAllTransaction,name="list transactions"),
    path("create-reserved-account",createReservedAccount,name="create reserved account"),
    path("delete-reserved-account",deleteReservedAccount,name="delete reserved account"),
    path("get-active-reserved-account",get_active_reserved_account,name="get active reserved accounts")
]