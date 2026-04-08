import { imgHPPowerYoga } from '../assets.js'

export default function ConfirmBooking({ setScreen, goBack }) {
  return (
    <div style={{ minHeight: '100%', background: '#1a1c1c', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <img src={imgHPPowerYoga} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,28,28,0.55)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, margin: '16px 16px 0', borderRadius: 48, overflow: 'hidden', height: 397, flexShrink: 0 }}>
        <img src={imgHPPowerYoga} alt="Morning Reformer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)' }} />
        <button onClick={() => goBack?.()} style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <div style={{ background: 'rgba(26,28,28,0.75)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 4px' }}>Yoga • Low Intensity</p>
                <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 20, color: 'white', margin: 0, lineHeight: 1.2 }}>Morning Reformer</h2>
              </div>
              <div style={{ background: 'transparent', border: '1.5px solid #f6c77e', borderRadius: 12, padding: '5px 10px', flexShrink: 0, marginLeft: 12, marginTop: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f6c77e' }}>15 cr</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 0, alignItems: 'center' }}>
              {[
                { label: 'Duration', value: '50 mins' },
                { label: 'Difficulty', value: 'Intermediate' },
                { label: 'Spots Left', value: '8' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center', padding: '0 4px' }}>
                  <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 2px' }}>{s.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'white', margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '48px 48px 0 0', marginTop: -28, padding: '32px 20px 120px', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)' }}>
        <div style={{ width: 40, height: 5, background: 'rgba(140,78,53,0.2)', borderRadius: 9999, margin: '-16px auto 28px' }} />
        <h1 style={{ fontFamily: "'Liberation Serif', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1a1c1c', margin: '0 0 4px 4px' }}>Confirm Your Session</h1>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 22px 4px' }}>Final Summary</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', height: 88 }}>
            <img src={imgHPPowerYoga} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,28,28,0.5)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Session</p>
              <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 17, color: 'white', margin: 0, fontWeight: 600 }}>Morning Reformer</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 20, padding: '14px 16px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 6px' }}>Time</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1c1c', margin: 0, lineHeight: 1.3 }}>11 Apr<br />08:30 AM</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 20, padding: '14px 16px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 6px' }}>Location</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1c1c', margin: 0, lineHeight: 1.3 }}>Studio A<br />West Mall</p>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,219,206,0.3)', borderRadius: 24, padding: '18px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#53433e' }}>Credit Balance</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#8c4e35', fontFamily: "'Noto Serif', Georgia, serif" }}>1,240</span>
          </div>
          <div style={{ height: 1, background: 'rgba(140,78,53,0.15)', marginBottom: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#7a5a52' }}>Booking Cost</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#8c4e35' }}>− 15 credits</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#7a5a52' }}>Remaining Balance</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#8c4e35', fontFamily: "'Noto Serif', Georgia, serif" }}>1,225</span>
          </div>
        </div>
        <button onClick={() => setScreen('bookingConfirmed')} style={{ width: '100%', background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '18px 0', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 10px 24px rgba(140,78,53,0.3)', marginBottom: 14 }}>Confirm Booking</button>
        <button onClick={() => goBack?.()} style={{ width: '100%', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: 'rgba(83,67,62,0.7)', cursor: 'pointer', letterSpacing: 0.3 }}>Cancel &amp; Go Back</button>
      </div>
    </div>
  )
}
