# Party Currency API Documentation

## Overview

The Party Currency API provides a suite of endpoints that allow users to manage authentication, user profiles, events, and payments. This documentation will guide you through the process of integrating with the API, including authentication, rate limits, and detailed endpoint descriptions.

## Getting Started

To start using the Party Currency API, follow these steps:

1. Obtain an API Key: Generate a valid API Key from your account settings to authenticate API requests.
2. Understand Rate Limits: The API has a rate limit of 300 requests per minute. Exceeding this limit results in an HTTP 429 Too Many Requests response.
3. Use HTTPS: The API only accepts HTTPS-secured communications. HTTP requests will receive an HTTP 301 redirect.
4. Response Format: Responses are in JSON format, including error messages with an error key.

## Authentication

The Party Currency API uses API keys for authentication. Include your API key in the Authorization header of each request.

### Example Request Header

Authorization: Token YOUR_API_KEY

### Authentication Error Response

If the API key is missing, malformed, or invalid, you will receive an HTTP 401 Unauthorized response.

## Rate and Usage Limits

* Rate Limit: 300 requests per minute per API key.
* Usage Limits: Additional limits may apply depending on your plan.

### Rate Limit Headers

Each API response includes the following headers to help monitor usage:

| Header | Description |
| --- | --- |
| X-RateLimit-Limit | Maximum requests allowed per minute. |
| X-RateLimit-Remaining | Remaining requests in the current window. |
| X-RateLimit-Reset | Time when the limit resets (UTC epoch seconds). |

### 503 Response

An HTTP 503 response indicates a temporary spike in API traffic. The server typically recovers within five minutes. Contact support if issues persist.

## Endpoints

### Authentication

* Change Password
	+ Method: POST
	+ URL: /auth/password/change
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body:
		{
			"oldpassword": "OldPass123",
			"newpassword": "NewPass123",
			"confirmpassword": "NewPass123"
		}
* Password Reset
	+ Method: POST
	+ URL: /auth/password/reset
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body:
		{
			"email": "user@example.com",
			"password": "SecurePass1"
		}
* Password Code Request
	+ Method: POST
	+ URL: /auth/password/code
	+ Body:
		{
			"email": "user@example.com"
		}
* Login
	+ Method: POST
	+ URL: /auth/login
	+ Body:
		{
			"email": "user@example.com",
			"password": "SecurePass1"
		}
* Signup User
	+ Method: POST
	+ URL: /auth/signup/user
	+ Body:
		{
			"first_name": "John",
			"last_name": "Doe",
			"email": "user@example.com",
			"password": "SecurePass1",
			"phone_number": "+2348012345678"
		}
* Signup Merchant
	+ Method: POST
	+ URL: /auth/signup/merchant
	+ Body:
		{
			"first_name": "Jane",
			"last_name": "Doe",
			"email": "merchant@example.com",
			"password": "SecurePass2",
			"phone_number": "+2348098765432",
			"country": "Nigeria",
			"state": "Lagos",
			"city": "Ikeja",
			"business_type": "printing service"
		}
* Google Auth
	+ Method: POST
	+ URL: /auth/google/
	+ Body:
		{
			"access_token": "tokenfromgoogle"
		}

### User

* Update Profile Picture
	+ Method: PUT
	+ URL: /users/upload-picture
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body: Form-data with profile_picture as a file.
* Get Profile Picture
	+ Method: GET
	+ URL: /users/get-picture
	+ Headers:
		- Authorization: Token YOUR_API_KEY
* Get User Profile
	+ Method: GET
	+ URL: /users/profile
	+ Headers:
		- Authorization: Token YOUR_API_KEY

### Event

* Retrieve User Events
	+ Method: GET
	+ URL: /events/list
	+ Headers:
		- Authorization: Token YOUR_API_KEY
* Create Event
	+ Method: POST
	+ URL: /events/create
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body:
		{
			"event_name": "Birthday Party",
			"event_type": "Private",
			"start_date": "2025-01-30",
			"end_date": "2025-01-31",
			"street_address": "123 Street",
			"city": "Lagos",
			"state": "Lagos",
			"post_code": "100001",
			"LGA": "Ikeja"
		}

### Payment

* Generate Transaction
	+ Method: POST
	+ URL: /payments/create-transaction
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body:
		{
			"event_id": "test_event"
		}
	+ Response:
		{
			"amount": {
				"printing": 1000,
				"delivery": 500,
				"reconciliation": 200
			},
			"total": 1700,
			"currency_code": "NGN",
			"payment_reference": "party1738803240"
		}
* Pay
	+ Method: POST
	+ URL: /payments/pay
	+ Headers:
		- Authorization: Token YOUR_API_KEY
	+ Body:
		{
			"payment_reference": "party123456789"
		}
	+ Response:
		{
			"requestSuccessful": true,
			"responseMessage": "success",
			"responseCode": "0",
			"responseBody": {
				"transactionReference": "MNFY|88|20250206015415|000006",
				"paymentReference": "party1738803240",
				"merchantName": "Party Currency",
				"apiKey": "MK_TEST_BXU3AJAJ2M",
				"redirectUrl": "http://google.com",
				"enabledPaymentMethod": [
					"CARD",
					"ACCOUNT_TRANSFER"
				],
				"checkoutUrl":
					"https://sandbox.sdk.monnify.com/checkout/MNFY|88|20250206015415|000006"
			}
		}
	+ No duplicate request allowed
		{
			"requestSuccessful": false,
			"responseMessage": "Duplicate payment reference",
			"responseCode": "99"
		}
	+ Generate another payment reference instead

## Need Help?

For assistance, refer to our developer or visit our website. Contact our support team for further help.

This documentation provides a comprehensive guide to using the Party Currency API. For more detailed examples and use cases, refer to our developer.
