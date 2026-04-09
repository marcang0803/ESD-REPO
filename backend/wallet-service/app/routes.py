from flask import Blueprint, jsonify, request

from app.service import get_wallet_balance, get_wallet_ledger, apply_transaction

wallet_bp = Blueprint("wallet", __name__)

@wallet_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

@wallet_bp.get("/wallets/<int:user_id>")
def get_wallet(user_id: int):
    result = get_wallet_balance(user_id)
    return jsonify(result), 200


@wallet_bp.get("/wallets/<int:user_id>/ledger")
def get_ledger(user_id: int):
    try:
        limit = int(request.args.get("limit", 50))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        return jsonify({"message": "limit and offset must be integers"}), 400

    if limit <= 0 or limit > 200:
        return jsonify({"message": "limit must be between 1 and 200"}), 400

    if offset < 0:
        return jsonify({"message": "offset must be 0 or greater"}), 400

    result = get_wallet_ledger(user_id, limit=limit, offset=offset)
    return jsonify(result), 200


@wallet_bp.post("/wallets/<int:user_id>/topup")
def topup_wallet(user_id: int):
    """
    Credit a user's wallet after a successful Stripe payment.
    Called by the payment service webhook.
    Body: { amount: int, transaction_id: str }
    """
    data = request.get_json()

    amount         = data.get("amount")
    transaction_id = data.get("transaction_id")

    if not amount or not transaction_id:
        return jsonify({"success": False, "message": "amount and transaction_id are required"}), 400

    try:
        amount = int(amount)
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "amount must be an integer"}), 400

    result = apply_transaction(
        user_id=user_id,
        amount=amount,
        transaction_id=transaction_id,
        entry_type="REFUND",   # REFUND adds credits to balance
    )

    if result.get("success"):
        return jsonify({
            "success":        True,
            "message":        f"Topped up {amount} credits successfully",
            "balance":        result["balance"],
            "transaction_id": transaction_id,
        }), 200
    else:
        return jsonify(result), 400
