#!/usr/bin/env python3
"""
ESD Microservices — End-to-End Scenario Test Script
=====================================================
Tests all 3 scenarios defined in the sequence diagrams:
  Scenario 1 — User Books Class Using Credits
  Scenario 2 — Booking Cancellation with Conditional Credit Refund
  Scenario 3 — Automatic Provider Payout After Class Completion

Usage:
    pip install requests
    python test_scenarios.py

Optional flags:
    python test_scenarios.py --host http://localhost --user-id 1001 --provider-id 1
"""

import argparse
import json
import sys
import time
import uuid
from datetime import date, timedelta
from typing import Any

import requests

# ─────────────────────────────────────────────────────────────────────────────
# Config — override via CLI flags
# ─────────────────────────────────────────────────────────────────────────────
DEFAULTS = {
    "host": "http://localhost",
    "book_composite_port": 5003,
    "cancel_composite_port": 5004,
    "class_service_port": 5000,
    "booking_service_port": 6005,
    "user_service_port": 5010,
    "wallet_rest_port": 5005,
    "rabbitmq_mgmt_port": 15672,
    "user_id": 1001,
    "provider_id": 1,   # Must match a seeded provider with payout_account_id
    "class_date": str(date.today() + timedelta(days=30)),  # 30 days in future → triggers refund path
    "class_time": "10:00:00",
    "capacity": 10,
}

# Colour helpers (ANSI)
RESET  = "\033[0m"
BOLD   = "\033[1m"
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
DIM    = "\033[2m"
BLUE   = "\033[94m"

# ─────────────────────────────────────────────────────────────────────────────
# Shared state across scenarios
# ─────────────────────────────────────────────────────────────────────────────
shared: dict[str, Any] = {}


# ─────────────────────────────────────────────────────────────────────────────
# Printing utilities
# ─────────────────────────────────────────────────────────────────────────────
def banner(text: str) -> None:
    width = 70
    print(f"\n{CYAN}{'═' * width}{RESET}")
    print(f"{BOLD}{CYAN}  {text}{RESET}")
    print(f"{CYAN}{'═' * width}{RESET}")


def step_header(n: int, name: str) -> None:
    print(f"\n  {BLUE}{BOLD}[STEP {n}]{RESET} {name}")
    print(f"  {DIM}{'─' * 60}{RESET}")


def ok(msg: str) -> None:
    print(f"  {GREEN}✓ PASS{RESET}  {msg}")


def fail(msg: str) -> None:
    print(f"  {RED}✗ FAIL{RESET}  {msg}")


def warn(msg: str) -> None:
    print(f"  {YELLOW}⚠ WARN{RESET}  {msg}")


def info(msg: str) -> None:
    print(f"  {DIM}       {msg}{RESET}")


def pretty(data: Any) -> str:
    return json.dumps(data, indent=4)


# ─────────────────────────────────────────────────────────────────────────────
# HTTP helpers
# ─────────────────────────────────────────────────────────────────────────────
TIMEOUT = 15


def get(url: str, headers: dict = None) -> tuple[int, Any]:
    t0 = time.time()
    try:
        r = requests.get(url, headers=headers, timeout=TIMEOUT)
        elapsed = int((time.time() - t0) * 1000)
        try:
            body = r.json()
        except Exception:
            body = {"raw": r.text}
        info(f"GET {url}  →  HTTP {r.status_code}  ({elapsed}ms)")
        return r.status_code, body
    except requests.exceptions.ConnectionError:
        print(f"\n  {RED}CONNECTION ERROR:{RESET} Could not reach {url}")
        print(f"  {YELLOW}→ Make sure 'docker compose up --build' is running{RESET}\n")
        sys.exit(1)


