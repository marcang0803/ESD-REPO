import { colors, navGradient } from '../tokens.js'
import Icon from './Icons.jsx'

const TABS = [
  { key: 'home',   icon: 'home',      label: 'Studio'    },
  { key: 'stats',  icon: 'bar-chart', label: 'Statistics' },
  { key: 'wallet', icon: 'wallet',    label: 'Wallet'    },
  { key: 'profile',icon: 'person',    label: 'Profile'   },
]

export default function AdminNav({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        position:        'fixed',
        bottom:          24,
        left:            '50%',
        transform:       'translateX(-50%)',
        width:           351,
        height:          72,
        borderRadius:    9999,
        background:      'rgba(255,255,255,0.7)',
        backdropFilter:  'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow:       '0px -10px 40px 0px rgba(0,0,0,0.06)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-around',
        zIndex:          100,
        padding:         '0 8px',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            aria-label={tab.label}
            style={{
              display:         'flex',
              flexDirection:   'column',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             4,
              border:          'none',
              cursor:          'pointer',
              borderRadius:    9999,
              padding:         isActive ? '10px 18px' : '10px 14px',
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
              strokeWidth={isActive ? 2 : 1.7}
            />
          </button>
        )
      })}
    </div>
  )
}
