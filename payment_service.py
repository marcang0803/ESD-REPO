import stripe
from flask import Flask, request, jsonify
from api_key import StripeAPI

app = Flask(__name__)
stripe_config = StripeAPI()

def provide_payment():
    pass



print(session_time())