def post(url: str, payload: dict, headers: dict = None) -> tuple[int, Any]:
    t0 = time.time()
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        elapsed = int((time.time() - t0) * 1000)
        try:
            body = r.json()
        except Exception:
            body = {"raw": r.text}
        info(f"POST {url}  →  HTTP {r.status_code}  ({elapsed}ms)")
        return r.status_code, body
    except requests.exceptions.ConnectionError:
        print(f"\n  {RED}CONNECTION ERROR:{RESET} Could not reach {url}")
        print(f"  {YELLOW}→ Make sure 'docker compose up --build' is running{RESET}\n")
        sys.exit(1)


def put(url: str, payload: dict = None) -> tuple[int, Any]:
    t0 = time.time()
    try:
        r = requests.put(url, json=payload, timeout=TIMEOUT)
        elapsed = int((time.time() - t0) * 1000)
        try:
            body = r.json()
        except Exception:
            body = {"raw": r.text}
        info(f"PUT {url}  →  HTTP {r.status_code}  ({elapsed}ms)")
        return r.status_code, body
    except requests.exceptions.ConnectionError:
        print(f"\n  {RED}CONNECTION ERROR:{RESET} Could not reach {url}")
        print(f"  {YELLOW}→ Make sure 'docker compose up --build' is running{RESET}\n")
        sys.exit(1)


def assert_eq(label: str, actual: Any, expected: Any) -> bool:
    if actual == expected:
        ok(f"{label}: {BOLD}{actual}{RESET}")
        return True
    else:
        fail(f"{label}: expected {BOLD}{expected}{RESET}, got {BOLD}{actual}{RESET}")
        return False


def assert_true(label: str, condition: bool, detail: str = "") -> bool:
    if condition:
        ok(f"{label}" + (f" ({detail})" if detail else ""))
        return True
    else:
        fail(f"{label}" + (f" ({detail})" if detail else ""))
        return False


