import mysql.connector
from mysql.connector import pooling
import os

_pool = None

def _get_pool():
    global _pool
    if _pool is None:
        db_config = {
            "host": os.environ.get("DB_HOST", "localhost"),
            "port": int(os.environ.get("DB_PORT", 3306)),
            "user": os.environ.get("DB_USER", "root"),
            "password": os.environ.get("DB_PASSWORD", "password"),
            "database": os.environ.get("DB_NAME", "classservice"),
        }

    _pool = pooling.MySQLConnectionPool(
        pool_name="class_pool",
        pool_size=5,
        **db_config
    )
    return _pool

def get_connection():
    return _get_pool.get_connection()
