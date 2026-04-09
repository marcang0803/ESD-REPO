import os


class Config:
    # Wallet gRPC (used by wallet_client.py)
    WALLET_GRPC_HOST = os.getenv("WALLET_GRPC_HOST", "localhost")
    WALLET_GRPC_PORT = int(os.getenv("WALLET_GRPC_PORT", "50051"))

    # Atomic service URLs
    CLASS_SERVICE_URL = os.getenv("CLASS_SERVICE_URL", "http://127.0.0.1:5006")
    BOOKING_SERVICE_URL = os.getenv("BOOKING_SERVICE_URL", "http://localhost:6005")
    USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:5010")
    WALLET_SERVICE_URL = os.getenv("WALLET_SERVICE_URL", "http://localhost:5000")

    # RabbitMQ
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "guest")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

    BOOKING_EXCHANGE = os.getenv("BOOKING_EXCHANGE", "booking_exchange")
    BOOKING_EXCHANGE_TYPE = os.getenv("BOOKING_EXCHANGE_TYPE", "topic")
    BOOKING_ROUTING_KEY = os.getenv("BOOKING_ROUTING_KEY", "booking.confirmed")