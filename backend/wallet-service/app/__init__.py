from flask import Flask, jsonify

from app.routes import wallet_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.register_blueprint(wallet_bp)

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        return jsonify({"message": "Internal server error"}), 500

    return app