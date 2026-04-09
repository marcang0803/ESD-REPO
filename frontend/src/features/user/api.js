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
  if (payload?.error) return payload.error
  return fallback
}

function createIdempotencyKey(prefix = 'request') {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function fetchUser(userId) {
  const response = await fetch(`/users/${userId}`)
  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to fetch user'))
  }

  return payload
}

export async function fetchUserBookings(userId) {
  const response = await fetch('/user-bookings')
  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to fetch bookings'))
  }

  const allBookings = Array.isArray(payload?.data) ? payload.data : []
  return allBookings.filter(
    (b) => Number(b.user_id) === userId && b.status === 'booked'
  )
}

export async function fetchWalletBalance(userId) {
  const response = await fetch(`/wallets/${userId}`)
  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to fetch wallet balance'))
  }

  return payload
}

export async function fetchWalletLedger(userId, { limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  const response = await fetch(`/wallets/${userId}/ledger?${params.toString()}`)
  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to fetch wallet ledger'))
  }

  return payload
}

export async function bookClass({ userId, classId, credits }) {
  const response = await fetch('/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      class_id: classId,
      credits,
      idempotency_key: createIdempotencyKey('book'),
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': createIdempotencyKey('cancel'),
    },
    body: JSON.stringify({
      bookingId,
      userId,
      credits,
    }),
  })

  const payload = await readJson(response)

  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, 'Failed to cancel booking'))
  }

  return payload
}
