import Icon from '../components/Icon.jsx'

export default function CancelBooking({ setScreen, goBack }) {
  return (
    <div style={{ background: '#f9f9f9', minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -192, left: -96, width: 500, height: 500, borderRadius: 250, background: '#f6d0c2', filter: 'blur(40px)', opacity: 0.08, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 184, left: 9, width: 500, height: 500, borderRadius: 250, background: '#e29578', filter: 'blur(40px)', opacity: 0.08, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: -221, width: 400, height: 400, borderRadius: 200, background: '#e29578', filter: 'blur(40px)', opacity: 0.08, pointerEvents: 'none' }} />
      <div style={{ position: 'sticky', top: 0, height: 64, display: 'flex', alignItems: 'center', paddingLeft: 16, backdropFilter: 'blur(12px)', zIndex: 10, background: 'rgba(249,249,249,0.7)', boxShadow: '0 20px 50px rgba(140,78,53,0.04)' }}>
        <button onClick={() => goBack?.()} style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(140,78,53,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#1a1c1c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div style={{ padding: '24px 24px 48px', display: 'flex', flexDirection: 'column', gap: 21 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 9999, background: '#ffdbce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8c4e35" strokeWidth="1.6" /><path d="M12 8v4M12 16h.01" stroke="#8c4e35" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <h1 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: 24, color: '#1a1c1c', margin: 0, textAlign: 'center', letterSpacing: -0.6 }}>Time-Sensitive Policy</h1>
          <div style={{ background: 'white', borderRadius: 32, padding: '22px 24px 24px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: '#8c4e35' }} />
            <p style={{ fontSize: 14, color: '#53433e', margin: '0 0 8px', textAlign: 'center', lineHeight: 1.625 }}>
              Cancellation within 12 hours: <strong style={{ color: '#8c4e35' }}>20 credits will be forfeited.</strong>
            </p>
            <p style={{ fontSize: 12, color: '#5d5f5f', margin: 0, textAlign: 'center', fontStyle: 'italic', opacity: 0.7, lineHeight: 1.33 }}>
              Late cancellation window: Under 8 hours remaining.
            </p>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 32, padding: 32, boxShadow: '0 30px 60px rgba(140,78,53,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -16, right: -16, width: 96, height: 96, borderRadius: 9999, background: 'rgba(226,149,120,0.1)', filter: 'blur(20px)' }} />
          <p style={{ fontSize: 10, color: '#5d5f5f', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 8px' }}>Booking Details</p>
          <h2 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: 24, color: '#1a1c1c', margin: '0 0 16px', lineHeight: 1.25 }}>Solar Vinyasa Flow</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8 }}>
            {[
              { icon: 'time', text: '11 April, 08:30 AM' },
              { icon: 'person', text: 'Julian Sol' },
              { icon: 'pin', text: 'Jal Yoga Singapore' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Icon name={item.icon} size={14} color="#8c4e35" />
                <span style={{ fontSize: 16, color: '#53433e' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(83,67,62,0.7)', textAlign: 'center', maxWidth: 248, lineHeight: 1.625, margin: '0 auto' }}>
          By confirming, you acknowledge that your session credits will be <strong>forfeited</strong>.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <button onClick={() => setScreen('bookingCancellation')} style={{ width: '100%', background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '20px 0', fontSize: 16, fontWeight: 500, color: 'white', cursor: 'pointer', letterSpacing: 0.4, boxShadow: '0 10px 15px -3px rgba(140,78,53,0.2), 0 4px 6px -4px rgba(140,78,53,0.2)' }}>Confirm Cancellation</button>
          <button onClick={() => goBack?.()} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(140,78,53,0.2)', borderRadius: 9999, padding: '21px 0', fontSize: 16, fontWeight: 500, color: '#8c4e35', cursor: 'pointer', letterSpacing: 0.4 }}>Go Back</button>
        </div>
      </div>
    </div>
  )
}
