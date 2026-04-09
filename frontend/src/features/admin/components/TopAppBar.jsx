import { colors, fonts } from '../tokens.js'
import Icon from './Icons.jsx'

// Admin avatar – reused across all TopAppBars
const imgAvatar = '/assets/img/elena-provider.png'

export default function TopAppBar() {
  return (
    <header
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '16px 24px',
        height:         72,
        backgroundColor: colors.cream,
        flexShrink:     0,
        position:       'relative',
      }}
    >
      {/* Left: avatar + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width:        40,
            height:       40,
            borderRadius: 9999,
            border:       `2px solid rgba(226,149,120,0.2)`,
            overflow:     'hidden',
            flexShrink:   0,
            backgroundColor: '#e8e8e8',
          }}
        >
          <img
            src={imgAvatar}
            alt="Elena"
            style={{ width: '115%', height: '173%', objectFit: 'cover', marginLeft: '-8%' }}
          />
        </div>

        <span
          style={{
            fontFamily:     fonts.logo,
            fontSize:       20,
            letterSpacing:  4,
            color:          colors.textDark,
            whiteSpace:     'nowrap',
          }}
        >
          Radiant Sanctuary
        </span>
      </div>

      {/* Right: bell */}
      <Icon name="bell" size={18} color={colors.textMid} strokeWidth={1.6} />
    </header>
  )
}
