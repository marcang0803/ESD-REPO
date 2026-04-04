from app.services.class_client import reserve_slot, release_slot
from app.services.wallet_client import debit_credits, refund_credits
from app.services.booking_client import create_booking
from app.services.user_client import get_user_contact
from app.services.publisher import publish_booking_confirmed


class BookingOrchestrator:
    def create_booking(self, user_id, class_id, idempotency_key):
        hold_id = None
        wallet_response = None

        try:
            print("STEP 1: Reserving class slot...")
            class_response = reserve_slot(class_id, user_id, idempotency_key)
            print("Class response:", class_response)

            hold_id = class_response.get("hold_id")
            if not hold_id:
                raise Exception("No hold_id returned from Class service")

            print("STEP 2: Debiting wallet...")
            wallet_response = debit_credits(
                user_id=user_id,
                amount=1,
                transaction_id=idempotency_key
            )
            print("Wallet response:", wallet_response)

            wallet_success = wallet_response.get("success", False)
            wallet_status = wallet_response.get("status", "")

            if (not wallet_success) or (wallet_status not in ["processed", "already_processed"]):
                print("Wallet debit failed. Releasing class hold...")
                release_response = release_slot(class_id, hold_id)
                print("Release response:", release_response)

                return {
                    "success": False,
                    "message": "Wallet debit failed, class slot released",
                    "wallet_response": wallet_response,
                    "http_status": 400
                }

            print("STEP 3: Creating booking record...")
            booking_response = create_booking(user_id, class_id)
            print("Booking response:", booking_response)


            booking_id = (
                booking_response.get("data", {}).get("booking_id")
                )

            if not booking_id:
                raise Exception("No booking_id returned from Booking service")

            print("STEP 4: Fetching user contact from User service...")
            user_contact_response = get_user_contact(user_id)
            print("User contact response:", user_contact_response)

            email = user_contact_response.get("email")
            if not email:
                raise Exception("No email returned from User service")

            event_payload = {
                "booking_id": booking_id,
                "user_id": user_id,
                "class_id": class_id,
                "email": email
            }

            print("STEP 5: Publishing booking.confirmed event to RabbitMQ...")
            publish_success = publish_booking_confirmed(event_payload)

            if not publish_success:
                return {
                    "success": True,
                    "message": "Booking successful, but failed to publish booking.confirmed event",
                    "booking": booking_response,
                    "wallet": wallet_response,
                    "class": class_response,
                    "event_payload": event_payload,
                    "event_published": False,
                    "http_status": 201
                }

            return {
                "success": True,
                "message": "Booking successful and booking.confirmed event published",
                "booking": booking_response,
                "wallet": wallet_response,
                "class": class_response,
                "user_contact": user_contact_response,
                "event_payload": event_payload,
                "event_published": True,
                "http_status": 201
            }

        except Exception as e:
            print("Orchestrator error:", str(e))

            # rollback only if class hold exists
            if hold_id:
                try:
                    print("Rolling back class hold...")
                    release_response = release_slot(class_id, hold_id)
                    print("Release response:", release_response)
                except Exception as release_error:
                    print("Failed to release class hold during rollback:", str(release_error))

            # refund only if wallet debit had already succeeded
            if wallet_response:
                try:
                    wallet_success = wallet_response.get("success", False)
                    wallet_status = wallet_response.get("status", "")

                    if wallet_success and wallet_status in ["processed", "already_processed"]:
                        print("Rolling back wallet debit...")
                        refund_response = refund_credits(
                            user_id=user_id,
                            amount=1,
                            transaction_id=f"{idempotency_key}-refund"
                        )
                        print("Refund response:", refund_response)
                except Exception as refund_error:
                    print("Failed to refund wallet during rollback:", str(refund_error))

            return {
                "success": False,
                "message": str(e),
                "http_status": 500
            }