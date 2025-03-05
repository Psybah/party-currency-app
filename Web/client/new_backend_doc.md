# Party Currency API Documentation

## Introduction
The Party Currency API enables developers to manage events, user profiles, payments, and administrative tasks for event planning applications. This documentation outlines all available endpoints, authentication methods, and best practices.

**Base URL**: `https://party-currency-app-production.up.railway.app`

## Authentication
Protected endpoints require an authentication token in the request header:
```
Authorization: Token <token>
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password"
}
```

#### Signup (User)
```http
POST /auth/signup/user
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "password": "password",
    "phone_number": "+1234567890"
}
```

#### Signup (Merchant)
```http
POST /auth/signup/merchant
Content-Type: application/json

{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "merchant@example.com",
    "password": "password",
    "phone_number": "+1234567890",
    "country": "Country",
    "state": "State",
    "city": "City",
    "business_type": "Type"
}
```

#### Google Authentication
```http
POST /auth/google/
Content-Type: application/json

{
    "access_token": "token_from_google"
}
```

## User Management

### Password Operations

#### Change Password
```http
POST /auth/password/change
Authorization: Token <token>
Content-Type: application/json

{
    "oldpassword": "current_password",
    "newpassword": "new_password",
    "confirmpassword": "new_password"
}
```

#### Reset Password Flow
1. Request Reset Code:
```http
POST /auth/password/code
Content-Type: application/json

{
    "email": "user@example.com"
}
```

2. Get Reset Token:
```http
POST /auth/password/token
Content-Type: application/json

{
    "email": "user@example.com"
}
```

3. Reset Password:
```http
POST /auth/password/reset
Authorization: Token <reset_token>
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "new_password"
}
```

### Profile Management

#### Get Profile
```http
GET /users/profile
Authorization: Token <token>
```

#### Update Profile Picture
```http
PUT /users/upload-picture
Authorization: Token <token>
Content-Type: multipart/form-data

profile_picture: [file]
```

## Event Management

### Event Operations

#### Create Event
```http
POST /events/create
Authorization: Token <token>
Content-Type: application/json

{
    "event_name": "My Birthday",
    "event_type": "Celebration",
    "start_date": "2024-12-25",
    "end_date": "2024-12-26",
    "street_address": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "reconciliation_service": false,
    "post_code": "12345",
    "LGA": "Local Government Area"
}
```

#### Other Event Endpoints
- `GET /events/list` - List user events
- `GET /events/get/<event_id>` - Get event details
- `PUT /events/update/<event_id>` - Update event
- `DELETE /events/delete/<event_id>` - Archive event

## Payment Processing

### Create Transaction
```http
POST /payments/create-transaction
Authorization: Token <token>
Content-Type: application/json

{
    "event_id": "event123"
}
```

### Process Payment
```http
POST /payments/pay
Authorization: Token <token>
Content-Type: application/json

{
    "payment_reference": "party1740782337"
}
```

## Admin Operations
- `GET /admin/get-admin-statistics` - Get system statistics
- `GET /admin/activate-user/<email>` - Activate user
- `GET /admin/get-users` - List all users
- `GET /admin/suspend-user/<email>` - Suspend user
- `GET /admin/delete-user/<email>` - Delete user

## Error Handling
All errors return JSON responses with an "error" key:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Rate Limit Exceeded
- 500: Server Error

## Rate Limiting
- 300 requests per minute per token
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Development Guidelines
1. Use HTTPS for all requests
2. Implement proper error handling
3. Monitor rate limits
4. Cache frequently accessed data
5. Use secure token storage
6. Validate all user inputs
