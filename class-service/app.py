from flask import Flask, request, jsonify
from flasgger import Swagger
from datetime import datetime, timedelta
import db

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
# Body: { customer_id }
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
            - customer_id
          properties:
            customer_id:
              type: integer
              description: ID of the customer reserving the slot
              example: 1
    responses:
      201:
        description: Slot reserved successfully
        schema:
          properties:
            success:
              type: boolean
              example: true
            hold_id:
              type: integer
              example: 1
      400:
        description: No slots available or class not schedulable
      404:
        description: Class not found
      500:
        description: Internal server error
    """
    data = request.get_json()

    if "customer_id" not in data:
        return jsonify({"success": False, "message": "customer_id is required"}), 400

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

        if cls["status"] != "Scheduled":
            return jsonify({"success": False, "message": "Class is not available for reservation"}), 400

        if cls["available_slots"] <= 0:
            return jsonify({"success": False, "message": "No slots available"}), 400

        expiry_time = datetime.now() + timedelta(minutes=15)
        cursor.execute(
            """
            INSERT INTO ClassHold (class_id, customer_id, expiry_time)
            VALUES (%s, %s, %s)
            """,
            (class_id, data["customer_id"], expiry_time)
        )
        hold_id = cursor.lastrowid

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
              type: integer
              description: ID of the hold to release
              example: 1
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

        return jsonify({
            "success": True,
            "message": "Class marked as completed",
            "class_id": class_id,
            "status": "Completed"
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
