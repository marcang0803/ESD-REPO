import { useState } from 'react'
import Icon from '../components/Icon.jsx'

export default function Filter({ setScreen, goBack }) {
  const [selectedType, setSelectedType] = useState('Yoga')
  const [selectedIntensity, setSelectedIntensity] = useState('Beginner')
  const [creditsMin, setCreditsMin] = useState(20)
  const [creditsMax, setCreditsMax] = useState(50)
  const [selectedDate, setSelectedDate] = useState(0)
  const [durationMin, setDurationMin] = useState(30)
  const [durationMax, setDurationMax] = useState(90)
  const types = [
    { key: 'Yoga', icon: 'meditate' },
    { key: 'Pilates', icon: 'pulse' },
    { key: 'HIIT', icon: 'fire' },
    { key: 'Meditation', icon: 'sparkles' },
  ]
  const intensities = ['Beginner', 'Moderate', 'Advance']
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const reset = () => {
    setSelectedType('Yoga')
    setSelectedIntensity('Beginner')
    setCreditsMin(20)
    setCreditsMax(50)
    setSelectedDate(0)
    setDurationMin(30)
    setDurationMax(90)
  }

  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 130 }}>
      <div style={{ position: 'absolute', top: -120, right: -60, width: 320, height: 320, borderRadius: 9999, background: 'rgba(226,149,120,0.13)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 200, left: -80, width: 280, height: 280, borderRadius: 9999, background: 'rgba(196,196,223,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => goBack?.()} style={{ width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#1a1c1c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span style={{ fontFamily: "'Liberation Serif', Georgia, serif", fontSize: 15, letterSpacing: 4, textTransform: 'uppercase', color: '#1a1c1c', fontWeight: 600 }}>Refine Studio</span>
        </div>
        <button onClick={reset} style={{ fontSize: 13, fontWeight: 500, color: '#8c4e35', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: 0.3 }}>Reset</button>
      </div>
      <div style={{ margin: '0 16px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: 32, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 28, boxShadow: '0 4px 24px rgba(140,78,53,0.06), 0 1px 0 rgba(255,255,255,0.9) inset' }}>
        <section>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#53433e', margin: '0 0 14px' }}>Type</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {types.map(({ key, icon }) => {
              const active = selectedType === key
              return (
                <button key={key} onClick={() => setSelectedType(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 18, cursor: 'pointer', background: active ? 'rgba(226,149,120,0.2)' : 'rgba(243,243,243,0.8)', border: active ? '1.5px solid #e29578' : '1.5px solid transparent', boxShadow: active ? '0 2px 8px rgba(226,149,120,0.2)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: active ? 'rgba(226,149,120,0.25)' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={icon} size={16} color={active ? '#8c4e35' : '#a0736a'} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? '#6f3720' : '#53433e' }}>{key}</span>
                </button>
              )
            })}
          </div>
        </section>
        <section>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#53433e', margin: '0 0 14px' }}>Intensity</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {intensities.map((lvl) => {
              const active = selectedIntensity === lvl
              return (
                <button key={lvl} onClick={() => setSelectedIntensity(lvl)} style={{ flex: 1, border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: active ? '#cc8368' : 'rgba(243,243,243,0.8)', color: active ? 'white' : '#7a5a52', boxShadow: active ? '0 4px 12px rgba(204,131,104,0.3)' : 'none', transition: 'all 0.15s' }}>
                  {lvl}
                </button>
              )
            })}
          </div>
        </section>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#53433e', margin: 0 }}>Credits</p>
            <span style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#8c4e35' }}>{creditsMin}–{creditsMax}</span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#ede4df', borderRadius: 9999, margin: '8px 0 20px' }}>
            <div style={{ position: 'absolute', left: `${creditsMin}%`, right: `${100 - creditsMax}%`, height: '100%', background: 'linear-gradient(90deg, #8c4e35, #e29578)', borderRadius: 9999 }} />
            <input type="range" min={0} max={100} value={creditsMin} onChange={(e) => setCreditsMin(Math.min(Number(e.target.value), creditsMax - 5))} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }} />
            <input type="range" min={0} max={100} value={creditsMax} onChange={(e) => setCreditsMax(Math.max(Number(e.target.value), creditsMin + 5))} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${creditsMin}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 9999, background: '#8c4e35', border: '3px solid white', boxShadow: '0 2px 6px rgba(140,78,53,0.4)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${creditsMax}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 9999, background: '#8c4e35', border: '3px solid white', boxShadow: '0 2px 6px rgba(140,78,53,0.4)', pointerEvents: 'none' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>0</span>
            <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>100</span>
          </div>
        </section>
        <section>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#53433e', margin: '0 0 14px' }}>Date</p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 4 }}>
            {dates.map((d, i) => {
              const active = selectedDate === i
              return (
                <button key={d.toISOString()} onClick={() => setSelectedDate(i)} style={{ flexShrink: 0, width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '12px 0', borderRadius: 16, border: 'none', cursor: 'pointer', background: active ? '#cc8368' : '#f3f3f3', boxShadow: active ? '0 4px 12px rgba(204,131,104,0.3)' : 'none' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.6, color: active ? 'rgba(255,255,255,0.8)' : '#7a5a52' }}>{d.toLocaleDateString('en', { weekday: 'short' }).toUpperCase()}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: active ? 'white' : '#1a1c1c' }}>{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        </section>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.2, textTransform: 'uppercase', color: '#53433e', margin: 0 }}>Duration</p>
            <span style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#8c4e35' }}>{durationMin}–{durationMax} <span style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Min</span></span>
          </div>
          <div style={{ position: 'relative', height: 6, background: '#ede4df', borderRadius: 9999, margin: '8px 0 20px' }}>
            <div style={{ position: 'absolute', left: `${((durationMin - 15) / 105) * 100}%`, right: `${100 - ((durationMax - 15) / 105) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #8c4e35, #e29578)', borderRadius: 9999 }} />
            <input type="range" min={15} max={120} step={5} value={durationMin} onChange={(e) => setDurationMin(Math.min(Number(e.target.value), durationMax - 10))} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }} />
            <input type="range" min={15} max={120} step={5} value={durationMax} onChange={(e) => setDurationMax(Math.max(Number(e.target.value), durationMin + 10))} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '100%' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${((durationMin - 15) / 105) * 100}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 9999, background: '#8c4e35', border: '3px solid white', boxShadow: '0 2px 6px rgba(140,78,53,0.4)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: `${((durationMax - 15) / 105) * 100}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 9999, background: '#8c4e35', border: '3px solid white', boxShadow: '0 2px 6px rgba(140,78,53,0.4)', pointerEvents: 'none' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>15 min</span>
            <span style={{ fontSize: 11, color: '#a8a29e', fontWeight: 500 }}>120 min</span>
          </div>
        </section>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 430px)', padding: '14px 20px 32px', background: 'rgba(248,244,241,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', gap: 10, zIndex: 50 }}>
        <button onClick={() => setScreen('explore')} style={{ flex: 1, background: 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)', border: 'none', borderRadius: 9999, padding: '17px 0', fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 8px 20px rgba(140,78,53,0.25)' }}>Apply Filters</button>
        <button onClick={() => goBack?.()} style={{ flex: 0.55, background: '#e7e7e7', border: 'none', borderRadius: 9999, padding: '17px 0', fontSize: 14, fontWeight: 600, color: '#53433e', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}
