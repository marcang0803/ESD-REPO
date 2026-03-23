import stripe
from flask import Flask, request, jsonify
from api_key import StripeAPI

app = Flask(__name__)
stripe_config = StripeAPI()

@app.route('/process_payout', methods=['POST'])

def provide_payout():
    data = request.get_json()

    #details require database extract
    provider_account = data.get('provider_account')
    amount = data.get('amount') 
    idempt_key = data.get('idem_key') #Link to session_token.py

    try:
        stripe.api_key = stripe_config.api_key
        # USE idem_key to prevent double-charging/double-payouts
        transfer = stripe.Transfer.create(
            amount=int(amount * 100),
            currency="sgd",
            destination=provider_account,
            idempotency_key=idempt_key
        )
        # returning status via json format
        return jsonify ({
            "status": "success",
            "transfer_id": transfer.id,
            "message": "Payout successful"
        }), 200
    
    except stripe.error.StripeError as e:
        return jsonify({"status": "fail", "error": str(e)}), 400
    

if __name__ == '__main__':
    app.run(port=5001, debug=True) # Note! Check port number before deployment
    


