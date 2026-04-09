import os
import stripe
from flask import Flask, request, jsonify
from flask_cors import CORS
from api_key import StripeAPI

app = Flask(__name__)
CORS(app, origins="*")

stripe_config      = StripeAPI()
stripe.api_key     = stripe_config.api_key

WALLET_SERVICE_URL = os.getenv("WALLET_SERVICE_URL", "http://wallet-service:5000")
FRONTEND_URL       = os.getenv("FRONTEND_URL",       "http://localhost:5173")
WEBHOOK_SECRET     = os.getenv("STRIPE_WEBHOOK_SECRET", "")

CREDIT_PACKAGES = [
    { "id": "pack_100",  "credits": 100,  "price_sgd": 10 },
    { "id": "pack_300",  "credits": 300,  "price_sgd": 25 },
    { "id": "pack_500",  "credits": 500,  "price_sgd": 38 },
    { "id": "pack_1000", "credits": 1000, "price_sgd": 70 },
]

@app.route("/process_payout", methods=["POST"])
def provide_payout():
    data = request.get_json() or {}
    provider_account = data.get("provider_account")
    amount = data.get("amount")
    idempt_key = data.get("idempotencyKey") or data.get("idem_key")
    if not provider_account:
        return jsonify({"status": "fail", "error": "provider_account is required"}), 400
    if amount is None:
        return jsonify({"status": "fail", "error": "amount is required"}), 400
    if not idempt_key:
        return jsonify({"status": "fail", "error": "idempotencyKey is required"}), 400
    COMMISSION_RATE = 0.15
    print("STEP 6 [Payment Service]: Calculating provider net amount with 15% platform commission...")
    gross_amount = round(float(amount), 2)
    net_amount = round(gross_amount * (1 - COMMISSION_RATE), 2)
    commission_amount = round(gross_amount * COMMISSION_RATE, 2)
    print(
        f"STEP 6 [Payment Service]: Gross={gross_amount}, "
        f"Commission={commission_amount}, Net={net_amount}"
    )
    try:
        print(f"STEP 7 [Payment Service]: Executing stripe.Transfer.create with idempotencyKey={idempt_key}...")
        transfer = stripe.Transfer.create(
            amount=int(net_amount * 100),
            currency="sgd",
            destination=provider_account,
            idempotency_key=idempt_key
        )
        print(f"STEP 7 [Payment Service]: Stripe transfer successful -> {transfer.id}")
        return jsonify({
            "status": "success",
            "transfer_id": transfer.id,
            "gross_amount": gross_amount,
            "net_amount": net_amount,
            "commission_deducted": commission_amount,
            "message": "Payout successful"
        }), 200
    except stripe.error.StripeError as e:
        print(f"STEP 7 [Payment Service]: Stripe transfer failed -> {e}")
        return jsonify({"status": "fail", "error": str(e)}), 400
    except Exception as e:
        print(f"STEP 7 [Payment Service]: Unexpected payout error -> {e}")
        return jsonify({"status": "fail", "error": "Internal Server Error"}), 500

@app.route("/topup/packages", methods=["GET"])
def get_packages():
    return jsonify({"packages": CREDIT_PACKAGES}), 200

@app.route("/topup/checkout", methods=["POST"])
def create_checkout_session():
    data       = request.get_json()
    user_id    = data.get("user_id")
    package_id = data.get("package_id")
    if not user_id or not package_id:
        return jsonify({"error": "user_id and package_id are required"}), 400
    package = next((p for p in CREDIT_PACKAGES if p["id"] == package_id), None)
    if not package:
        return jsonify({"error": f"Unknown package: {package_id}"}), 400
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price_data": {"currency": "sgd", "unit_amount": int(package["price_sgd"] * 100), "product_data": {"name": f"{package['credits']} Radiant Credits", "description": f"Top up your Radiant Sanctuary wallet with {package['credits']} credits"}}, "quantity": 1}],
            mode="payment",
            success_url=f"{FRONTEND_URL}/?topup=success&credits={package['credits']}&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/?topup=cancelled",
            metadata={"user_id": str(user_id), "credits": str(package["credits"]), "package_id": package_id},
        )
        return jsonify({"checkout_url": session.url, "session_id": session.id}), 200
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/topup/webhook", methods=["POST"])
def stripe_webhook():
    import json
    import requests as req
    payload    = request.get_data()
    sig_header = request.headers.get("Stripe-Signature", "")
    if WEBHOOK_SECRET:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
        except stripe.error.SignatureVerificationError:
            return jsonify({"error": "Invalid signature"}), 400
    else:
        try:
            event = json.loads(payload)
        except Exception:
            return jsonify({"error": "Invalid payload"}), 400
    if event.get("type") == "checkout.session.completed":
        session  = event["data"]["object"]
        metadata = session.get("metadata", {})
        user_id  = metadata.get("user_id")
        credits  = int(metadata.get("credits", 0))
        if user_id and credits > 0:
            try:
                res = req.post(f"{WALLET_SERVICE_URL}/wallets/{user_id}/topup", json={"amount": credits, "transaction_id": session["id"]}, timeout=10)
                print(f"[Webhook] Topped up {credits} credits for user {user_id}: {res.status_code}")
            except Exception as e:
                print(f"[Webhook] Failed to top up wallet: {e}")
    return jsonify({"received": True}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
