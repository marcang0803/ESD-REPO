# Cancel Booking Composite Microservice

A composite (orchestrator) microservice that coordinates a booking cancellation across multiple atomic services.

---

## Overview

This service handles the complete cancellation workflow for a wellness/fitness booking. It orchestrates calls to 4 atomic services and publishes an async notification event.

### Cancellation Flow (5 Steps)

```
1. Booking Service   → Validate & set status to CANCELLED
2. Class Service     → Increment available_slots (+1)
3. Wallet Service    → Refund or Forfeit credits via gRPC (12h policy)
4. User Service      → Fetch user contact details
5. RabbitMQ          → Publish booking.cancelled event
```

### 12-Hour Cancellation Policy

| Condition | Action | Wallet Effect |
|-----------|--------|---------------|
| Cancellation **>12h** before class start | **REFUND** | Credits returned to balance |
| Cancellation **≤12h** before class start | **FORFEIT** | Ledger entry recorded, balance unchanged |

---

## API Contract

### `POST /cancel`

Cancel an existing booking.

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `Idempotency-Key` | Yes | UUID to prevent duplicate cancellations |

**Request Body:**
```json
{
  "bookingId": 1,
  "userId": 1001
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "booking_id": 1,
    "user_id": 1001,
    "class_id": 101,
    "status": "cancelled",
    "booked_at": "2026-03-01T09:00:00+08:00",
    "cancelled_at": "2026-04-05T15:00:00+08:00",
    "completed_at": null
  },
  "wallet": {
    "success": true,
    "status": "processed",
    "message": "Transaction applied successfully",
    "user_id": 1001,
    "balance": 1000,
    "transaction_id": "cancel-uuid-here",
    "entry_type": "REFUND",
    "amount": 1
  },
  "user_contact": {
    "id": 1001,
    "name": "Rachel Tan",
    "email": "rachel.tan@example.com",
    "phone": "91234567"
  },
  "refund_policy": "refund"
}
```

**Error Responses:**

| Code | Condition |
|------|-----------|
| 400 | Missing `bookingId`, `userId`, or `Idempotency-Key` |
| 400 | Booking status is not `booked` |
| 403 | Booking does not belong to the specified user |
| 500 | Downstream service failure |

---

### `GET /health`

Health check endpoint.

**Response (200):**
```json
{
  "service": "cancel-booking-composite",
  "status": "UP"
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BOOKING_SERVICE_URL` | `http://localhost:6005` | Booking service base URL |
| `CLASS_SERVICE_URL` | `http://localhost:5006` | Class service base URL |
| `USER_SERVICE_URL` | `http://localhost:5010` | User service base URL |
| `WALLET_GRPC_HOST` | `localhost` | Wallet gRPC hostname |
| `WALLET_GRPC_PORT` | `50051` | Wallet gRPC port |
| `RABBITMQ_HOST` | `localhost` | RabbitMQ hostname |
| `RABBITMQ_PORT` | `5672` | RabbitMQ AMQP port |
| `RABBITMQ_USERNAME` | `guest` | RabbitMQ username |
| `RABBITMQ_PASSWORD` | `guest` | RabbitMQ password |

---

## Communication Protocols

| Downstream Service | Protocol | Details |
|-------------------|----------|---------|
| booking-service | REST (HTTP) | GET + PUT `/booking/{id}` |
| class-service | REST (HTTP) | GET `/classes/{id}`, PUT `/classes/{id}/slots/increment` |
| wallet-service | **gRPC** | `RefundCredits` / `ForfeitCredits` on port 50051 |
| user-service | REST (HTTP) | GET `/users/{id}/contact` |
| RabbitMQ | **AMQP** | Exchange: `booking_exchange`, Routing key: `booking.cancelled` |

---

## RabbitMQ Event

**Exchange:** `booking_exchange` (topic, durable)
**Routing Key:** `booking.cancelled`

**Payload:**
```json
{
  "booking_id": 1,
  "user_id": 1001,
  "class_id": 101,
  "email": "rachel.tan@example.com",
  "refund_policy": "refund"
}
```

---

## Idempotency

- The `Idempotency-Key` header is passed through as the `transaction_id` to the wallet-service gRPC call.
- The wallet-service enforces idempotency: duplicate `transaction_id` values return `already_processed` without re-applying the transaction.
- This ensures that retrying a cancellation request does not double-refund or double-forfeit.

---

## Project Structure

```
cancel-booking-composite/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── config.py                # Environment variable config
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py            # GET /health
│   │   └── cancel.py            # POST /cancel
│   └── services/
│       ├── __init__.py
│       ├── orchestrator.py      # 5-step cancellation workflow
│       ├── booking_client.py    # REST client for booking-service
│       ├── class_client.py      # REST client for class-service
│       ├── wallet_client.py     # gRPC client for wallet-service
│       ├── user_client.py       # REST client for user-service
│       ├── publisher.py         # RabbitMQ event publisher
│       ├── wallet_pb2.py        # (generated at Docker build)
│       └── wallet_pb2_grpc.py   # (generated at Docker build)
├── proto/
│   └── wallet.proto             # gRPC proto definition
├── Dockerfile
├── requirements.txt
├── run.py
└── README.md
```

---

## Running the Service

### With Docker Compose (from repo root)

```bash
docker compose up --build
```

The service will be available at: **http://localhost:5004**

### Local Development

```bash
cd cancel-booking-composite
pip install -r requirements.txt

# Generate gRPC stubs
python -m grpc_tools.protoc -I./proto --python_out=./app/services --grpc_python_out=./app/services ./proto/wallet.proto

python run.py
```

---

## Port Configuration

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| cancel-booking-composite | 5004 | 5004 |

---

## Dependencies

| Package | Purpose |
|---------|---------|
| Flask | Web framework |
| requests | REST client for downstream services |
| grpcio | gRPC client for wallet-service |
| grpcio-tools | Protobuf compiler |
| protobuf | Protocol Buffers runtime |
| pika | RabbitMQ AMQP client |

---

## Example Usage

```bash
curl -X POST http://localhost:5004/cancel \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: cancel-$(uuidgen)" \
  -d '{
    "bookingId": 1,
    "userId": 1001
  }'
```
