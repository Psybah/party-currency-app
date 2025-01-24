from django.urls import path
from .views import InitializeTransactionView,generate_transcation_ID
urlpatterns = [
    path("pay",InitializeTransactionView.post,name="make payment "),
    path("gen_transcation",generate_transcation_ID)

]