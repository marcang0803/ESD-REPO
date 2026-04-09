from app.services.class_client import reserve_slot, release_slot
from app.services.wallet_client import debit_credits, refund_credits
from app.services.booking_client import create_booking
from app.services.user_client import get_user_contact
from app.services.publisher import publish_booking_confirmed
import traceback


class BookingOrchestrator:
    def create_booking(self, user_id, class_id, idempotency_key, credits):
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
                amount=credits,
                transaction_id=idempotency_key
            )
            print("Wallet response:", wallet_response)

            wallet_success = wallet_response.get("success", False)
            wallet_status = wallet_response.get("status", "")

            if (not wallet_success) or (wallet_status not in ["processed", "already_processed"]):
                print("Wallet debit failed. Releasing class hold...")

                release_slot(class_id, hold_id)

                return {
                    "success": False,
                    "message": "Payment failed. Please try again.",
                    "http_status": 400
                }


            print("STEP 3: Creating booking record...")
            booking_response = create_booking(user_id, class_id)
            print("Booking response:", booking_response)

            if not booking_response.get("success"):
                print("Booking failed. Rolling back...")

                # rollback class
                release_slot(class_id, hold_id)

                # rollback wallet
                refund_credits(
                    user_id=user_id,
                    amount=credits,
                    transaction_id=f"{idempotency_key}-refund"
                )

                return {
                    "success": False,
                    "message": booking_response.get("message", "Booking failed"),
                    "http_status": 400
                }

            booking_data = booking_response.get("data")
            booking_id = booking_data.get("booking_id")


            print("STEP 4: Fetching user contact...")
            user_contact = get_user_contact(user_id)
            print("User contact:", user_contact)

            email = user_contact.get("email")


            print("STEP 5: Publishing booking.confirmed event...")

            event_payload = {
                "booking_id": booking_id,
                "user_id": user_id,
                "class_id": class_id,
                "email": email
            }

            publish_booking_confirmed(event_payload)

            print("Booking event published successfully")


            return {
                "success": True,
                "message": "Booking successful",
                "booking": booking_data,
                "wallet": wallet_response,
                "class": class_response,
                "http_status": 201
            }

        except Exception as e:
            print(" FULL ERROR:")
            traceback.print_exc()
            

            # rollback class
            if hold_id:
                try:
                    print("Rolling back class hold...")
                    release_slot(class_id, hold_id)
                except Exception as err:
                    print("Class rollback failed:", str(err))

            # rollback wallet
            if wallet_response:
                try:
                    wallet_success = wallet_response.get("success", False)
                    wallet_status = wallet_response.get("status", "")

                    if wallet_success and wallet_status in ["processed", "already_processed"]:
                        print("Rolling back wallet...")
                        refund_credits(
                            user_id=user_id,
                            amount=credits,
                            transaction_id=f"{idempotency_key}-refund"
                        )
                except Exception as err:
                    print("Wallet rollback failed:", str(err))

            message = str(e) or "Something went wrong. Please try again."
            return {
                "success": False,
                "message": message,
                "http_status": 500
            }