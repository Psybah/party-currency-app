from django.urls import path
from .views import InitializeTransactionView,generate_transcation_ID,callback
urlpatterns = [
    path("pay",InitializeTransactionView.as_view(),name="make payment "),
    path("create-transaction",generate_transcation_ID),
    path("callback",callback,name="callback")

]