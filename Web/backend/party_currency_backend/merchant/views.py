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
import logging

logger = logging.getLogger(__name__)

class UserThrottle(UserRateThrottle):
    scope = 'user'

# Create your views here.
@api_view(["GET"])
@permission_classes([IsAuthenticated])
# @throttle_classes([UserThrottle])
def getAllTransaction(request):
    try:
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
        if not base_url:
            logger.error("MONIFY_BASE_URL not configured")
            return Response({
                "error": "Service misconfiguration: API base URL not found"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        url = f"{base_url}/bank-transfer/reserved-accounts/transactions?accountReference={account_reference}&page=0&size=1000"
        
        response = requests.get(url, headers=headers, timeout=30).json()
        
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
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request to Monnify API failed: {str(req_err)}")
        return Response({
            "error": "Payment provider service unavailable",
            "detail": str(req_err)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        logger.exception(f"Error fetching transactions: {str(e)}")
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
# @throttle_classes([UserThrottle])
def createReservedAccount(request):
    try:
        data = request.data
        
        # Validate required fields
        if not data.get("event_id") or not data.get("customer_name") or not data.get("bvn"):
            return Response({
                "error": "event_id, customer_name, and bvn are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the event
        try:
            event = Events.objects.get(event_id=data["event_id"])
        except Events.DoesNotExist:
            return Response({
                "error": "Event not found"
            }, status=status.HTTP_404_NOT_FOUND)

        # Get access token
        access_token = MonnifyAuth.get_access_token()
        if not access_token or 'token' not in access_token:
            logger.error("Failed to obtain Monnify access token")
            return Response({
                "error": "Failed to authenticate with payment provider"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        headers = {
            'Authorization': f"Bearer {access_token['token']}",
            'Content-Type': 'application/json'
        }
        
        base_url = os.getenv("MONIFY_BASE_URL")
        contract_code = os.getenv("MONIFY_CONTRACT_CODE")
        
        if not base_url or not contract_code:
            logger.error("MONIFY_BASE_URL or MONIFY_CONTRACT_CODE not configured")
            return Response({
                "error": "Service misconfiguration: Required environment variables not found"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        payload = {
            "accountReference": event.event_id,
            "accountName": event.event_name,
            "currencyCode": "NGN",
            "contractCode": contract_code,
            "customerEmail": event.event_author,
            "customerName": request.data["customer_name"],
            "bvn": request.data["bvn"],
            "getAllAvailableBanks": "true",
        }
        
        response = requests.post(
            f"{base_url}/bank-transfer/reserved-accounts", 
            headers=headers, 
            json=payload,
            timeout=30
        ).json()
        
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
        
        # Update the user's virtual account reference
        user = request.user
        user.virtual_account_reference = response["responseBody"]["accountReference"]
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
                                                                            
    except requests.exceptions.RequestException as req_err:
        logger.error(f"Request to Monnify API failed: {str(req_err)}")
        return Response({
            "error": "Payment provider service unavailable",
            "detail": str(req_err)
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as e:
        logger.exception(f"Error creating reserved account: {str(e)}")
        return Response({
            "error": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    
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
    except Exception as e:
        logger.exception(f"Error retrieving active reserved account: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
# @throttle_classes([UserThrottle])
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
    try:
        logger.info("Starting reserved account deletion")
        
        # Get account_reference from URL path param or query param
        if account_reference is None:
            if request is not None:
                account_reference = request.query_params.get("account_reference")
            else:
                logger.error("Account reference not provided for deletion")
                return {"error": "account_reference is required", "status_code": status.HTTP_400_BAD_REQUEST}
        
        # Validate input
        if not account_reference or not isinstance(account_reference, str):
            error_msg = "Valid account_reference is required"
            logger.error(f"Invalid account reference: {account_reference}")
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get Monnify base URL using the consistent MONIFY spelling
        base_url = os.getenv('MONIFY_BASE_URL')
        if not base_url:
            logger.error("MONIFY_BASE_URL not configured")
            return Response(
                {"error": "Service misconfiguration: API base URL not found"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get access token
        access_token = MonnifyAuth.get_access_token()
        if not access_token or 'token' not in access_token:
            logger.error("Failed to obtain Monnify access token")
            return Response(
                {"error": "Failed to authenticate with payment provider"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
        headers = {
            'Authorization': f"Bearer {access_token['token']}",
            'Content-Type': 'application/json'
        }
        
        logger.info(f"Deleting reserved account: {account_reference}")
        
        # Log the request details (without sensitive info)
        request_url = f"{base_url}/bank-transfer/reserved-accounts/reference/{account_reference}"
        logger.info(f"Sending delete request to: {request_url}")
        
        # Make API request
        api_response = requests.delete(
            request_url, 
            headers=headers,
            timeout=30
        )
        
        # Log response status before raising any exceptions
        logger.info(f"Monnify API response status: {api_response.status_code}")
        
        # For 404, consider account already deleted
        if api_response.status_code == 404:
            logger.warning(f"Account {account_reference} not found on Monnify - considering already deleted")
            if request is None:
                return {"message": "Account already deleted or not found", "status_code": status.HTTP_200_OK}
            return Response({"message": "Account already deleted or not found"}, status=status.HTTP_200_OK)
        
        # Check for HTTP errors
        api_response.raise_for_status()
        
        # Parse response
        response_data = api_response.json()
        
        # Update user data if successful
        if request is not None and hasattr(request, 'user'):
            user = request.user
            user.virtual_account_reference = None
            user.save()
        
        # Log success
        logger.info(f"Successfully deleted reserved account: {account_reference}")
        
        # Return appropriate response based on caller
        if request is None:
            return {"data": response_data, "status_code": status.HTTP_200_OK}
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except requests.exceptions.HTTPError as http_err:
        # Handle HTTP error responses (4XX, 5XX)
        error_msg = f"Monnify API error: {str(http_err)}"
        logger.error(error_msg)
        
        # Extract status code and response body for more detailed error handling
        status_code = http_err.response.status_code
        
        try:
            error_response = http_err.response.json()
            error_detail = error_response.get('responseMessage', str(http_err))
        except ValueError:
            error_detail = str(http_err)
        
        # Map common error codes to appropriate responses
        if status_code == 400:
            # Handle Bad Request specifically
            logger.error(f"Bad request to Monnify API: {error_detail}")
            
            if "does not exist" in error_detail.lower() or "not found" in error_detail.lower():
                message = "Account reference not found or already deleted"
                # Still update user if the account doesn't exist
                if request is not None and hasattr(request, 'user'):
                    request.user.virtual_account_reference = None
                    request.user.save()
            else:
                message = "Invalid request to payment provider"
                
            if request is None:
                return {"error": message, "detail": error_detail, "status_code": status.HTTP_400_BAD_REQUEST}
            
            return Response(
                {"error": message, "detail": error_detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif status_code == 401 or status_code == 403:
            message = "Authentication error with payment provider"
            if request is None:
                return {"error": message, "detail": error_detail, "status_code": status.HTTP_502_BAD_GATEWAY}
            
            return Response(
                {"error": message, "detail": error_detail},
                status=status.HTTP_502_BAD_GATEWAY
            )
        else:
            # Handle other HTTP errors
            if request is None:
                return {"error": "Payment provider service error", "detail": error_detail, "status_code": status.HTTP_502_BAD_GATEWAY}
            
            return Response(
                {"error": "Payment provider service error", "detail": error_detail},
                status=status.HTTP_502_BAD_GATEWAY
            )
            
    except requests.exceptions.RequestException as req_err:
        # Handle other request errors (timeouts, connection issues)
        error_msg = f"Request to Monnify API failed: {str(req_err)}"
        logger.error(error_msg)
        
        if request is None:
            return {"error": "Payment provider service unavailable", "detail": str(req_err), "status_code": status.HTTP_503_SERVICE_UNAVAILABLE}
        
        return Response(
            {"error": "Payment provider service unavailable", "detail": str(req_err)},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        
    except ValueError as json_err:
        # Handle JSON parsing errors
        error_msg = f"Invalid response from Monnify API: {str(json_err)}"
        logger.error(error_msg)
        
        if request is None:
            return {"error": error_msg, "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}
        
        return Response(
            {"error": "Unexpected response from payment provider", "detail": str(json_err)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
    except Exception as e:
        # Catch-all for any other errors
        error_msg = f"Error deleting reserved account {account_reference}: {str(e)}"
        logger.exception(error_msg)
        
        if request is None:
            return {"error": error_msg, "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}
        
        return Response(
            {"error": "Failed to delete reserved account", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )