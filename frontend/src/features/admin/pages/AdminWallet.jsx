import { useEffect, useState } from 'react'
import TopAppBar  from '../components/TopAppBar.jsx'
import PayoutRow  from '../components/PayoutRow.jsx'
import Icon       from '../components/Icons.jsx'
import { colors, fonts, radius } from '../tokens.js'
import { fetchProviderDetails } from '../../user/api.js'

const PROVIDER_ID = 1

export default function AdminWallet() {
  const [provider, setProvider]   = useState(null)
  const [loading,  setLoading]    = useState(true)

  useEffect(() => {
    fetchProviderDetails(PROVIDER_ID)
      .then(setProvider)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const providerName    = provider?.name               ?? 'Provider'
  const providerEmail   = provider?.email              ?? '—'
  const providerBiz     = provider?.provider_business_name ?? '—'
  const payoutAccountId = provider?.payout_account_id  ?? '—'

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Provider Overview Header ─────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 12, color: colors.brownDark, textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Provider Overview
          </span>
          <h1 style={{ fontFamily: fonts.serif, fontWeight: 400, fontSize: 44, color: colors.textDark, margin: 0, lineHeight: 1.05, letterSpacing: -1 }}>
            {loading ? 'Loading…' : providerBiz || providerName}
          </h1>
          <p style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.textMid, margin: 0, lineHeight: 1.6 }}>
            Your studio impact is expanding. Here is the pulse of your professional practice this morning.
          </p>
        </section>

        {/* ── Provider Info Card ───────────────────────── */}
        {!loading && (
          <section style={{ backgroundColor: colors.cardBg, borderRadius: radius.lg, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontFamily: fonts.serif, fontWeight: 400, fontSize: 18, color: colors.textDark, margin: 0 }}>Account Details</h3>
            {[
              { label: 'Name',           value: providerName },
              { label: 'Email',          value: providerEmail },
              { label: 'Business',       value: providerBiz },
              { label: 'Stripe Account', value: payoutAccountId },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.brownLight}20`, paddingBottom: 8 }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted }}>{label}</span>
                <span style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 600, color: colors.textDark, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
              </div>
            ))}
          </section>
        )}

        {/* ── Balance Card ─────────────────────────────── */}
        <section style={{ backgroundColor: colors.teal, borderRadius: radius.xl, padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -20, right: -20, width: 120, height: 120, borderRadius: 9999, border: `2px solid rgba(164,241,231,0.2)`, opacity: 0.4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.tealLight, textTransform: 'uppercase', letterSpacing: 1.2, opacity: 0.85 }}>
              Stripe Payout Account
            </span>
            <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 28, color: colors.cardBg, margin: 0, letterSpacing: -0.5, wordBreak: 'break-all' }}>
              {loading ? 'Loading…' : payoutAccountId}
            </h2>
            <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.tealLight, margin: 0, opacity: 0.85 }}>
              Payouts are processed automatically after each class is completed.
            </p>
          </div>
        </section>

        {/* ── Recent Payouts placeholder ───────────────── */}
        <section style={{ backgroundColor: colors.cardBg, borderRadius: radius.lg, padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontFamily: fonts.serif, fontWeight: 400, fontSize: 22, color: colors.textDark, margin: 0 }}>
            Recent Payouts
          </h3>
          <p style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted, margin: 0, lineHeight: 1.6 }}>
            Payout history is recorded in Stripe. Visit your{' '}
            <a href="https://dashboard.stripe.com/test/transfers" target="_blank" rel="noreferrer"
              style={{ color: colors.brownDark, fontWeight: 600 }}>
              Stripe Dashboard
            </a>{' '}
            to view all processed transfers.
          </p>
          <button
            onClick={() => window.open('https://dashboard.stripe.com/test/transfers', '_blank')}
            style={{ border: `2px solid ${colors.brownLight}`, borderRadius: 9999, backgroundColor: 'transparent', color: colors.brownDark, fontFamily: fonts.sans, fontWeight: 700, fontSize: 13, padding: '13px 0', cursor: 'pointer', width: '100%' }}>
            View in Stripe →
          </button>
        </section>
      </main>
    </div>
  )
}
