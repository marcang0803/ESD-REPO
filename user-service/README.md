# User / Provider Microservice

Atomic User & Provider Management Microservice for the Wellness & Fitness Booking Platform.

---

## Overview

This microservice manages users and providers for the wellness & fitness booking system.

It supports:

* Creating users/providers
* Retrieving user details
* Updating user information
* Retrieving contact details
* Retrieving provider payout details

---

## Responsibilities

* Manage user/provider lifecycle (create, retrieve, update)
* Validate user input (email format, role, subscription status)
* Enforce provider-only fields (payout details)
* Provide user contact details to other services
* Provide provider payout details for payment processing
* Ensure idempotent user creation using `Idempotency-Key`

---

## Design Choices

### Single Table Design

Users and providers are stored in a single table:

* Common fields shared across all users
* Provider-specific fields stored as nullable:
  * `provider_business_name`
  * `payout_account_id`

This simplifies schema design while supporting multiple roles.

### Idempotency for User Creation

To prevent duplicate user creation:

* Clients may send an `Idempotency-Key` in request headers
* The service stores:
  * Request hash
  * Response body

If the same key is reused:

* Same request → same response returned
* Different request → rejected with `409 Conflict`

---

## Tech Stack

* Python (Flask)
* MySQL
* SQLAlchemy
* Swagger (Flasgger)
* Docker & Docker Compose

---

## Architecture

* Microservices architecture
* Database-per-service pattern
* REST APIs (HTTP + JSON)

Integrates with:

* Booking Service
* Wallet Service
* Payment Service
* Notification Service

---

## Running the Service

### Option 1: Run with Docker (Recommended)

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

## Port Configuration
| Component      | Host Port | Container Port |
| -------------- | --------- | -------------- |
| REST API       | 5010      | 5001           |
| MySQL Database | 3340      | 3306           |

## API Endpoints

### Health

GET /health

### Create User / Provider

POST /users

Example:

```json
{
  "name": "Rachel Tan",
  "email": "rachel.tan@example.com",
  "phone": "91234567",
  "role": "customer",
  "subscription_status": "ACTIVE"
}
```

---

### Get User

GET /users/{id}

Example:

```json
{
  "name": "Rachel Tan",
  "email": "rachel.tan@example.com",
  "phone": "91234567",
  "role": "customer",
  "subscription_status": "ACTIVE"
}
```

### Update User

PUT /users/{id}

---

### Get User Contact (Used by Booking/Notification)

GET /users/{id}/contact

Example:

```json
{
  "id": 2,
  "name": "Daniel Lim",
  "email": "daniel.lim@example.com",
  "phone": "91234567"
}
```

---

### Get Provider Payout Details (Used by Payment)

GET /providers/{id}/payout-details

Example:

```json
{
  "provider_business_name": "Zen Yoga Studio",
  "payout_account_id": "PAYNOW-92345678"
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

## Integration Notes

Used by:
Booking Service → retrieves contact details
Payment Service → retrieves payout details
Notification Service → retrieves contact details

## Notes

* Single table for users and providers
* Provider fields are nullable
* REST-based JSON communication
* Designed for modular microservices integration
