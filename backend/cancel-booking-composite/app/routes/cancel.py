from flask import Blueprint, request, jsonify
from app.services.orchestrator import CancelOrchestrator

cancel_bp = Blueprint("cancel", __name__)
orchestrator = CancelOrchestrator()


@cancel_bp.route("/cancel", methods=["POST"])
def cancel_booking():
    data = request.get_json() or {}

    booking_id = data.get("bookingId")
    user_id = data.get("userId")
    idempotency_key = request.headers.get("Idempotency-Key")

    if not booking_id or not user_id:
        return jsonify({
            "success": False,
            "message": "Missing required fields: bookingId, userId"
        }), 400

    if not idempotency_key:
        return jsonify({
            "success": False,
            "message": "Missing required header: Idempotency-Key"
        }), 400

    result = orchestrator.cancel_booking(
        booking_id=booking_id,
        user_id=user_id,
        idempotency_key=idempotency_key
    )

    status_code = result.pop("http_status", 200)
    return jsonify(result), status_code
