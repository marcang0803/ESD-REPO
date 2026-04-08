import requests
from app.config import Config


def reserve_slot(class_id, user_id, idempotency_key):
    url = f"{Config.CLASS_SERVICE_URL}/classes/{class_id}/reserve"

    payload = {
        "user_id": user_id,
        "idempotency_key": idempotency_key
    }

    print("Reserve URL:", url)
    print("Reserve payload:", payload)

    session = requests.Session()
    session.trust_env = False

    response = session.post(
        url,
        json=payload,
        timeout=10,
        allow_redirects=False
    )

    print("Reserve status:", response.status_code)
    print("Reserve response URL:", response.url)
    print("Reserve headers:", dict(response.headers))
    print("Reserve body:", response.text)

    try:
        data = response.json()
    except ValueError:
        data = {"raw_response": response.text}

    if not response.ok:
        raise Exception(f"Class reserve failed ({response.status_code}): {data}")

    return data


def release_slot(class_id, hold_id):
    url = f"{Config.CLASS_SERVICE_URL}/classes/{class_id}/release"

    payload = {
        "hold_id": hold_id
    }

    session = requests.Session()
    session.trust_env = False

    response = session.post(
        url,
        json=payload,
        timeout=10,
        allow_redirects=False
    )

    try:
        data = response.json()
    except ValueError:
        data = {"raw_response": response.text}

    if not response.ok:
        raise Exception(f"Class release failed ({response.status_code}): {data}")

    return data