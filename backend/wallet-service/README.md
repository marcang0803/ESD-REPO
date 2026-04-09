# wallet-service

Atomic Credit Wallet Microservice for the fitness booking platform.

## Responsibilities
- Show wallet balance
- Debit credits for booking
- Refund credits for valid cancellations
- Record forfeits for late cancellations
- Keep wallet transaction ledger
- Enforce idempotency using transactionId
- Reject debit when balance is insufficient

## Important design choice
The 12-hour cancellation policy is **not** computed here.
The composite/orchestrator service decides whether to call:
- `RefundCredits(...)`
- `ForfeitCredits(...)`

This service only executes the wallet operation and records it.

## REST endpoints
### Get wallet balance
GET /wallets/{userId}

Example:
GET /wallets/1

### Get wallet ledger
GET /wallets/{userId}/ledger?limit=50&offset=0

Example:
GET /wallets/1/ledger?limit=20&offset=0

## gRPC methods
- GetBalance(user_id)
- DebitCredits(user_id, amount, transaction_id)
- RefundCredits(user_id, amount, transaction_id)
- ForfeitCredits(user_id, amount, transaction_id)

## Idempotency behavior
If the same `transactionId` is sent again:
- no balance change happens again
- no new ledger record is created
- response status is `already_processed`

## Lazy wallet creation
When a wallet is first accessed for a user:
- wallet is auto-created
- initial balance = 1000 credits

## Run with Docker Compose
```bash
docker compose up --build