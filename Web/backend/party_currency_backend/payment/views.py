# views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import TransactionSerializer
from rest_framework.decorators import api_view, permission_classes
from .models import Transaction
from events.models import Events
import time
import os
from dotenv import load_dotenv
from .utils import MonnifyAuth
from rest_framework.permissions import AllowAny


load_dotenv()
class InitializeTransactionView(APIView):
    def post(self, request):
        transaction = Transaction.objects.get(payment_reference=request.data['payment_reference'])
        
            # Prepare the request to Monnify API
        headers = {
                'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
                'Content-Type': 'application/json'
            }
        print(headers)
        payload = {
                'amount': float(transaction.amount),
                'customerName': transaction.customer_name,
                'customerEmail': transaction.customer_email,
                'paymentReference': transaction.payment_reference,
                'paymentDescription': transaction.payment_description,
                'currencyCode': transaction.currency_code,
                'contractCode': transaction.contract_code,
                'redirectUrl': f"{os.getenv('Base_Backend_URL')}/payments/callback",
                'paymentMethods': ['CARD', 'ACCOUNT_TRANSFER']
            }

        try:
            response = requests.post(
                    f'{os.getenv('MONIFY_BASE_URL')}/merchant/transactions/init-transaction',
                    json=payload,
                    headers=headers
                )

            response_data = response.json()

            if response_data['requestSuccessful']:
                    # Update transaction with reference from Monnify
                   
                    transaction.transaction_reference = response_data['responseBody']['transactionReference']
                    transaction.save()

            return Response(response_data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
                return Response({
                    'error': 'Failed to initialize transaction',
                    'detail': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def calculate_amount():
    return {
        "printing": 1000,
        "delivery": 500,
        "reconciliation": 200
        
    }
@api_view(["POST"])
def generate_transcation_ID(request):
    amount=calculate_amount()
    transcation = Transaction.objects.create(
                    amount=sum(amount.values()),    
                    customer_name=f"{request.user.first_name} {request.user.last_name}",
                    customer_email=request.user.email,
                    payment_reference=f"party{int(time.time())}",
                    payment_description=f"Payment for services {request.data['event_id']}",
                    currency_code="NGN",
                    contract_code=os.getenv("MONIFY_CONTRACT_CODE")
        
                        )
    
    return Response({
        "amount": amount,
        "total": sum(calculate_amount().values()),
        "currency_code": "NGN",
        "payment_reference":transcation.payment_reference

    })

@api_view(["GET"])
@permission_classes([AllowAny])
def callback(request):
    transaction = Transaction.objects.get(payment_reference=request.data['payment_reference'])
    transaction.status = request.data['status']
    transaction.save()
    event = Events.objects.get(event_id=request.data['event_id'])
    event.transaction_id = request.data['payment_reference']
    event.save()
    return Response({"message": "payment successful", "transaction": transaction.status, "transaction_reference": transaction.transaction_reference}, status=status.HTTP_200_OK)