# ─────────────────────────────────────────────────────────────────────────────
# SCENARIO 1 — User Books Class Using Credits
# ─────────────────────────────────────────────────────────────────────────────
def scenario_1(cfg: dict) -> bool:
    banner("SCENARIO 1 — User Books Class Using Credits")

    H = cfg["host"]
    CS  = f"{H}:{cfg['class_service_port']}"
    BS  = f"{H}:{cfg['booking_service_port']}"
    WS  = f"{H}:{cfg['wallet_rest_port']}"
    BCC = f"{H}:{cfg['book_composite_port']}"

    user_id   = cfg["user_id"]
    idem_key  = f"book-{uuid.uuid4().hex[:12]}"
    passed    = True

    # ── STEP 0: Create a test class ──────────────────────────────────
    step_header(0, "SETUP — Create a future-dated test class in class-service")
    class_payload = {
        "customer_id": cfg["provider_id"],
        "class_name": f"Test Yoga {int(time.time())}",
        "date": cfg["class_date"],
        "start_time": cfg["class_time"],
        "duration": 60,
        "capacity": cfg["capacity"],
        "location": "Test Studio A",
    }
    info(f"Payload: {pretty(class_payload)}")
    status, body = post(f"{CS}/classes", class_payload)
    info(f"Response: {pretty(body)}")

    if status == 201 and body.get("class_id"):
        class_id = body["class_id"]
        shared["s1_class_id"] = class_id
        ok(f"Class created — class_id={class_id}")
    else:
        fail(f"Expected HTTP 201 with class_id, got HTTP {status}")
        info(pretty(body))
        return False

    # ── STEP 1: Check wallet balance (pre-booking) ────────────────────
    step_header(1, "Check wallet balance before booking")
    status, body = get(f"{WS}/wallets/{user_id}")
    info(f"Response: {pretty(body)}")

    if status == 200:
        balance_before = body.get("balance", 0)
        shared["s1_balance_before"] = balance_before
        assert_true("Balance ≥ 1 (sufficient for booking)", balance_before >= 1,
                    f"balance={balance_before}")
    else:
        # Wallet auto-creates on first gRPC call — treat as 1000
        warn(f"Wallet not found (HTTP {status}) — it will auto-create with 1000 credits on first use")
        shared["s1_balance_before"] = 1000
        balance_before = 1000

    # ── STEP 2: POST /bookings → book-class-composite ─────────────────
    step_header(2, "POST /bookings to book-class-composite (orchestrator)")
    book_payload = {
        "user_id": user_id,
        "class_id": class_id,
        "idempotency_key": idem_key,
    }
    info(f"Payload: {pretty(book_payload)}")
    status, body = post(f"{BCC}/bookings", book_payload)
    info(f"Response: {pretty(body)}")

    if status == 201 and body.get("success") and body.get("booking"):
        booking_id = body["booking"]["booking_id"]
        shared["s1_booking_id"] = booking_id
        ok(f"Booking created — booking_id={booking_id}")
    else:
        fail(f"Expected HTTP 201 with booking data, got HTTP {status}")
        passed = False

    if not passed:
        return False

    # ── STEP 3: Verify booking record in booking-service ─────────────
    step_header(3, "Verify booking record exists with status=booked")
    status, body = get(f"{BS}/booking/{booking_id}")
    info(f"Response: {pretty(body)}")

    booking_data = body.get("data", {})
    p = assert_eq("HTTP status", status, 200)
    p &= assert_eq("booking.status", booking_data.get("status"), "booked")
    p &= assert_eq("booking.user_id", booking_data.get("user_id"), user_id)
    p &= assert_eq("booking.class_id", booking_data.get("class_id"), class_id)
    passed &= p

    # ── STEP 4: Verify wallet debited by 1 credit ────────────────────
    step_header(4, "Verify wallet was debited by exactly 1 credit")
    status, body = get(f"{WS}/wallets/{user_id}")
    info(f"Response: {pretty(body)}")

    if status == 200:
        balance_after = body.get("balance", 0)
        shared["s1_balance_after"] = balance_after
        delta = balance_before - balance_after
        p = assert_eq("Wallet debit delta", delta, 1)
        info(f"Balance: {balance_before} → {balance_after} (delta={delta})")
        passed &= p
    else:
        fail(f"Could not fetch wallet (HTTP {status})")
        passed = False

    # ── STEP 5: Verify class available_slots decremented ─────────────
    step_header(5, "Verify class available_slots decremented by 1")
    status, body = get(f"{CS}/classes/{class_id}")
    info(f"Response: {pretty(body)}")

    cls = body.get("class", {})
    expected_slots = cfg["capacity"] - 1
    p = assert_eq("available_slots", cls.get("available_slots"), expected_slots)
    passed &= p

    # ── STEP 6: Idempotency — duplicate booking ────────────────────────
    step_header(6, "Idempotency — submit duplicate booking request")
    info(f"Re-sending same payload with same idempotency_key={idem_key}")
    status2, body2 = post(f"{BCC}/bookings", book_payload)
    info(f"Response: {pretty(body2)}")

    # Either rejected outright (409/400) or success=False
    is_rejected = (not (200 <= status2 < 300)) or body2.get("success") is False
    p = assert_true("Duplicate request rejected", is_rejected,
                    f"HTTP {status2}, success={body2.get('success')}")
    passed &= p

    # ── Result ────────────────────────────────────────────────────────
    print()
    if passed:
        print(f"  {GREEN}{BOLD}SCENARIO 1 PASSED ✓{RESET}")
    else:
        print(f"  {RED}{BOLD}SCENARIO 1 FAILED ✗{RESET}")
    return passed


