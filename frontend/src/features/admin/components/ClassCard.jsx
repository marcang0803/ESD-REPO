import { colors, fonts, radius, shadows } from '../tokens.js'
import Icon from './Icons.jsx'

// Upcoming schedule card — used on AdminHomepage
export default function ClassCard({ month, day, title, time, students, isActive = false }) {
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         24,
        backgroundColor: colors.cardBg,
        borderRadius:    radius.lg,
        boxShadow:       shadows.card,
        flexShrink:      0,
        width:           '100%',
      }}
    >
      {/* Date badge */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div
          style={{
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            width:           58,
            height:          64,
            borderRadius:    radius.md,
            backgroundColor: isActive ? colors.brownMid : colors.cardAlt,
            flexShrink:      0,
          }}
        >
          <span
            style={{
              fontFamily:    fonts.sans,
              fontWeight:    700,
              fontSize:      12,
              color:         isActive ? '#ffffff' : colors.brownDark,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {month}
          </span>
          <span
            style={{
              fontFamily: fonts.serif,
              fontWeight: 700,
              fontSize:   20,
              color:      isActive ? '#ffffff' : colors.brownDark,
            }}
          >
            {day}
          </span>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span
            style={{
              fontFamily: fonts.serif,
              fontWeight: 700,
              fontSize:   18,
              color:      colors.textDark,
            }}
          >
            {title}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="time" size={13} color={colors.textMid} strokeWidth={1.5} />
              <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>
                {time}
              </span>
            </div>

            <div
              style={{
                width: 4, height: 4, borderRadius: 9999,
                backgroundColor: colors.brownLight,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="users" size={13} color={colors.textMid} strokeWidth={1.5} />
              <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>
                {students}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Icon name="chevron-right" size={14} color={colors.brownLight} strokeWidth={2} />
    </div>
  )
}
