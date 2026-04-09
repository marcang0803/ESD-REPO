import { useState } from 'react'
import TopAppBar from '../components/TopAppBar.jsx'
import MetricCard from '../components/MetricCard.jsx'
import { colors, fonts, radius, shadows } from '../tokens.js'

// Simulated line chart path — matches the wave shape in the Figma design
const CHART_PATH =
  'M0 180 C30 180, 40 120, 70 100 C100 80, 110 140, 140 90 C170 40, 180 20, 210 60 C240 100, 250 50, 280 30 C310 10, 320 70, 342 50'

const CATEGORIES = [
  { name: 'Yoga & Breathwork',  share: 82, opacity: 1   },
  { name: 'Mindful Pilates',    share: 64, opacity: 0.7 },
  { name: 'High Intensity (HIIT)', share: 48, opacity: 0.4 },
]

const INSIGHTS = [
  { name: 'Beginner Flow', rate: '99.2%', color: colors.tealLight },
  { name: 'Core Sculpt',   rate: '97.5%', color: '#ffdbce'        },
  { name: 'HIIT Power',    rate: '95.0%', color: '#ffdbce'        },
]

const PERIODS = ['30D', '90D', '1Y']

const imgStudio = '/assets/img/pilates-reformer.png'

export default function AdminStatistics() {
  const [period, setPeriod] = useState('30D')

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* ── Hero Header ──────────────────────────────── */}
        <section
          style={{
            borderRadius: radius.xl,
            padding:      32,
            position:     'relative',
            overflow:     'hidden',
            background:   'linear-gradient(135deg, #6f3720 0%, #8c4e35 100%)',
          }}
        >
          <div
            style={{
              position:        'absolute',
              bottom:          -80,
              right:           -80,
              width:           320,
              height:          320,
              borderRadius:    9999,
              backgroundColor: 'rgba(255,255,255,0.1)',
              filter:          'blur(32px)',
            }}
          />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontFamily:    fonts.sans,
                fontSize:      11,
                color:         colors.white,
                textTransform: 'uppercase',
                letterSpacing: 2.4,
                opacity:       0.8,
              }}
            >
              Monthly Overview
            </span>
            <h1
              style={{
                fontFamily: fonts.serif,
                fontWeight: 700,
                fontSize:   34,
                color:      colors.white,
                margin:     0,
                lineHeight: 1.25,
              }}
            >
              Mastering<br />Your Impact
            </h1>
            <p
              style={{
                fontFamily: fonts.serif,
                fontSize:   17,
                color:      colors.white,
                margin:     '6px 0 0',
                lineHeight: 1.65,
                opacity:    0.9,
              }}
            >
              Your studio's resonance continues to grow. This month, we've observed a significant increase in client retention and session depth.
            </p>
          </div>
        </section>

        {/* ── Key Metrics Grid ─────────────────────────── */}
        <section>
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 16,
            }}
          >
            <MetricCard label="Active Classes"  value="12"   trend="+5% trend" />
            <MetricCard label="Avg Rating"      value="4.98" subtitle="From 82 reviews" />
            <MetricCard label="Total Sessions"  value="40"   subtitle="This month" />
            <MetricCard label="Completion"      value="98%"  subtitle="Stable vs. last period" />
          </div>
        </section>

        {/* ── Attendance Chart ─────────────────────────── */}
        <section
          style={{
            backgroundColor: colors.white,
            borderRadius:    radius.lg,
            padding:         '28px 28px 0',
            overflow:        'hidden',
            boxShadow:       '0px 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <h3 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 18, color: colors.textDark, margin: 0 }}>
                Class Attendance
              </h3>
              <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted, margin: '2px 0 0' }}>
                Last 30 days daily overview
              </p>
            </div>

            {/* Period toggle */}
            <div
              style={{
                display:         'flex',
                backgroundColor: colors.cardBg,
                borderRadius:    9999,
                padding:         4,
                gap:             2,
              }}
            >
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    fontFamily:      fonts.sans,
                    fontSize:        11,
                    border:          'none',
                    borderRadius:    9999,
                    padding:         '5px 14px',
                    cursor:          'pointer',
                    backgroundColor: period === p ? colors.brownDark : 'transparent',
                    color:           period === p ? colors.white : colors.textMuted,
                    transition:      'all 0.15s ease',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* SVG line chart */}
          <svg
            width="100%"
            viewBox="0 0 342 200"
            preserveAspectRatio="none"
            style={{ display: 'block', marginTop: 16, height: 180 }}
          >
            {/* Grid lines */}
            {[50, 100, 150].map(y => (
              <line key={y} x1="0" y1={y} x2="342" y2={y}
                stroke={colors.cardBg} strokeWidth="1" />
            ))}
            {/* Area fill */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.brownMid} stopOpacity="0.15" />
                <stop offset="100%" stopColor={colors.brownMid} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${CHART_PATH} L342 200 L0 200 Z`}
              fill="url(#chartGrad)"
            />
            {/* Line */}
            <path
              d={CHART_PATH}
              fill="none"
              stroke={colors.brownMid}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Peak dot */}
            <circle cx="280" cy="30" r="4" fill={colors.brownMid} />
          </svg>

          {/* X-axis labels */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              padding:        '8px 0 16px',
            }}
          >
            {['Oct 01', 'Oct 10', 'Oct 20', 'Oct 30'].map(label => (
              <span
                key={label}
                style={{
                  fontFamily:    fonts.sans,
                  fontSize:      9,
                  color:         colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: -0.3,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Top Categories ───────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 18, color: colors.textDark, margin: 0 }}>
            Top Categories
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 13, color: colors.textDark }}>
                    {cat.name}
                  </span>
                  <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.brownDark }}>
                    {cat.share}% Share
                  </span>
                </div>
                <div
                  style={{
                    height:          8,
                    borderRadius:    9999,
                    backgroundColor: colors.cardBg,
                    overflow:        'hidden',
                  }}
                >
                  <div
                    style={{
                      height:          '100%',
                      width:           `${cat.share}%`,
                      backgroundColor: colors.brownDark,
                      opacity:         cat.opacity,
                      borderRadius:    9999,
                      transition:      'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Class Insights ───────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 18, color: colors.textDark, margin: 0 }}>
            Class Insights
          </h3>

          <div
            style={{
              backgroundColor: colors.cardBg,
              borderRadius:    radius.lg,
              padding:         20,
              display:         'flex',
              flexDirection:   'column',
              gap:             10,
            }}
          >
            {INSIGHTS.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: colors.white,
                  borderRadius:    6,
                  padding:         12,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width:           32,
                      height:          32,
                      borderRadius:    9999,
                      backgroundColor: item.color,
                      flexShrink:      0,
                    }}
                  />
                  <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 13, color: colors.textDark }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 12, color: colors.teal }}>
                  {item.rate} Rate
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Refine Your Craft CTA ────────────────────── */}
        <section
          style={{
            borderRadius: radius.xl,
            overflow:     'hidden',
            position:     'relative',
            minHeight:    220,
          }}
        >
          <img
            src={imgStudio}
            alt=""
            style={{
              position:   'absolute',
              inset:      0,
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              opacity:    0.18,
              filter:     'grayscale(1)',
            }}
          />
          <div
            style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to right, rgba(254,248,244,0.95) 40%, rgba(254,248,244,0))',
            }}
          />
          <div style={{ position: 'relative', padding: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.brownDark, margin: 0 }}>
              Refine Your Craft
            </h3>
            <p style={{ fontFamily: fonts.serif, fontSize: 15, color: colors.textDark, margin: 0, lineHeight: 1.65, maxWidth: 260 }}>
              Advanced analytics suggest that adding a meditation segment to HIIT classes increases client satisfaction by 12%.
            </p>
            <button
              style={{
                backgroundColor: colors.brownDark,
                color:           colors.white,
                fontFamily:      fonts.sans,
                fontWeight:      600,
                fontSize:        12,
                border:          'none',
                borderRadius:    9999,
                padding:         '11px 28px',
                cursor:          'pointer',
                textTransform:   'uppercase',
                letterSpacing:   1.4,
                alignSelf:       'flex-start',
                marginTop:       6,
              }}
            >
              View Advisory
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
