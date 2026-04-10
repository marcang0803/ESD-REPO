import pika
import json
import os
import time
import requests

# ── Config (all overridable via environment) ──────────────────────────────────
RABBITMQ_HOST    = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT    = int(os.getenv("RABBITMQ_PORT", 5672))


USER_SERVICE_URL    = os.getenv("USER_SERVICE_URL", "http://localhost:5003")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://localhost:5001")

OUTSYSTEMS_URL = (
    "https://personal-rx8tuqla.outsystemscloud.com"
    "/Notifications_Microservice/rest/InternalNotificationAPI/TriggerPayoutEmail"
)

COMMISSION_RATE = 0.15


# ── Message handler ───────────────────────────────────────────────────────────
def on_class_completed(ch, method, properties, body):
    print(f"[PayProvider] Received class.completed event: {body}")

    try:
        event_data = json.loads(body)
    except json.JSONDecodeError as e:
        print(f"[PayProvider] ERROR — failed to decode message: {e}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    class_id        = event_data.get("classId")
    provider_id     = event_data.get("providerId")
    credits_used    = event_data.get("totalCreditsUsed", 0)

    try:
        cu = int(credits_used)
    except (TypeError, ValueError):
        cu = 0
    if cu <= 0:
        print(f"[PayProvider] Skip payout — no credits for class_id={class_id}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    try:
        user_res = requests.get(
            f"{USER_SERVICE_URL}/providers/{provider_id}/payout-details",
            timeout=10
        )
        user_res.raise_for_status()
        provider_details = user_res.json()
    except requests.RequestException as e:
        print(f"[PayProvider] ERROR — could not fetch provider {provider_id}: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        return

    
    payout_account  = provider_details.get("payout_account_id")
    provider_email  = provider_details.get("email")
    provider_name   = provider_details.get("name", "Provider")

    if not payout_account:
        print(f"[PayProvider] ERROR — provider {provider_id} has no payout_account_id")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    # Must match class-service: same key for same (class, credits, destination). Do not use the
    # queue's idempotency_key — old messages carried legacy keys like payout-class-108 and broke Stripe.
    idempotency_key = f"payout-v2-class-{class_id}-{cu}-{payout_account}"

    payment_payload = {
        "provider_account": payout_account,
        "amount": cu,
        "idem_key": idempotency_key
    }

    try:
        pay_res = requests.post(
            f"{PAYMENT_SERVICE_URL}/process_payout",
            json=payment_payload,
            timeout=15
        )
        pay_res.raise_for_status()
        pay_status = pay_res.json()
    except requests.RequestException as e:
        print(f"[PayProvider] ERROR — payment service call failed: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        return

    print(f"[PayProvider] Payment result: {pay_status}")

    
    notification_payload = {
        "email": provider_email,
        "amount": pay_status.get("amount"),
        "status": pay_status.get("status", "unknown")
    }

    try:
        notif_res = requests.post(OUTSYSTEMS_URL, json=notification_payload, timeout=10)
        if notif_res.ok:
            print(f"[PayProvider] Notification sent to {provider_email}")
        else:
            print(f"[PayProvider] WARNING — OutSystems {notif_res.status_code}: {notif_res.text}")
    except requests.RequestException as e:
        print(f"[PayProvider] WARNING — notification call failed (non-fatal): {e}")

    # Ack only after all steps have been attempted
    ch.basic_ack(delivery_tag=method.delivery_tag)
    print(f"[PayProvider] class_id={class_id} fully processed.")


# ── RabbitMQ connection with retry on startup ─────────────────────────────────
def connect_with_retry(retries=15, delay=5):
    for attempt in range(1, retries + 1):
        try:
            print(f"[PayProvider] Connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT} "
                  f"(attempt {attempt}/{retries})...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    port=RABBITMQ_PORT,
                    credentials=pika.PlainCredentials("guest", "guest"),
                    heartbeat=60,
                    blocked_connection_timeout=300
                )
            )
            print("[PayProvider] Connected to RabbitMQ.")
            return connection
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[PayProvider] Connection failed: {e}. Retrying in {delay}s...")
            time.sleep(delay)
    raise RuntimeError("[PayProvider] Could not connect to RabbitMQ after multiple attempts.")


def main():
    connection = connect_with_retry()
    channel = connection.channel()

    channel.queue_declare(queue="class_completed", durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue="class_completed", on_message_callback=on_class_completed)

    print("[PayProvider] Waiting for class.completed events...")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("[PayProvider] Shutting down...")
        channel.stop_consuming()
    finally:
        if connection.is_open:
            connection.close()


if __name__ == "__main__":
    main()
