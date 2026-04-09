from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.services.booking_client import get_booking, cancel_booking
from app.services.class_client import get_class, increment_slot
from app.services.wallet_client import refund_credits, forfeit_credits
from app.services.user_client import get_user_contact
from app.services.publisher import publish_booking_cancelled

SGT = ZoneInfo("Asia/Singapore")


class CancelOrchestrator:
    def cancel_booking(self, booking_id, user_id, idempotency_key, credits):
        booking_data = None
        class_data = None
        slot_incremented = False
        wallet_response = None
        refund_policy = None

        try:
            # ─────────────────────────────────────────
            # STEP 1: Fetch booking & validate, then cancel
            # ─────────────────────────────────────────
            print(f"STEP 1: Fetching booking {booking_id}...")
            booking_data = get_booking(booking_id)
            print("Booking data:", booking_data)

            # Validate ownership
            if booking_data.get("user_id") != user_id:
                return {
                    "success": False,
                    "message": "Booking does not belong to this user.",
                    "http_status": 403
                }

            # Validate status
            if booking_data.get("status") != "booked":
                return {
                    "success": False,
                    "message": f"Booking cannot be cancelled. Current status: {booking_data.get('status')}",
                    "http_status": 400
                }

            class_id = booking_data.get("class_id")

            # Set booking status to cancelled
            print(f"STEP 1b: Setting booking {booking_id} to CANCELLED...")
            cancelled_booking = cancel_booking(booking_id)
            print("Cancelled booking:", cancelled_booking)

            # ─────────────────────────────────────────
            # STEP 2: Increment available_slots (+1)
            # ─────────────────────────────────────────
            print(f"STEP 2: Incrementing slot for class {class_id}...")
            slot_result = increment_slot(class_id)
            slot_incremented = True
            print("Slot result:", slot_result)

            # ─────────────────────────────────────────
            # STEP 3: Wallet — Refund or Forfeit via gRPC
            # ─────────────────────────────────────────
            print(f"STEP 3: Fetching class {class_id} for schedule...")
            class_data = get_class(class_id)
            print("Class data:", class_data)

            # Determine refund policy based on 12h rule
            refund_policy = self._determine_refund_policy(class_data)
            print(f"Refund policy: {refund_policy}")

            if refund_policy == "refund":
                print("STEP 3b: Refunding credits via gRPC...")
                wallet_response = refund_credits(
                    user_id=user_id,
                    amount=credits,
                    transaction_id=idempotency_key
                )
            else:
                print("STEP 3b: Recording forfeit via gRPC...")
                wallet_response = forfeit_credits(
                    user_id=user_id,
                    amount=credits,
                    transaction_id=idempotency_key
                )

            print("Wallet response:", wallet_response)

            wallet_success = wallet_response.get("success", False)
            wallet_status = wallet_response.get("status", "")

            if not wallet_success and wallet_status != "already_processed":
                print("WARNING: Wallet operation failed:", wallet_response)

            # ─────────────────────────────────────────
            # STEP 4: Get user contact details
            # ─────────────────────────────────────────
            print(f"STEP 4: Fetching user contact for user {user_id}...")
            user_contact = get_user_contact(user_id)
            print("User contact:", user_contact)

            email = user_contact.get("email")

            # ─────────────────────────────────────────
            # STEP 5: Publish booking.cancelled to RabbitMQ
            # ─────────────────────────────────────────
            print("STEP 5: Publishing booking.cancelled event...")

            event_payload = {
                "booking_id": booking_id,
                "user_id": user_id,
                "class_id": class_id,
                "email": email,
                "refund_policy": refund_policy
            }

            publish_booking_cancelled(event_payload)
            print("Cancellation event published successfully")

            # ─────────────────────────────────────────
            # SUCCESS RESPONSE
            # ─────────────────────────────────────────
            return {
                "success": True,
                "message": "Booking cancelled successfully",
                "booking": cancelled_booking,
                "wallet": wallet_response,
                "user_contact": user_contact,
                "refund_policy": refund_policy,
                "http_status": 200
            }

        except Exception as e:
            print("Orchestrator error:", str(e))

            return {
                "success": False,
                "message": f"Cancellation failed: {str(e)}",
                "http_status": 500
            }

    def _determine_refund_policy(self, class_data):
        """
        Determine whether to REFUND or FORFEIT based on the 12-hour rule.

        If the current time is more than 12 hours before the class start time,
        the user gets a REFUND. Otherwise, credits are FORFEITED.
        """
        try:
            class_date_str = class_data.get("date")  # "2026-04-10"
            class_time_str = class_data.get("start_time")  # "10:00:00"

            # Parse class start datetime in SGT
            class_start_str = f"{class_date_str} {class_time_str}"
            class_start = datetime.strptime(class_start_str, "%Y-%m-%d %H:%M:%S")
            class_start = class_start.replace(tzinfo=SGT)

            now = datetime.now(SGT)
            time_until_class = class_start - now

            print(f"Class start: {class_start}")
            print(f"Current time: {now}")
            print(f"Time until class: {time_until_class}")

            if time_until_class > timedelta(hours=12):
                return "refund"
            else:
                return "forfeit"

        except Exception as e:
            print(f"Error determining refund policy: {e}")
            # Default to forfeit if we can't determine the time
            return "forfeit"
