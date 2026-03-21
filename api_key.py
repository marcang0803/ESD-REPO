class StripeAPI:
    def __init__(self, api_key):
        # We use a leading underscore to signal "internal use"
        self._api_key = api_key

    @property
    def api_key(self):
        """The getter: allows you to call client.api_key"""
        return self._api_key

    @api_key.setter
    def api_key(self, value):
        """The setter: allows you to add validation logic"""
        if not value.startswith("sk_"):
            raise ValueError("Invalid Stripe API key format.")
        self._api_key = value
    
