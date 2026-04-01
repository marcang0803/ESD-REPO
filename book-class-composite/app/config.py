import os


class Config:
    WALLET_GRPC_HOST = "localhost"
    WALLET_GRPC_PORT = 50051
    CLASS_SERVICE_URL = os.getenv("CLASS_SERVICE_URL", "http://127.0.0.1:5006")    
    BOOKING_SERVICE_URL = os.getenv("BOOKING_SERVICE_URL", "http://localhost:6005")
    USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:5010")
    WALLET_SERVICE_URL = os.getenv("WALLET_SERVICE_URL", "http://localhost:5000")
    RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")