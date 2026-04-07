import stripe
from flask import Flask, request, jsonify
from api_key import StripeAPI

app = Flask(__name__)
stripe_config = StripeAPI()


@app.route("/process_payout", methods=["POST"])
def provide_payout():
    data = request.get_json()

    provider_account = data.get("provider_account")
    amount = data.get("amount")
    idempt_key = data.get("idem_key")

    
    if not provider_account:
        return jsonify({"status": "fail", "error": "provider_account is required"}), 400
    if amount is None:
        return jsonify({"status": "fail", "error": "amount is required"}), 400
    if not idempt_key:
        return jsonify({"status": "fail", "error": "idem_key is required"}), 400

  
    COMMISSION_RATE = 0.15
    net_amount = round(float(amount) * (1 - COMMISSION_RATE), 2)

    try:
        stripe.api_key = stripe_config.api_key

        
        transfer = stripe.Transfer.create(
            amount=int(net_amount * 100),   # Stripe expects cents
            currency="sgd",
            destination=provider_account,
            idempotency_key=idempt_key
        )

        return jsonify({
            "status": "success",
            "transfer_id": transfer.id,
            "message": "Payout successful",
            
            "amount": net_amount,
            "commission_deducted": round(float(amount) * COMMISSION_RATE, 2)
        }), 200

    except stripe.error.StripeError as e:
        return jsonify({"status": "fail", "error": str(e)}), 400
    except Exception as e:
        return jsonify({"status": "fail", "error": "Internal Server Error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
