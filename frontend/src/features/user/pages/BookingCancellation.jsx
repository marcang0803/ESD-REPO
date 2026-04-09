import Icon from '../components/Icon.jsx'

function formatCredits(amount) {
  if (!Number.isFinite(amount)) return null
  return `${amount} credit${amount === 1 ? '' : 's'}`
}

export default function BookingCancellation({ setScreen, lastCancellation }) {
  const result = lastCancellation?.result
  const booking = lastCancellation?.booking
  const refunded = result?.refund_policy === 'refund'
  const walletAmount = Number(result?.wallet?.amount)
  const walletBalance = Number(result?.wallet?.balance)
  const balanceLabel = Number.isFinite(walletBalance) ? walletBalance.toLocaleString() : null
  const refundLabel = formatCredits(walletAmount)

  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, left: -100, width: 340, height: 340, borderRadius: 9999, background: '#ffb59a', filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 200, right: -80, width: 280, height: 280, borderRadius: 9999, background: '#e0e0fc', filter: 'blur(70px)', opacity: 0.15, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 120, left: -60, width: 260, height: 260, borderRadius: 9999, background: '#e29578', filter: 'blur(60px)', opacity: 0.15, pointerEvents: 'none' }} />
      <button onClick={() => setScreen('bookings')} style={{ position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <Icon name="x" size={14} color="#1a1c1c" />
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '120px 28px 100px', textAlign: 'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 9999, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 12px 40px rgba(140,78,53,0.14)' }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M22 7C22 7 17 15 17 22C17 26.1 19.2 29.7 22 32C24.8 29.7 27 26.1 27 22C27 15 22 7 22 7Z" fill="#e29578" opacity="0.9" />
            <path d="M7 22C7 22 15 17 22 17C26.1 17 29.7 19.2 32 22C29.7 24.8 26.1 27 22 27C15 27 7 22 7 22Z" fill="#e29578" opacity="0.6" />
            <path d="M12 10C12 10 17 16 17 22C17 26.1 18.9 29.6 22 32C18.5 33.5 14.3 32.4 11.8 29.6C9.1 26.7 8.5 21.7 12 10Z" fill="#cc8368" opacity="0.7" />
            <path d="M32 10C32 10 27 16 27 22C27 26.1 25.1 29.6 22 32C25.5 33.5 29.7 32.4 32.2 29.6C34.9 26.7 35.5 21.7 32 10Z" fill="#cc8368" opacity="0.7" />
            <circle cx="22" cy="22" r="3" fill="#8c4e35" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 28, fontWeight: 600, color: '#380d00', margin: '0 0 10px', lineHeight: 1.25 }}>
          {result?.success ? 'Cancellation Confirmed' : 'No Cancellation Result'}
        </h1>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1c1c', margin: '0 0 8px' }}>{booking?.name || 'Your selected booking'}</p>
        <p style={{ fontSize: 14, color: refunded ? '#2e7d32' : 'rgba(186,26,26,0.67)', margin: '0 0 32px', fontWeight: 500 }}>
          {refunded
            ? 'Booking cancelled. Credits refunded.'
            : 'Booking cancelled. Credits forfeited due to late cancellation.'}
        </p>
        <div style={{ width: '100%', background: 'white', borderRadius: 28, padding: '20px 20px 22px', boxShadow: '0 4px 20px rgba(140,78,53,0.07)', marginBottom: 36, textAlign: 'left' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#53433e', margin: '0 0 14px' }}>Backend Response</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#8c4e35' }}>Composite message</p>
              <p style={{ margin: 0, fontSize: 14, color: '#53433e', lineHeight: 1.5 }}>{result?.message || 'No response available.'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#8c4e35' }}>Refund policy</p>
              <p style={{ margin: 0, fontSize: 14, color: '#53433e', lineHeight: 1.5, textTransform: 'capitalize' }}>{result?.refund_policy || 'Unavailable'}</p>
            </div>
            {result?.wallet?.message ? (
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#8c4e35' }}>Wallet response</p>
                <p style={{ margin: 0, fontSize: 14, color: '#53433e', lineHeight: 1.5 }}>{result.wallet.message}</p>
              </div>
            ) : null}
            {balanceLabel ? (
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#8c4e35' }}>Updated credit balance</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1c1c' }}>{balanceLabel}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <button onClick={() => setScreen('bookings')} style={{ width: '100%', background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '18px 0', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 10px 24px rgba(140,78,53,0.25)' }}>Back to My Bookings</button>
          <button onClick={() => setScreen('explore')} style={{ width: '100%', background: 'transparent', border: '1.5px solid rgba(140,78,53,0.2)', borderRadius: 9999, padding: '18px 0', fontSize: 15, fontWeight: 500, color: '#8c4e35', cursor: 'pointer' }}>Explore New Classes</button>
        </div>
      </div>
    </div>
  )
}
