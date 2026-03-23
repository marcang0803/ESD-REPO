import os

class StripeAPI:
    def __init__(self, api_key):  
        self._api_key = os.getenv("STRIPE_KEY", "")

    @property
    def api_key(self):
        # Calls api_key
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        # Set api_key
        if not value.startswith("sk_"):
            raise ValueError("Invalid Stripe API key format.")
        self._api_key = value
    
