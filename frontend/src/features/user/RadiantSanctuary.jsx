import { useEffect, useState } from 'react'
import { bookClass, cancelBooking, fetchUser, fetchWalletBalance, fetchWalletLedger } from './api.js'
import { createUpcomingBooking, explorePractices, initialPastBookings, initialUpcomingBookings } from './bookingData.js'
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
const USER_ID = 1001
const DEFAULT_PRACTICE = explorePractices[0]
const practiceOrder = new Map(explorePractices.map((practice, index) => [practice.classId, index]))

function sortUpcomingBookings(bookings) {
  return [...bookings].sort((left, right) => (
    (practiceOrder.get(left.classId) ?? Number.MAX_SAFE_INTEGER)
    - (practiceOrder.get(right.classId) ?? Number.MAX_SAFE_INTEGER)
  ))
}

function parseSpotCount(spotsLabel) {
  const match = String(spotsLabel).match(/\d+/)
  return match ? Number(match[0]) : 0
}

function formatSpotCount(count) {
  return `${Math.max(count, 0)} SPOTS LEFT`
}

function updatePracticeSpots(practices, classId, delta) {
  return practices.map((practice) => {
    if (practice.classId !== classId) return practice

    return {
      ...practice,
      spots: formatSpotCount(parseSpotCount(practice.spots) + delta),
    }
  })
}

function calculateCreditsSpent(entries) {
  const total = (Array.isArray(entries) ? entries : []).reduce((sum, entry) => {
    const amount = Number(entry?.amount)
    if (!Number.isFinite(amount)) return sum
    if (entry?.type === 'DEBIT') return sum + amount
    if (entry?.type === 'REFUND') return sum - amount
    return sum
  }, 0)

  return Math.max(total, 0)
}

