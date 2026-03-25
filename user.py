from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class Provider(db.Model):
    provider_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    stripe_account_id = db.Column(db.String(100), unique=True, nullable=False)

@app.before_first_request

# Initialise database
def create_tables():
    db.create_all()
    if not Provider.query.filter_by(provider_id="P123").first():
        sample = Provider(
            provider_id="P123",
            name="Marcus",
            email="marcus@smu.edu.com",
            stripe_account_id="acct_676712345"
        )
        db.session.add(sample)
        db.session.commit()

@app.route('/provider/<string:provider_id>', methods=['GET'])
def get_provider(provider_id):
    provider = Provider.query.get(provider_id)
    if provider:
        return jsonify({
            "provider_id": provider.provider_id,
            "email": provider.email,
            "stripe_account_id": provider.stripe_account_id
        }), 200
    return jsonify({"message": "Provider not found"}), 404


if __name__ == "__main__":
    # Check port no
    app.run(port=5002, debug=True)
        
