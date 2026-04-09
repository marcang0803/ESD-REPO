import Icon from './Icon.jsx'
import { imgElenaVance } from '../assets.js'

export default function UserSwitchAccountSheet({ onClose, onSwitchToAdmin }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,28,28,0.72)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 200,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(100vw, 430px)',
          background: '#faf6f3',
          borderRadius: '48px 48px 0 0',
          padding: '0 20px 40px',
          zIndex: 201,
          boxShadow: '0 -8px 40px 0 rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ width: 40, height: 6, background: 'rgba(216,194,186,0.7)', borderRadius: 9999, margin: '14px auto 28px' }} />

        <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#1a1c1c', margin: '0 0 20px 4px' }}>
          Switch Account
        </h2>

        <div
          style={{
            background: 'rgba(248,232,225,0.9)',
            borderRadius: 28,
            padding: '16px 18px',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0, width: 52, height: 52 }}>
            <div style={{ position: 'absolute', inset: -4, borderRadius: 9999, border: '2px solid #ece7e3' }} />
            <div style={{ position: 'absolute', inset: -2, borderRadius: 9999, border: '2px solid #af6b50' }} />
            <div style={{ width: 52, height: 52, borderRadius: 9999, overflow: 'hidden' }}>
              <img src={imgElenaVance} alt="Elena" style={{ width: '158%', height: '202%', objectFit: 'cover', marginLeft: '-18%', marginTop: '-3%' }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', color: '#6f3720', margin: '0 0 3px' }}>
              Student Account
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1c1c', margin: 0 }}>Student: Elena</p>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #8c4e35 0%, #e29578 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.2 4.2L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <button
          onClick={onSwitchToAdmin}
          style={{
            width: '100%',
            background: '#f8f3ee',
            border: 'none',
            borderRadius: 28,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 14,
            cursor: 'pointer',
            textAlign: 'left',
            opacity: 0.8,
          }}
        >
          <div style={{ width: 52, height: 52, borderRadius: 9999, background: '#ece7e3', overflow: 'hidden', flexShrink: 0 }}>
            <img src={imgElenaVance} alt="Elena Trainer" style={{ width: '158%', height: '202%', objectFit: 'cover', marginLeft: '-18%', marginTop: '-3%', filter: 'saturate(0.7)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.1, textTransform: 'uppercase', fontStyle: 'italic', color: '#6f3720', margin: '0 0 3px' }}>
              Business Account
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1c1c', margin: 0 }}>Trainer: Elena Lim</p>
          </div>
          <Icon name="chevron-right" size={16} color="#53433e" />
        </button>

        <button
          style={{
            width: '100%',
            border: '1px dashed #d8c2ba',
            borderRadius: 28,
            padding: '15px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: 'transparent',
            cursor: 'pointer',
            marginBottom: 14,
            boxSizing: 'border-box',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#6f3720" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#6f3720' }}>
            Add New Account
          </span>
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 28,
            padding: '16px 0',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: '#53433e',
            background: '#ece7e3',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          Cancel and Return
        </button>
      </div>
    </>
  )
}
