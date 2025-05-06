from django.shortcuts import render
from payment.utils import MonnifyAuth
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework import status
from events.models import Events
import requests
import os

class UserThrottle(UserRateThrottle):
    scope = 'user'

# Create your views here.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@throttle_classes([UserThrottle])
def getAllTransaction(request):
    headers = {
        'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Get parameters from query_params instead of data
    account_reference = request.query_params.get("account_reference")
    
    if not account_reference:
        return Response({
            "error": "account_reference is required"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Build the URL with query parameters - using a large size to get all transactions
    base_url = os.getenv("MONIFY_BASE_URL")
    url = f"{base_url}/bank-transfer/reserved-accounts/transactions?accountReference={account_reference}&page=0&size=1000"
    
    try:
        response = requests.get(url, headers=headers).json()
        
        if not response.get("requestSuccessful", False):
            error_message = response.get("responseMessage", "Unknown error")
            error_code = response.get("responseCode", "unknown")
            
            return Response({
                "error": error_message,
                "error_code": error_code
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract only the transactions from the response
        transactions = response.get("responseBody", {}).get("content", [])
        
        # Format the transactions to include only necessary information
        formatted_transactions = []
        for transaction in transactions:
            formatted_transaction = {
                "amount": transaction.get("amount"),
                "currency": transaction.get("currencyCode"),
                "status": transaction.get("paymentStatus"),
                "reference": transaction.get("paymentReference"),
                "date": transaction.get("completedOn"),
                "description": transaction.get("paymentDescription"),
                "payment_method": transaction.get("paymentMethod")
            }
            formatted_transactions.append(formatted_transaction)
            
        return Response({
            "transactions": formatted_transactions
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@throttle_classes([UserThrottle])
def createReservedAccount(request):
    data = request.data
    event = Events.objects.get(event_id=data["event_id"])

    headers = {
        'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
        'Content-Type': 'application/json'
    }
    payload = {
        "accountReference": event.event_id,
        "accountName": event.event_name,
        "currencyCode": "NGN",
        "contractCode": os.getenv("MONIFY_CONTRACT_CODE"),
        "customerEmail": event.event_author,
        "customerName": request.data["customer_name"],
        "bvn": request.data["bvn"],
        "getAllAvailableBanks": "true",
    }
    try:
        response = requests.post(f"{os.getenv('MONIFY_BASE_URL')}/bank-transfer/reserved-accounts", headers=headers, json=payload).json()
        
        if not response.get("requestSuccessful", False):
            error_message = response.get("responseMessage", "Unknown error")
            error_code = response.get("responseCode", "unknown")
            
            if error_code == "99" and "same reference" in error_message.lower():
                return Response({
                    "error": "An account with this reference already exists. Please use a different event ID or check if the account was already created.",
                    "error_code": error_code
                }, status=status.HTTP_409_CONFLICT)
            else:
                return Response({
                    "error": error_message,
                    "error_code": error_code
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the event to indicate it has a reserved account
        event.has_reserved_account = True
        event.save()
        user = request.user
        user.virtual_account_reference=response["responseBody"]["accountReference"]
        user.save()
        return Response({
            "message": "account created successfully",
            "account_details": {
                "account_reference": response["responseBody"]["accountReference"],
                "account_name": response["responseBody"]["accountName"],
                "account_number": response["responseBody"]["accountNumber"],
                "account_bank": response["responseBody"]["accountBank"],
                "account_currency": response["responseBody"]["accountCurrency"],
                "account_type": response["responseBody"]["accountType"],
                "account_status": response["responseBody"]["accountStatus"]
            }
        }, status=status.HTTP_200_OK)
                                                                            
    except Exception as e:
        return Response({
            "error": str(e),
            "response": response if 'response' in locals() else None
        }, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@throttle_classes([UserThrottle])
def deleteReservedAccount(request, account_reference=None):
    # If account_reference is not provided as a parameter, get it from query_params
    if account_reference is None and request is not None:
        account_reference = request.query_params.get("account_reference")
    
    if not account_reference:
        return Response({
            "error": "account_reference is required"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    headers = {
        'Authorization': f"Bearer {MonnifyAuth.get_access_token()['token']}",
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.delete(
            f"{os.getenv('MONIFY_BASE_URL')}/bank-transfer/reserved-accounts/{account_reference}", 
            headers=headers
        ).json()
        
        # If this was called from the scheduler, return a simple response
        if request is None:
            return response
            
        return Response(response, status=status.HTTP_200_OK)
    except Exception as e:
        error_response = {
            "error": str(e),
            "response": response if 'response' in locals() else None
        }
        
        # If this was called from the scheduler, return the error response
        if request is None:
            return error_response
            
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@throttle_classes([UserThrottle])
def get_active_reserved_account(request):
    """
    Retrieve the active virtual account reference for the authenticated user.
    
    Args:
        request: The HTTP request object containing user information
        
    Returns:
        Response: JSON response with account reference or error message
    """
    try:
        account_reference = request.user.virtual_account_reference
        if account_reference is None:
            return Response(
                {"error": "No active virtual account found for this merchant"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {"account_reference": account_reference},
            status=status.HTTP_200_OK
        )
    except AttributeError:
        return Response(
            {"error": "User authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )