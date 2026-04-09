import json
import os
import time

import pika
import requests

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:5003")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://localhost:5001")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:5000")


def _nack(ch, delivery_tag, reason, requeue):
    print(f"[PayProvider] NACK -> {reason} | requeue={requeue}")
    ch.basic_nack(delivery_tag=delivery_tag, requeue=requeue)


def on_class_completed(ch, method, properties, body):
    print(f"STEP 3 [Pay Provider Orchestrator]: Consumed class.completed event from RabbitMQ -> {body}")

    try:
        event_data = json.loads(body)
    except json.JSONDecodeError as exc:
        print(f"[PayProvider] ERROR: failed to decode message body: {exc}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    class_id = event_data.get("classId")
    provider_id = event_data.get("providerId")
    total_credits_used = event_data.get("totalCreditsUsed", 0)
    idempotency_key = f"payout-class-{class_id}"

    if class_id is None or provider_id is None:
        print(f"[PayProvider] ERROR: class.completed payload missing classId/providerId -> {event_data}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    try:
        print(
            "STEP 4 [Pay Provider Orchestrator]: "
            f"Fetching payout details from User Service -> GET /providers/{provider_id}/payout-details"
        )
        user_response = requests.get(
            f"{USER_SERVICE_URL}/providers/{provider_id}/payout-details",
            timeout=10
        )
        user_response.raise_for_status()
        provider_details = user_response.json()
        print(f"STEP 4 [Pay Provider Orchestrator]: Received provider payout details -> {provider_details}")
    except requests.RequestException as exc:
        _nack(ch, method.delivery_tag, f"user-service lookup failed for provider_id={provider_id}: {exc}", True)
        return

    payout_account_id = provider_details.get("payout_account_id")
    provider_email = provider_details.get("email")
    provider_name = provider_details.get("name", "Provider")

    if not payout_account_id:
        _nack(
            ch,
            method.delivery_tag,
            f"provider_id={provider_id} has no payout_account_id configured",
            False
        )
        return

    payment_payload = {
        "provider_account": payout_account_id,
        "amount": total_credits_used,
        "idempotencyKey": idempotency_key,
        "classId": class_id,
        "providerId": provider_id,
    }

    try:
        print(
            "STEP 5 [Pay Provider Orchestrator]: "
            "Forwarding payout request to Payment Service -> POST /process_payout"
        )
        print(f"STEP 5 [Pay Provider Orchestrator]: Payload -> {payment_payload}")
        payment_response = requests.post(
            f"{PAYMENT_SERVICE_URL}/process_payout",
            json=payment_payload,
            timeout=15
        )
        payment_response.raise_for_status()
        payout_result = payment_response.json()
        print(f"STEP 5 [Pay Provider Orchestrator]: Payment Service responded -> {payout_result}")
    except requests.RequestException as exc:
        _nack(ch, method.delivery_tag, f"payment-service payout failed for class_id={class_id}: {exc}", True)
        return

    notification_payload = {
        "providerId": provider_id,
        "providerName": provider_name,
        "email": provider_email,
        "classId": class_id,
        "grossAmount": total_credits_used,
        "netAmount": payout_result.get("net_amount"),
        "transferId": payout_result.get("transfer_id"),
        "status": payout_result.get("status"),
    }

    try:
        print(
            "STEP 8 [Pay Provider Orchestrator]: "
            "Calling Notification Service to trigger provider payout email"
        )
        print(f"STEP 8 [Pay Provider Orchestrator]: Payload -> {notification_payload}")
        notification_response = requests.post(
            f"{NOTIFICATION_SERVICE_URL}/notify/provider-payout",
            json=notification_payload,
            timeout=10
        )
        notification_response.raise_for_status()
        print(
            "STEP 9 [Pay Provider Orchestrator]: "
            f"Notification Service responded -> {notification_response.json()}"
        )
    except requests.RequestException as exc:
        _nack(ch, method.delivery_tag, f"notification-service call failed for class_id={class_id}: {exc}", True)
        return

    print("STEP 10 [Pay Provider Orchestrator]: Entire payout chain succeeded. Sending basic_ack to RabbitMQ.")
    ch.basic_ack(delivery_tag=method.delivery_tag)
    print(f"[PayProvider] Flow complete for class_id={class_id}, provider_id={provider_id}")


def connect_with_retry(retries=15, delay=5):
    credentials = pika.PlainCredentials(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)

    for attempt in range(1, retries + 1):
        try:
            print(
                f"[PayProvider] Connecting to RabbitMQ at {RABBITMQ_HOST}:{RABBITMQ_PORT} "
                f"(attempt {attempt}/{retries})..."
            )
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBITMQ_HOST,
                    port=RABBITMQ_PORT,
                    credentials=credentials,
                    heartbeat=60,
                    blocked_connection_timeout=300
                )
            )
            print("[PayProvider] Connected to RabbitMQ.")
            return connection
        except pika.exceptions.AMQPConnectionError as exc:
            print(f"[PayProvider] Connection failed: {exc}. Retrying in {delay}s...")
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
