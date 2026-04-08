#!/bin/bash
# Kong Admin API configuration script
# Run after Kong is up: ./kong-setup.sh
#
# This configures upstreams (with health checks) so Kong can
# load-balance across replicas that Docker Compose scales.
KONG_ADMIN="http://localhost:8001"
echo "Waiting for Kong Admin API..."
until curl -s "$KONG_ADMIN/status" > /dev/null 2>&1; do
  sleep 2
done
echo "Kong is ready."

# -------------------------------------------------------
# Helper: create upstream -> service -> route
# -------------------------------------------------------
setup_service() {
  local name=$1
  local host=$2   # Docker Compose service name
  local port=$3
  local path=$4   # route path prefix
  local target="${host}:${port}"

  echo ""
  echo "=== Setting up: $name ==="

  # 1. Upsert upstream with active checks effectively disabled (idempotent)
  curl -s -X PUT "$KONG_ADMIN/upstreams/${name}.upstream" \
    --data "healthchecks.active.healthy.interval=0" \
    > /dev/null

  # 2. Add target only if not present (prevents duplicate target entries)
  if ! curl -s "$KONG_ADMIN/upstreams/${name}.upstream/targets" | grep -q "\"target\":\"${target}\""; then
    curl -s -X POST "$KONG_ADMIN/upstreams/${name}.upstream/targets" \
      --data "target=${target}" \
      > /dev/null
  fi

  # 3. Upsert service pointing to upstream
  curl -s -X PUT "$KONG_ADMIN/services/${name}" \
    --data "host=${name}.upstream" \
    --data "port=${port}" \
    > /dev/null

  # 4. Upsert route
  curl -s -X PUT "$KONG_ADMIN/services/${name}/routes/${name}.route" \
    --data "paths[]=${path}" \
    --data "strip_path=false" \
    > /dev/null

  echo "  upstream: ${name}.upstream -> ${host}:${port}"
  echo "  route:    ${path}"
}

# -------------------------------------------------------
# Register all ESD services
# -------------------------------------------------------

# Atomic services
setup_service "user-service"      "user_service"      5001 "/user"
setup_service "booking-service"   "booking_service"   5000 "/booking"
setup_service "class-service"     "class_service"     5000 "/class"
setup_service "wallet-service"    "wallet_service"    5000 "/wallet"
setup_service "payment-service"   "payment_service"   5001 "/payment"
setup_service "notification-service"    "notification_service"    5000 "/notification"

# Composite services
setup_service "cancel-booking-composite" "cancel_booking_composite" 5000 "/cancel-booking"
setup_service "book-class-composite"    "book_class_composite"    5000 "/book-class"

# Add more as needed

echo "Kong upstreams, services, and routes configured."
