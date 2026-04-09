import { colors, fonts, radius, shadows } from '../tokens.js'

// Stat metric card — 2-up grid on AdminStatistics
export default function MetricCard({ label, value, subtitle, trend, icon }) {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius:    radius.lg,
        padding:         24,
        boxShadow:       shadows.card,
        display:         'flex',
        flexDirection:   'column',
        justifyContent:  'space-between',
        gap:             16,
        minHeight:       160,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontFamily:    fonts.sans,
            fontSize:      10,
            color:         colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1,
            lineHeight:    1.5,
          }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ fontSize: 16, opacity: 0.6 }}>{icon}</span>
        )}
      </div>

      {/* Value + context */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: fonts.serif,
            fontWeight: 700,
            fontSize:   36,
            color:      colors.textDark,
            lineHeight: 1,
          }}
        >
          {value}
        </span>

        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: colors.teal }}>↑</span>
            <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.teal }}>
              {trend}
            </span>
          </div>
        )}

        {subtitle && !trend && (
          <span style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMuted }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
