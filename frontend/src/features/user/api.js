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

function createIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) {
    return `cancel-${globalThis.crypto.randomUUID()}`
  }

  return `cancel-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function fetchUser(userId) {
  const response = await fetch(`/users/${userId}`)
  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, 'Failed to fetch user'))
  }

  return payload
}

export async function cancelBooking({ bookingId, userId }) {
  const response = await fetch('/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': createIdempotencyKey(),
    },
    body: JSON.stringify({
      bookingId,
      userId,
    }),
  })

  const payload = await readJson(response)

  if (!response.ok || payload?.success === false) {
    throw new Error(getErrorMessage(payload, 'Failed to cancel booking'))
  }

  return payload
}
