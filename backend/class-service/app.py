from flask import Flask, request, jsonify
from flasgger import Swagger
from datetime import datetime, timedelta
import uuid
import os
import json
import pika
import requests
import db

USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://127.0.0.1:5010")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://127.0.0.1:5001")

app = Flask(__name__)

# ─────────────────────────────────────────────
# Swagger Configuration
# ─────────────────────────────────────────────
app.config['SWAGGER'] = {
    'title': 'Class Service API',
    'version': '1.0',
    'description': 'API for managing wellness classes and slot reservations',
    'uiversion': 3
}
swagger = Swagger(app)


# ─────────────────────────────────────────────
# GET /classes?date=YYYY-MM-DD&providerId=123
# ─────────────────────────────────────────────
@app.route("/classes", methods=["GET"])
def get_classes():
    """
    Get classes by date and provider
    ---
    parameters:
      - name: date
        in: query
        type: string
        required: true
        description: Date to filter classes (YYYY-MM-DD)
        example: "2025-01-01"
      - name: providerId
        in: query
        type: integer
        required: true
        description: Provider's customer ID
        example: 1
    responses:
      200:
        description: List of classes returned successfully
        schema:
          properties:
            classes:
              type: array
              items:
                properties:
                  class_id:
                    type: integer
                    example: 1
                  customer_id:
                    type: integer
                    example: 1
                  class_name:
                    type: string
                    example: "Yoga Basics"
                  date:
                    type: string
                    example: "2025-01-01"
                  start_time:
                    type: string
                    example: "10:00:00"
                  duration:
                    type: integer
                    example: 60
                  capacity:
                    type: integer
                    example: 20
                  available_slots:
                    type: integer
                    example: 15
                  status:
                    type: string
                    example: "Scheduled"
                  location:
                    type: string
                    example: "Studio A, Level 2"
      400:
        description: Missing required parameters
      500:
        description: Internal server error
    """
    date = request.args.get("date")
    provider_id = request.args.get("providerId")

    if not date or not provider_id:
        return jsonify({"error": "date and providerId are required"}), 400

    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT class_id, customer_id, class_name, date, start_time,
                   duration, capacity, available_slots, status, location
            FROM Class
            WHERE date = %s AND customer_id = %s
            """,
            (date, provider_id)
        )
        classes = cursor.fetchall()

        for c in classes:
            c["date"] = str(c["date"])
            c["start_time"] = str(c["start_time"])

        return jsonify({"classes": classes}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# POST /classes
# Body: { customer_id, class_name, date, start_time, duration, capacity, location }
# ─────────────────────────────────────────────
@app.route("/classes", methods=["POST"])
def create_class():
    """
    Create a new class
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          required:
            - customer_id
            - class_name
            - date
            - start_time
            - duration
            - capacity
            - location
          properties:
            customer_id:
              type: integer
              example: 1
            class_name:
              type: string
              example: "Yoga Basics"
            date:
              type: string
              example: "2025-01-01"
            start_time:
              type: string
              example: "10:00:00"
            duration:
              type: integer
              example: 60
            capacity:
              type: integer
              example: 20
            location:
              type: string
              example: "Studio A, Level 2"
    responses:
      201:
        description: Class created successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            class_id:
              type: integer
              example: 1
      400:
        description: Missing required fields
      500:
        description: Internal server error
    """
    data = request.get_json()

    required = ["customer_id", "class_name", "date", "start_time", "duration", "capacity", "location"]
    for field in required:
        if field not in data:
            return jsonify({"success": False, "message": f"'{field}' is required"}), 400

    try:
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Class (customer_id, class_name, date, start_time, duration, capacity, available_slots, status, location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Scheduled', %s)
            """,
            (
                data["customer_id"],
                data["class_name"],
                data["date"],
                data["start_time"],
                data["duration"],
                data["capacity"],
                data["capacity"],
                data["location"],
            )
        )
        conn.commit()
        class_id = cursor.lastrowid

        return jsonify({"success": True, "class_id": class_id}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# POST /classes/<classId>/reserve
# Body: { user_id, idempotency_key }
# ─────────────────────────────────────────────
@app.route("/classes/<int:class_id>/reserve", methods=["POST"])
def reserve_slot(class_id):
    """
    Reserve a slot in a class
    ---
    parameters:
      - name: class_id
        in: path
        type: integer
        required: true
        description: ID of the class to reserve
        example: 1
      - name: body
        in: body
        required: true
        schema:
          required:
            - user_id
            - idempotency_key
          properties:
            user_id:
              type: integer
              description: ID of the user reserving the slot
              example: 1
            idempotency_key:
              type: string
              description: Unique key to prevent duplicate reservations
              example: "book-001"
    responses:
      201:
        description: Slot reserved successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            hold_id:
              type: string
              example: "hold_123"
      400:
        description: No slots available or class not schedulable
      404:
        description: Class not found
      409:
        description: Duplicate request - idempotency key already used
      500:
        description: Internal server error
    """
    data = request.get_json()

    if "user_id" not in data:
        return jsonify({"success": False, "message": "user_id is required"}), 400
    if "idempotency_key" not in data:
        return jsonify({"success": False, "message": "idempotency_key is required"}), 400

    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check for duplicate request using idempotency_key
        cursor.execute(
            "SELECT hold_id FROM ClassHold WHERE idempotency_key = %s",
            (data["idempotency_key"],)
        )
        existing = cursor.fetchone()
        if existing:
            return jsonify({
                "success": True,
                "hold_id": existing["hold_id"],
                "message": "Duplicate request - returning existing hold"
            }), 200

        # Get class and lock the row for update
        cursor.execute(
            "SELECT * FROM Class WHERE class_id = %s FOR UPDATE",
            (class_id,)
        )
        cls = cursor.fetchone()

        if not cls:
            return jsonify({"success": False, "message": "Class not found"}), 404

        if cls["status"] != "Scheduled":
            return jsonify({"success": False, "message": "Class is not available for reservation"}), 400

        if cls["available_slots"] <= 0:
            return jsonify({"success": False, "message": "No slots available"}), 400

        # Generate string hold_id
        hold_id = f"hold_{uuid.uuid4().hex[:8]}"
        expiry_time = datetime.now() + timedelta(minutes=15)

        cursor.execute(
            """
            INSERT INTO ClassHold (hold_id, class_id, user_id, idempotency_key, expiry_time)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (hold_id, class_id, data["user_id"], data["idempotency_key"], expiry_time)
        )

        cursor.execute(
            "UPDATE Class SET available_slots = available_slots - 1 WHERE class_id = %s",
            (class_id,)
        )
        conn.commit()

        return jsonify({"success": True, "hold_id": hold_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# POST /classes/<classId>/release
# Body: { hold_id }
# ─────────────────────────────────────────────
@app.route("/classes/<int:class_id>/release", methods=["POST"])
def release_slot(class_id):
    """
    Release a reserved slot
    ---
    parameters:
      - name: class_id
        in: path
        type: integer
        required: true
        description: ID of the class to release the slot from
        example: 1
      - name: body
        in: body
        required: true
        schema:
          required:
            - hold_id
          properties:
            hold_id:
              type: string
              description: ID of the hold to release
              example: "hold_123"
    responses:
      200:
        description: Slot released successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Slot released successfully"
      400:
        description: Missing hold_id
      404:
        description: Hold not found
      500:
        description: Internal server error
    """
    data = request.get_json()

    if "hold_id" not in data:
        return jsonify({"success": False, "message": "hold_id is required"}), 400

    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM ClassHold WHERE hold_id = %s AND class_id = %s",
            (data["hold_id"], class_id)
        )
        hold = cursor.fetchone()

        if not hold:
            return jsonify({"success": False, "message": "Hold not found"}), 404

        cursor.execute(
            "DELETE FROM ClassHold WHERE hold_id = %s",
            (data["hold_id"],)
        )

        cursor.execute(
            "UPDATE Class SET available_slots = available_slots + 1 WHERE class_id = %s",
            (class_id,)
        )
        conn.commit()

        return jsonify({"success": True, "message": "Slot released successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# RabbitMQ publisher helper
# ─────────────────────────────────────────────
def publish_class_completed(class_id, provider_id, total_bookings, total_credits_used, idempotency_key):
    """Publish a class.completed event to RabbitMQ (e.g. notifications). Returns True if published."""
    try:
        credentials = pika.PlainCredentials(
            os.getenv("RABBITMQ_USERNAME", "guest"),
            os.getenv("RABBITMQ_PASSWORD", "guest")
        )
        params = pika.ConnectionParameters(
            host=os.getenv("RABBITMQ_HOST", "localhost"),
            port=int(os.getenv("RABBITMQ_PORT", 5672)),
            credentials=credentials
        )
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue="class_completed", durable=True)
        channel.basic_publish(
            exchange="",
            routing_key="class_completed",
            body=json.dumps({
                "classId": class_id,
                "providerId": str(provider_id),
                "totalBookings": total_bookings,
                "totalCreditsUsed": total_credits_used,
                "idempotency_key": idempotency_key,
            }),
            properties=pika.BasicProperties(delivery_mode=2)   # persistent message
        )
        connection.close()
        print(f"[Class Service] Published class.completed for class_id={class_id}")
        return True
    except Exception as e:
        print(f"[Class Service] WARNING: failed to publish class.completed event: {e}")
        return False


def trigger_stripe_payout(class_id, provider_id, credits_used):
    """
    Process Stripe transfer via payment-service (same flow as pay-provider consumer).

    Idempotency key includes class_id, credits, and Stripe destination account so Stripe does not
    treat a retried payout (e.g. after changing connected account) as conflicting with the first
    request (same key, different parameters).
    """
    if credits_used is None or int(credits_used) <= 0:
        return {
            "ok": True,
            "skipped": True,
            "status": "no_credits",
            "detail": "No booked credits to pay out",
            "idempotency_key": f"payout-v2-class-{class_id}-0-none",
        }

    try:
        user_res = requests.get(
            f"{USER_SERVICE_URL}/providers/{provider_id}/payout-details",
            timeout=10,
        )
        user_res.raise_for_status()
        details = user_res.json()
    except requests.RequestException as e:
        return {
            "ok": False,
            "skipped": False,
            "status": "user_service_error",
            "detail": str(e),
            "idempotency_key": f"payout-v2-class-{class_id}-{int(credits_used)}-nouser",
        }

    payout_account = details.get("payout_account_id")
    if not payout_account:
        return {
            "ok": False,
            "skipped": False,
            "status": "no_payout_account",
            "detail": "Provider has no payout_account_id configured",
            "idempotency_key": f"payout-v2-class-{class_id}-{int(credits_used)}-noacct",
        }

    # payout-v2- prefix: avoids Stripe conflicts with legacy keys like payout-class-108
    idempotency_key = f"payout-v2-class-{class_id}-{int(credits_used)}-{payout_account}"

    try:
        pay_res = requests.post(
            f"{PAYMENT_SERVICE_URL}/process_payout",
            json={
                "provider_account": payout_account,
                "amount": credits_used,
                "idem_key": idempotency_key,
            },
            timeout=20,
        )
        body = pay_res.json() if pay_res.content else {}
        if not pay_res.ok or body.get("status") != "success":
            err = body.get("error") or body.get("message") or pay_res.text or "payment failed"
            return {
                "ok": False,
                "skipped": False,
                "status": "stripe_error",
                "detail": str(err),
                "idempotency_key": idempotency_key,
            }
        return {
            "ok": True,
            "skipped": False,
            "status": "success",
            "transfer_id": body.get("transfer_id"),
            "amount": body.get("amount"),
            "idempotency_key": idempotency_key,
        }
    except requests.RequestException as e:
        return {
            "ok": False,
            "skipped": False,
            "status": "payment_service_error",
            "detail": str(e),
            "idempotency_key": idempotency_key,
        }


# ─────────────────────────────────────────────
# POST /classes/<classId>/complete
# ─────────────────────────────────────────────
@app.route("/classes/<int:class_id>/complete", methods=["POST"])
def complete_class(class_id):
    """
    Mark a class as completed
    ---
    parameters:
      - name: class_id
        in: path
        type: integer
        required: true
        description: ID of the class to mark as completed
        example: 1
    responses:
      200:
        description: Class marked as completed successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Class marked as completed"
            class_id:
              type: integer
              example: 1
            status:
              type: string
              example: "Completed"
      400:
        description: Class already completed
      404:
        description: Class not found
      500:
        description: Internal server error
    """
    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM Class WHERE class_id = %s",
            (class_id,)
        )
        cls = cursor.fetchone()

        if not cls:
            return jsonify({"success": False, "message": "Class not found"}), 404

        if cls["status"] == "Completed":
            return jsonify({"success": False, "message": "Class already completed"}), 400

        cursor.execute(
            "UPDATE Class SET status = 'Completed' WHERE class_id = %s",
            (class_id,)
        )
        conn.commit()

        # Derive payout figures from bookings (capacity - available_slots = booked seats)
        total_bookings = cls["capacity"] - cls["available_slots"]
        # Each booking costs 1 credit by default; adjust if your schema tracks actual credits
        total_credits_used = total_bookings

        payout = trigger_stripe_payout(class_id, cls["customer_id"], total_credits_used)
        idempotency_key = payout.get("idempotency_key") or f"payout-v2-class-{class_id}-{total_credits_used}"
        rabbit_ok = publish_class_completed(
            class_id=class_id,
            provider_id=cls["customer_id"],
            total_bookings=total_bookings,
            total_credits_used=total_credits_used,
            idempotency_key=idempotency_key,
        )

        return jsonify({
            "success": True,
            "message": "Class marked as completed",
            "class_id": class_id,
            "status": "Completed",
            "total_bookings": total_bookings,
            "total_credits_used": total_credits_used,
            "payout": {
                "stripe": payout,
                "rabbitmq_published": rabbit_ok,
            },
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# GET /classes/<classId>
# ─────────────────────────────────────────────
@app.route("/classes/<int:class_id>", methods=["GET"])
def get_class(class_id):
    """
    Get a single class by ID
    ---
    parameters:
      - name: class_id
        in: path
        type: integer
        required: true
        description: ID of the class to retrieve
        example: 1
    responses:
      200:
        description: Class found
        schema:
          properties:
            success:
              type: boolean
              example: true
            class:
              type: object
              properties:
                class_id:
                  type: integer
                  example: 1
                customer_id:
                  type: integer
                  example: 1
                class_name:
                  type: string
                  example: "Yoga Basics"
                date:
                  type: string
                  example: "2025-01-01"
                start_time:
                  type: string
                  example: "10:00:00"
                duration:
                  type: integer
                  example: 60
                capacity:
                  type: integer
                  example: 20
                available_slots:
                  type: integer
                  example: 15
                status:
                  type: string
                  example: "Scheduled"
                location:
                  type: string
                  example: "Studio A, Level 2"
      404:
        description: Class not found
      500:
        description: Internal server error
    """
    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT class_id, customer_id, class_name, date, start_time,
                   duration, capacity, available_slots, status, location
            FROM Class
            WHERE class_id = %s
            """,
            (class_id,)
        )
        cls = cursor.fetchone()

        if not cls:
            return jsonify({"success": False, "message": "Class not found"}), 404

        cls["date"] = str(cls["date"])
        cls["start_time"] = str(cls["start_time"])

        return jsonify({"success": True, "class": cls}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# PUT /classes/<classId>/slots/increment
# ─────────────────────────────────────────────
@app.route("/classes/<int:class_id>/slots/increment", methods=["PUT"])
def increment_slot(class_id):
    """
    Increment available_slots by 1 (used for cancellation)
    ---
    parameters:
      - name: class_id
        in: path
        type: integer
        required: true
        description: ID of the class to increment slot for
        example: 1
    responses:
      200:
        description: Slot incremented successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            message:
              type: string
              example: "Slot incremented successfully"
            class_id:
              type: integer
              example: 1
            available_slots:
              type: integer
              example: 16
      400:
        description: Slots already at capacity
      404:
        description: Class not found
      500:
        description: Internal server error
    """
    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM Class WHERE class_id = %s FOR UPDATE",
            (class_id,)
        )
        cls = cursor.fetchone()

        if not cls:
            return jsonify({"success": False, "message": "Class not found"}), 404

        if cls["available_slots"] >= cls["capacity"]:
            return jsonify({"success": False, "message": "Slots already at capacity"}), 400

        cursor.execute(
            "UPDATE Class SET available_slots = available_slots + 1 WHERE class_id = %s",
            (class_id,)
        )
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Slot incremented successfully",
            "class_id": class_id,
            "available_slots": cls["available_slots"] + 1
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route("/classes/provider/<int:provider_id>", methods=["GET"])
def get_classes_by_provider(provider_id):
    try:
        conn = db.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT class_id, customer_id, class_name, date, start_time,
                      duration, capacity, available_slots, status, location
               FROM Class WHERE customer_id = %s ORDER BY date DESC""",
            (provider_id,)
        )
        classes = cursor.fetchall()
        for c in classes:
            c["date"] = str(c["date"])
            c["start_time"] = str(c["start_time"])
        return jsonify({"classes": classes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
@app.route("/health", methods=["GET"])
def health():
  return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=True)
