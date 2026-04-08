
import Icon from '../components/Icon.jsx'
import { imgElenaVance, imgHPPowerYoga } from '../assets.js'

export default function Homepage({ setScreen, user }) {
  return (
    <div style={{ background: '#f9f9f9', minHeight: '100%', paddingBottom: 108, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -26, left: -29, width: 480, height: 480, borderRadius: 9999, background: 'rgba(226,149,120,0.15)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9999, overflow: 'hidden', border: '2px solid rgba(226,149,120,0.3)', background: '#e8e8e8' }}>
            <img src={user?.img || imgElenaVance} alt="" style={{ width: '164%', height: '209%', objectFit: 'cover', marginLeft: '-22%', marginTop: '-2%' }} />
          </div>
          <span style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 4, color: '#1a1c1c' }}>Radiant Sanctuary</span>
        </div>
        <Icon name="bell" size={22} color="#8c4e35" />
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ paddingTop: 36 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: '#1a1c1c', letterSpacing: 0.9, lineHeight: 1.3 }}>
            <div>Good Morning,</div>
            <div style={{ color: '#8c4e35' }}>{user?.name || 'Elena'}.</div>
          </div>
          <p style={{ fontSize: 16, color: '#5b5d74', fontWeight: 300, lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
            Your morning radiance is reaching a peak. Take a moment to settle into the present.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1c1c', margin: '0 0 16px', letterSpacing: -0.6 }}>Your Next Practice</h2>
          <div style={{ background: '#f3f3f3', borderRadius: 28, padding: 4 }}>
            <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <img src={imgHPPowerYoga} alt="Solar Vinyasa Flow" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px 20px 16px' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#8c4e35', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 4px' }}>Tomorrow, 08:30 AM</p>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1c1c', margin: '0 0 12px' }}>Solar Vinyasa Flow</h3>
                <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#5b5d74" strokeWidth="1.5" /></svg>
                    <span style={{ fontSize: 14, color: '#5b5d74' }}>Marcus Thorne</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 20 }}>
                  <svg width="12" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" stroke="#5b5d74" strokeWidth="1.5" fill="none" /></svg>
                  <span style={{ fontSize: 14, color: '#5b5d74' }}>Sanctuary Studio A</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setScreen('classDetails')} style={{ flex: 1, background: '#e2e2e2', border: 'none', borderRadius: 9999, padding: '12px 0', fontSize: 14, fontWeight: 600, color: '#1a1c1c', cursor: 'pointer' }}>View Details</button>
                  <button onClick={() => setScreen('cancelBooking')} style={{ background: 'transparent', border: 'none', padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#5b5d74', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1a1c1c', margin: '0 0 16px', letterSpacing: -0.75 }}>Weekly Vitality</h2>

          <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 40, padding: 28, boxShadow: '0 20px 50px 0 rgba(140,78,53,0.05)', marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>Total Energy Burned</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 44, fontFamily: 'Georgia, serif', color: '#1a1c1c', lineHeight: 1 }}>2,450</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: '#e29578' }}>kcal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 7l5-6 5 6" stroke="#059669" strokeWidth="1.5" /></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>12% from last week</span>
            </div>
            <span style={{ background: 'rgba(140,78,53,0.1)', color: '#8c4e35', fontSize: 10, fontWeight: 600, padding: '6px 14px', borderRadius: 9999 }}>WEEKLY GOAL: 3,000</span>

            <div style={{ marginTop: 24, height: 140, position: 'relative' }}>
              <svg width="100%" height="140" viewBox="0 0 310 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e29578" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#e29578" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,110 C30,100 50,80 80,70 C110,60 130,90 160,60 C190,30 210,50 240,30 C270,10 290,40 310,35" stroke="#e29578" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M0,110 C30,100 50,80 80,70 C110,60 130,90 160,60 C190,30 210,50 240,30 C270,10 290,40 310,35 L310,140 L0,140 Z" fill="url(#chartGrad)" />
                <circle cx="240" cy="30" r="5" fill="#e29578" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                  <span key={d} style={{ fontSize: 10, color: i === 4 ? '#8c4e35' : '#5b5d74', fontWeight: 500 }}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {[
            { label: 'Active Minutes', value: '320', unit: 'min', icon: 'activeMinutes' },
            { label: 'Sessions Completed', value: '6', unit: 'Practices', icon: 'sessionsCompleted' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 40, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>{s.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 28, fontFamily: 'Georgia, serif', color: '#1a1c1c' }}>{s.value}</span>
                  <span style={{ fontSize: 14, color: '#5b5d74' }}>{s.unit}</span>
                </div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 9999, background: 'rgba(226,149,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <Icon name={s.icon} size={18} color="#8c4e35" />
              </div>
            </div>
          ))}

          <div style={{ background: 'rgba(140,78,53,0.05)', border: '1px solid rgba(140,78,53,0.1)', borderRadius: 40, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l2 7h7l-6 4 2 7-5-4-5 4 2-7-6-4h7z" fill="#e29578" /></svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#8c4e35', textTransform: 'uppercase', letterSpacing: 0.35 }}>Radiant Insight</span>
            </div>
            <p style={{ fontSize: 14, color: '#5b5d74', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
              You're <strong style={{ color: '#8c4e35' }}>82%</strong> towards your weekly goal. One more Solar Vinyasa session tomorrow will bring you to your peak performance zone!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
