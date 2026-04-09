import { colors, fonts, radius } from '../tokens.js'
import Icon from './Icons.jsx'

const imgProviderAvatar = '/assets/img/elena-provider.png'
const imgUserAvatar     = '/assets/img/elena-user.png'

// Bottom sheet overlay — triggered from AdminProfile settings
export default function SwitchAccountSheet({ onClose, onSwitchToUser }) {
  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position:        'fixed',
          inset:           0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex:          200,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position:        'fixed',
          bottom:          0,
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           390,
          maxWidth:        '100%',
          backgroundColor: colors.cream,
          borderRadius:    '48px 48px 0 0',
          boxShadow:       '0px -8px 40px 0px rgba(0,0,0,0.12)',
          zIndex:          300,
          paddingBottom:   48,
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0 8px' }}>
          <div
            style={{
              width:           48,
              height:          6,
              borderRadius:    9999,
              backgroundColor: 'rgba(216,194,186,0.4)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '16px 32px 0', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <h2
            style={{
              fontFamily: fonts.serif,
              fontWeight: 400,
              fontSize:   24,
              color:      colors.textDark,
              margin:     0,
            }}
          >
            Switch Account
          </h2>

          {/* Account list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Active: Business account */}
            <div
              style={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                padding:         20,
                backgroundColor: colors.cardAlt,
                borderRadius:    40,
                height:          95,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    style={{
                      width:        56,
                      height:       56,
                      borderRadius: 9999,
                      overflow:     'hidden',
                      border:       `4px solid ${colors.brownDark}`,
                      outline:      `2px solid ${colors.cardAlt}`,
                    }}
                  >
                    <img src={imgProviderAvatar} alt="Elena" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {/* Checkmark badge */}
                  <div
                    style={{
                      position:        'absolute',
                      bottom:          -4,
                      right:           -4,
                      width:           22,
                      height:          22,
                      borderRadius:    9999,
                      backgroundColor: colors.brownDark,
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      border:          `2px solid ${colors.cardAlt}`,
                    }}
                  >
                    <Icon name="check" size={10} color="#fff" strokeWidth={2.5} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span
                    style={{
                      fontFamily:    fonts.sans,
                      fontWeight:    600,
                      fontSize:      11,
                      color:         colors.brownDark,
                      textTransform: 'uppercase',
                      letterSpacing: 1.1,
                    }}
                  >
                    Business Account
                  </span>
                  <span style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.textDark }}>
                    Trainer: Elena Lim
                  </span>
                </div>
              </div>

              <div
                style={{
                  width:           24,
                  height:          24,
                  borderRadius:    9999,
                  backgroundColor: colors.brownDark,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                }}
              >
                <Icon name="check" size={12} color="#fff" strokeWidth={2.5} />
              </div>
            </div>

            {/* User account */}
            <button
              onClick={onSwitchToUser}
              style={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'space-between',
                padding:         20,
                backgroundColor: colors.cardBg,
                borderRadius:    40,
                height:          95,
                border:          'none',
                cursor:          'pointer',
                width:           '100%',
                textAlign:       'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width:        56,
                    height:       56,
                    borderRadius: 9999,
                    overflow:     'hidden',
                    opacity:      0.85,
                    flexShrink:   0,
                  }}
                >
                  <img src={imgUserAvatar} alt="Elena (Student)" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span
                    style={{
                      fontFamily:    fonts.sans,
                      fontStyle:     'italic',
                      fontSize:      10,
                      color:         colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Student Account
                  </span>
                  <span style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.textDark }}>
                    Student: Elena
                  </span>
                </div>
              </div>
              <Icon name="chevron-right" size={14} color={colors.brownLight} strokeWidth={2} />
            </button>

            {/* Add account */}
            <button
              style={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             8,
                padding:         '20px 0',
                backgroundColor: colors.white,
                border:          `1.5px dashed ${colors.brownLight}`,
                borderRadius:    radius.lg,
                cursor:          'pointer',
                width:           '100%',
              }}
            >
              <Icon name="plus" size={14} color={colors.brownDark} strokeWidth={2} />
              <span
                style={{
                  fontFamily:    fonts.sans,
                  fontWeight:    600,
                  fontSize:      13,
                  color:         colors.brownDark,
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                }}
              >
                Add New Account
              </span>
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              padding:         16,
              backgroundColor: colors.cardAlt,
              borderRadius:    9999,
              border:          'none',
              cursor:          'pointer',
              width:           '100%',
            }}
          >
            <span
              style={{
                fontFamily:    fonts.sans,
                fontWeight:    600,
                fontSize:      12,
                color:         colors.textMid,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}
            >
              Cancel and Return
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
