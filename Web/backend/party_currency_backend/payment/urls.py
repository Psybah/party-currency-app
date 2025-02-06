from django.urls import path
from .views import InitializeTransactionView,generate_transcation_ID
urlpatterns = [
    path("pay",InitializeTransactionView.as_view(),name="make payment "),
    path("create-transcation",generate_transcation_ID)

]