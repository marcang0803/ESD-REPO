# User Atomic Microservice

## Overview

This microservice manages users and providers for the wellness & fitness booking system.

It supports:

* Creating users/providers
* Retrieving user details
* Updating user information
* Retrieving contact details
* Retrieving provider payout details

---

## Tech Stack

* Python (Flask)
* MySQL
* SQLAlchemy
* Swagger (Flasgger)
* Docker

---

## Running the Service

### Option 1: Docker (Recommended)

```bash
docker compose up --build
```

Service will run at:
http://localhost:5010

---

### Option 2: Local (Development)

```bash
python run.py
```

Service will run at:
http://localhost:5001

---

## API Endpoints

### Health

GET /health

### Create User / Provider

POST /users

Example:

```json
{
  "name": "Alice Tan",
  "email": "alice@example.com",
  "role": "customer"
}
```

---

### Get User

GET /users/{id}

---

### Update User

PUT /users/{id}

---

### Get User Contact (Used by Booking/Notification)

GET /users/{id}/contact

Returns:

```json
{
  "name": "...",
  "email": "...",
  "phone": "..."
}
```

---

### Get Provider Payout Details (Used by Payment)

GET /providers/{id}/payout-details

Returns:

```json
{
  "provider_business_name": "...",
  "payout_account_id": "..."
}
```

---

## Swagger Documentation

/apidocs

Example:
http://localhost:5010/apidocs

---

## Database

* MySQL database per service
* Schema initialized automatically using `db.create_all()`

---

## Notes

* Customers and providers are stored in the same table
* Provider-specific fields are nullable
* Service is designed to integrate with Booking, Payment, and Notification microservices
