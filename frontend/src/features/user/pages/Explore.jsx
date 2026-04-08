import { imgEXHiit, imgEXMeditation, imgEXPilates, imgElenaVance } from '../assets.js'
import Icon from '../components/Icon.jsx'

export default function Explore({ setScreen }) {
  const classes = [
    { img: imgEXPilates, spots: '8 SPOTS LEFT', name: 'Morning Reformer', credits: '15 Credits', desc: 'A low-impact, high-intensity session focusing on core stability and alignment.', type: 'Pilates • Med', duration: '50 mins', instructor: 'Sasha Gray' },
    { img: imgEXHiit, spots: '2 SPOTS LEFT', name: 'Ignite HIIT', credits: '25 Credits', desc: 'Push your limits with high-octane intervals designed to boost metabolism.', type: 'HIIT • High', duration: '40 mins', instructor: 'David Chen' },
    { img: imgEXMeditation, spots: '5 SPOTS LEFT', name: 'Lunar Yin Yoga', credits: '18 Credits', desc: 'A restorative practice focused on deep connective tissue and meditation.', type: 'Yoga • Low', duration: '60 mins', instructor: 'Aria Veda' },
  ]

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100%', paddingBottom: 108, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -292, left: -20, width: 640, height: 640, borderRadius: 9999, background: 'rgba(255,181,154,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 1170, right: -39, width: 560, height: 560, borderRadius: 9999, background: 'rgba(196,196,223,0.1)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, overflow: 'hidden', border: '2px solid rgba(226,149,120,0.3)', background: '#e8e8e8' }}>
            <img src={imgElenaVance} alt="Elena" style={{ width: '164%', height: '209%', objectFit: 'cover', marginLeft: '-22%', marginTop: '-2%' }} />
          </div>
          <span style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 4, color: '#1a1c1c' }}>Radiant Sanctuary</span>
        </div>
        <Icon name="bell" size={22} color="#8c4e35" />
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ marginTop: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 9999, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px 0 rgba(140,78,53,0.06)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="7" stroke="rgba(140,78,53,0.5)" strokeWidth="1.5" /><path d="M15.5 15.5L20 20" stroke="rgba(140,78,53,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 16, color: 'rgba(140,78,53,0.4)', fontFamily: 'Georgia, serif', flex: 1 }}>Search</span>
            <button onClick={() => setScreen('filter')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke="rgba(140,78,53,0.5)" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1a1c1c', margin: '0 0 16px', letterSpacing: -0.75 }}>Explore Practices</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {classes.map((c) => (
              <div key={c.name} style={{ background: '#f1eae6', borderRadius: 28, padding: 14, overflow: 'hidden' }}>
                <div style={{ borderRadius: 18, overflow: 'hidden', height: 180, position: 'relative', marginBottom: 16 }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '161.5%', objectFit: 'cover', marginTop: '-30.7%' }} />
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', borderRadius: 9999, padding: '4px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#8c4e35' }}>{c.spots}</span>
                  </div>
                </div>
                <div style={{ padding: '0 8px 8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 19, fontFamily: 'Georgia, serif', color: '#1a1c1c' }}>{c.name}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#8c4e35' }}>{c.credits}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#5b5d74', fontWeight: 300, lineHeight: 1.6, margin: '0 0 14px' }}>{c.desc}</p>
                  <div style={{ borderTop: '1px solid rgba(216,194,186,0.15)', paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9z" stroke="#5b5d74" strokeWidth="1.5" /></svg>
                      <span style={{ fontSize: 12, color: '#5b5d74' }}>{c.type}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5b5d74" strokeWidth="1.5" /><path d="M12 7v5l3 3" stroke="#5b5d74" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      <span style={{ fontSize: 12, color: '#5b5d74' }}>{c.duration}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#5b5d74" strokeWidth="1.5" /></svg>
                      <span style={{ fontSize: 12, color: '#5b5d74' }}>{c.instructor}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setScreen('classDetails')} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(140,78,53,0.25)', borderRadius: 9999, padding: '12px 0', fontSize: 13, fontWeight: 600, color: '#8c4e35', cursor: 'pointer' }}>Details</button>
                    <button onClick={() => setScreen('confirmBooking')} style={{ flex: 1, background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '12px 0', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
