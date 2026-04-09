import React, { useEffect, useMemo, useState } from 'react'
import { completeClass, fetchProviderClasses, fetchProviders } from '../../user/api.js'

const ACTIVE_PROVIDER_STORAGE_KEY = 'radiant.activeProviderId'

function getStoredProviderId() {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(ACTIVE_PROVIDER_STORAGE_KEY)
  return value ? Number(value) : null
}

function persistProviderId(providerId) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACTIVE_PROVIDER_STORAGE_KEY, String(providerId))
}

function formatClassMeta(cls) {
  return `${cls.date} at ${cls.start_time} - ${cls.location}`
}

function getBookedCount(cls) {
  return Math.max((cls.capacity ?? 0) - (cls.available_slots ?? 0), 0)
}

export default function ProviderDashboard() {
  const [providers, setProviders] = useState([])
  const [providerId, setProviderId] = useState(() => getStoredProviderId())
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProviders() {
      try {
        setLoading(true)
        setError('')
        const payload = await fetchProviders()
        if (cancelled) return

        const providerList = Array.isArray(payload?.providers) ? payload.providers : []
        setProviders(providerList)

        const storedProviderId = getStoredProviderId()
        const nextProvider =
          providerList.find((provider) => provider.id === storedProviderId)
          || providerList.find((provider) => provider.payout_account_id)
          || providerList[0]
          || null

        if (!nextProvider) {
          setProviderId(null)
          setClasses([])
          setError('No provider accounts are available right now.')
          return
        }

        persistProviderId(nextProvider.id)
        setProviderId(nextProvider.id)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProviders()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!providerId) return

    let cancelled = false

    async function loadClasses() {
      try {
        setLoading(true)
        setError('')
        const payload = await fetchProviderClasses(providerId)
        if (!cancelled) {
          setClasses(Array.isArray(payload?.classes) ? payload.classes : [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadClasses()

    return () => {
      cancelled = true
    }
  }, [providerId])

  useEffect(() => {
    if (!toast) return undefined

    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const activeProvider = providers.find((provider) => provider.id === providerId) || null

  const scheduledClasses = useMemo(
    () => classes.filter((cls) => cls.status !== 'Completed'),
    [classes]
  )

  const completedClasses = useMemo(
    () => classes.filter((cls) => cls.status === 'Completed'),
    [classes]
  )

  function handleProviderChange(event) {
    const nextProviderId = Number(event.target.value)
    persistProviderId(nextProviderId)
    setProviderId(nextProviderId)
  }

  async function handleComplete(classId) {
    try {
      setProcessingId(classId)
      const response = await completeClass(classId)
      setClasses((current) =>
        current.map((cls) =>
          cls.class_id === classId ? { ...cls, status: 'Completed' } : cls
        )
      )
      setToast({
        type: 'success',
        message: response?.message || 'Class completed successfully. Provider payout is being processed.',
      })
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message,
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div style={{ padding: '36px 24px 120px', maxWidth: 860, margin: '0 auto', fontFamily: '"Segoe UI", sans-serif' }}>
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(244,114,182,0.10), rgba(59,130,246,0.08), rgba(16,185,129,0.10))',
          borderRadius: 28,
          padding: '28px 24px',
          border: '1px solid rgba(17,24,39,0.08)',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280' }}>
          Provider Operations
        </div>
        <h1 style={{ fontSize: 28, margin: '8px 0 10px', color: '#111827' }}>
          Completed Classes
        </h1>
        <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.5 }}>
          Review your scheduled sessions, mark classes as completed, and let payout processing continue in the background.
        </p>
      </section>

      {toast && (
        <div
          style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderRadius: 16,
            background: toast.type === 'error' ? '#fef2f2' : '#ecfdf5',
            color: toast.type === 'error' ? '#b91c1c' : '#047857',
            border: '1px solid rgba(17,24,39,0.08)',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}

      <section
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: 20,
          border: '1px solid rgba(17,24,39,0.08)',
          marginBottom: 20,
          display: 'grid',
          gap: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Active Provider
          </div>
          <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800, color: '#111827' }}>
            {activeProvider?.name || 'Loading provider...'}
          </div>
          {activeProvider && (
            <div style={{ marginTop: 4, color: '#4b5563' }}>
              {activeProvider.provider_business_name} - Payout account: {activeProvider.payout_account_id || 'Not configured'}
            </div>
          )}
        </div>

        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Switch provider</span>
          <select
            value={providerId ?? ''}
            onChange={handleProviderChange}
            style={{
              borderRadius: 14,
              border: '1px solid #d1d5db',
              padding: '12px 14px',
              fontSize: 14,
              background: '#ffffff',
              color: '#111827',
            }}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} - {provider.provider_business_name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <div style={{ padding: 24, color: '#4b5563' }}>Loading classes...</div>
      ) : error ? (
        <div style={{ padding: 24, color: '#b91c1c', fontWeight: 600 }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          <section>
            <h2 style={{ fontSize: 20, margin: '0 0 14px', color: '#111827' }}>
              Ready to mark complete ({scheduledClasses.length})
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {scheduledClasses.length === 0 ? (
                <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid rgba(17,24,39,0.08)', color: '#4b5563' }}>
                  No scheduled classes are waiting to be completed.
                </div>
              ) : scheduledClasses.map((cls) => {
                const isProcessing = processingId === cls.class_id

                return (
                  <article
                    key={cls.class_id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(17,24,39,0.08)',
                      borderRadius: 24,
                      padding: 22,
                      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                        {cls.class_name}
                      </div>
                      <div style={{ color: '#4b5563', marginBottom: 12 }}>{formatClassMeta(cls)}</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#f3f4f6', color: '#374151', fontSize: 12, fontWeight: 700 }}>
                          {getBookedCount(cls)} / {cls.capacity} booked
                        </span>
                        <span style={{ padding: '6px 10px', borderRadius: 999, background: '#fef3c7', color: '#92400e', fontSize: 12, fontWeight: 700 }}>
                          Scheduled
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleComplete(cls.class_id)}
                      disabled={isProcessing || !activeProvider?.payout_account_id}
                      style={{
                        border: 'none',
                        background: '#111827',
                        color: '#ffffff',
                        borderRadius: 999,
                        padding: '12px 18px',
                        fontWeight: 800,
                        cursor: isProcessing || !activeProvider?.payout_account_id ? 'not-allowed' : 'pointer',
                        opacity: isProcessing || !activeProvider?.payout_account_id ? 0.7 : 1,
                        minWidth: 170,
                      }}
                    >
                      {isProcessing ? 'Processing Payout...' : 'Mark Completed'}
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 20, margin: '0 0 14px', color: '#111827' }}>
              Completed classes ({completedClasses.length})
            </h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {completedClasses.length === 0 ? (
                <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid rgba(17,24,39,0.08)', color: '#4b5563' }}>
                  Completed classes will appear here once they are marked done.
                </div>
              ) : completedClasses.map((cls) => (
                <article
                  key={cls.class_id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(17,24,39,0.08)',
                    borderRadius: 24,
                    padding: 22,
                    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                        {cls.class_name}
                      </div>
                      <div style={{ color: '#4b5563', marginBottom: 12 }}>{formatClassMeta(cls)}</div>
                      <span style={{ padding: '6px 10px', borderRadius: 999, background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 700 }}>
                        Completed
                      </span>
                    </div>
                    <div style={{ color: '#166534', fontWeight: 800 }}>Processed</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
