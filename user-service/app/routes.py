from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from app.extensions import db
from app.models import User

user_bp = Blueprint("user_bp", __name__)

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
        description: Email already exists
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "request body must be JSON"}), 400

    required_fields = ["name", "email", "role"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    if data["role"] not in ["customer", "provider"]:
        return jsonify({"error": "role must be customer or provider"}), 400

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
        return jsonify(user.to_dict()), 201
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

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.phone = data.get("phone", user.phone)
    user.subscription_status = data.get("subscription_status", user.subscription_status)
    user.payout_account_id = data.get("payout_account_id", user.payout_account_id)
    user.provider_business_name = data.get("provider_business_name", user.provider_business_name)

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

# Check if it works
@user_bp.route("/", methods=["GET"])
def root():
    return {
        "message": "User microservice is running"
    }, 200