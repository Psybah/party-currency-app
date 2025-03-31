from django.urls import path
from .views import save_currency,get_all_currency,get_currency_by_id,update_currency,delete_currency


urlpatterns = [
    path("save-currency",save_currency),
    path("get-currency/<str:id>",get_currency_by_id),
    path("get-all-currencies",get_all_currency),
    path("update-currency/<str:id>",update_currency),
    path("delete-currency/<str:id>",delete_currency)

]