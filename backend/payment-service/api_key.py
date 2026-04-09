import os
from dotenv import load_dotenv

load_dotenv("key.env")

class StripeAPI:
    def __init__(self):
        # Support both STRIPE_KEY (legacy) and STRIPE_API_KEY (new .env name)
        self._api_key = os.getenv("STRIPE_KEY") or os.getenv("STRIPE_API_KEY", "")
        if not self._api_key:
            raise ValueError("Stripe secret key not found. Set STRIPE_KEY in key.env")

    @property
    def api_key(self):
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        if not value.startswith("sk_"):
            raise ValueError("Invalid Stripe API key.")
        self._api_key = value
