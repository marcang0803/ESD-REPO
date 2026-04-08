import json
import pika
from app.config import Config


def publish_booking_cancelled(event_payload):
    """Publish a booking.cancelled event to the RabbitMQ exchange."""
    connection = None

    try:
        credentials = pika.PlainCredentials(
            Config.RABBITMQ_USERNAME,
            Config.RABBITMQ_PASSWORD
        )

        parameters = pika.ConnectionParameters(
            host=Config.RABBITMQ_HOST,
            port=Config.RABBITMQ_PORT,
            credentials=credentials
        )

        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        # Ensure exchange exists (same exchange as book-class-composite)
        channel.exchange_declare(
            exchange=Config.BOOKING_EXCHANGE,
            exchange_type=Config.BOOKING_EXCHANGE_TYPE,
            durable=True
        )

        message_body = json.dumps(event_payload)

        channel.basic_publish(
            exchange=Config.BOOKING_EXCHANGE,
            routing_key=Config.CANCEL_ROUTING_KEY,
            body=message_body,
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type="application/json"
            )
        )

        print("[RabbitMQ] Published booking.cancelled successfully")
        print("[RabbitMQ] Exchange:", Config.BOOKING_EXCHANGE)
        print("[RabbitMQ] Routing key:", Config.CANCEL_ROUTING_KEY)
        print("[RabbitMQ] Payload:", message_body)

        return True

    except Exception as e:
        print("[RabbitMQ] Publish failed:", str(e))
        return False

    finally:
        if connection and connection.is_open:
            connection.close()
