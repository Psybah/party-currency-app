# views.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import TransactionSerializer
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from .models import Transaction
from events.models import Events
import time
import os
from dotenv import load_dotenv
from .utils import MonnifyAuth
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from authentication.models import CustomUser as CUser
from django.http import HttpResponseRedirect

class UserThrottle(UserRateThrottle):
    scope = 'user'

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
                    f"{os.getenv('MONIFY_BASE_URL')}/merchant/transactions/init-transaction",
                    json=payload,
                    headers=headers
                )

            response_data = response.json()

            if response_data['requestSuccessful']:
                    # Update transaction with reference from Monnify
                   
                    transaction.transaction_reference = response_data['responseBody']['transactionReference']
                    transaction.save()
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.payment_status='successful'
                    event.delivery_status='pending'
                    event.save()

            return Response(response_data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
                return Response({
                    'error': 'Failed to initialize transaction',
                    'detail': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@throttle_classes([UserThrottle])
def calculate_amount():
    return {
        "printing": 1000,
        "delivery": 500,
        "reconciliation": 200
        
    }
@api_view(["POST"])
def generate_transcation_ID(request):
    amount = calculate_amount()
    event = Events.objects.get(event_id = request.data['event_id'])
    if (event.payment_status  == 'successful' or event.payment_status  == 'Successful'):
        return Response({'message':'event has been paid for '}, status=status.HTTP_400_BAD_REQUEST)
    transaction = Transaction.objects.create(
        amount=sum(amount.values()),    
        customer_name=f"{request.user.first_name} {request.user.last_name}",
        customer_email=request.user.email,
        payment_reference=f"party{int(time.time())}",
        payment_description=f"Payment for {request.data['event_id']}",
        currency_code="NGN",
        breakdown=str(amount),
        contract_code=os.getenv("MONIFY_CONTRACT_CODE"),  # Fixed the missing comma
        event_id=request.data['event_id'],
        user_id=request.user.email  # Storing user email as user_id
    )
    
    return Response({
        "amount": amount,
        "total": sum(amount.values()),
        "currency_code": "NGN",
        "payment_reference": transaction.payment_reference
    })
@api_view(["GET"])
@throttle_classes([UserThrottle])
@permission_classes([AllowAny])
def callback(request):
    frontend_url = os.getenv("FRONTEND_URL")
    transaction_reference = None
    
    try:
        payment_reference = request.query_params.get("paymentReference")
        
        if not payment_reference:
            return HttpResponseRedirect(f"{frontend_url}/dashboard?error=missing_reference")
        
        transaction = Transaction.objects.get(payment_reference=payment_reference)
        transaction_reference = transaction.transaction_reference
        
        # Verify with Monnify
        headers = {
            'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
            'Content-Type': 'application/json'
        }
        
        verification_response = requests.get(
            f"{os.getenv('MONIFY_BASE_URL')}/merchant/transactions/query?paymentReference={payment_reference}",
            headers=headers
        )
        
        verification_data = verification_response.json()
        
        if verification_data.get('requestSuccessful') and verification_data['responseBody'].get('paymentStatus') == "PAID":
            # Update transaction
            transaction.status = "successful"
            transaction.save()
            
            # Update event
            if transaction.event_id:
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.transaction_id = payment_reference
                    event.payment_status = 'successful'
                    event.delivery_status = 'pending'
                    event.save()
                except Events.DoesNotExist:
                    pass  # Continue even if event not found
            
            # Update user total
            try:
                user = CUser.objects.get(email=transaction.user_id)
                user.total_amount_spent += transaction.amount
                user.save()
            except (CUser.DoesNotExist, Exception) as e:
                print(f"Error updating user total: {str(e)}")
            
            redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction_reference}"
            return HttpResponseRedirect(redirect_url)
            
        else:
            # Payment failed
            transaction.status = "failed"
            transaction.save()
            
            if transaction.event_id:
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.transaction_id = payment_reference
                    event.payment_status = 'failed'
                    event.save()
                except Events.DoesNotExist:
                    pass
            
            redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction_reference}&status=failed"
            return HttpResponseRedirect(redirect_url)
            
    except Transaction.DoesNotExist:
        redirect_url = f"{frontend_url}/dashboard?error=transaction_not_found"
        return HttpResponseRedirect(redirect_url)
        
    except Exception as e:
        print(f"Callback error: {str(e)}")
        error_redirect = f"{frontend_url}/dashboard"
        if transaction_reference:
            error_redirect += f"?transaction_reference={transaction_reference}&error=processing_failed"
        else:
            error_redirect += "?error=processing_failed"
        return HttpResponseRedirect(error_redirect)