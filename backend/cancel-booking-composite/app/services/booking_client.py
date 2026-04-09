import requests
from app.config import Config


def get_booking(booking_id):
    """Fetch a single booking by ID from the booking-service."""
    url = f"{Config.BOOKING_SERVICE_URL}/booking/{booking_id}"

    response = requests.get(url, timeout=10)

    try:
        data = response.json()
    except Exception:
        raise Exception("Invalid response from Booking service")

    if response.status_code == 404:
        raise Exception(f"Booking {booking_id} not found")

    if response.status_code != 200:
        raise Exception(f"Failed to fetch booking: {data.get('message', 'Unknown error')}")

    return data.get("data")


def cancel_booking(booking_id):
    """PUT to booking-service to set status to 'cancelled'."""
    url = f"{Config.BOOKING_SERVICE_URL}/booking/{booking_id}"

    payload = {"status": "cancelled"}

    response = requests.put(url, json=payload, timeout=10)

    try:
        data = response.json()
    except Exception:
        raise Exception("Invalid response from Booking service")

    if response.status_code == 404:
        raise Exception(f"Booking {booking_id} not found")

    if response.status_code != 200:
        raise Exception(f"Failed to cancel booking: {data.get('message', 'Unknown error')}")

    return data.get("data")
