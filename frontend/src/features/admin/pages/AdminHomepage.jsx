import { useEffect, useState } from 'react'
import TopAppBar  from '../components/TopAppBar.jsx'
import ClassCard  from '../components/ClassCard.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import Icon       from '../components/Icons.jsx'
import { colors, fonts, radius, shadows } from '../tokens.js'
import { completeClass, fetchClasses, fetchProviderDetails } from '../../user/api.js'

const PROVIDER_ID    = 1
const imgReviewer1   = '/assets/img/elena-vance.png'
const imgReviewer2   = '/assets/img/elena-user.png'

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

// ── Payout Modal ──────────────────────────────────────────────────────────────
function PayoutModal({ cls, onClose, onConfirm, loading, result }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 28, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.textDark, margin: 0 }}>
          Complete Class & Trigger Payout
        </h2>
        <div style={{ backgroundColor: colors.cardBg, borderRadius: radius.md, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 16, color: colors.textDark }}>{cls.class_name}</span>
          <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>Class ID: {cls.class_id}</span>
          <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>
            Booked: {cls.capacity - cls.available_slots} / {cls.capacity} students
          </span>
        </div>
        <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMid, margin: 0, lineHeight: 1.6 }}>
          This will mark the class as <strong>Completed</strong> and publish a{' '}
          <code>class.completed</code> event to RabbitMQ. The pay-provider service will
          process a Stripe payout to the provider automatically.
        </p>
        {result && (
          <div style={{ backgroundColor: result.success ? '#e6f4f1' : '#fdecea', borderRadius: radius.md, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, color: result.success ? colors.green : colors.error }}>
              {result.success ? '✓ Payout triggered successfully' : '✗ Failed'}
            </span>
            {result.message && <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>{result.message}</span>}
            {result.total_bookings !== undefined && (
              <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>
                Total bookings: {result.total_bookings} · Credits used: {result.total_credits_used}
              </span>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px 0', borderRadius: radius.pill, border: `1.5px solid ${colors.brownLight}`, backgroundColor: 'transparent', fontFamily: fonts.sans, fontWeight: 600, fontSize: 15, color: colors.brownDark, cursor: 'pointer' }}>
            {result ? 'Close' : 'Cancel'}
          </button>
          {!result && (
            <button onClick={onConfirm} disabled={loading}
              style={{ flex: 1, padding: '14px 0', borderRadius: radius.pill, border: 'none', backgroundColor: loading ? colors.brownLight : colors.brownDark, fontFamily: fonts.sans, fontWeight: 600, fontSize: 15, color: colors.white, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing…' : 'Confirm & Pay Out'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── AdminHomepage ─────────────────────────────────────────────────────────────
export default function AdminHomepage() {
  const [classes,        setClasses]        = useState([])
  const [provider,       setProvider]       = useState(null)
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [selectedClass,  setSelectedClass]  = useState(null)
  const [payoutLoading,  setPayoutLoading]  = useState(false)
  const [payoutResult,   setPayoutResult]   = useState(null)

  useEffect(() => {
    fetchClasses()
      .then(list => setClasses(list.filter(c => c.status === 'Scheduled')))
      .catch(err => console.error('Failed to fetch classes:', err))
      .finally(() => setLoadingClasses(false))

    fetchProviderDetails(PROVIDER_ID)
      .then(setProvider)
      .catch(() => {})
  }, [])

  function openPayoutModal(cls) {
    setSelectedClass(cls)
    setPayoutResult(null)
  }

  function closeModal() {
    setSelectedClass(null)
    setPayoutResult(null)
    // Refresh classes so completed ones disappear
    fetchClasses()
      .then(list => setClasses(list.filter(c => c.status === 'Scheduled')))
      .catch(() => {})
  }

  async function handleCompleteClass() {
    if (!selectedClass) return
    setPayoutLoading(true)
    try {
      const data = await completeClass(selectedClass.class_id)
      setPayoutResult({
        success:            true,
        message:            'Class marked as Completed. RabbitMQ event published — Stripe payout is being processed.',
        total_bookings:     data.total_bookings,
        total_credits_used: data.total_credits_used,
      })
    } catch (err) {
      setPayoutResult({ success: false, message: err.message })
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
              : `You have ${classes.length} scheduled class${classes.length !== 1 ? 'es' : ''}.`}
          </p>
        </section>

        {/* ── Upcoming Schedule ────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>Upcoming Schedule</h2>
          </div>

          {loadingClasses
            ? <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted }}>Loading…</p>
            : classes.length === 0
              ? <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted }}>No scheduled classes.</p>
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {classes.map((cls, i) => {
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
                        <button onClick={() => openPayoutModal(cls)}
                          style={{ position: 'absolute', bottom: 16, right: 52, backgroundColor: colors.green, color: colors.white, fontFamily: fonts.sans, fontWeight: 600, fontSize: 11, border: 'none', borderRadius: radius.pill, padding: '6px 14px', cursor: 'pointer' }}>
                          Complete & Pay Out
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
          }
        </section>

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

      {selectedClass && (
        <PayoutModal
          cls={selectedClass}
          onClose={closeModal}
          onConfirm={handleCompleteClass}
          loading={payoutLoading}
          result={payoutResult}
        />
      )}
    </div>
  )
}
