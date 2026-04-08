import TopAppBar from '../components/TopAppBar.jsx'
import PayoutRow from '../components/PayoutRow.jsx'
import Icon from '../components/Icons.jsx'
import { colors, fonts, radius } from '../tokens.js'

const PAYOUTS = [
  { date: 'Oct 20, 2023', status: 'Completed', amount: '$2,450.00' },
  { date: 'Oct 13, 2023', status: 'Initiated',  amount: '$3,120.00' },
  { date: 'Oct 06, 2023', status: 'Ready',      amount: '$2,890.00' },
]

const BAR_HEIGHTS = [64, 85, 64, 96, 128, 102, 96]

export default function AdminWallet() {
  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Welcome Header ───────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            style={{
              fontFamily:    fonts.sans,
              fontWeight:    600,
              fontSize:      12,
              color:         colors.brownDark,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            Provider Overview
          </span>
          <h1
            style={{
              fontFamily: fonts.serif,
              fontWeight: 400,
              fontSize:   44,
              color:      colors.textDark,
              margin:     0,
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Cultivating<br />excellence.
          </h1>
          <p style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.textMid, margin: 0, lineHeight: 1.6 }}>
            Your studio impact is expanding. Here is the pulse of your professional practice this morning.
          </p>
        </section>

        {/* ── Balance Card ─────────────────────────────── */}
        <section
          style={{
            backgroundColor: colors.teal,
            borderRadius:    radius.xl,
            padding:         32,
            position:        'relative',
            overflow:        'hidden',
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position:        'absolute',
              bottom:          -20,
              right:           -20,
              width:           120,
              height:          120,
              borderRadius:    9999,
              border:          `2px solid rgba(164,241,231,0.2)`,
              opacity:         0.4,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            <span
              style={{
                fontFamily:    fonts.sans,
                fontSize:      11,
                color:         colors.tealLight,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                opacity:       0.85,
              }}
            >
              Available Balance
            </span>

            <h2
              style={{
                fontFamily:  fonts.serif,
                fontWeight:  700,
                fontSize:    44,
                color:       colors.cardBg,
                margin:      0,
                letterSpacing: -1,
              }}
            >
              $4,250.00
            </h2>

            <button
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             8,
                backgroundColor: colors.cream,
                color:           colors.teal,
                fontFamily:      fonts.sans,
                fontSize:        15,
                border:          'none',
                borderRadius:    9999,
                padding:         '13px 28px',
                cursor:          'pointer',
                alignSelf:       'flex-start',
              }}
            >
              Withdraw Funds
              <Icon name="arrow-right" size={12} color={colors.teal} strokeWidth={2} />
            </button>
          </div>
        </section>

        {/* ── Earnings Forecast Card ───────────────────── */}
        <section
          style={{
            backgroundColor: colors.brownMid,
            borderRadius:    radius.xl,
            padding:         32,
            position:        'relative',
            overflow:        'hidden',
          }}
        >
          {/* Decorative blur */}
          <div
            style={{
              position:        'absolute',
              top:             -80,
              right:           -80,
              width:           256,
              height:          256,
              borderRadius:    9999,
              backgroundColor: 'rgba(255,255,255,0.05)',
              filter:          'blur(32px)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
            <span
              style={{
                fontFamily:    fonts.sans,
                fontWeight:    700,
                fontSize:      11,
                color:         '#ffcebc',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                opacity:       0.85,
              }}
            >
              Earnings Forecast
            </span>

            <div>
              <h2
                style={{
                  fontFamily:  fonts.serif,
                  fontWeight:  400,
                  fontSize:    52,
                  color:       colors.white,
                  margin:      0,
                  lineHeight:  1,
                }}
              >
                $12,480.00
              </h2>
              <p
                style={{
                  fontFamily: fonts.sans,
                  fontStyle:  'italic',
                  fontSize:   15,
                  color:      '#ffb599',
                  margin:     '4px 0 0',
                }}
              >
                Projected for October 2023
              </p>
            </div>

            {/* Mini bar chart */}
            <div
              style={{
                display:     'flex',
                gap:         4,
                alignItems:  'flex-end',
                height:      128,
                margin:      '8px 0',
              }}
            >
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex:            1,
                    height:          h,
                    backgroundColor: i === 4 ? colors.white : 'rgba(255,255,255,0.2)',
                    borderRadius:    '3px 3px 0 0',
                  }}
                />
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  backgroundColor: colors.white,
                  color:           colors.brownDark,
                  fontFamily:      fonts.sans,
                  fontWeight:      700,
                  fontSize:        13,
                  border:          'none',
                  borderRadius:    9999,
                  padding:         '8px 24px',
                  cursor:          'pointer',
                }}
              >
                View Reports
              </button>
            </div>
          </div>
        </section>

        {/* ── Recent Payouts ───────────────────────────── */}
        <section
          style={{
            backgroundColor: colors.cardBg,
            borderRadius:    radius.lg,
            padding:         '20px 28px 28px',
            display:         'flex',
            flexDirection:   'column',
            gap:             20,
          }}
        >
          <h3 style={{ fontFamily: fonts.serif, fontWeight: 400, fontSize: 22, color: colors.textDark, margin: 0 }}>
            Recent Payouts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PAYOUTS.map((p, i) => <PayoutRow key={i} {...p} />)}
          </div>

          <button
            style={{
              border:          `2px solid ${colors.brownLight}`,
              borderRadius:    9999,
              backgroundColor: 'transparent',
              color:           colors.brownDark,
              fontFamily:      fonts.sans,
              fontWeight:      700,
              fontSize:        13,
              padding:         '13px 0',
              cursor:          'pointer',
              width:           '100%',
            }}
          >
            History
          </button>
        </section>
      </main>
    </div>
  )
}