# ─────────────────────────────────────────────────────────────────────────────
# SCENARIO 2 — Booking Cancellation with Conditional Credit Refund
# ─────────────────────────────────────────────────────────────────────────────
def scenario_2(cfg: dict) -> bool:
    banner("SCENARIO 2 — Booking Cancellation with Conditional Credit Refund")

    H = cfg["host"]
    CS   = f"{H}:{cfg['class_service_port']}"
    BS   = f"{H}:{cfg['booking_service_port']}"
    WS   = f"{H}:{cfg['wallet_rest_port']}"
    CBC  = f"{H}:{cfg['cancel_composite_port']}"

    user_id    = cfg["user_id"]
    booking_id = shared.get("s1_booking_id")
    class_id   = shared.get("s1_class_id")
    cancel_key = f"cancel-{uuid.uuid4().hex[:12]}"
    passed     = True

    if not booking_id or not class_id:
        fail("No booking_id or class_id from Scenario 1 — run Scenario 1 first")
        return False

    info(f"Using booking_id={booking_id}, class_id={class_id}, user_id={user_id}")

    # ── STEP 0: Record wallet balance before cancellation ─────────────
    step_header(0, "Record wallet balance before cancellation")
    status, body = get(f"{WS}/wallets/{user_id}")
    info(f"Response: {pretty(body)}")

    if status == 200:
        balance_before_cancel = body.get("balance", 0)
        shared["s2_balance_before"] = balance_before_cancel
        ok(f"Pre-cancel balance = {balance_before_cancel}")
    else:
        fail(f"Could not fetch wallet (HTTP {status})")
        return False

    # ── STEP 1: Record class slots before cancellation ────────────────
    step_header(1, "Record class available_slots before cancellation")
    status, body = get(f"{CS}/classes/{class_id}")
    info(f"Response: {pretty(body)}")

    if status == 200:
        slots_before = body["class"]["available_slots"]
        shared["s2_slots_before"] = slots_before
        ok(f"Pre-cancel slots = {slots_before}")
    else:
        fail(f"Could not fetch class (HTTP {status})")
        return False

    # ── STEP 2: POST /cancel → cancel-booking-composite ──────────────
    step_header(2, "POST /cancel to cancel-booking-composite (orchestrator)")
    cancel_payload = {
        "bookingId": booking_id,
        "userId": user_id,
    }
    cancel_headers = {"Idempotency-Key": cancel_key}
    info(f"Payload: {pretty(cancel_payload)}")
    info(f"Headers: Idempotency-Key={cancel_key}")
    status, body = post(f"{CBC}/cancel", cancel_payload, headers=cancel_headers)
    info(f"Response: {pretty(body)}")

    if status == 200 and body.get("success"):
        refund_policy = body.get("refund_policy")
        ok(f"Cancellation accepted — refund_policy={refund_policy}")
        shared["s2_refund_policy"] = refund_policy
        if refund_policy == "refund":
            info(f"Class is > 12h away — credits will be REFUNDED")
        else:
            info(f"Class is ≤ 12h away — credits will be FORFEITED")
    else:
        fail(f"Expected HTTP 200 success, got HTTP {status}")
        info(pretty(body))
        passed = False

    if not passed:
        return False

    # ── STEP 3: Verify booking status = cancelled ─────────────────────
    step_header(3, "Verify booking status is now 'cancelled'")
    status, body = get(f"{BS}/booking/{booking_id}")
    info(f"Response: {pretty(body)}")

    booking_data = body.get("data", {})
    p = assert_eq("HTTP status", status, 200)
    p &= assert_eq("booking.status", booking_data.get("status"), "cancelled")
    assert_true("cancelled_at is set", bool(booking_data.get("cancelled_at")),
                str(booking_data.get("cancelled_at")))
    passed &= p

    # ── STEP 4: Verify class slot incremented (+1) ────────────────────
    step_header(4, "Verify class available_slots restored (+1)")
    status, body = get(f"{CS}/classes/{class_id}")
    info(f"Response: {pretty(body)}")

    slots_after = body.get("class", {}).get("available_slots")
    expected_slots = slots_before + 1
    p = assert_eq("available_slots", slots_after, expected_slots)
    info(f"Slots: {slots_before} → {slots_after}")
    passed &= p

    # ── STEP 5: Verify wallet refund/forfeit applied ──────────────────
    step_header(5, "Verify wallet reflects correct refund/forfeit policy")
    status, body = get(f"{WS}/wallets/{user_id}")
    info(f"Response: {pretty(body)}")

    refund_policy = shared.get("s2_refund_policy", "forfeit")
    if status == 200:
        balance_after = body.get("balance", 0)
        info(f"Balance: {balance_before_cancel} → {balance_after}")

        if refund_policy == "refund":
            expected_balance = balance_before_cancel + 1
            p = assert_eq("Balance after refund", balance_after, expected_balance)
            info("Class was >12h away → 1 credit refunded ✓")
        else:
            expected_balance = balance_before_cancel
            p = assert_eq("Balance after forfeit (unchanged)", balance_after, expected_balance)
            info("Class was ≤12h away → credits forfeited, no change ✓")
        passed &= p
    else:
        fail(f"Could not fetch wallet (HTTP {status})")
        passed = False

    # ── STEP 6: Idempotency — duplicate cancel ────────────────────────
    step_header(6, "Idempotency — submit duplicate cancellation request")
    dup_key = f"cancel-dupe-{uuid.uuid4().hex[:8]}"
    info(f"Re-sending same bookingId={booking_id} with a new Idempotency-Key={dup_key}")
    status2, body2 = post(f"{CBC}/cancel", cancel_payload, headers={"Idempotency-Key": dup_key})
    info(f"Response: {pretty(body2)}")

    is_rejected = (not (200 <= status2 < 300)) or body2.get("success") is False
    p = assert_true("Duplicate cancel rejected (booking already cancelled)",
                    is_rejected, f"HTTP {status2}")
    passed &= p

    # ── Result ────────────────────────────────────────────────────────
    print()
    if passed:
        print(f"  {GREEN}{BOLD}SCENARIO 2 PASSED ✓{RESET}")
    else:
        print(f"  {RED}{BOLD}SCENARIO 2 FAILED ✗{RESET}")
    return passed