export default function RadiantSanctuary({ onSwitchToAdmin }) {
  const [history, setHistory] = useState(['homepage'])
  const screen = history[history.length - 1]
  const [user, setUser] = useState({ id: USER_ID, name: 'Elena Lim', img: null })
  const [practices, setPractices] = useState(() => explorePractices.map((practice) => ({ ...practice })))
  const [upcomingBookings, setUpcomingBookings] = useState(() => sortUpcomingBookings(initialUpcomingBookings))
  const [pastBookings] = useState(initialPastBookings)
  const [selectedBookingId, setSelectedBookingId] = useState(initialUpcomingBookings[0]?.bookingId ?? null)
  const [selectedPracticeId, setSelectedPracticeId] = useState(DEFAULT_PRACTICE.classId)
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null)
  const [bookedPracticeIds, setBookedPracticeIds] = useState(() => initialUpcomingBookings.map((booking) => booking.classId))
  const [walletBalance, setWalletBalance] = useState(null)
  const [creditsSpent, setCreditsSpent] = useState(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancellationError, setCancellationError] = useState('')
  const [lastCancellation, setLastCancellation] = useState(null)

  const refreshWalletState = async () => {
    const [wallet, ledger] = await Promise.all([
      fetchWalletBalance(USER_ID),
      fetchWalletLedger(USER_ID),
    ])

    const nextBalance = Number(wallet?.balance)
    setWalletBalance(Number.isFinite(nextBalance) ? nextBalance : null)
    setCreditsSpent(calculateCreditsSpent(ledger?.entries))
  }

  useEffect(() => {
    fetchUser(USER_ID)
      .then((data) => {
        setUser((current) => ({
          ...current,
          ...data,
          name: data.name || current.name,
          img: data.img || current.img || null,
        }))
      })
      .catch((error) => {
        console.error('Failed to fetch user:', error)
      })

    refreshWalletState().catch((error) => {
      console.error('Failed to fetch wallet state:', error)
    })
  }, [])

  const setScreen = (nextScreen) => {
    setHistory((current) => {
      const currentScreen = current[current.length - 1]
      if (currentScreen === nextScreen) return current
      if (tabScreens.has(nextScreen)) return [nextScreen]
      return [...current, nextScreen]
    })

    setTimeout(() => {
      const container = document.querySelector('[data-radiant-scroll]') || window
      if (container.scrollTo) container.scrollTo(0, 0)
    }, 0)
  }

  const nextBooking = upcomingBookings[0] ?? null
  const selectedBooking = upcomingBookings.find((booking) => booking.bookingId === selectedBookingId) ?? nextBooking
  const selectedPractice = practices.find((practice) => practice.classId === selectedPracticeId) ?? practices[0] ?? DEFAULT_PRACTICE
  const confirmationPractice = lastConfirmedBooking ?? selectedPractice ?? DEFAULT_PRACTICE

  const isPracticeBooked = (practice) => {
    if (!practice?.classId) return false
    return bookedPracticeIds.includes(practice.classId)
  }

  const openPractice = (practice, nextScreen) => {
    if (practice?.classId) {
      setSelectedPracticeId(practice.classId)
    }

    if (nextScreen === 'confirmBooking') {
      setBookingError('')
    }

    setScreen(nextScreen)
  }

  const openBooking = (booking, nextScreen = 'classDetails') => {
    if (booking?.bookingId) {
      setSelectedBookingId(booking.bookingId)
    }

    if (booking?.classId) {
      setSelectedPracticeId(booking.classId)
    }

    setScreen(nextScreen)
  }

  const startCancellation = (booking) => {
    if (!booking?.bookingId) return

    setSelectedBookingId(booking.bookingId)
    setCancellationError('')
    setScreen('cancelBooking')
  }

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) {
      setCancellationError('Missing booking id.')
      return
    }

    const booking = upcomingBookings.find((item) => item.bookingId === bookingId) ?? null

    setIsCancelling(true)
    setCancellationError('')

    try {
      const result = await cancelBooking({
        bookingId,
        userId: USER_ID,
      })

      const nextBalance = Number(result?.wallet?.balance)
      const walletAmount = Number(result?.wallet?.amount)
      const shouldRefreshWalletState = !Number.isFinite(nextBalance)
        || (result?.refund_policy === 'refund' && !Number.isFinite(walletAmount))

      if (Number.isFinite(nextBalance)) {
        setWalletBalance(nextBalance)
      }

      if (shouldRefreshWalletState) {
        await refreshWalletState()
      } else if (result?.refund_policy === 'refund' && Number.isFinite(walletAmount)) {
        setCreditsSpent((current) => (
          Number.isFinite(current) ? Math.max(current - walletAmount, 0) : 0
        ))
      }

      if (booking?.classId) {
        setBookedPracticeIds((current) => current.filter((classId) => classId !== booking.classId))
        setPractices((current) => updatePracticeSpots(current, booking.classId, 1))
      }

      setLastCancellation({
        booking,
        result,
      })
      setUpcomingBookings((current) => current.filter((item) => item.bookingId !== bookingId))
      setSelectedBookingId(null)
      setScreen('bookingCancellation')
    } catch (error) {
      setCancellationError(error.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleConfirmBooking = async () => {
    const practice = selectedPractice ?? DEFAULT_PRACTICE
    if (!practice || isPracticeBooked(practice) || isBooking) return

    setIsBooking(true)
    setBookingError('')

    try {
      const result = await bookClass({
        userId: USER_ID,
        classId: practice.classId,
        credits: practice.credits,
      })

      const bookingId = Number(result?.booking?.booking_id)
      const walletAmount = Number(result?.wallet?.amount)
      const nextBalance = Number(result?.wallet?.balance)
      const shouldRefreshWalletState = !Number.isFinite(nextBalance) || !Number.isFinite(walletAmount)

      if (!Number.isFinite(bookingId)) {
        throw new Error('Booking completed but no booking ID was returned.')
      }

      const booking = createUpcomingBooking(practice, bookingId, {
        credits: Number.isFinite(walletAmount) ? walletAmount : practice.credits,
      })

      if (Number.isFinite(nextBalance)) {
        setWalletBalance(nextBalance)
      }

      if (shouldRefreshWalletState) {
        await refreshWalletState()
      } else {
        setCreditsSpent((current) => (
          Number.isFinite(current) ? current + walletAmount : walletAmount
        ))
      }

      setUpcomingBookings((current) => sortUpcomingBookings([...current, booking]))
      setBookedPracticeIds((current) => (
        current.includes(practice.classId) ? current : [...current, practice.classId]
      ))
      setPractices((current) => updatePracticeSpots(current, practice.classId, -1))
      setSelectedBookingId(bookingId)
      setLastConfirmedBooking(booking)
      setScreen('bookingConfirmed')
    } catch (error) {
      setBookingError(error.message)
    } finally {
      setIsBooking(false)
    }
  }

  const goBack = (fallback = 'homepage') => {
    setHistory((current) => (current.length > 1 ? current.slice(0, -1) : [fallback]))
  }

  const sharedProps = {
    setScreen,
    goBack,
    user,
    nextBooking,
    selectedBooking,
    selectedPractice,
    confirmationPractice,
    upcomingBookings,
    pastBookings,
    practices,
    walletBalance,
    creditsSpent,
    isBooking,
    bookingError,
    isCancelling,
    cancellationError,
    lastCancellation,
    startCancellation,
    handleCancelBooking,
    handleConfirmBooking,
    openPractice,
    openBooking,
    isPracticeBooked,
    isSelectedPracticeBooked: isPracticeBooked(selectedPractice),
  }

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
