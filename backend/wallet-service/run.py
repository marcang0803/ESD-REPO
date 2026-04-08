from threading import Thread

from app import create_app
from app.config import Config
from app.db import Base, engine
from app.grpc_server import serve_grpc

app = create_app()


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()

    grpc_thread = Thread(target=serve_grpc, daemon=True)
    grpc_thread.start()

    print(f"REST server running on port {Config.REST_PORT}")
    app.run(host="0.0.0.0", port=Config.REST_PORT, debug=True, threaded=True)