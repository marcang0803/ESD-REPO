import os
from dotenv import load_dotenv

load_dotenv("key.env")

class StripeAPI:
    def __init__(self):  
        self._api_key = os.getenv("STRIPE_KEY", "")
        if not self._api_key:
            raise ValueError("STRIPE_KEY not found in key.env")

    @property
    def api_key(self):
        # Calls api_key
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        # Set api_key
        if not value.startswith("sk_"):
            raise ValueError("Invalid Stripe API key.")
        self._api_key = value
    
