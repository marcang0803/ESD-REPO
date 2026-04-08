import { useState, useEffect } from 'react'
import { fetchUser } from '../api.js'
import StarRating from '../components/StarRating.jsx'
import UserSwitchAccountSheet from '../components/UserSwitchAccountSheet.jsx'
import { imgBreathwork, imgDeepHealing, imgElenaVance, imgMorningYoga, imgVinyasa } from '../assets.js'
import Icon from '../components/Icon.jsx'


export default function Profile({ onSwitchToAdmin }) {
  const [showSwitchSheet, setShowSwitchSheet] = useState(false)
  const [user, setUser] = useState({ name: 'Loading...', img: null })
  // For loading user 1001 into the demo, change to another user if you want to
  useEffect(() => {
    fetchUser(1001)
      .then((data) => setUser({ name: data.name || 'Unknown', img: data.img || null }))
      .catch(() => setUser({ name: 'Unknown', img: null }))
  }, [])

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100%', paddingBottom: 112, position: 'relative', overflow: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div style={{ position: 'absolute', top: -178, left: -39, width: 195, height: 888, borderRadius: 9999, background: 'rgba(255,181,154,0.1)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 710, right: -20, width: 156, height: 710, borderRadius: 9999, background: 'rgba(196,196,223,0.1)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 0' }}>
        <span style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 4, color: '#1a1c1c' }}>Radiant Sanctuary</span>
        <Icon name="bell" size={22} color="#8c4e35" />
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, gap: 8 }}>
          <div style={{ position: 'relative', width: 128, height: 128 }}>
            <div style={{ position: 'absolute', inset: -32, background: 'rgba(226,149,120,0.2)', borderRadius: 9999, filter: 'blur(32px)' }} />
            <div style={{ width: 128, height: 128, borderRadius: 9999, background: 'linear-gradient(45deg, #8c4e35 0%, #e29578 100%)', padding: 4, boxShadow: '0 0 40px 10px rgba(226,149,120,0.2)', position: 'relative' }}>
              <div style={{ borderRadius: 9999, border: '4px solid #f9f9f9', overflow: 'hidden', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                <img src={user.img || imgElenaVance} alt={user.name} style={{ width: '158%', height: '202%', objectFit: 'cover', marginLeft: '-18%', marginTop: '-3%' }} />
              </div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 'bold', color: '#1a1c1c', margin: '8px 0 0', letterSpacing: -0.9 }}>{user.name}</h1>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 'bold', color: '#1a1c1c', margin: 0 }}>Saved Classes</h2>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#8c4e35', letterSpacing: 1.2, textTransform: 'uppercase' }}>See all</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollSnapType: 'x proximity', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{'div::-webkit-scrollbar { display: none; }'}</style>
            {[
              { img: imgDeepHealing, label: 'Meditation', title: 'Eternal Echoes: Deep Healing' },
              { img: imgVinyasa, label: 'Yoga', title: 'Sunlit Vinyasa Flow' },
            ].map((item) => (
              <div key={item.title} style={{ width: 224, flexShrink: 0, scrollSnapAlign: 'start' }}>
                <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 24px rgba(140,78,53,0.08)', border: '1px solid rgba(255,255,255,0.7)' }}>
                  <div style={{ height: 112, position: 'relative', overflow: 'hidden' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.84)', borderRadius: 9999, padding: '5px 7px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#8c4e35"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </div>
                  </div>
                  <div style={{ padding: 12 }}>
                    <p style={{ fontSize: 8.5, fontWeight: 700, color: '#8c4e35', textTransform: 'uppercase', letterSpacing: 1.15, margin: '0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize: 13, lineHeight: 1.18, fontWeight: 700, color: '#1a1c1c', margin: 0, fontFamily: 'Georgia, serif', maxHeight: 32, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 'bold', color: '#1a1c1c', margin: 0 }}>Session History</h2>
            <span style={{ fontSize: 12, color: '#8c4e35', textTransform: 'uppercase', letterSpacing: 1.2 }}>View All</span>
          </div>
          {[
            { bg: imgMorningYoga, time: 'Yesterday • 06:15 AM', name: 'Solar Gratitude', duration: '45m', type: 'Vinyasa Flow', stars: 5 },
            { bg: imgBreathwork, time: 'Tuesday • 09:30 PM', name: 'Lunar Breath', duration: '20m', type: 'Deep Rest', stars: 5 },
          ].map((s) => (
            <div key={s.name} style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 12, height: 96, position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
                <img src={s.bg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#8c4e35', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>{s.time}</p>
                  <p style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1c1c', margin: 0, fontFamily: 'Georgia, serif' }}>{s.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 'bold', color: '#1a1c1c', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>{s.duration}</p>
                  <p style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>{s.type}</p>
                  <StarRating count={s.stars} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, borderTop: '1px solid rgba(226,149,120,0.1)', paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: '#5b5d74', letterSpacing: 3.6, textTransform: 'uppercase', margin: '0 0 20px' }}>Preferences</p>
          {[
            { label: 'Edit Profile' },
            { label: 'Privacy' },
            { label: 'Notifications' },
            { label: 'Aesthetic Theme', sub: 'Pearlescent' },
            { label: 'Switch Account', action: 'switch' },
          ].map((item) => (
            <div key={item.label} onClick={() => item.action === 'switch' && setShowSwitchSheet(true)} style={{ background: 'white', borderRadius: 24, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, cursor: item.action ? 'pointer' : 'default' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1c1c' }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.sub && <span style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase' }}>{item.sub}</span>}
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#5b5d74" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, background: 'rgba(186,26,26,0.05)', borderRadius: 48, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#ba1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#ba1a1a' }}>Sign out of Sanctuary</span>
        </div>
      </div>

      {showSwitchSheet && (
        <UserSwitchAccountSheet
          onClose={() => setShowSwitchSheet(false)}
          onSwitchToAdmin={() => {
            setShowSwitchSheet(false)
            onSwitchToAdmin?.()
          }}
        />
      )}
    </div>
  )
}
