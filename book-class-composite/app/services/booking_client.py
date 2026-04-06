import requests
from app.config import Config


def create_booking(user_id, class_id):
    url = f"{Config.BOOKING_SERVICE_URL}/booking"

    payload = {
        "user_id": user_id,
        "class_id": class_id,
        "status": "booked"
    }

    response = requests.post(url, json=payload, timeout=10)

    try:
        data = response.json()
    except Exception:
        return {
            "success": False,
            "message": "Invalid response from Booking service"
        }

    # HANDLE DUPLICATE (409)
    if response.status_code == 409:
        return {
            "success": False,
            "message": "User has already booked this class."
        }

    # HANDLE OTHER ERRORS
    if response.status_code != 201:
        return {
            "success": False,
            "message": data.get("message", "Booking failed")
        }

    # Booking service returns {"code": 201, "data": {...}}
    booking_data = data.get("data")
    return {
        "success": True,
        "data": booking_data
    }