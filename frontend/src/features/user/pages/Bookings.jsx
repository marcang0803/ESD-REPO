import Icon from '../components/Icon.jsx'
import { imgElenaVance, imgBreathwork, imgHPPowerYoga, imgMorningYoga } from '../assets.js'

export default function Bookings({ setScreen }) {
  const upcoming = [
    { img: imgHPPowerYoga, date: 'Fri 11 Apr', time: '08:30 AM', name: 'Morning Reformer', instructor: 'Marcus Thorne', location: 'Studio A, West Mall', credits: 15 },
    { img: imgMorningYoga, date: 'Sat 12 Apr', time: '09:00 AM', name: 'Solar Gratitude', instructor: 'Elena Thorne', location: 'ION Orchard', credits: 20 },
  ]
  const past = [
    { img: imgMorningYoga, date: 'Tue 8 Apr', name: 'Solar Gratitude', stars: 5, credits: -45 },
    { img: imgBreathwork, date: 'Sun 6 Apr', name: 'Lunar Breath', stars: 5, credits: -60 },
  ]

  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowX: 'hidden', paddingBottom: 120 }}>
      <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: 9999, background: 'rgba(226,149,120,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, overflow: 'hidden', border: '2px solid rgba(226,149,120,0.3)', background: '#e8e8e8' }}>
            <img src={imgElenaVance} alt="" style={{ width: '164%', height: '209%', objectFit: 'cover', marginLeft: '-22%', marginTop: '-2%' }} />
          </div>
          <span style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 4, color: '#1a1c1c' }}>Radiant Sanctuary</span>
        </div>
        <Icon name="bell" size={22} color="#8c4e35" />
      </div>
      <div style={{ padding: '0 24px' }}>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 28, fontWeight: 600, color: '#1a1c1c', margin: '24px 0 0' }}>Bookings</h1>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 20, color: '#1a1c1c', margin: 0 }}>Upcoming</h2>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8c4e35' }}>See all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcoming.map((b) => (
              <div key={b.name} onClick={() => setScreen('classDetails')} style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(140,78,53,0.07)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  <div style={{ width: 80, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    <img src={b.img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 100 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                  </div>
                  <div style={{ flex: 1, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 2px' }}>{b.date} • {b.time}</p>
                        <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 16, fontWeight: 600, color: '#1a1c1c', margin: 0 }}>{b.name}</p>
                      </div>
                      <div style={{ background: 'rgba(246,199,126,0.18)', border: '1.5px solid #f6c77e', borderRadius: 10, padding: '4px 8px', flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#8c4e35' }}>{b.credits} cr</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Icon name="person" size={11} color="#a0736a" />
                      <span style={{ fontSize: 12, color: '#7a5a52' }}>{b.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="pin" size={11} color="#a0736a" />
                        <span style={{ fontSize: 12, color: '#7a5a52' }}>{b.location}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setScreen('cancelBooking') }} style={{ fontSize: 11, fontWeight: 600, color: '#ba1a1a', background: 'rgba(186,26,26,0.06)', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 20, color: '#1a1c1c', margin: 0 }}>Past Sessions</h2>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#8c4e35' }}>View all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map((b) => (
              <div key={b.name + b.date} style={{ background: 'white', borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(140,78,53,0.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={b.img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, filter: 'saturate(0.7)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 1px' }}>{b.date}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1c1c', margin: '0 0 3px' }}>{b.name}</p>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: b.stars }).map((_, index) => <Icon key={index} name="star" size={9} color="#e29578" />)}
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#53433e', fontFamily: "'Noto Serif', Georgia, serif" }}>{b.credits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
