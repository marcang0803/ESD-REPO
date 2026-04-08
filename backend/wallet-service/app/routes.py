from flask import Blueprint, jsonify, request

from app.service import get_wallet_balance, get_wallet_ledger

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