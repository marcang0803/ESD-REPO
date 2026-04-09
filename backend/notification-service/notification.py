import json
import os
import time
import requests
import pika

# ─────────────────────────────────────────────
# Config (all overridable via environment)
# ─────────────────────────────────────────────
RABBITMQ_HOST     = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT     = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

BOOKING_EXCHANGE     = os.getenv("BOOKING_EXCHANGE", "booking_exchange")
BOOKING_EXCHANGE_TYPE = os.getenv("BOOKING_EXCHANGE_TYPE", "topic")
BOOKING_ROUTING_KEY  = os.getenv("BOOKING_ROUTING_KEY", "booking.confirmed")
QUEUE_NAME           = os.getenv("QUEUE_NAME", "notification.booking.confirmed")

# OutSystems Notification Microservice
OUTSYSTEMS_SEND_EMAIL_URL = os.getenv(
    "OUTSYSTEMS_SEND_EMAIL_URL",
    "https://personal-rx8tuqla.outsystemscloud.com/Notifications_Microservice/rest/Notification/SendEmail"
)


# ─────────────────────────────────────────────
# Callback: called for each booking.confirmed message
# ─────────────────────────────────────────────
def on_booking_confirmed(ch, method, properties, body):
    print("[Notification] Received message:", body)

    try:
        event = json.loads(body)
    except json.JSONDecodeError as e:
        print("[Notification] ERROR - failed to decode message body:", str(e))
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    booking_id = event.get("booking_id")
    user_id    = event.get("user_id")
    class_id   = event.get("class_id")
    email      = event.get("email")

    if not email:
        print("[Notification] WARNING - no email in event, skipping OutSystems call")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    print(f"[Notification] Sending booking confirmation to {email} "
          f"(booking_id={booking_id}, user_id={user_id}, class_id={class_id})")

    payload = {
        "emailAddress": email,
        "emailSubject": "Your Booking is Confirmed!",
        "emailBody": (
            f"Hi,\n\n"
            f"Your booking has been confirmed.\n\n"
            f"Booking ID: {booking_id}\n"
            f"Class ID:   {class_id}\n\n"
            f"Thank you for booking with us!"
        )
    }

    try:
        response = requests.post(
            OUTSYSTEMS_SEND_EMAIL_URL,
            json=payload,
            timeout=10
        )
        if response.ok:
            print(f"[Notification] OutSystems responded {response.status_code} - email sent successfully")
        else:
            print(f"[Notification] WARNING - OutSystems responded {response.status_code}: {response.text}")
    except requests.RequestException as e:
        print("[Notification] ERROR - failed to call OutSystems:", str(e))
        # We still ack the message so it doesn't requeue forever;
        # a dead-letter queue should be used in production for retries.

    ch.basic_ack(delivery_tag=method.delivery_tag)


# ─────────────────────────────────────────────
# RabbitMQ connection with retry on startup
# ─────────────────────────────────────────────
def connect_with_retry(retries=10, delay=5):
    credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
    parameters  = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials,
        heartbeat=60,
        blocked_connection_timeout=300
    )

    for attempt in range(1, retries + 1):
        try:
            print(f"[Notification] Connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT} "
                  f"(attempt {attempt}/{retries})...")
            connection = pika.BlockingConnection(parameters)
            print("[Notification] Connected to RabbitMQ successfully")
            return connection
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[Notification] Connection failed: {e}. Retrying in {delay}s...")
            time.sleep(delay)

    raise RuntimeError("[Notification] Could not connect to RabbitMQ after multiple attempts")


def main():
    connection = connect_with_retry()
    channel    = connection.channel()

    # Declare exchange (idempotent - must match publisher settings)
    channel.exchange_declare(
        exchange=BOOKING_EXCHANGE,
        exchange_type=BOOKING_EXCHANGE_TYPE,
        durable=True
    )

    # Declare and bind a durable queue
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.queue_bind(
        exchange=BOOKING_EXCHANGE,
        queue=QUEUE_NAME,
        routing_key=BOOKING_ROUTING_KEY
    )

    # Only fetch one message at a time (fair dispatch)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=on_booking_confirmed)

    print(f"[Notification] Listening on exchange='{BOOKING_EXCHANGE}' "
          f"queue='{QUEUE_NAME}' routing_key='{BOOKING_ROUTING_KEY}'")
    print("[Notification] Waiting for booking.confirmed events...")

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("[Notification] Shutting down...")
        channel.stop_consuming()
    finally:
        if connection.is_open:
            connection.close()


if __name__ == "__main__":
    main()
