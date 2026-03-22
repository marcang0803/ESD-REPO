from datetime import datetime
from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(30), nullable=True)
    role = db.Column(db.String(20), nullable=False)
    subscription_status = db.Column(db.String(20), nullable=False, default="ACTIVE")
    payout_account_id = db.Column(db.String(100), nullable=True)
    provider_business_name = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "subscription_status": self.subscription_status,
            "payout_account_id": self.payout_account_id,
            "provider_business_name": self.provider_business_name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def to_contact_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone
        }

    def to_payout_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "payout_account_id": self.payout_account_id,
            "provider_business_name": self.provider_business_name
        }