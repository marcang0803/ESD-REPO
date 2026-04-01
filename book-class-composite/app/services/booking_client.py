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
    response.raise_for_status()
    return response.json()