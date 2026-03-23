import pika
import json
import requests

def on_class_completed(ch, method, properties, body):
    event_data = json.loads(body)
    class_id = event_data['classId']

    user_res =  requests.get(f"http://user-service/provider/{event_data['providerId']}")
    provider_details = user_res.json()

    payment_payload = {
        "provider_id": provider_details['stripe_account_id'],
        "amount": event_data['totalCreditsUsed'],
        "idem_key": event_data['idempotency_key']
    }

    pay_res = requests.post("http://payment-service/process_payout", json=payment_payload)
    pay_status = pay_res.json()

    requests.post("http://notification-service/notify", json={
        "email": provider_details['email'],
        "status": pay_status['status']
    })


#rabbitMQ setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='class_completed')
channel.basic_consume(queue='class_completed', on_message_callback=on_class_completed, auto_ack=True)

print(" [*] Waiting for class completion events...")
channel.start_consuming()