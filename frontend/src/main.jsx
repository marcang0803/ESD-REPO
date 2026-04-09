import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import AdminApp from './features/admin/AdminApp.jsx'
import RadiantSanctuary from './features/user/RadiantSanctuary.jsx'
import './styles.css'

function Root() {
  const [mode, setMode] = useState(() =>
    window.location.hash.startsWith('#admin') ? 'admin' : 'user'
  )

  const switchToAdmin = () => {
    window.location.hash = 'admin'
    setMode('admin')
    window.scrollTo(0, 0)
  }

  const switchToUser = () => {
    window.location.hash = ''
    setMode('user')
    window.scrollTo(0, 0)
  }

  if (mode === 'admin') {
    return <AdminApp onSwitchToUser={switchToUser} />
  }

  return <RadiantSanctuary onSwitchToAdmin={switchToAdmin} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('[SW] Registered:', reg.scope))
      .catch((err) => console.warn('[SW] Registration failed:', err))
  })
}
}
