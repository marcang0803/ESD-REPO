import { colors, fonts, radius, shadows } from '../tokens.js'
import Icon from './Icons.jsx'

// Student review card — used on AdminHomepage
export default function ReviewCard({ quote, reviewer, avatarSrc, rating = 5 }) {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius:    radius.lg,
        padding:         24,
        boxShadow:       shadows.card,
        border:          '1px solid rgba(216,194,186,0.15)',
        display:         'flex',
        flexDirection:   'column',
        gap:             12,
        width:           '100%',
      }}
    >
      {/* Stars */}
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: rating }).map((_, i) => (
          <Icon key={i} name="star" size={11} color="#e29578" />
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: fonts.serif,
          fontSize:   15,
          lineHeight: 1.65,
          color:      colors.textDark,
          margin:     0,
        }}
      >
        {`"${quote}"`}
      </p>

      {/* Reviewer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width:           32,
            height:          32,
            borderRadius:    9999,
            overflow:        'hidden',
            backgroundColor: colors.cardBg,
            flexShrink:      0,
          }}
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt={reviewer} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="person" size={16} color={colors.textMuted} />
            </div>
          )}
        </div>
        <span
          style={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize:   13,
            color:      colors.textDark,
          }}
        >
          — {reviewer}
        </span>
      </div>
    </div>
  )
}
