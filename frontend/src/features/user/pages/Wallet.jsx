import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { imgCWProfile, imgCWLunarBreath, imgCWSolarGratitude } from '../assets.js'

const PAYMENT_SERVICE_URL = 'http://localhost:5001'
const USER_ID = 1001

const milestones = [
  {
    icon: 'zenMaster',
    label: 'Zen Master',
    bg: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
    opacity: 1,
    customSvg: 'zenMaster',
  },
  {
    icon: 'tenSessions',
    label: '10 Session',
    bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    opacity: 1,
    customSvg: 'tenSessions',
  },
  {
    icon: 'recovery',
    label: 'Soul Flow',
    bg: '#e2e2e2',
    opacity: 0.4,
    customSvg: 'soulFlow',
  },
]

// ── Top Up Modal ──────────────────────────────────────────────────────────────
function TopUpModal({ onClose, onSuccess }) {
  const [packages, setPackages]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => {
    fetch(`${PAYMENT_SERVICE_URL}/topup/packages`)
      .then(r => r.json())
      .then(data => {
        setPackages(data.packages || [])
        if (data.packages?.length) setSelected(data.packages[1].id) // default: 300 credits
      })
      .catch(() => setError('Could not load packages. Is the payment service running?'))
  }, [])

  async function handleCheckout() {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${PAYMENT_SERVICE_URL}/topup/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user_id: USER_ID, package_id: selected }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        // Redirect to Stripe Checkout in the same tab
        window.location.href = data.checkout_url
      } else {
        setError(data.error || 'Failed to create checkout session.')
      }
    } catch (err) {
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const selectedPkg = packages.find(p => p.id === selected)

  return (
    <div
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          1000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display:         'flex',
        alignItems:      'flex-end',
        justifyContent:  'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: '#fef8f4',
          borderRadius:    '32px 32px 0 0',
          padding:         '28px 24px 40px',
          width:           '100%',
          maxWidth:        390,
          display:         'flex',
          flexDirection:   'column',
          gap:             20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1c1c', margin: 0 }}>
            Top Up Credits
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#8c4e35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <p style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#5b5d74', margin: 0, lineHeight: 1.6 }}>
          Select a credit package to top up your wallet via Stripe.
        </p>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#fdecea', borderRadius: 16, padding: 14 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#ba1a1a', fontFamily: 'sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Packages */}
        {packages.length === 0 && !error ? (
          <p style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#5b5d74', textAlign: 'center' }}>
            Loading packages…
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                style={{
                  display:         'flex',
                  justifyContent:  'space-between',
                  alignItems:      'center',
                  padding:         '16px 20px',
                  borderRadius:    20,
                  border:          selected === pkg.id
                                     ? '2px solid #8c4e35'
                                     : '2px solid transparent',
                  backgroundColor: selected === pkg.id ? '#fff3ee' : 'white',
                  cursor:          'pointer',
                  boxShadow:       '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width:           44,
                      height:          44,
                      borderRadius:    12,
                      background:      selected === pkg.id
                                         ? 'linear-gradient(135deg, #8c4e35, #e29578)'
                                         : '#f3ede9',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={selected === pkg.id ? 'white' : '#8c4e35'}>
                      <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 17, color: '#1a1c1c', fontWeight: 600 }}>
                      {pkg.credits.toLocaleString()} Credits
                    </p>
                    <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 12, color: '#5b5d74' }}>
                      SGD ${pkg.price_sgd.toFixed(2)}
                    </p>
                  </div>
                </div>
                {selected === pkg.id && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#8c4e35"/>
                    <path d="M7 12l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Summary + CTA */}
        {selectedPkg && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius:    20,
              padding:         '16px 20px',
              display:         'flex',
              justifyContent:  'space-between',
              alignItems:      'center',
            }}
          >
            <div>
              <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 12, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>
                You pay
              </p>
              <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: 22, color: '#8c4e35', fontWeight: 700 }}>
                SGD ${selectedPkg.price_sgd.toFixed(2)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 12, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>
                You receive
              </p>
              <p style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: 22, color: '#1a1c1c', fontWeight: 700 }}>
                {selectedPkg.credits.toLocaleString()} cr
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || !selected || packages.length === 0}
          style={{
            background:    loading ? '#d8c2ba' : 'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)',
            border:        'none',
            borderRadius:  9999,
            padding:       '18px 40px',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'center',
            gap:           10,
            cursor:        loading ? 'not-allowed' : 'pointer',
            boxShadow:     '0 10px 15px -3px rgba(140,78,53,0.2)',
          }}
        >
          {/* Stripe logo */}
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 32 32" fill="white">
              <path d="M14.5 9.8c0-1 .8-1.4 2.1-1.4 1.9 0 4.2.6 6.1 1.6V4.5C20.7 3.5 18.6 3 16.5 3 11.4 3 8 5.6 8 10.1c0 7 9.6 5.9 9.6 8.9 0 1.2-1 1.6-2.4 1.6-2.1 0-4.8-.9-6.9-2.1v5.6c2.3 1 4.7 1.5 6.9 1.5 5.2 0 8.8-2.6 8.8-7.1-.1-7.5-9.5-6.2-9.5-8.7z"/>
            </svg>
          )}
          <span style={{ color: 'white', fontSize: 15, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {loading ? 'Redirecting…' : 'Pay with Stripe'}
          </span>
        </button>

        <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#a8a29e', textAlign: 'center', margin: 0 }}>
          Secured by Stripe · Test mode · Use card 4242 4242 4242 4242
        </p>
      </div>
    </div>
  )
}

