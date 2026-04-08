import { colors, fonts, radius } from '../tokens.js'

const STATUS_COLORS = {
  completed: colors.teal,
  initiated:  colors.brownMid,
  ready:      '#d6d3d1',
}

// Single payout list row — used on AdminWallet
export default function PayoutRow({ date, status, amount }) {
  const dot = STATUS_COLORS[status.toLowerCase()] ?? '#d6d3d1'

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius:    radius.lg,
        padding:         16,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width:           8,
            height:          8,
            borderRadius:    9999,
            backgroundColor: dot,
            flexShrink:      0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 13, color: colors.textDark }}>
            {date}
          </span>
          <span
            style={{
              fontFamily:    fonts.sans,
              fontSize:      10,
              color:         colors.textMid,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {status}
          </span>
        </div>
      </div>

      <span style={{ fontFamily: fonts.serif, fontSize: 15, color: colors.textDark }}>
        {amount}
      </span>
    </div>
  )
}
