import requests
from app.config import Config


def get_class(class_id):
    """Fetch a single class by ID from the class-service."""
    url = f"{Config.CLASS_SERVICE_URL}/classes/{class_id}"

    response = requests.get(url, timeout=10)

    try:
        data = response.json()
    except Exception:
        raise Exception("Invalid response from Class service")

    if response.status_code == 404:
        raise Exception(f"Class {class_id} not found")

    if response.status_code != 200:
        raise Exception(f"Failed to fetch class: {data.get('message', 'Unknown error')}")

    return data.get("class")


def increment_slot(class_id):
    """PUT to class-service to increment available_slots by 1."""
    url = f"{Config.CLASS_SERVICE_URL}/classes/{class_id}/slots/increment"

    response = requests.put(url, timeout=10)

    try:
        data = response.json()
    except Exception:
        raise Exception("Invalid response from Class service")

    if response.status_code == 404:
        raise Exception(f"Class {class_id} not found")

    if response.status_code != 200:
        raise Exception(f"Failed to increment slot: {data.get('message', 'Unknown error')}")

    return data