// ── Wallet Page ───────────────────────────────────────────────────────────────
export default function Wallet({ walletBalance, setWalletBalance, lastCancellation }) {
  const [showTopUp, setShowTopUp] = useState(false)
  const [topUpBanner, setTopUpBanner] = useState(null)

  // Check if returning from Stripe Checkout (success or cancelled)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status  = params.get('topup')
    const credits = params.get('credits')

    if (status === 'success' && credits) {
      setTopUpBanner({ type: 'success', credits: parseInt(credits, 10) })
      // Refresh wallet balance from backend
      fetch(`http://localhost:5005/wallets/${USER_ID}`)
        .then(r => r.json())
        .then(data => {
          if (typeof setWalletBalance === 'function') {
            setWalletBalance(data.balance)
          }
        })
        .catch(() => {})
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname + window.location.hash)
    } else if (status === 'cancelled') {
      setTopUpBanner({ type: 'cancelled' })
      window.history.replaceState({}, '', window.location.pathname + window.location.hash)
    }
  }, [])

  const balanceLabel = Number.isFinite(walletBalance) ? walletBalance.toLocaleString() : '--'

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100%', paddingBottom: 108, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, left: -80, width: 500, height: 500, borderRadius: 250, background: '#ffb59a', filter: 'blur(40px)', opacity: 0.08, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 9999, overflow: 'hidden', border: '2px solid rgba(226,149,120,0.3)', background: '#e8e8e8' }}>
            <img src={imgCWProfile} alt="" style={{ width: '163%', height: '209%', objectFit: 'cover', marginLeft: '-22%', marginTop: '-2%' }} />
          </div>
          <span style={{ fontFamily: 'serif', fontSize: 16, letterSpacing: 4, color: '#1a1c1c' }}>Radiant Sanctuary</span>
        </div>
        <Icon name="bell" size={22} color="#8c4e35" />
      </div>

      <div style={{ padding: '0 24px' }}>

        {/* Top-up result banner */}
        {topUpBanner && (
          <div
            style={{
              marginTop:       20,
              backgroundColor: topUpBanner.type === 'success' ? '#e6f4f1' : '#fdecea',
              borderRadius:    20,
              padding:         '14px 18px',
              display:         'flex',
              justifyContent:  'space-between',
              alignItems:      'center',
            }}
          >
            <p style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 14, color: topUpBanner.type === 'success' ? '#00504b' : '#ba1a1a', fontWeight: 600 }}>
              {topUpBanner.type === 'success'
                ? `✓ ${topUpBanner.credits.toLocaleString()} credits added to your wallet!`
                : '✗ Top-up cancelled.'}
            </p>
            <button
              onClick={() => setTopUpBanner(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36 }}>
          <div style={{ width: 280, height: 280, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(circle, rgba(255,219,206,1) 0%, rgba(241,184,163,1) 20%, rgba(226,149,120,1) 40%, rgba(226,149,120,0) 70%)', filter: 'blur(20px)' }} />
            <div style={{ position: 'relative', width: 248, height: 248, borderRadius: 9999, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: 10, color: '#5b5d74', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 4px' }}>Current Balance</p>
              <p style={{ fontSize: 56, fontWeight: 'bold', color: '#8c4e35', margin: 0, fontFamily: 'Georgia, serif', letterSpacing: -1.5 }}>{balanceLabel}</p>
              <p style={{ fontSize: 13, fontWeight: 'bold', color: '#e29578', letterSpacing: 1.4, margin: '4px 0 0' }}>CREDITS</p>
              <p style={{ fontSize: 11, color: '#5b5d74', margin: '8px 0 0', textAlign: 'center', maxWidth: 180, lineHeight: 1.5 }}>
                Current available credits for Elena Lim.
              </p>
            </div>
          </div>

          {/* Top Up Button */}
          <button
            onClick={() => setShowTopUp(true)}
            style={{
              marginTop:   16,
              background:  'linear-gradient(11deg, #8c4e35 0%, #e29578 100%)',
              border:      'none',
              borderRadius: 9999,
              padding:     '16px 40px',
              display:     'flex',
              alignItems:  'center',
              gap:         10,
              cursor:      'pointer',
              boxShadow:   '0 10px 15px -3px rgba(140,78,53,0.2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" /></svg>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600, letterSpacing: 2.1, textTransform: 'uppercase' }}>Top Up Balance</span>
          </button>
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {lastCancellation?.result ? (
            <div style={{ background: 'white', borderRadius: 32, padding: 28, boxShadow: '0 20px 50px 0 rgba(140,78,53,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>Latest wallet update</p>
                  <p style={{ fontSize: 22, color: '#1a1c1c', fontFamily: 'Georgia, serif', margin: '10px 0 6px' }}>
                    {lastCancellation.result.refund_policy === 'refund' ? 'Credits Refunded' : 'No Refund Applied'}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: '#5b5d74', lineHeight: 1.6 }}>
                    {lastCancellation.result.wallet?.message || lastCancellation.result.message}
                  </p>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'rgba(140,78,53,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={lastCancellation.result.refund_policy === 'refund' ? 'undo' : 'creditsSpent'} size={22} color="#8c4e35" />
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ background: 'white', borderRadius: 32, padding: 28, boxShadow: '0 20px 50px 0 rgba(140,78,53,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'rgba(140,78,53,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="creditsSpent" size={22} color="#8c4e35" />
              </div>
              <span style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>This Month</span>
            </div>
            <p style={{ fontSize: 22, color: '#1a1c1c', fontFamily: 'Georgia, serif', margin: '16px 0 4px' }}>Credits Spent</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingBottom: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 'bold', color: '#8c4e35', fontFamily: 'Georgia, serif' }}>
                {Number.isFinite(walletBalance) ? (1000 - walletBalance) : '--'}
              </span>
              <span style={{ fontSize: 12, color: '#5b5d74' }}>Credits</span>
            </div>
            <div style={{ height: 4, background: '#eee', borderRadius: 9999 }}>
              <div style={{ height: '100%', width: `${Math.min(100, Number.isFinite(walletBalance) ? ((1000 - walletBalance) / 10) : 0)}%`, background: '#8c4e35', borderRadius: 9999 }} />
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 32, padding: 28, boxShadow: '0 20px 50px 0 rgba(140,78,53,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'rgba(91,93,116,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="24" fill="#5b5d74" style={{ opacity: 0.7 }}>
                  <path d="M12 4c1.11 0 2 .89 2 2s-.89 2-2 2s-2-.89-2-2s.9-2 2-2m9 12v-2c-2.24 0-4.16-.96-5.6-2.68l-1.34-1.6A1.98 1.98 0 0 0 12.53 9H11.5c-.61 0-1.17.26-1.55.72l-1.34 1.6C7.16 13.04 5.24 14 3 14v2c2.77 0 5.19-1.17 7-3.25V15l-3.88 1.55c-.67.27-1.12.95-1.12 1.66C5 19.2 5.8 20 6.79 20H9v-.5a2.5 2.5 0 0 1 2.5-2.5h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.83 0-1.5.67-1.5 1.5v.5h7.21c.99 0 1.79-.8 1.79-1.79c0-.71-.45-1.39-1.12-1.66L14 15v-2.25c1.81 2.08 4.23 3.25 7 3.25" />
                </svg>
              </div>
              <span style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>Total Growth</span>
            </div>
            <p style={{ fontSize: 22, color: '#1a1c1c', fontFamily: 'Georgia, serif', margin: '16px 0 4px' }}>Recovery Gained</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingBottom: 16 }}>
              <span style={{ fontSize: 30, fontWeight: 'bold', color: '#5b5d74', fontFamily: 'Georgia, serif' }}>42h</span>
              <span style={{ fontSize: 12, color: '#5b5d74' }}>Mindfulness</span>
            </div>
            <div style={{ height: 4, background: '#eee', borderRadius: 9999 }}>
              <div style={{ height: '100%', width: '82%', background: '#5b5d74', borderRadius: 9999 }} />
            </div>
          </div>

          <div style={{ background: '#f3f3f3', borderRadius: 32, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Icon name="trophy" size={16} color="#8c4e35" />
              <span style={{ fontSize: 20, fontFamily: 'Georgia, serif', color: '#1a1c1c' }}>Milestones</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {milestones.map((milestone) => (
                <div key={milestone.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: milestone.opacity }}>
                  <div style={{ width: 52, height: 52, borderRadius: 9999, background: milestone.bg, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {milestone.customSvg === 'zenMaster' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#8c4e35" width="32" height="32">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    )}
                    {milestone.customSvg === 'tenSessions' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#8c4e35" width="32" height="32">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                      </svg>
                    )}
                    {milestone.customSvg === 'soulFlow' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#8c4e35" width="32" height="32">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#53433e', textTransform: 'uppercase', letterSpacing: -0.45 }}>{milestone.label}</span>
                </div>
              ))}
            </div>
          </div>

          {[
            { img: imgCWSolarGratitude, name: 'Solar Gratitude', loc: 'West Mall', lead: 'Lead: Elena Thorne', amount: '-45', date: 'Oct 24, 08:30 AM' },
            { img: imgCWLunarBreath, name: 'Lunar Breath', loc: 'ION Orchard', lead: 'Lead: Julian Sol', amount: '-60', date: 'Oct 22, 06:00 PM' },
          ].map((transaction) => (
            <div key={transaction.name} style={{ background: 'white', borderRadius: 24, padding: 20, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 52, height: 60, borderRadius: 14, overflow: 'hidden', background: 'rgba(140,78,53,0.1)', flexShrink: 0 }}>
                  <img src={transaction.img} alt={transaction.name} style={{ width: '131%', height: '100%', objectFit: 'cover', marginLeft: '-16%', opacity: 0.8 }} />
                </div>
                <div>
                  <p style={{ fontSize: 17, fontFamily: 'Georgia, serif', color: '#1a1c1c', margin: '0 0 4px' }}>{transaction.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Icon name="pin" size={12} color="#5b5d74" />
                    <p style={{ fontSize: 13, color: '#5b5d74', margin: 0 }}>{transaction.loc}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="person" size={12} color="#5b5d74" />
                    <p style={{ fontSize: 13, color: '#5b5d74', margin: 0 }}>{transaction.lead}</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#8c4e35', fontFamily: 'Georgia, serif' }}>{transaction.amount}</span>
                <span style={{ fontSize: 10, color: '#5b5d74', textTransform: 'uppercase', letterSpacing: 1 }}>{transaction.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={() => {
            setShowTopUp(false)
          }}
        />
      )}
    </div>
  )
}
