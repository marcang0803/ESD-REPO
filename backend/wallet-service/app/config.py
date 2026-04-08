import os


class Config:
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "wallet_db")
    MYSQL_USER = os.getenv("MYSQL_USER", "wallet_user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "wallet_pass")

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    )

    INITIAL_CREDITS = int(os.getenv("INITIAL_CREDITS", "1000"))
    REST_PORT = int(os.getenv("REST_PORT", "5000"))
    GRPC_PORT = int(os.getenv("GRPC_PORT", "50051"))