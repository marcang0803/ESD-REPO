
import { colors, navGradient } from '../tokens.js'
import Icon from './Icon.jsx'

const TABS = [
  { key: 'homepage', icon: 'home', label: 'Home' },
  { key: 'explore', icon: 'search', label: 'Explore' },
  { key: 'bookings', icon: 'calendar', label: 'Bookings' },
  { key: 'wallet', icon: 'card', label: 'Wallet' },
  { key: 'profile', icon: 'person', label: 'Profile' },
]

export default function BottomNav({ screen, setScreen }) {
  return (
    <div
      style={{
        position:        'fixed',
        bottom:          24,
        left:            '50%',
        transform:       'translateX(-50%)',
        width:           'min(390px, calc(100vw - 24px))',
        height:          72,
        borderRadius:    9999,
        background:      'rgba(255,255,255,0.7)',
        backdropFilter:  'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow:       '0px -10px 40px 0px rgba(0,0,0,0.06)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        zIndex:          100,
        padding:         '0 10px',
        gap:             2,
      }}
    >
      {TABS.map(tab => {
        const isActive = screen === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => setScreen(tab.key)}
            aria-label={tab.label}
            style={{
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              justifyContent:  'center',
              flex:            1,
              minWidth:        0,
              gap:             4,
              border:          'none',
              cursor:          'pointer',
              borderRadius:    9999,
              padding:         '10px 0',
              background:      isActive ? navGradient : 'transparent',
              boxShadow:       isActive
                ? '0px 0px 15px 0px rgba(226,149,120,0.4)'
                : 'none',
              transition:      'all 0.2s ease',
            }}
          >
            <Icon
              name={tab.icon}
              size={isActive ? 19 : 20}
              color={isActive ? '#ffffff' : colors.textMuted}
            />
            <span style={{
              fontSize:      11,
              fontWeight:    600,
              color:         isActive ? '#fff' : colors.textMuted,
              letterSpacing: 0.2,
              marginTop:     2,
            }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
