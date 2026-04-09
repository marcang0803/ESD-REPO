from flask import Blueprint, request, jsonify
from app.services.orchestrator import BookingOrchestrator

bookings_bp = Blueprint("bookings", __name__)
orchestrator = BookingOrchestrator()


@bookings_bp.route("/bookings", methods=["POST"])
def create_booking():
    print("Incoming request:", request.get_json())
    data = request.get_json() or {}

    user_id = data.get("user_id")
    class_id = data.get("class_id")
    idempotency_key = data.get("idempotency_key")
    credits = data.get("credits")

    if not user_id or not class_id or not idempotency_key:
        return jsonify({
            "success": False,
            "message": "Missing required fields: user_id, class_id, idempotency_key"
        }), 400

    if credits is None or not isinstance(credits, (int, float)) or credits <= 0:
        return jsonify({
            "success": False,
            "message": "credits must be a positive number"
        }), 400

    result = orchestrator.create_booking(
        user_id=user_id,
        class_id=class_id,
        idempotency_key=idempotency_key,
        credits=credits
    )

    status_code = result.get("http_status", 200)
    result.pop("http_status", None)

    return jsonify(result), status_code