import requests
from app.config import Config


def get_user_contact(user_id):
    url = f"{Config.USER_SERVICE_URL}/users/{user_id}/contact"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()