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
    transaction = Transaction.objects.create(
        amount=sum(amount.values()),    
        customer_name=f"{request.user.first_name} {request.user.last_name}",
        customer_email=request.user.email,
        payment_reference=f"party{int(time.time())}",
        payment_description=f"Payment for services {request.data['event_id']}",
        currency_code="NGN",
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
    try:
        # Get payment reference from query parameters
        payment_reference = request.query_params.get("paymentReference")
        
        if not payment_reference:
            return Response({"error": "Payment reference not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get transaction using payment reference
        transaction = Transaction.objects.get(payment_reference=payment_reference)
        
        # Verify the transaction status with Monnify (optional, but recommended)
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
            # Update transaction status
            transaction.status = "successful"
            transaction.save()
            
            # Update the event with transaction information
            if transaction.event_id:
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.transaction_id = payment_reference
                    event.save()
                except Events.DoesNotExist:
                    return Response({
                        "message": "Payment successful but event not found", 
                        "transaction": transaction.status
                    }, status=status.HTTP_200_OK)
            
            # Update user's total amount spent
            try:
                # Since you're storing email as user_id, retrieve the user by email
                user = CUser.objects.get(email=transaction.user_id)
                user.total_amount_spent += transaction.amount
                user.save()
            except CUser.DoesNotExist:
                # Continue processing even if user is not found
                pass
            except Exception as e:
                # Log the error but continue processing
                print(f"Error updating user total: {str(e)}")
            frontend_url = os.getenv("FRONTEND_URL")
            redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction.transaction_reference}"
            from django.http import HttpResponseRedirect
            
            return HttpResponseRedirect(redirect_url)
            return Response({
                "message": "Payment successful", 
                "transaction": transaction.status, 
                "transaction_reference": transaction.transaction_reference
            }, status=status.HTTP_200_OK)
        else:
            # If verification failed or payment not successful
            return Response({
                "message": "Payment verification failed", 
                "status": verification_data['responseBody'].get('paymentStatus', 'unknown')
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Transaction.DoesNotExist:
        return Response({
            "error": "Transaction not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": "An error occurred processing the callback",
            "detail": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)