# ─────────────────────────────────────────────────────────────────────────────
# SCENARIO 3 — Automatic Provider Payout After Class Completion
# ─────────────────────────────────────────────────────────────────────────────
def scenario_3(cfg: dict) -> bool:
    banner("SCENARIO 3 — Automatic Provider Payout After Class Completion")

    H = cfg["host"]
    CS  = f"{H}:{cfg['class_service_port']}"
    US  = f"{H}:{cfg['user_service_port']}"
    BCC = f"{H}:{cfg['book_composite_port']}"
    RMQ = f"{H}:{cfg['rabbitmq_mgmt_port']}"

    user_id     = cfg["user_id"]
    provider_id = cfg["provider_id"]
    idem_key    = f"payout-{uuid.uuid4().hex[:12]}"
    passed      = True

    # ── STEP 0: Create a class owned by provider (customer_id=1) ──────
    step_header(0, "SETUP — Create class owned by provider (customer_id=1)")
    info("Note: provider_id must be 1 (Alice Tan — only seeded provider with payout_account_id)")
    class_payload = {
        "customer_id": provider_id,   # MUST be 1 for payout to work
        "class_name": f"Payout Test {int(time.time())}",
        "date": cfg["class_date"],
        "start_time": cfg["class_time"],
        "duration": 60,
        "capacity": cfg["capacity"],
        "location": "Payout Studio",
    }
    info(f"Payload: {pretty(class_payload)}")
    status, body = post(f"{CS}/classes", class_payload)
    info(f"Response: {pretty(body)}")

    if status == 201 and body.get("class_id"):
        class_id = body["class_id"]
        shared["s3_class_id"] = class_id
        ok(f"Class created — class_id={class_id}")
    else:
        fail(f"Expected HTTP 201 with class_id, got HTTP {status}")
        return False

    # ── STEP 1: Book the class to generate credit usage ────────────────
    step_header(1, "Book the class to generate credit usage (via composite)")
    book_payload = {
        "user_id": user_id,
        "class_id": class_id,
        "idempotency_key": idem_key,
    }
    info(f"Payload: {pretty(book_payload)}")
    status, body = post(f"{BCC}/bookings", book_payload)
    info(f"Response: {pretty(body)}")

    if status == 201 and body.get("booking"):
        booking_id = body["booking"]["booking_id"]
        shared["s3_booking_id"] = booking_id
        ok(f"Booking created — booking_id={booking_id}")
    else:
        fail(f"Expected HTTP 201 with booking, got HTTP {status}")
        info(pretty(body))
        return False

    # ── STEP 2: Verify provider payout details in user-service ────────
    step_header(2, "Verify provider payout details exist in user-service")
    status, body = get(f"{US}/providers/{provider_id}/payout-details")
    info(f"Response: {pretty(body)}")

    if status == 200:
        payout_account = body.get("payout_account_id")
        p = assert_true("payout_account_id present", bool(payout_account),
                        str(payout_account))
        ok(f"Provider: name={body.get('name')}, email={body.get('email')}")
        ok(f"payout_account_id={payout_account}")
        passed &= p
    else:
        fail(f"Expected HTTP 200, got HTTP {status}")
        info(pretty(body))
        passed = False

    if not passed:
        return False

    # ── STEP 3: POST /classes/:id/complete ────────────────────────────
    step_header(3, f"POST /classes/{class_id}/complete — trigger payout event")
    info("This marks the class as 'Completed' and publishes class.completed to RabbitMQ")
    status, body = post(f"{CS}/classes/{class_id}/complete", {})
    info(f"Response: {pretty(body)}")

    if status == 200 and body.get("success"):
        total_bookings = body.get("total_bookings", 0)
        total_credits  = body.get("total_credits_used", 0)
        ok(f"Class marked as Completed")
        ok(f"total_bookings={total_bookings}, total_credits_used={total_credits}")
        info("RabbitMQ class.completed event published — pay-provider will consume it asynchronously")
    else:
        fail(f"Expected HTTP 200 success, got HTTP {status}")
        info(pretty(body))
        passed = False

    if not passed:
        return False

    # ── STEP 4: Verify class status = Completed ───────────────────────
    step_header(4, "Verify class status is now 'Completed'")
    status, body = get(f"{CS}/classes/{class_id}")
    info(f"Response: {pretty(body)}")

    cls_status = body.get("class", {}).get("status")
    p = assert_eq("class.status", cls_status, "Completed")
    passed &= p

    # ── STEP 5: Idempotency — mark complete again ─────────────────────
    step_header(5, "Idempotency — POST /complete again on already-completed class")
    status2, body2 = post(f"{CS}/classes/{class_id}/complete", {})
    info(f"Response: {pretty(body2)}")

    is_rejected = status2 == 400 and body2.get("success") is False
    p = assert_true("Duplicate /complete rejected with HTTP 400",
                    is_rejected, f"HTTP {status2}, message='{body2.get('message')}'")
    passed &= p

    # ── STEP 6: Check RabbitMQ management API ─────────────────────────
    step_header(6, "Check RabbitMQ class_completed queue via management API")
    info("Waiting 2s for pay-provider to consume the message...")
    time.sleep(2)

    try:
        r = requests.get(
            f"{RMQ}/api/queues/%2F/class_completed",
            auth=("guest", "guest"),
            timeout=5,
        )
        if r.status_code == 200:
            q = r.json()
            ready    = q.get("messages_ready", "?")
            unacked  = q.get("messages_unacknowledged", "?")
            total    = q.get("messages", "?")
            ok(f"Queue 'class_completed' found")
            info(f"messages_ready={ready}, messages_unacknowledged={unacked}, total={total}")
            if ready == 0 and unacked == 0:
                ok("Queue empty — pay-provider consumed the message ✓")
            elif unacked > 0:
                warn(f"{unacked} message(s) unacknowledged — pay-provider may still be processing")
            else:
                warn(f"{ready} message(s) still in queue — pay-provider may not have consumed yet")
        elif r.status_code == 404:
            warn("Queue 'class_completed' not found — it may not have been declared yet")
            warn("Check: docker logs pay_provider")
        else:
            warn(f"RabbitMQ management returned HTTP {r.status_code}")
    except requests.exceptions.ConnectionError:
        warn("Could not reach RabbitMQ management API — verify manually:")
        info(f"  Open http://localhost:{cfg['rabbitmq_mgmt_port']} (guest/guest)")
        info("  Look for queue: class_completed")
        info("  Or run: docker logs pay_provider")

    # ── Result ────────────────────────────────────────────────────────
    print()
    if passed:
        print(f"  {GREEN}{BOLD}SCENARIO 3 PASSED ✓{RESET}")
    else:
        print(f"  {RED}{BOLD}SCENARIO 3 FAILED ✗{RESET}")
    return passed


# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
def print_summary(results: dict[str, bool]) -> None:
    print(f"\n{CYAN}{'═' * 70}{RESET}")
    print(f"{BOLD}{CYAN}  TEST SUMMARY{RESET}")
    print(f"{CYAN}{'─' * 70}{RESET}")
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    for name, result in results.items():
        icon = f"{GREEN}PASSED ✓{RESET}" if result else f"{RED}FAILED ✗{RESET}"
        print(f"  {name:45s} {icon}")
    print(f"{CYAN}{'─' * 70}{RESET}")
    colour = GREEN if passed == total else RED
    print(f"  {colour}{BOLD}{passed}/{total} scenarios passed{RESET}")
    if passed < total:
        print(f"\n  {YELLOW}Tips for failed scenarios:{RESET}")
        print(f"  • Check service logs:  docker logs <container_name>")
        print(f"  • Container names: booking_service, class_service, wallet_service,")
        print(f"    book_class_composite, cancel_booking_composite, pay_provider")
        print(f"  • RabbitMQ UI: http://localhost:15672  (guest/guest)")
    print(f"{CYAN}{'═' * 70}{RESET}\n")


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
def parse_args() -> dict:
    parser = argparse.ArgumentParser(
        description="ESD Microservices — End-to-End Scenario Tests"
    )
    parser.add_argument("--host",        default=DEFAULTS["host"])
    parser.add_argument("--user-id",     type=int, default=DEFAULTS["user_id"])
    parser.add_argument("--provider-id", type=int, default=DEFAULTS["provider_id"])
    parser.add_argument("--class-date",  default=DEFAULTS["class_date"],
                        help="YYYY-MM-DD, must be >12h in future for refund path")
    parser.add_argument("--class-time",  default=DEFAULTS["class_time"])
    parser.add_argument("--capacity",    type=int, default=DEFAULTS["capacity"])
    parser.add_argument("--scenario",    type=int, choices=[1, 2, 3],
                        help="Run only a specific scenario (default: all)")
    args = parser.parse_args()
    cfg = DEFAULTS.copy()
    cfg["host"]        = args.host
    cfg["user_id"]     = args.user_id
    cfg["provider_id"] = args.provider_id
    cfg["class_date"]  = args.class_date
    cfg["class_time"]  = args.class_time
    cfg["capacity"]    = args.capacity
    cfg["scenario"]    = args.scenario
    return cfg


def main() -> None:
    cfg = parse_args()

    print(f"\n{BOLD}ESD Microservices — End-to-End Test Suite{RESET}")
    print(f"{DIM}Host: {cfg['host']}  |  user_id={cfg['user_id']}  |  "
          f"provider_id={cfg['provider_id']}  |  class_date={cfg['class_date']}{RESET}")

    results = {}
    only = cfg.get("scenario")

    if only is None or only == 1:
        results["Scenario 1 — Book Class"] = scenario_1(cfg)

    if only is None or only == 2:
        results["Scenario 2 — Cancel Booking"] = scenario_2(cfg)

    if only is None or only == 3:
        results["Scenario 3 — Provider Payout"] = scenario_3(cfg)

    print_summary(results)
    all_passed = all(results.values())
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
