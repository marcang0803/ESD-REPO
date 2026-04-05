import os


class Config:
    BOOKING_SERVICE_URL = os.getenv("BOOKING_SERVICE_URL", "http://localhost:6005")
    CLASS_SERVICE_URL = os.getenv("CLASS_SERVICE_URL", "http://localhost:5006")
    USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:5010")
    WALLET_SERVICE_URL = os.getenv("WALLET_SERVICE_URL", "http://localhost:5000")

    WALLET_GRPC_HOST = os.getenv("WALLET_GRPC_HOST", "localhost")
    WALLET_GRPC_PORT = int(os.getenv("WALLET_GRPC_PORT", "50051"))

    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "guest")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

    BOOKING_EXCHANGE = "booking_exchange"
    BOOKING_EXCHANGE_TYPE = "topic"
    CANCEL_ROUTING_KEY = "booking.cancelled"
