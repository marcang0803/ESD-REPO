from datetime import datetime
import os
from zoneinfo import ZoneInfo

from flasgger import Swagger
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy


SGT = ZoneInfo("Asia/Singapore")


def current_time():
    return datetime.now(SGT).replace(microsecond=0, tzinfo=None)


def format_datetime(value):
    if not value:
        return None

    return value.replace(tzinfo=SGT).isoformat(timespec="seconds")


def is_integer(value):
    return isinstance(value, int) and not isinstance(value, bool)


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "mysql+mysqlconnector://root@localhost:3306/booking"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_recycle": 299}

db = SQLAlchemy(app)

app.config["SWAGGER"] = {
    "title": "Booking Microservice API",
    "version": 1.0,
    "openapi": "3.0.2",
    "description": "Manages booking records for users and classes with SGT timestamps.",
}
swagger = Swagger(app)


class Booking(db.Model):
    __tablename__ = "booking"

    booking_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    user_id = db.Column(db.BigInteger, nullable=False)
    class_id = db.Column(db.BigInteger, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    booked_at = db.Column(db.DateTime, nullable=False)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)

    def json(self):
        return {
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "class_id": self.class_id,
            "status": self.status,
            "booked_at": format_datetime(self.booked_at),
            "cancelled_at": format_datetime(self.cancelled_at),
            "completed_at": format_datetime(self.completed_at),
        }


@app.route("/booking", methods=["GET"])
def get_all_bookings():
    """
    Get all booking records
    ---
    tags:
      - Booking
    responses:
      200:
        description: Booking records retrieved successfully
      404:
        description: No booking records found
    """
    query = db.select(Booking).order_by(Booking.booking_id)
    bookings = db.session.scalars(query).all()

    if bookings:
        return jsonify({"code": 200, "data": [booking.json() for booking in bookings]}), 200

    return jsonify({"code": 404, "message": "No booking records found."}), 404


@app.route("/booking/<int:booking_id>", methods=["GET"])
def get_booking(booking_id):
    """
    Get a booking by ID
    ---
    tags:
      - Booking
    parameters:
      - in: path
        name: booking_id
        schema:
          type: integer
        required: true
    responses:
      200:
        description: Booking record retrieved successfully
      404:
        description: Booking record not found
    """
    booking = db.session.get(Booking, booking_id)

    if not booking:
        return jsonify({"code": 404, "message": f"Booking {booking_id} not found."}), 404

    return jsonify({"code": 200, "data": booking.json()}), 200


@app.route("/booking", methods=["POST"])
def create_booking():
    """
    Create a new booking record
    ---
    tags:
      - Booking
    responses:
      201:
        description: Booking created successfully
      400:
        description: Validation error or invalid JSON body
      500:
        description: Internal server error
    """
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"code": 400, "message": "Request body must be valid JSON."}), 400

    errors = []
    expected_fields = {"user_id", "class_id", "status"}
    unexpected_fields = sorted(set(data.keys()) - expected_fields)

    if "user_id" not in data:
        errors.append("user_id is required.")
    elif not is_integer(data["user_id"]):
        errors.append("user_id must be an integer.")

    if "class_id" not in data:
        errors.append("class_id is required.")
    elif not is_integer(data["class_id"]):
        errors.append("class_id must be an integer.")

    if "status" not in data:
        errors.append("status is required.")
    elif not isinstance(data["status"], str):
        errors.append("status must be a string.")
    elif data["status"] != "booked":
        errors.append("status must be booked.")

    if unexpected_fields:
        errors.append(
            f"Only user_id, class_id, and status are allowed. Unexpected fields: {', '.join(unexpected_fields)}."
        )

    if errors:
        return jsonify({"code": 400, "message": "Validation error.", "errors": errors}), 400

    booking = Booking(
        user_id=data["user_id"],
        class_id=data["class_id"],
        status="booked",
        booked_at=current_time(),
        cancelled_at=None,
        completed_at=None,
    )

    try:
        db.session.add(booking)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return jsonify({"code": 500, "message": f"Error creating booking: {str(exc)}"}), 500

    return jsonify({"code": 201, "data": booking.json()}), 201


@app.route("/booking/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    """
    Update a booking status
    ---
    tags:
      - Booking
    parameters:
      - in: path
        name: booking_id
        schema:
          type: integer
        required: true
    responses:
      200:
        description: Booking updated successfully
      400:
        description: Validation error or invalid JSON body
      404:
        description: Booking record not found
      500:
        description: Internal server error
    """
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"code": 400, "message": "Request body must be valid JSON."}), 400

    booking = db.session.get(Booking, booking_id)
    if not booking:
        return jsonify({"code": 404, "message": f"Booking {booking_id} not found."}), 404

    errors = []
    unexpected_fields = sorted(set(data.keys()) - {"status"})

    if "status" not in data:
        errors.append("status is required.")
    elif not isinstance(data["status"], str):
        errors.append("status must be a string.")
    elif data["status"] not in {"cancelled", "completed"}:
        errors.append("status must be either cancelled or completed.")

    if unexpected_fields:
        errors.append(
            f"Only status can be updated. Unexpected fields: {', '.join(unexpected_fields)}."
        )

    if errors:
        return jsonify({"code": 400, "message": "Validation error.", "errors": errors}), 400

    booking.status = data["status"]
    timestamp = current_time()

    if booking.status == "completed":
        booking.completed_at = timestamp
    else:
        booking.cancelled_at = timestamp

    try:
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return jsonify({"code": 500, "message": f"Error updating booking: {str(exc)}"}), 500

    return jsonify({"code": 200, "data": booking.json()}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
