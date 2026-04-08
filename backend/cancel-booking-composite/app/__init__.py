from flask import Flask
from app.routes.health import health_bp
from app.routes.cancel import cancel_bp


def create_app():
    app = Flask(__name__)

    app.register_blueprint(health_bp)
    app.register_blueprint(cancel_bp)

    return app
