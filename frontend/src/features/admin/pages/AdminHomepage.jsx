import { useEffect, useState } from 'react'
import TopAppBar  from '../components/TopAppBar.jsx'
import ClassCard  from '../components/ClassCard.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import Icon       from '../components/Icons.jsx'
import { colors, fonts, radius, shadows } from '../tokens.js'
import { completeClass, fetchClasses, fetchProviderDetails } from '../../user/api.js'

const PROVIDER_ID  = 1
const imgReviewer1 = '/assets/img/elena-vance.png'
const imgReviewer2 = '/assets/img/elena-user.png'

const REVIEWS = [
  { quote: 'Loved the energy! The focus on intentional breathing during the flow was exactly what I needed.', reviewer: 'Sarah K.', avatarSrc: imgReviewer1, rating: 5 },
  { quote: 'Elena is a master of her craft. The class felt personal even with 12 others in the room.',        reviewer: 'David M.', avatarSrc: imgReviewer2, rating: 5 },
]

function formatDate(dateStr) {
  if (!dateStr) return { month: '---', day: '--' }
  const d = new Date(dateStr)
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day:   String(d.getDate()).padStart(2, '0'),
  }
}

function relativeDay(dateStr) {
  if (!dateStr) return ''
  const classDate = new Date(dateStr)
  const today     = new Date()
  today.setHours(0, 0, 0, 0)
  classDate.setHours(0, 0, 0, 0)
  const diff = Math.round((today - classDate) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return classDate.toLocaleDateString('en', { weekday: 'long' })
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position:        'fixed',
      bottom:          100,
      left:            '50%',
      transform:       'translateX(-50%)',
      zIndex:          2000,
      backgroundColor: type === 'success' ? colors.teal : colors.error,
      color:           colors.white,
      fontFamily:      fonts.sans,
      fontWeight:      600,
      fontSize:        14,
      borderRadius:    radius.pill,
      padding:         '14px 24px',
      boxShadow:       '0 8px 32px rgba(0,0,0,0.18)',
      display:         'flex',
      alignItems:      'center',
      gap:             10,
      maxWidth:        320,
      textAlign:       'center',
      animation:       'slideUp 0.3s ease',
      whiteSpace:      'nowrap',
    }}>
      <span style={{ fontSize: 18 }}>{type === 'success' ? '✓' : '✗'}</span>
      {message}
    </div>
  )
}

