import Icon from '../components/Icon.jsx'
import { imgElenaVance, imgHPPowerYoga } from '../assets.js'

export default function ClassDetails({ setScreen, goBack }) {
  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 120 }}>
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={imgHPPowerYoga} alt="Morning Reformer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
        <button onClick={() => goBack?.()} style={{ position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button style={{ position: 'absolute', top: 52, right: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h14v17l-7-4-7 4V4z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: 22, right: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', margin: '0 0 4px' }}>Yoga • Low Intensity</p>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 26, fontWeight: 600, color: 'white', margin: 0 }}>Morning Reformer</h1>
        </div>
      </div>
      <div style={{ padding: '24px 20px 20px', position: 'relative', marginTop: -20, background: '#f8f4f1', borderRadius: '28px 28px 0 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 0, background: 'white', borderRadius: 20, padding: '16px 0', marginBottom: 20, boxShadow: '0 4px 16px rgba(140,78,53,0.07)' }}>
          {[
            { label: 'Duration', value: '50 min' },
            { label: 'Difficulty', value: 'Intermediate' },
            { label: 'Spots Left', value: '8' },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(140,78,53,0.1)' : 'none', padding: '0 8px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1c1c', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ background: 'rgba(246,199,126,0.15)', border: '1.5px solid #f6c77e', borderRadius: 12, padding: '6px 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#8c4e35' }}>15 Credits</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={12} color="#e29578" />)}
            <span style={{ fontSize: 12, color: '#53433e', marginLeft: 4, fontWeight: 500 }}>4.9</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 18, color: '#1a1c1c', margin: '0 0 10px' }}>About This Class</h3>
          <p style={{ fontSize: 14, color: '#53433e', lineHeight: 1.7, margin: 0 }}>
            A dynamic morning flow designed to energise your body and centre your mind. This 50-minute session blends classical reformer exercises with mindful breathing for a deeply restorative practice.
          </p>
        </div>
        <div style={{ background: 'white', borderRadius: 24, padding: '18px 20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(140,78,53,0.05)' }}>
          <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 16, color: '#1a1c1c', margin: '0 0 14px' }}>Session Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'time', text: 'Friday 11 April • 08:30 AM' },
              { icon: 'person', text: 'Lead: Marcus Thorne' },
              { icon: 'location', text: 'Studio A, West Mall' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'rgba(140,78,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={item.icon} size={14} color="#8c4e35" />
                </div>
                <span style={{ fontSize: 14, color: '#53433e' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 24, padding: '18px 20px', boxShadow: '0 4px 16px rgba(140,78,53,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'linear-gradient(135deg, #e29578, #8c4e35)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={imgElenaVance} alt="Marcus" style={{ width: '158%', height: '202%', objectFit: 'cover', marginLeft: '-18%', marginTop: '-3%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 2px' }}>Instructor</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1c1c', margin: 0 }}>Marcus Thorne</p>
              <p style={{ fontSize: 12, color: '#7a5a52', margin: 0 }}>Certified Pilates & Yoga Instructor • 8 yrs</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 430px)', padding: '14px 20px 32px', background: 'rgba(248,244,241,0.95)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <button onClick={() => setScreen('confirmBooking')} style={{ width: '100%', background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '18px 0', fontSize: 16, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 10px 24px rgba(140,78,53,0.3)' }}>
          Book Now • 15 Credits
        </button>
      </div>
    </div>
  )
}
