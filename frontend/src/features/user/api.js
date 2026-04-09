// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

function getErrorMessage(payload, fallback) {
  if (payload?.message) return payload.message
  if (payload?.error)   return payload.error
  return fallback
}

function createIdempotencyKey(prefix = 'request') {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// ─── User ─────────────────────────────────────────────────────────────────────

export async function fetchUser(userId) {
  const response = await fetch(`/users/${userId}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch user'))
  return payload
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function fetchWalletBalance(userId) {
  const response = await fetch(`/wallets/${userId}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch wallet balance'))
  return payload
}

export async function fetchWalletLedger(userId, { limit = 20, offset = 0 } = {}) {
  const params   = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  const response = await fetch(`/wallets/${userId}/ledger?${params}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch wallet ledger'))
  return payload
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function fetchClasses() {
  const response = await fetch('http://localhost:5000/classes')
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch classes'))
  return payload?.classes ?? []
}

export async function completeClass(classId) {
  const response = await fetch(`http://localhost:5000/classes/${classId}/complete`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({}),
  })
  const payload = await readJson(response)
  if (!response.ok || payload?.success === false)
    throw new Error(getErrorMessage(payload, 'Failed to complete class'))
  return payload
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function fetchUserBookings(userId) {
  const response = await fetch('/user-bookings')
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch bookings'))
  const all = Array.isArray(payload?.data) ? payload.data : []
  return all.filter((b) => Number(b.user_id) === userId)
}

export async function bookClass({ userId, classId, credits }) {
  const response = await fetch('/bookings', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id:          userId,
      class_id:         classId,
      credits,
      idempotency_key:  createIdempotencyKey('book'),
    }),
  })
  const payload = await readJson(response)
  if (!response.ok || payload?.success === false)
    throw new Error(getErrorMessage(payload, 'Failed to book class'))
  return payload
}

export async function cancelBooking({ bookingId, userId, credits }) {
  const response = await fetch('/cancel', {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'Idempotency-Key': createIdempotencyKey('cancel'),
    },
    body: JSON.stringify({
      bookingId,
      userId,
      credits,
    }),
  })
  const payload = await readJson(response)
  if (!response.ok || payload?.success === false)
    throw new Error(getErrorMessage(payload, 'Failed to cancel booking'))
  return payload
}

// ─── Admin: provider payout details ───────────────────────────────────────────

export async function fetchProviderDetails(providerId) {
  const response = await fetch(`http://localhost:5010/providers/${providerId}/payout-details`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch provider details'))
  return payload
}
