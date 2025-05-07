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
# @throttle_classes([UserThrottle])
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
# @throttle_classes([UserThrottle])
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
    """
    Delete a reserved account from Monnify.
    
    Args:
        request: The HTTP request object
        account_reference: Optional account reference from URL path parameter
    
    Query Parameters:
        account_reference: The reference ID of the account to delete (if not provided in URL)
    
    Returns:
        Response: JSON response from Monnify API or error details
    """
    # Get account_reference from URL path param or query param
    if account_reference is None:
        if request is not None:
            account_reference = request.query_params.get("account_reference")
        else:
            return {"error": "account_reference is required", "status_code": status.HTTP_400_BAD_REQUEST}
    
    # Validate input
    if not account_reference or not isinstance(account_reference, str):
        error_msg = "Valid account_reference is required"
        return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get Monnify base URL from settings with fallback to env variable
    base_url = getattr(os.getenv('MONNIFY_BASE_URL'))
    if not base_url:
        return Response(
            {"error": "Service misconfiguration: API base URL not found"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Prepare request
    try:
        access_token = MonnifyAuth.get_access_token()
        if not access_token or 'token' not in access_token:
            return Response(
                {"error": "Failed to authenticate with payment provider"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        headers = {
            'Authorization': f"Bearer {access_token['token']}",
            'Content-Type': 'application/json'
        }
        
        
        # Make API request
        api_response = requests.delete(
            f"{base_url}/bank-transfer/reserved-accounts/{account_reference}", 
            headers=headers,
            timeout=30  # Add timeout to prevent hanging
        )
        
        # Check for HTTP errors
        api_response.raise_for_status()
        
        # Parse response
        response_data = api_response.json()
        
                
        # Return appropriate response based on caller
        if request is None:
            return {"data": response_data, "status_code": status.HTTP_200_OK}
        
        return Response(response_data)
        
    except requests.exceptions.RequestException as req_err:
        # Handle network/request errors
        error_msg = f"Request to Monnify API failed: {str(req_err)}"
        
        if request is None:
            return {"error": error_msg, "status_code": status.HTTP_503_SERVICE_UNAVAILABLE}
        
        return Response(
            {"error": "Payment provider service unavailable", "detail": str(req_err)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except ValueError as json_err:
        # Handle JSON parsing errors
        error_msg = f"Invalid response from Monnify API: {str(json_err)}"
        
        if request is None:
            return {"error": error_msg, "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}
        
        return Response(
            {"error": "Unexpected response from payment provider", "detail": str(json_err)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
    except Exception as e:
        # Catch-all for any other errors
        error_msg = f"Error deleting reserved account {account_reference}: {str(e)}"

        if request is None:
            return {"error": error_msg, "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}
        
        return Response(
            {"error": "Failed to delete reserved account", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
# @throttle_classes([UserThrottle])
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