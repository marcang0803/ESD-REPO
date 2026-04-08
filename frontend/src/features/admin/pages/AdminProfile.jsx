import { useState } from 'react'
import TopAppBar from '../components/TopAppBar.jsx'
import SwitchAccountSheet from '../components/SwitchAccountSheet.jsx'
import Icon from '../components/Icons.jsx'
import { colors, fonts, radius, shadows } from '../tokens.js'
import { imgElenaProvider } from '../../user/assets.js'

const imgTrainer = imgElenaProvider

const MILESTONES = [
  { label: 'Impact',       value: '500+ Sessions'  },
  { label: 'Performance',  value: 'Top Rated'      },
  { label: 'Focus',        value: 'Wellness Guide' },
  { label: 'Contribution', value: 'Community Pillar' },
]

const SETTINGS = [
  { icon: 'edit',         label: 'Edit Profile'    },
  { icon: 'lock',         label: 'Privacy'         },
  { icon: 'notification', label: 'Notifications'   },
  { icon: 'switch',       label: 'Switch Account', action: 'switch' },
]

export default function AdminProfile({ onSwitchToUser }) {
  const [showSheet, setShowSheet] = useState(false)

  const handleSettingTap = (item) => {
    if (item.action === 'switch') setShowSheet(true)
  }

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Profile Hero ─────────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Avatar — slight tilt matches Figma */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width:        192,
                height:       256,
                borderRadius: radius.xl,
                overflow:     'hidden',
                transform:    'rotate(-3deg)',
                boxShadow:    shadows.avatar,
              }}
            >
              <img
                src={imgTrainer}
                alt="Elena Lim"
                style={{ width: '133%', height: '148%', objectFit: 'cover', marginLeft: '-17%' }}
              />
            </div>
            {/* Verified badge */}
            <div
              style={{
                position:        'absolute',
                bottom:          -8,
                right:           -8,
                width:           42,
                height:          42,
                borderRadius:    9999,
                backgroundColor: colors.brownMid,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                border:          `3px solid ${colors.cream}`,
                boxShadow:       shadows.card,
              }}
            >
              <Icon name="check" size={16} color="#fff" strokeWidth={2.5} />
            </div>
          </div>

          {/* Name + bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            <span
              style={{
                fontFamily:    fonts.sans,
                fontWeight:    600,
                fontSize:      12,
                color:         colors.brownDark,
                textTransform: 'uppercase',
                letterSpacing: 2.4,
              }}
            >
              Trainer
            </span>
            <h1
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize:   34,
                color:      colors.textDark,
                margin:     0,
              }}
            >
              Elena Lim
            </h1>
            <p
              style={{
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize:   15,
                color:      colors.textMid,
                margin:     0,
                lineHeight: 1.65,
              }}
            >
              "Empowering movement through the synthesis of ancient wisdom and modern performance science."
            </p>
          </div>
        </section>

        {/* ── Milestones ───────────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 13, color: colors.textMid }}>
            Milestones &amp; Recognition
          </span>

          {/* Horizontal scroll row */}
          <div
            style={{
              display:         'flex',
              gap:             12,
              overflowX:       'auto',
              scrollbarWidth:  'none',
              paddingBottom:   4,
            }}
          >
            {MILESTONES.map((m, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: colors.white,
                  borderRadius:    radius.lg,
                  padding:         18,
                  boxShadow:       shadows.card,
                  flexShrink:      0,
                  width:           152,
                  display:         'flex',
                  flexDirection:   'column',
                  justifyContent:  'space-between',
                  gap:             32,
                  minHeight:       130,
                }}
              >
                {/* Icon placeholder dot */}
                <div
                  style={{
                    width:           24,
                    height:          24,
                    borderRadius:    9999,
                    backgroundColor: colors.cardBg,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span
                    style={{
                      fontFamily:    fonts.sans,
                      fontSize:      10,
                      color:         colors.textMid,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontFamily: fonts.display,
                      fontWeight: 600,
                      fontSize:   16,
                      color:      colors.textDark,
                    }}
                  >
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Settings ─────────────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 13, color: colors.textMid, textTransform: 'capitalize' }}>
            Preference
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SETTINGS.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSettingTap(item)}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'space-between',
                  padding:         16,
                  backgroundColor: colors.white,
                  borderRadius:    radius.lg,
                  border:          'none',
                  cursor:          'pointer',
                  width:           '100%',
                  textAlign:       'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Icon name={item.icon} size={16} color={colors.textDark} strokeWidth={1.6} />
                  <span style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 14, color: colors.textDark }}>
                    {item.label}
                  </span>
                </div>
                <Icon name="chevron-right" size={10} color={colors.textMuted} strokeWidth={2} />
              </button>
            ))}
          </div>
        </section>

        {/* ── Sign Out ─────────────────────────────────── */}
        <button
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             10,
            padding:         '14px 0',
            backgroundColor: 'rgba(186,26,26,0.06)',
            borderRadius:    radius.xl,
            border:          'none',
            cursor:          'pointer',
            width:           '100%',
          }}
        >
          <Icon name="logout" size={14} color={colors.error} strokeWidth={1.8} />
          <span
            style={{
              fontFamily:  fonts.sans,
              fontWeight:  500,
              fontSize:    14,
              color:       colors.error,
              letterSpacing: 0.3,
            }}
          >
            Sign out
          </span>
        </button>
      </main>

      {/* Switch Account bottom sheet */}
      {showSheet && (
        <SwitchAccountSheet
          onClose={() => setShowSheet(false)}
          onSwitchToUser={() => {
            setShowSheet(false)
            if (onSwitchToUser) onSwitchToUser()
          }}
        />
      )}
    </div>
  )
}
