# views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import TransactionSerializer

class InitializeTransactionView(APIView):
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            # Save transaction to database
            transaction = serializer.save()
            
            # Prepare the request to Monnify API
            headers = {
                'Authorization': f'Token {settings.MONNIFY_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'amount': float(transaction.amount),
                'customerName': transaction.customer_name,
                'customerEmail': transaction.customer_email,
                'paymentReference': transaction.payment_reference,
                'paymentDescription': transaction.payment_description,
                'currencyCode': transaction.currency_code,
                'contractCode': transaction.contract_code,
                'redirectUrl': transaction.redirect_url,
                'paymentMethods': serializer.validated_data.get('payment_methods', ['CARD', 'ACCOUNT_TRANSFER'])
            }
            
            try:
                response = requests.post(
                    f'{settings.MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction',
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