import Icon from '../components/Icon.jsx'
import { imgElenaVance } from '../assets.js'

export default function ClassDetails({ goBack, selectedPractice, isSelectedPracticeBooked, openPractice }) {
  const practice = selectedPractice

  return (
    <div style={{ background: '#f8f4f1', minHeight: '100%', position: 'relative', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 120 }}>
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={practice.img} alt={practice.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)' }} />
        <button onClick={() => goBack?.()} style={{ position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button style={{ position: 'absolute', top: 52, right: 20, width: 40, height: 40, borderRadius: 9999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h14v17l-7-4-7 4V4z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: 22, right: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', margin: '0 0 4px' }}>{practice.category}</p>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 26, fontWeight: 600, color: 'white', margin: 0 }}>{practice.name}</h1>
        </div>
      </div>
      <div style={{ padding: '24px 20px 20px', position: 'relative', marginTop: -20, background: '#f8f4f1', borderRadius: '28px 28px 0 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: 0, background: 'white', borderRadius: 20, padding: '16px 0', marginBottom: 20, boxShadow: '0 4px 16px rgba(140,78,53,0.07)' }}>
          {[
            { label: 'Duration', value: practice.duration },
            { label: 'Difficulty', value: practice.type.split('•')[1]?.trim() || practice.type },
            { label: 'Spots Left', value: practice.spots.replace(' SPOTS LEFT', '') },
          ].map((section, index, array) => (
            <div key={section.label} style={{ textAlign: 'center', borderRight: index < array.length - 1 ? '1px solid rgba(140,78,53,0.1)' : 'none', padding: '0 8px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 4px' }}>{section.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1c1c', margin: 0 }}>{section.value}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ background: 'rgba(246,199,126,0.15)', border: '1.5px solid #f6c77e', borderRadius: 12, padding: '6px 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#8c4e35' }}>{practice.credits} Credits</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((index) => <Icon key={index} name="star" size={12} color="#e29578" />)}
            <span style={{ fontSize: 12, color: '#53433e', marginLeft: 4, fontWeight: 500 }}>{practice.rating}</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 18, color: '#1a1c1c', margin: '0 0 10px' }}>About This Class</h3>
          <p style={{ fontSize: 14, color: '#53433e', lineHeight: 1.7, margin: 0 }}>
            {practice.desc}
          </p>
        </div>
        <div style={{ background: 'white', borderRadius: 24, padding: '18px 20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(140,78,53,0.05)' }}>
          <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 16, color: '#1a1c1c', margin: '0 0 14px' }}>Session Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'time', text: `${practice.date} • ${practice.time}` },
              { icon: 'person', text: practice.lead },
              { icon: 'location', text: practice.location },
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
              <img src={imgElenaVance} alt={practice.instructor} style={{ width: '158%', height: '202%', objectFit: 'cover', marginLeft: '-18%', marginTop: '-3%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#a0736a', margin: '0 0 2px' }}>Instructor</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1c1c', margin: 0 }}>{practice.instructor}</p>
              <p style={{ fontSize: 12, color: '#7a5a52', margin: 0 }}>Certified movement coach • Radiant Sanctuary</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(100vw, 430px)', padding: '14px 20px 32px', background: 'rgba(248,244,241,0.95)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <button
          onClick={() => {
            if (!isSelectedPracticeBooked) {
              openPractice(practice, 'confirmBooking')
            }
          }}
          disabled={isSelectedPracticeBooked}
          style={{
            width: '100%',
            background: isSelectedPracticeBooked ? 'rgba(140,78,53,0.16)' : 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)',
            border: 'none',
            borderRadius: 9999,
            padding: '18px 0',
            fontSize: 16,
            fontWeight: 700,
            color: isSelectedPracticeBooked ? '#8c4e35' : 'white',
            cursor: isSelectedPracticeBooked ? 'not-allowed' : 'pointer',
            boxShadow: isSelectedPracticeBooked ? 'none' : '0 10px 24px rgba(140,78,53,0.3)',
          }}
        >
          {isSelectedPracticeBooked ? 'Booked' : `Book Now • ${practice.credits} Credits`}
        </button>
      </div>
    </div>
  )
}
