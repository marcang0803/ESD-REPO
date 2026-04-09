import json
import os
import threading
import time

import pika
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

BOOKING_EXCHANGE = os.getenv("BOOKING_EXCHANGE", "booking_exchange")
BOOKING_EXCHANGE_TYPE = os.getenv("BOOKING_EXCHANGE_TYPE", "topic")
BOOKING_ROUTING_KEY = os.getenv("BOOKING_ROUTING_KEY", "booking.confirmed")
QUEUE_NAME = os.getenv("QUEUE_NAME", "notification.booking.confirmed")

OUTSYSTEMS_SEND_EMAIL_URL = os.getenv(
    "OUTSYSTEMS_SEND_EMAIL_URL",
    "https://personal-rx8tuqla.outsystemscloud.com/Notifications_Microservice/rest/Notification/SendEmail"
)


def send_email(email_address, email_subject, email_body, log_prefix):
    payload = {
        "emailAddress": email_address,
        "emailSubject": email_subject,
        "emailBody": email_body
    }

    print(f"{log_prefix} Calling OutSystems email endpoint for {email_address}")
    response = requests.post(
        OUTSYSTEMS_SEND_EMAIL_URL,
        json=payload,
        timeout=10
    )
    print(f"{log_prefix} OutSystems responded with HTTP {response.status_code}")
    response.raise_for_status()


def on_booking_confirmed(ch, method, properties, body):
    print(f"[Notification] Received booking.confirmed event -> {body}")

    try:
        event = json.loads(body)
    except json.JSONDecodeError as exc:
        print(f"[Notification] ERROR: failed to decode booking.confirmed payload: {exc}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    email = event.get("email")
    if not email:
        print("[Notification] WARNING: booking.confirmed payload has no email. Acking without send.")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    try:
        send_email(
            email_address=email,
            email_subject="Your Booking is Confirmed!",
            email_body=(
                "Hi,\n\n"
                "Your booking has been confirmed.\n\n"
                f"Booking ID: {event.get('booking_id')}\n"
                f"Class ID: {event.get('class_id')}\n\n"
                "Thank you for booking with us!"
            ),
            log_prefix="[Notification][Booking]"
        )
    except requests.RequestException as exc:
        print(f"[Notification] ERROR: booking email delivery failed: {exc}")

    ch.basic_ack(delivery_tag=method.delivery_tag)


@app.route("/notify/provider-payout", methods=["POST"])
def notify_provider_payout():
    payload = request.get_json() or {}
    email = payload.get("email")

    if not email:
        return jsonify({"status": "fail", "error": "email is required"}), 400

    provider_name = payload.get("providerName", "Provider")
    class_id = payload.get("classId")
    net_amount = payload.get("netAmount")
    transfer_id = payload.get("transferId", "N/A")

    print(
        "STEP 8 [Notification Service]: "
        f"Received provider payout notification request for provider={provider_name}, class_id={class_id}"
    )

    try:
        send_email(
            email_address=email,
            email_subject="Your Provider Payout Has Been Processed",
            email_body=(
                f"Hi {provider_name},\n\n"
                "Your provider payout has been processed successfully.\n\n"
                f"Class ID: {class_id}\n"
                f"Net Amount: ${net_amount}\n"
                f"Transfer ID: {transfer_id}\n\n"
                "Thank you for teaching with us."
            ),
            log_prefix="STEP 9 [Notification Service]:"
        )
        print("STEP 9 [Notification Service]: Provider payout email triggered successfully.")
        return jsonify({"status": "success", "message": "Provider payout email triggered"}), 200
    except requests.RequestException as exc:
        print(f"STEP 9 [Notification Service]: Provider payout email failed -> {exc}")
        return jsonify({"status": "fail", "error": str(exc)}), 502


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


def connect_with_retry(retries=10, delay=5):
    credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials,
        heartbeat=60,
        blocked_connection_timeout=300
    )

    for attempt in range(1, retries + 1):
        try:
            print(
                f"[Notification] Connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT} "
                f"(attempt {attempt}/{retries})..."
            )
            connection = pika.BlockingConnection(parameters)
            print("[Notification] Connected to RabbitMQ successfully")
            return connection
        except pika.exceptions.AMQPConnectionError as exc:
            print(f"[Notification] Connection failed: {exc}. Retrying in {delay}s...")
            time.sleep(delay)

    raise RuntimeError("[Notification] Could not connect to RabbitMQ after multiple attempts")


def consume_booking_notifications():
    connection = connect_with_retry()
    channel = connection.channel()

    channel.exchange_declare(
        exchange=BOOKING_EXCHANGE,
        exchange_type=BOOKING_EXCHANGE_TYPE,
        durable=True
    )
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.queue_bind(
        exchange=BOOKING_EXCHANGE,
        queue=QUEUE_NAME,
        routing_key=BOOKING_ROUTING_KEY
    )

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=on_booking_confirmed)

    print(
        f"[Notification] Listening for booking.confirmed events on "
        f"exchange={BOOKING_EXCHANGE}, queue={QUEUE_NAME}, routing_key={BOOKING_ROUTING_KEY}"
    )

    try:
        channel.start_consuming()
    finally:
        if connection.is_open:
            connection.close()


if __name__ == "__main__":
    consumer_thread = threading.Thread(target=consume_booking_notifications, daemon=True)
    consumer_thread.start()
    app.run(host="0.0.0.0", port=5000, debug=False)
