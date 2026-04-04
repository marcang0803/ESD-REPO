from flask import Blueprint, request, jsonify
from app.services.orchestrator import BookingOrchestrator

bookings_bp = Blueprint("bookings", __name__)
orchestrator = BookingOrchestrator()


@bookings_bp.route("/bookings", methods=["POST"])
def create_booking():
    data = request.get_json() or {}

    user_id = data.get("user_id")
    class_id = data.get("class_id")
    idempotency_key = data.get("idempotency_key")

    if not user_id or not class_id or not idempotency_key:
        return jsonify({
            "success": False,
            "message": "Missing required fields: user_id, class_id, idempotency_key"
        }), 400

    result = orchestrator.create_booking(
        user_id=user_id,
        class_id=class_id,
        idempotency_key=idempotency_key
    )

    status_code = result.get("http_status", 200)
    result.pop("http_status", None)

    return jsonify(result), status_code