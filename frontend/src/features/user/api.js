async function readJson(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function getErrorMessage(payload, fallback) {
  if (payload?.message) return payload.message
  if (payload?.error)   return payload.error
  return fallback
}

function createIdempotencyKey(prefix = 'request') {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchUser(userId) {
  const response = await fetch(`/users/${userId}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch user'))
  return payload
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchProviderDetails(providerId) {
  const response = await fetch(`/providers/${providerId}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch provider'))
  // Normalise: user service may return { user: {...} } or the object directly
  return payload?.user ?? payload
}

// ─────────────────────────────────────────────────────────────────────────────
// Classes
// Fetches across a rolling window (past 60 days + next 30 days) so that both
// Scheduled and Completed classes are always visible regardless of date.
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchClasses(providerId) {
  const today  = new Date()
  const dates  = []

  for (let i = -60; i <= 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }

  const chunks = await Promise.all(
    dates.map(date =>
      fetch(`/classes?date=${date}&providerId=${providerId}`)
        .then(r => r.json())
        .then(d => (Array.isArray(d?.classes) ? d.classes : []))
        .catch(() => [])
    )
  )

  // Flatten and de-duplicate by class_id
  const seen = new Set()
  return chunks.flat().filter(c => {
    if (seen.has(c.class_id)) return false
    seen.add(c.class_id)
    return true
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Complete a class → triggers RabbitMQ event → Stripe payout (Scenario 3)
// ─────────────────────────────────────────────────────────────────────────────
export async function completeClass(classId) {
  const response = await fetch(`/classes/${classId}/complete`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  const payload = await readJson(response)
  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, 'Failed to complete class'))
  }
  return payload
}

// ─────────────────────────────────────────────────────────────────────────────
// Bookings
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchUserBookings(userId) {
  const response = await fetch('/user-bookings')
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch bookings'))
  const allBookings = Array.isArray(payload?.data) ? payload.data : []
  return allBookings.filter(b => Number(b.user_id) === userId && b.status === 'booked')
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
  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, 'Failed to book class'))
  }
  return payload
}

export async function cancelBooking({ bookingId, userId, credits }) {
  const response = await fetch('/cancel', {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'Idempotency-Key': createIdempotencyKey('cancel'),
    },
    body: JSON.stringify({ bookingId, userId, credits }),
  })
  const payload = await readJson(response)
  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, 'Failed to cancel booking'))
  }
  return payload
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchWalletBalance(userId) {
  const response = await fetch(`/wallets/${userId}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch wallet balance'))
  return payload
}

export async function fetchWalletLedger(userId, { limit = 50, offset = 0 } = {}) {
  const params   = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  const response = await fetch(`/wallets/${userId}/ledger?${params.toString()}`)
  const payload  = await readJson(response)
  if (!response.ok) throw new Error(getErrorMessage(payload, 'Failed to fetch wallet ledger'))
  return payload
}
