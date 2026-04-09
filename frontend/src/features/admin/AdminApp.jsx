import { useEffect, useState } from 'react'
import AdminNav from './components/AdminNav.jsx'
import AdminHomepage from './pages/AdminHomepage.jsx'
import AdminWallet from './pages/AdminWallet.jsx'
import AdminStatistics from './pages/AdminStatistics.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import ProviderDashboard from './pages/ProviderDashboard.jsx'

// ─── AdminApp ────────────────────────────────────────────────────────────────
// State-based router for all admin pages.
// Switch to user app by calling the onSwitchToUser prop (passed from main.jsx).

export default function AdminApp({ onSwitchToUser }) {
  const [tab, setTab] = useState('home')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  const pages = {
    home: <AdminHomepage />,
    payouts: <ProviderDashboard />,
    stats: <AdminStatistics />,
    wallet: <AdminWallet />,
    profile: <AdminProfile onSwitchToUser={onSwitchToUser} />,
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 390,
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#fef8f4',
        overflowX: 'hidden',
      }}
    >
      {pages[tab]}
      <AdminNav activeTab={tab} onTabChange={setTab} />
    </div>
  )
}
