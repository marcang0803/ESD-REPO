import json
import re
import hashlib
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models import User, IdempotencyRecord

user_bp = Blueprint("user_bp", __name__)

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
VALID_ROLES = ["customer", "provider"]
VALID_SUBSCRIPTION_STATUSES = ["ACTIVE", "INACTIVE"]


def validate_user_payload(data, is_update=False):
    if not data:
        return "request body must be JSON"

    if not is_update:
        required_fields = ["name", "email", "role"]
        for field in required_fields:
            if field not in data:
                return f"{field} is required"

    if "email" in data and not re.match(EMAIL_REGEX, data["email"]):
        return "invalid email format"

    if "role" in data and data["role"] not in VALID_ROLES:
        return "role must be customer or provider"

    if "subscription_status" in data and data["subscription_status"] not in VALID_SUBSCRIPTION_STATUSES:
        return "subscription_status must be ACTIVE or INACTIVE"

    role = data.get("role")

    # If creating or updating a provider, require provider fields
    if role == "provider":
        if not data.get("payout_account_id"):
            return "payout_account_id is required for provider"
        if not data.get("provider_business_name"):
            return "provider_business_name is required for provider"

    # If creating/updating a customer, block provider-only fields
    if role == "customer":
        if data.get("payout_account_id") is not None:
            return "payout_account_id is only allowed for provider"
        if data.get("provider_business_name") is not None:
            return "provider_business_name is only allowed for provider"

    return None


def build_request_hash(data):
    normalized = json.dumps(data, sort_keys=True)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


@user_bp.route("/health", methods=["GET"])
def health():
    """
    Health check endpoint
    ---
    tags:
      - Health
    responses:
      200:
        description: Service is up
    """
    return jsonify({
        "service": "user-service",
        "status": "UP"
    }), 200


@user_bp.route("/users", methods=["POST"])
def create_user():
    """
    Create a new user or provider
    ---
    tags:
      - Users
    consumes:
      - application/json
    parameters:
      - name: Idempotency-Key
        in: header
        type: string
        required: false
        description: Optional idempotency key to prevent duplicate user creation
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - role
          properties:
            name:
              type: string
              example: Alice Tan
            email:
              type: string
              example: alice@example.com
            phone:
              type: string
              example: 91234567
            role:
              type: string
              example: customer
            subscription_status:
              type: string
              example: ACTIVE
            payout_account_id:
              type: string
              example: acct_provider_001
            provider_business_name:
              type: string
              example: Zen Yoga Studio
    responses:
      201:
        description: User created successfully
      400:
        description: Invalid request
      409:
        description: Email already exists or idempotency key reused incorrectly
    """
    data = request.get_json()
    validation_error = validate_user_payload(data, is_update=False)

    if validation_error:
        return jsonify({"error": validation_error}), 400

    idem_key = request.headers.get("Idempotency-Key")

    if idem_key:
        request_hash = build_request_hash(data)
        existing_record = IdempotencyRecord.query.filter_by(idem_key=idem_key).first()

        if existing_record:
            if existing_record.request_hash != request_hash:
                return jsonify({
                    "error": "idempotency key was already used with a different request"
                }), 409

            return jsonify(json.loads(existing_record.response_body)), existing_record.status_code

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        role=data["role"],
        subscription_status=data.get("subscription_status", "ACTIVE"),
        payout_account_id=data.get("payout_account_id"),
        provider_business_name=data.get("provider_business_name")
    )

    try:
        db.session.add(user)
        db.session.commit()

        response_payload = user.to_dict()
        status_code = 201

        if idem_key:
            record = IdempotencyRecord(
                idem_key=idem_key,
                request_hash=build_request_hash(data),
                response_body=json.dumps(response_payload),
                status_code=status_code
            )
            db.session.add(record)
            db.session.commit()

        return jsonify(response_payload), status_code

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    """
    Get full user details by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        example: 1
    responses:
      200:
        description: User found
      404:
        description: User not found
    """
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404

    return jsonify(user.to_dict()), 200


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    """
    Update an existing user by ID
    ---
    tags:
      - Users
    consumes:
      - application/json
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        example: 1
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              example: Alice Tan Updated
            email:
              type: string
              example: alice_updated@example.com
            phone:
              type: string
              example: 98765432
            role:
              type: string
              example: customer
            subscription_status:
              type: string
              example: ACTIVE
            payout_account_id:
              type: string
              example: acct_provider_001
            provider_business_name:
              type: string
              example: Zen Yoga Studio
    responses:
      200:
        description: User updated successfully
      400:
        description: Invalid request
      404:
        description: User not found
      409:
        description: Email already exists
    """
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "request body must be JSON"}), 400

    # merge current user data with update payload so validation sees final state
    merged_data = {
        "name": data.get("name", user.name),
        "email": data.get("email", user.email),
        "phone": data.get("phone", user.phone),
        "role": data.get("role", user.role),
        "subscription_status": data.get("subscription_status", user.subscription_status),
        "payout_account_id": data.get("payout_account_id", user.payout_account_id),
        "provider_business_name": data.get("provider_business_name", user.provider_business_name),
    }

    validation_error = validate_user_payload(merged_data, is_update=True)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    user.name = merged_data["name"]
    user.email = merged_data["email"]
    user.phone = merged_data["phone"]
    user.role = merged_data["role"]
    user.subscription_status = merged_data["subscription_status"]
    user.payout_account_id = merged_data["payout_account_id"]
    user.provider_business_name = merged_data["provider_business_name"]

    try:
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "email already exists"}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_bp.route("/users/<int:user_id>/contact", methods=["GET"])
def get_user_contact(user_id):
    """
    Get user contact details by ID
    ---
    tags:
      - Users
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        example: 1
    responses:
      200:
        description: Contact details found
      404:
        description: User not found
    """
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "user not found"}), 404

    return jsonify(user.to_contact_dict()), 200


@user_bp.route("/providers/<int:provider_id>/payout-details", methods=["GET"])
def get_provider_payout_details(provider_id):
    """
    Get provider payout details by provider ID
    ---
    tags:
      - Providers
    parameters:
      - name: provider_id
        in: path
        type: integer
        required: true
        example: 2
    responses:
      200:
        description: Provider payout details found
      404:
        description: Provider not found
    """
    provider = User.query.filter_by(id=provider_id, role="provider").first()

    if not provider:
        return jsonify({"error": "provider not found"}), 404

    return jsonify(provider.to_payout_dict()), 200