// ── Payout Modal ──────────────────────────────────────────────────────────────
function PayoutModal({ cls, onClose, onConfirm, loading, result }) {
  const booked = cls.capacity - cls.available_slots
  const estimatedPayout = (booked * 12).toFixed(2)

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      zIndex:          1000,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display:         'flex',
      alignItems:      'flex-end',
      justifyContent:  'center',
      padding:         0,
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius:    `${radius.lg}px ${radius.lg}px 0 0`,
        padding:         '32px 24px 40px',
        width:           '100%',
        maxWidth:        480,
        display:         'flex',
        flexDirection:   'column',
        gap:             20,
      }}>
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: colors.brownLight, alignSelf: 'center', marginBottom: 4 }} />

        <h2 style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.textDark, margin: 0 }}>
          {result ? 'Payout Summary' : 'Trigger Class Payout'}
        </h2>

        {/* Class info card */}
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius:    radius.md,
          padding:         '16px 20px',
          display:         'flex',
          flexDirection:   'column',
          gap:             10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 17, color: colors.textDark }}>{cls.class_name}</span>
            <span style={{
              fontFamily:      fonts.sans,
              fontSize:        11,
              fontWeight:      700,
              color:           colors.teal,
              backgroundColor: colors.tealLight,
              borderRadius:    radius.pill,
              padding:         '3px 10px',
              textTransform:   'uppercase',
              letterSpacing:   0.5,
            }}>
              Completed
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Students</span>
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 15, color: colors.textDark }}>{booked} / {cls.capacity}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Est. Payout</span>
              <span style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 15, color: colors.brownDark }}>${estimatedPayout}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Credits</span>
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 15, color: colors.textDark }}>{booked}</span>
            </div>
          </div>
        </div>

        {!result && (
          <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMid, margin: 0, lineHeight: 1.7 }}>
            Confirming marks the session complete, runs the Stripe payout immediately via the payment service,
            and publishes a <code style={{ backgroundColor: colors.cardBg, padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>class.completed</code> event for any downstream consumers.
          </p>
        )}

        {/* Result banner */}
        {result && (
          <div style={{
            backgroundColor: result.success ? '#e6f4f1' : '#fdecea',
            borderRadius:    radius.md,
            padding:         '16px 20px',
            display:         'flex',
            flexDirection:   'column',
            gap:             8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{result.success ? '🎉' : '⚠️'}</span>
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 15, color: result.success ? colors.teal : colors.error }}>
                {result.success ? 'Payout triggered successfully!' : 'Something went wrong'}
              </span>
            </div>
            {result.message && (
              <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid, lineHeight: 1.6 }}>{result.message}</span>
            )}
            {result.total_bookings !== undefined && (
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
                  <strong>{result.total_bookings}</strong> bookings
                </span>
                <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
                  <strong>{result.total_credits_used}</strong> credits redeemed
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex:            1,
              padding:         '15px 0',
              borderRadius:    radius.pill,
              border:          `1.5px solid ${colors.brownLight}`,
              backgroundColor: 'transparent',
              fontFamily:      fonts.sans,
              fontWeight:      600,
              fontSize:        15,
              color:           colors.brownDark,
              cursor:          'pointer',
            }}
          >
            {result ? 'Close' : 'Cancel'}
          </button>
          {!result && (
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex:            2,
                padding:         '15px 0',
                borderRadius:    radius.pill,
                border:          'none',
                backgroundColor: loading ? colors.brownLight : colors.brownDark,
                fontFamily:      fonts.sans,
                fontWeight:      700,
                fontSize:        15,
                color:           colors.white,
                cursor:          loading ? 'not-allowed' : 'pointer',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             8,
              }}
            >
              {loading
                ? <><span style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}>⟳</span> Processing…</>
                : '💸 Confirm & Pay Out'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp  { from { transform: translateX(-50%) translateY(20px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }
        @keyframes spin     { to { transform: rotate(360deg) } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

// ── Session History Card ──────────────────────────────────────────────────────
function SessionCard({ cls, onPayout, alreadyPaid }) {
  const { month, day } = formatDate(cls.date)
  const booked         = cls.capacity - cls.available_slots
  const dayLabel       = relativeDay(cls.date)
  const timeStr        = cls.start_time?.slice(0, 5) ?? '--:--'

  return (
    <div style={{
      backgroundColor: colors.cardBg,
      borderRadius:    radius.lg,
      overflow:        'hidden',
      boxShadow:       shadows.card,
      animation:       'fadeSlide 0.4s ease both',
    }}>
      {/* Top stripe */}
      <div style={{
        height:          3,
        background:      alreadyPaid
          ? `linear-gradient(90deg, ${colors.teal}, ${colors.tealLight})`
          : `linear-gradient(90deg, ${colors.brownMid}, #e29578)`,
      }} />

      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                fontFamily:    fonts.sans,
                fontSize:      11,
                fontWeight:    600,
                color:         colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                {dayLabel} • {timeStr}
              </span>
            </div>
            <span style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 18, color: colors.textDark }}>
              {cls.class_name}
            </span>
          </div>

          {/* Date badge */}
          <div style={{
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            width:           48,
            height:          52,
            borderRadius:    radius.md,
            backgroundColor: colors.cardAlt,
            flexShrink:      0,
          }}>
            <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 10, color: colors.brownDark, textTransform: 'uppercase' }}>{month}</span>
            <span style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 18, color: colors.brownDark }}>{day}</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { label: 'Students',  value: `${booked}/${cls.capacity}` },
            { label: 'Duration',  value: `${cls.duration}m`          },
            { label: 'Credits',   value: `${booked} used`            },
          ].map((stat, i) => (
            <div key={i} style={{
              flex:          1,
              display:       'flex',
              flexDirection: 'column',
              gap:           2,
              paddingLeft:   i > 0 ? 12 : 0,
              borderLeft:    i > 0 ? `1px solid ${colors.brownLight}` : 'none',
              marginLeft:    i > 0 ? 12 : 0,
            }}>
              <span style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.7 }}>{stat.label}</span>
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, color: colors.textDark }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Action row */}
        {alreadyPaid ? (
          <div style={{
            display:         'flex',
            alignItems:      'center',
            gap:             6,
            backgroundColor: '#e6f4f1',
            borderRadius:    radius.pill,
            padding:         '8px 16px',
            alignSelf:       'flex-start',
          }}>
            <span style={{ fontSize: 14 }}>✓</span>
            <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 12, color: colors.teal }}>
              Marked complete
            </span>
          </div>
        ) : (
          <button
            onClick={() => onPayout(cls)}
            style={{
              width:           '100%',
              padding:         '12px 0',
              borderRadius:    radius.pill,
              border:          'none',
              background:      `linear-gradient(135deg, ${colors.brownDark} 0%, ${colors.brownMid} 100%)`,
              fontFamily:      fonts.sans,
              fontWeight:      700,
              fontSize:        13,
              color:           colors.white,
              cursor:          'pointer',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             6,
              letterSpacing:   0.3,
            }}
          >
            💸 Complete & Trigger Payout
          </button>
        )}
      </div>
    </div>
  )
}

