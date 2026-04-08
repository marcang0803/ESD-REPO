import { useState, useEffect } from 'react'
import { fetchUser } from './api.js'
import BottomNav from './components/BottomNav.jsx'
import BookingCancellation from './pages/BookingCancellation.jsx'
import BookingConfirmed from './pages/BookingConfirmed.jsx'
import Bookings from './pages/Bookings.jsx'
import CancelBooking from './pages/CancelBooking.jsx'
import ClassDetails from './pages/ClassDetails.jsx'
import ConfirmBooking from './pages/ConfirmBooking.jsx'
import Explore from './pages/Explore.jsx'
import Filter from './pages/Filter.jsx'
import Homepage from './pages/Homepage.jsx'
import Profile from './pages/Profile.jsx'
import Wallet from './pages/Wallet.jsx'

const tabScreens = new Set(['homepage', 'explore', 'bookings', 'wallet', 'profile'])

export default function RadiantSanctuary({ onSwitchToAdmin }) {
  const [history, setHistory] = useState(['homepage'])
  const screen = history[history.length - 1]
  const [user, setUser] = useState({ name: 'Loading...', img: null })

  useEffect(() => {
    fetchUser(1001)
      .then((data) => {
        console.log('Fetched user data:', data);
        setUser({ name: data.name || 'Unknown', img: data.img || null });
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        setUser({ name: 'Unknown', img: null });
      });
  }, [])

  const setScreen = (nextScreen) => {
    setHistory((current) => {
      const currentScreen = current[current.length - 1]
      if (currentScreen === nextScreen) return current
      if (tabScreens.has(nextScreen)) return [nextScreen]
      return [...current, nextScreen]
    })
    // Scroll to top on page change
    setTimeout(() => {
      const container = document.querySelector('[data-radiant-scroll]') || window;
      if (container.scrollTo) container.scrollTo(0, 0);
    }, 0);
  }

  const goBack = (fallback = 'homepage') => {
    setHistory((current) => (current.length > 1 ? current.slice(0, -1) : [fallback]))
  }

  const sharedProps = { setScreen, goBack, user }

  const screens = {
    homepage: <Homepage {...sharedProps} />, 
    explore: <Explore {...sharedProps} />, 
    bookings: <Bookings {...sharedProps} />, 
    wallet: <Wallet {...sharedProps} />, 
    profile: <Profile {...sharedProps} onSwitchToAdmin={onSwitchToAdmin} />, 
    filter: <Filter {...sharedProps} />, 
    confirmBooking: <ConfirmBooking {...sharedProps} />, 
    cancelBooking: <CancelBooking {...sharedProps} />, 
    bookingCancellation: <BookingCancellation {...sharedProps} />, 
    classDetails: <ClassDetails {...sharedProps} />, 
    bookingConfirmed: <BookingConfirmed {...sharedProps} />, 
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(226,149,120,0.18), rgba(248,244,241,0.72) 34%, #f8f4f1 70%)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, minHeight: '100vh', position: 'relative', background: '#f8f4f1', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -160, left: -80, width: 340, height: 340, borderRadius: 9999, background: 'rgba(226,149,120,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 40, right: -120, width: 260, height: 260, borderRadius: 9999, background: 'rgba(196,196,223,0.14)', filter: 'blur(46px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 104 }} data-radiant-scroll>
          {screens[screen] ?? screens.homepage}
        </div>
        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    </div>
  )
}
