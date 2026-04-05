import requests
from app.config import Config


def get_user_contact(user_id):
    """Fetch user contact details from the user-service."""
    url = f"{Config.USER_SERVICE_URL}/users/{user_id}/contact"

    response = requests.get(url, timeout=10)

    try:
        data = response.json()
    except Exception:
        raise Exception("Invalid response from User service")

    if response.status_code == 404:
        raise Exception(f"User {user_id} not found")

    if response.status_code != 200:
        raise Exception(f"Failed to fetch user contact: {data.get('error', 'Unknown error')}")

    return data
