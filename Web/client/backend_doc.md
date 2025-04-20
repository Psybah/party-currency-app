---
title: Party Currency
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Party Currency

Base URLs:

* <a href="https://party-currency-app-production-70c0.up.railway.app">Develop Env: https://party-currency-app-production-70c0.up.railway.app</a>

# Authentication

# Authentication

## POST Login

POST /auth/login

> Body Parameters

```json
{
  "email": "string",
  "password": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» email|body|string| yes |none|
|» password|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST signup user

POST /auth/signup/user

route to signup as a user

> Body Parameters

```json
{
  "email": "string",
  "password": "string",
  "firstname": "string",
  "lastname": "string",
  "phonenumber": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» email|body|string| yes |user email|
|» password|body|string| yes |password|
|» firstname|body|string| yes |first name (text )|
|» lastname|body|string| yes |last name (text)|
|» phonenumber|body|string| yes |phone number +234 plus 10 digits format|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST signup merchant

POST /auth/signup/merchant

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Google

POST /auth/google/

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# user

## PUT Untitled Endpoint

PUT /events/update/{event_id}

> Body Parameters

```json
{
  "event_name": "my baby's birthdAY",
  "event_description": "celebrating my 2nd anniversery",
  "event_date": "2024-10-31",
  "address": "Lekki",
  "delivery_address": "Festac town"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|event_id|path|string| yes |none|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_name|body|string| yes |none|
|» event_description|body|string| yes |none|
|» event_date|body|string| yes |none|
|» address|body|string| yes |none|
|» delivery_address|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# user/profile picture

## GET get profile pictue

GET /users/get-picture

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT upload profile picture

PUT /users/upload-picture

upload profile picture 

> Body Parameters

```yaml
profile_picture: file:///Users/mac/Desktop/1144C52D-BA0A-463B-8492-CCE9DA99657A_1_105_c.jpeg

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» profile_picture|body|string(binary)| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# events

## POST create event

POST /events/create

> Body Parameters

```json
{
  "event_name": "Celebration of life",
  "event_type": "backend wan kil me",
  "start_date": "2025-01-30",
  "end_date": "2025-01-31",
  "street_address": "ile eja junction",
  "city": "Ibadan",
  "state": "Oyo",
  "reconciliation_service": "False",
  "post_code": "100213",
  "LGA": "Ibadan North West"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_name|body|string| yes |none|
|» event_type|body|string| yes |none|
|» start_date|body|string| yes |none|
|» end_date|body|string| yes |none|
|» street_address|body|string| yes |none|
|» city|body|string| yes |none|
|» state|body|string| yes |none|
|» reconciliation_service|body|string| yes |none|
|» post_code|body|string| yes |none|
|» LGA|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get events

GET /events/list

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get event details

GET /events/get/{event_id}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|event_id|path|string| yes |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE delete event

DELETE /events/delete/{event_id)

delete events from user profile

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT save currency image

PUT /events/save-currency

attach currency templates as available

> Body Parameters

```yaml
event_id: tes0247c31
currency_id: EVTMlh1n

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_id|body|string| no |none|
|» currency_id|body|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get currency

GET /events/get-currency

> Body Parameters

```json
{
  "event_id": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_id|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# payment

## POST generate transcation

POST /payments/create-transaction

generate payment transcation. this generates a payment refrence that can be passed to the pay route to initialize payment. 

> Body Parameters

```json
{
  "event_id": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_id|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST pay

POST /payments/pay

agter generating a payment refrence from the create-transaction route, pass the refrence in this url to generate the link to pay . i.e base_url/payments/pay/

body {
"payment_refrence":"party1743153515"  . where party1743153515 is the payment refrence.

> Body Parameters

```json
{
  "payment_refrence": "string"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» payment_refrence|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# admin

## GET get admin dashboard details

GET /admin/get-admin-statistics

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get all users

GET /admin/get-users

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT Activate user

PUT /admin/activate-user/{user_email}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|user_email|path|string| yes |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT Suspend user

PUT /admin/suspend-user/{user_email}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|user_email|path|string| yes |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE Delete User

DELETE /admin/delete-user/{user_email}

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|user_email|path|string| yes |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# currencies

## POST save currency

POST /currencies/save-currency

save currency , event_id is optional

> Body Parameters

```yaml
currency_name: iya elewa tewa funmi
front_celebration_text: Happy Birthday
back_celebration_text: Long life and prosperity
front_image: file:///Users/mac/Documents/tecno pop7 pro /DCIM/Camera/1697364956432.jpg
back_image: file:///Users/mac/Documents/tecno pop7 pro
  /DCIM/Camera/IMG_20231016_071140_968.jpg
event_id: Eve1234

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» currency_name|body|string| no |none|
|» front_celebration_text|body|string| no |none|
|» back_celebration_text|body|string| no |none|
|» front_image|body|string(binary)| no |none|
|» back_image|body|string(binary)| no |none|
|» event_id|body|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PUT update currrency

PUT /currencies/update-currency/

update currency , event_id is optional. pass all othe rparameters , including old ones

> Body Parameters

```yaml
currency_name: iya elewa
front_celebration_text: Happy Birthday
back_celebration_text: Long life and prosperity
front_image: file:///Users/mac/Documents/tecno pop7 pro /DCIM/Camera/1697364956432.jpg
back_image: file:///Users/mac/Documents/tecno pop7 pro
  /DCIM/Camera/IMG_20231016_071140_968.jpg
event_id: Eve1234

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|currency_id|query|string| no |none|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» currency_name|body|string| no |none|
|» front_celebration_text|body|string| no |none|
|» back_celebration_text|body|string| no |none|
|» front_image|body|string(binary)| no |none|
|» back_image|body|string(binary)| no |none|
|» event_id|body|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get all user currency

GET /currencies/get-all-currencies

get a list of all user currencies 

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get currency by id

GET /currencies/get-currency/

get currency with currency ID

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|currency_id|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE delete currency

DELETE /currenciees/delete-currency/7CUR5CURmCURcCUR2

remove currency from user profile

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# merchant

## DELETE delete event reserved account

DELETE /merchant/delete-reserved-account

pass accont reference also event_id as query parameter

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|account_reference|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create reserved account for event

POST /merchant/create-reserved-account

> Body Parameters

```yaml
event_id: EVTTPfEb
customer_name: Kayode ojo
bvn: "345432343"

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| no |none|
|» event_id|body|string| no |none|
|» customer_name|body|string| no |none|
|» bvn|body|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get merchant transactions

GET /merchant/transactions

get all transactions in a merchant account, pass accountRefrence aleo event_id as query parameter

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|account_reference|query|string| no |none|
|Authorization|header|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Data Schema

<h2 id="tocS_Pet">Pet</h2>

<a id="schemapet"></a>
<a id="schema_Pet"></a>
<a id="tocSpet"></a>
<a id="tocspet"></a>

```json
{
  "id": 1,
  "category": {
    "id": 1,
    "name": "string"
  },
  "name": "doggie",
  "photoUrls": [
    "string"
  ],
  "tags": [
    {
      "id": 1,
      "name": "string"
    }
  ],
  "status": "available"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer(int64)|true|none||Pet ID|
|category|[Category](#schemacategory)|true|none||group|
|name|string|true|none||name|
|photoUrls|[string]|true|none||image URL|
|tags|[[Tag](#schematag)]|true|none||tag|
|status|string|true|none||Pet Sales Status|

#### Enum

|Name|Value|
|---|---|
|status|available|
|status|pending|
|status|sold|

<h2 id="tocS_Category">Category</h2>

<a id="schemacategory"></a>
<a id="schema_Category"></a>
<a id="tocScategory"></a>
<a id="tocscategory"></a>

```json
{
  "id": 1,
  "name": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||Category ID|
|name|string|false|none||Category Name|

<h2 id="tocS_Tag">Tag</h2>

<a id="schematag"></a>
<a id="schema_Tag"></a>
<a id="tocStag"></a>
<a id="tocstag"></a>

```json
{
  "id": 1,
  "name": "string"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer(int64)|false|none||Tag ID|
|name|string|false|none||Tag Name|

