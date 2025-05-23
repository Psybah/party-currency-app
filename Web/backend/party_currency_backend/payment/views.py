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
import logging

# Set up logging
logger = logging.getLogger(__name__)

class UserThrottle(UserRateThrottle):
    scope = 'user'

load_dotenv()

class InitializeTransactionView(APIView):
    def post(self, request):
        try:
            # More robust transaction retrieval
            payment_reference = request.data.get('payment_reference')
            if not payment_reference:
                return Response({
                    'error': 'Payment reference is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            transaction = Transaction.objects.get(payment_reference=payment_reference)
            
            # Prepare the request to Monnify API
            headers = {
                'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
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
                'redirectUrl': f"{os.getenv('Base_Backend_URL')}/payments/callback",
                'paymentMethods': ['CARD', 'ACCOUNT_TRANSFER']
            }

            response = requests.post(
                f"{os.getenv('MONIFY_BASE_URL')}/merchant/transactions/init-transaction",
                json=payload,
                headers=headers
            )

            response_data = response.json()
            logger.info(f"Monnify response: {response_data}")

            if response_data.get('requestSuccessful'):
                # Update transaction with reference from Monnify
                transaction.transaction_reference = response_data['responseBody']['transactionReference']
                transaction.status = "pending"  # Set initial status
                transaction.save()
                
                # Update event status
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.payment_status = 'pending'  # Changed from 'successful' to 'pending'
                    event.delivery_status = 'pending'
                    event.save()
                except Events.DoesNotExist:
                    logger.warning(f"Event not found for transaction {payment_reference}")

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                # Handle failed initialization
                transaction.status = "failed"
                transaction.save()
                
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.payment_status = 'failed'
                    event.save()
                except Events.DoesNotExist:
                    pass
                
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

        except Transaction.DoesNotExist:
            return Response({
                'error': 'Transaction not found',
                'payment_reference': payment_reference
            }, status=status.HTTP_404_NOT_FOUND)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return Response({
                'error': 'Failed to initialize transaction',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({
                'error': 'An unexpected error occurred',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@throttle_classes([UserThrottle])
def calculate_amount():
    return {
        "printing": 1000,
        "delivery": 500,
        "reconciliation": 200
    }

@api_view(["POST"])
def generate_transcation_ID(request):
    try:
        amount = calculate_amount()
        transaction = Transaction.objects.create(
            amount=sum(amount.values()),    
            customer_name=f"{request.user.first_name} {request.user.last_name}",
            customer_email=request.user.email,
            payment_reference=f"party{int(time.time())}",
            payment_description=f"Payment for services {request.data['event_id']}",
            currency_code="NGN",
            contract_code=os.getenv("MONIFY_CONTRACT_CODE"),
            event_id=request.data['event_id'],
            user_id=request.user.email,
            status="created"  # Initial status
        )
        
        return Response({
            "amount": amount,
            "total": sum(amount.values()),
            "currency_code": "NGN",
            "payment_reference": transaction.payment_reference
        })
    except Exception as e:
        logger.error(f"Error generating transaction: {str(e)}")
        return Response({
            "error": "Failed to generate transaction",
            "detail": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@throttle_classes([UserThrottle])
@permission_classes([AllowAny])
def callback(request):
    try:
        # Get payment reference from query parameters with multiple possible names
        payment_reference = (
            request.query_params.get("paymentReference") or 
            request.query_params.get("payment_reference") or
            request.query_params.get("reference")
        )
        
        logger.info(f"Callback received with parameters: {dict(request.query_params)}")
        
        if not payment_reference:
            return Response({
                "error": "Payment reference not provided",
                "received_params": dict(request.query_params)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get transaction using payment reference
        try:
            transaction = Transaction.objects.get(payment_reference=payment_reference)
            logger.info(f"Transaction found: {transaction.payment_reference}")
        except Transaction.DoesNotExist:
            # Try to find by transaction_reference as well
            try:
                transaction = Transaction.objects.get(transaction_reference=payment_reference)
                logger.info(f"Transaction found by transaction_reference: {transaction.payment_reference}")
            except Transaction.DoesNotExist:
                logger.error(f"Transaction not found with reference: {payment_reference}")
                return Response({
                    "error": "Transaction not found",
                    "payment_reference": payment_reference
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Verify the transaction status with Monnify
        headers = {
            'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
            'Content-Type': 'application/json'
        }
        
        try:
            verification_response = requests.get(
                f"{os.getenv('MONIFY_BASE_URL')}/merchant/transactions/query?paymentReference={payment_reference}",
                headers=headers,
                timeout=30
            )
            verification_data = verification_response.json()
            logger.info(f"Verification response: {verification_data}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Verification request failed: {str(e)}")
            # Handle failed verification - mark as failed
            transaction.status = "failed"
            transaction.save()
            
            if transaction.event_id:
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.payment_status = 'failed'
                    event.save()
                except Events.DoesNotExist:
                    pass
            
            return Response({
                "error": "Payment verification failed",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Process verification results
        if verification_data.get('requestSuccessful'):
            payment_status = verification_data['responseBody'].get('paymentStatus', '').upper()
            
            if payment_status == "PAID":
                # Update transaction status to successful
                transaction.status = "successful"
                transaction.save()
                
                # Update the event with transaction information
                if transaction.event_id:
                    try:
                        event = Events.objects.get(event_id=transaction.event_id)
                        event.transaction_id = payment_reference
                        event.payment_status = 'successful'
                        event.save()
                    except Events.DoesNotExist:
                        logger.warning(f"Event not found for transaction {payment_reference}")
                
                # Update user's total amount spent
                try:
                    user = CUser.objects.get(email=transaction.user_id)
                    user.total_amount_spent += transaction.amount
                    user.save()
                except CUser.DoesNotExist:
                    logger.warning(f"User not found: {transaction.user_id}")
                except Exception as e:
                    logger.error(f"Error updating user total: {str(e)}")
                
                # Redirect to frontend
                frontend_url = os.getenv("FRONTEND_URL")
                redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction.transaction_reference}&status=success"
                
                return HttpResponseRedirect(redirect_url)
                
            elif payment_status in ["FAILED", "CANCELLED", "EXPIRED"]:
                # Handle failed/cancelled/expired payments
                transaction.status = "failed"
                transaction.save()
                
                if transaction.event_id:
                    try:
                        event = Events.objects.get(event_id=transaction.event_id)
                        event.payment_status = 'failed'
                        event.save()
                    except Events.DoesNotExist:
                        pass
                
                # Redirect to frontend with failure status
                frontend_url = os.getenv("FRONTEND_URL")
                redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction.transaction_reference}&status=failed"
                
                return HttpResponseRedirect(redirect_url)
                
            else:
                # Payment is still pending or unknown status
                transaction.status = "pending"
                transaction.save()
                
                frontend_url = os.getenv("FRONTEND_URL")
                redirect_url = f"{frontend_url}/dashboard?transaction_reference={transaction.transaction_reference}&status=pending"
                
                return HttpResponseRedirect(redirect_url)
        else:
            # Verification request was not successful
            transaction.status = "failed"
            transaction.save()
            
            if transaction.event_id:
                try:
                    event = Events.objects.get(event_id=transaction.event_id)
                    event.payment_status = 'failed'
                    event.save()
                except Events.DoesNotExist:
                    pass
            
            return Response({
                "message": "Payment verification failed", 
                "error": verification_data.get('responseMessage', 'Unknown error')
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Callback error: {str(e)}")
        return Response({
            "error": "An error occurred processing the callback",
            "detail": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Additional utility function to manually update failed transactions
@api_view(["POST"])
@permission_classes([AllowAny])  # Adjust permissions as needed
def mark_transaction_failed(request):
    """
    Utility endpoint to manually mark a transaction as failed
    """
    try:
        payment_reference = request.data.get('payment_reference')
        if not payment_reference:
            return Response({
                'error': 'Payment reference is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        transaction = Transaction.objects.get(payment_reference=payment_reference)
        transaction.status = "failed"
        transaction.save()
        
        # Update associated event
        if transaction.event_id:
            try:
                event = Events.objects.get(event_id=transaction.event_id)
                event.payment_status = 'failed'
                event.save()
            except Events.DoesNotExist:
                pass
        
        return Response({
            "message": "Transaction marked as failed",
            "payment_reference": payment_reference
        }, status=status.HTTP_200_OK)
        
    except Transaction.DoesNotExist:
        return Response({
            "error": "Transaction not found",
            "payment_reference": payment_reference
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": "Failed to update transaction",
            "detail": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)