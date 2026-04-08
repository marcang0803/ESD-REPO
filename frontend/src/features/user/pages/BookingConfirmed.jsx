import Icon from '../components/Icon.jsx'
import { imgHPPowerYoga } from '../assets.js'

export default function BookingConfirmed({ setScreen }) {
  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, left: -80, width: 360, height: 360, borderRadius: 9999, background: '#ffb59a', filter: 'blur(80px)', opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 250, right: -80, width: 300, height: 300, borderRadius: 9999, background: '#e0e0fc', filter: 'blur(70px)', opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: -40, width: 280, height: 280, borderRadius: 9999, background: '#e29578', filter: 'blur(60px)', opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 28px 40px', textAlign: 'center' }}>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ position: 'absolute', inset: -16, borderRadius: 9999, background: 'rgba(226,149,120,0.15)', filter: 'blur(20px)' }} />
          <div style={{ width: 96, height: 96, borderRadius: 9999, background: 'linear-gradient(135deg, #8c4e35 0%, #e29578 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(140,78,53,0.3)', position: 'relative' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 8px' }}>You're all set</p>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 30, fontWeight: 600, color: '#380d00', margin: '0 0 8px', lineHeight: 1.2 }}>Booking Confirmed!</h1>
        <p style={{ fontSize: 14, color: '#7a5a52', margin: '0 0 36px', lineHeight: 1.6 }}>Your session has been booked. See you there!</p>
        <div style={{ width: '100%', background: 'white', borderRadius: 28, overflow: 'hidden', boxShadow: '0 8px 32px rgba(140,78,53,0.09)', marginBottom: 16 }}>
          <div style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
            <img src={imgHPPowerYoga} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,28,28,0.4)' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>Your Session</p>
              <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 16, color: 'white', fontWeight: 600, margin: 0 }}>Morning Reformer</p>
            </div>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: 'time', label: 'Date & Time', value: 'Friday 11 April • 08:30 AM' },
              { icon: 'person', label: 'Instructor', value: 'Marcus Thorne' },
              { icon: 'location', label: 'Location', value: 'Studio A, West Mall' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'rgba(140,78,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={item.icon} size={13} color="#8c4e35" />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#a0736a', letterSpacing: 0.8, textTransform: 'uppercase', margin: '0 0 1px' }}>{item.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1c1c', margin: 0 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,219,206,0.35)', padding: '13px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#53433e', fontWeight: 500 }}>Credits deducted</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#8c4e35', fontFamily: "'Noto Serif', Georgia, serif" }}>− 15</span>
          </div>
        </div>
        <div style={{ width: '100%', background: 'rgba(246,199,126,0.15)', border: '1.5px solid rgba(246,199,126,0.4)', borderRadius: 20, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, textAlign: 'left' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#c8841c" strokeWidth="1.6" /><path d="M12 8v4M12 16h.01" stroke="#c8841c" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <p style={{ fontSize: 12, color: '#7a5a52', margin: 0, lineHeight: 1.5 }}>Free cancellation up to <strong style={{ color: '#8c4e35' }}>12 hours</strong> before your session.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <button onClick={() => setScreen('bookings')} style={{ width: '100%', background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '18px 0', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 10px 24px rgba(140,78,53,0.25)' }}>View My Bookings</button>
          <button onClick={() => setScreen('homepage')} style={{ width: '100%', background: 'transparent', border: '1.5px solid rgba(140,78,53,0.2)', borderRadius: 9999, padding: '18px 0', fontSize: 15, fontWeight: 500, color: '#8c4e35', cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}
