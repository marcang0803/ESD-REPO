def publish_booking_confirmed(event_payload):
    print("Publishing booking.confirmed event:", event_payload)
    return True