// ── AdminHomepage ─────────────────────────────────────────────────────────────
export default function AdminHomepage() {
  const [scheduledClasses,  setScheduledClasses]  = useState([])
  const [completedClasses,  setCompletedClasses]  = useState([])
  const [paidOutIds,        setPaidOutIds]         = useState(new Set())
  const [provider,          setProvider]           = useState(null)
  const [loadingClasses,    setLoadingClasses]     = useState(true)
  const [selectedClass,     setSelectedClass]      = useState(null)
  const [payoutLoading,     setPayoutLoading]      = useState(false)
  const [payoutResult,      setPayoutResult]       = useState(null)
  const [toast,             setToast]              = useState(null)

  function loadClasses() {
    return fetchClasses(PROVIDER_ID)
      .then(list => {
        setScheduledClasses(list.filter(c => c.status === 'Scheduled'))
        setCompletedClasses(list.filter(c => c.status === 'Completed'))
      })
      .catch(err => console.error('Failed to fetch classes:', err))
  }

  useEffect(() => {
    loadClasses().finally(() => setLoadingClasses(false))
    fetchProviderDetails(PROVIDER_ID).then(setProvider).catch(() => {})
  }, [])

  function openPayoutModal(cls) {
    setSelectedClass(cls)
    setPayoutResult(null)
  }

  function closeModal() {
    const wasSuccess = payoutResult?.success
    setSelectedClass(null)
    setPayoutResult(null)
    if (wasSuccess) {
      loadClasses()
    }
  }

  async function handleCompleteClass() {
    if (!selectedClass) return
    setPayoutLoading(true)
    try {
      const data = await completeClass(selectedClass.class_id)
      const stripe = data.payout?.stripe
      const rabbitOk = data.payout?.rabbitmq_published

      if (data.success) {
        setPaidOutIds(prev => new Set([...prev, selectedClass.class_id]))
      }

      if (!data.payout) {
        setPayoutResult({
          success:            true,
          message:            'Class marked completed. If payout does not appear in Stripe, ensure class-service, user-service, and payment-service can reach each other.',
          total_bookings:     data.total_bookings,
          total_credits_used: data.total_credits_used,
        })
        setToast({ message: 'Class completed', type: 'success' })
        return
      }

      if (stripe?.ok) {
        const extra = !rabbitOk ? ' (RabbitMQ publish failed — check class-service logs.)' : ''
        setPayoutResult({
          success:            true,
          message:            stripe.skipped
            ? `Class completed. ${stripe.detail ?? 'No credits to pay out.'}${extra}`
            : `Stripe payout succeeded.${stripe.transfer_id ? ` Transfer ${stripe.transfer_id}.` : ''}${extra}`,
          total_bookings:     data.total_bookings,
          total_credits_used: data.total_credits_used,
        })
        setToast({
          message: stripe.skipped ? 'Class completed (no payout)' : 'Payout completed',
          type:    'success',
        })
        return
      }

      setPayoutResult({
        success:            false,
        message:            stripe?.detail ?? 'Stripe payout did not complete. The class is still marked completed.',
        total_bookings:     data.total_bookings,
        total_credits_used: data.total_credits_used,
      })
      setToast({ message: 'Class completed — Stripe payout failed', type: 'error' })
    } catch (err) {
      setPayoutResult({ success: false, message: err.message })
      setToast({ message: 'Could not complete class', type: 'error' })
    } finally {
      setPayoutLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ── Welcome Hero ─────────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 13, color: 'rgba(111,55,32,0.7)', textTransform: 'uppercase', letterSpacing: 1.4 }}>
            Welcome back
          </span>
          <div>
            <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: colors.textDark, margin: 0, lineHeight: 1.25 }}>Good Morning,</h1>
            <h1 style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: colors.brownDark, margin: 0, lineHeight: 1.25 }}>
              {provider?.name ?? 'Elena'}.
            </h1>
          </div>
          <p style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.textMid, margin: 0, lineHeight: 1.6 }}>
            {loadingClasses
              ? 'Loading your schedule…'
              : `You have ${scheduledClasses.length} scheduled class${scheduledClasses.length !== 1 ? 'es' : ''}.`}
          </p>
        </section>

        {/* ── Upcoming Schedule ────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>
            Upcoming Schedule
          </h2>

          {loadingClasses
            ? <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted }}>Loading…</p>
            : scheduledClasses.length === 0
              ? <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted }}>No scheduled classes.</p>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {scheduledClasses.map((cls, i) => {
                    const { month, day } = formatDate(cls.date)
                    const booked = cls.capacity - cls.available_slots
                    return (
                      <div key={cls.class_id} style={{ position: 'relative' }}>
                        <ClassCard
                          month={month}
                          day={day}
                          title={cls.class_name}
                          time={cls.start_time?.slice(0, 5) ?? '--:--'}
                          students={`${booked} / ${cls.capacity} Students`}
                          isActive={i === 0}
                        />
                        <button
                          onClick={() => openPayoutModal(cls)}
                          style={{
                            position:        'absolute',
                            bottom:          16,
                            right:           52,
                            backgroundColor: colors.green,
                            color:           colors.white,
                            fontFamily:      fonts.sans,
                            fontWeight:      600,
                            fontSize:        11,
                            border:          'none',
                            borderRadius:    radius.pill,
                            padding:         '6px 14px',
                            cursor:          'pointer',
                          }}
                        >
                          Complete & Pay Out
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
          }
        </section>

        {/* ── Session History ───────────────────────────── */}
        {(loadingClasses || completedClasses.length > 0) && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>
                  Session History
                </h2>
                <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted }}>
                  {completedClasses.length} completed class{completedClasses.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Pending payout badge */}
              {completedClasses.some(c => !paidOutIds.has(c.class_id)) && (
                <div style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             6,
                  backgroundColor: '#fff3e0',
                  borderRadius:    radius.pill,
                  padding:         '6px 14px',
                }}>
                  <span style={{ fontSize: 12 }}>⏳</span>
                  <span style={{
                    fontFamily:    fonts.sans,
                    fontSize:      11,
                    fontWeight:    700,
                    color:         '#e65100',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    Payout pending
                  </span>
                </div>
              )}
            </div>

            {loadingClasses ? (
              <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted }}>Loading…</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {completedClasses.map(cls => (
                  <SessionCard
                    key={cls.class_id}
                    cls={cls}
                    onPayout={openPayoutModal}
                    alreadyPaid={paidOutIds.has(cls.class_id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Recent Reviews ───────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>Recent Reviews</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={13} color="#e29578" />
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, color: colors.brownDark }}>4.9</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {REVIEWS.map((r, i) => <ReviewCard key={i} {...r} />)}
          </div>
        </section>
      </main>

      {/* ── Payout Modal ──── */}
      {selectedClass && (
        <PayoutModal
          cls={selectedClass}
          onClose={closeModal}
          onConfirm={handleCompleteClass}
          loading={payoutLoading}
          result={payoutResult}
        />
      )}

      {/* ── Toast ──── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideUp   { from { transform: translateX(-50%) translateY(20px); opacity: 0 } to { transform: translateX(-50%) translateY(0); opacity: 1 } }
        @keyframes spin      { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
