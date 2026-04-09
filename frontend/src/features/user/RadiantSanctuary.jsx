import { useEffect, useState } from 'react'
import {
  bookClass,
  cancelBooking,
  fetchClasses,
  fetchUser,
  fetchUserBookings,
  fetchWalletBalance,
} from './api.js'
import { imgFallback, practiceImages, practiceMetadata } from './bookingData.js'
import BottomNav           from './components/BottomNav.jsx'
import BookingCancellation from './pages/BookingCancellation.jsx'
import BookingConfirmed    from './pages/BookingConfirmed.jsx'
import Bookings            from './pages/Bookings.jsx'
import CancelBooking       from './pages/CancelBooking.jsx'
import ClassDetails        from './pages/ClassDetails.jsx'
import ConfirmBooking      from './pages/ConfirmBooking.jsx'
import Explore             from './pages/Explore.jsx'
import Filter              from './pages/Filter.jsx'
import Homepage            from './pages/Homepage.jsx'
import Profile             from './pages/Profile.jsx'
import Wallet              from './pages/Wallet.jsx'

const tabScreens = new Set(['homepage', 'explore', 'bookings', 'wallet', 'profile'])
const USER_ID    = 1001

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatShortDate(dateStr, timeStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day  = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
  const time = timeStr ? timeStr.slice(0, 5) : ''
  return time ? `${day}, ${time}` : day
}

function formatFullDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Map a raw class from backend → practice object used by the UI
function classToPractice(cls) {
  const meta = practiceMetadata[cls.class_id] ?? practiceMetadata['default']
  return {
    classId:     cls.class_id,
    backendClassId: cls.class_id,
    name:        cls.class_name,
    credits:     1,
    spots:       `${cls.available_slots} SPOTS LEFT`,
    date:        formatFullDate(cls.date),
    shortDate:   formatShortDate(cls.date, cls.start_time),
    time:        cls.start_time ? cls.start_time.slice(0, 5) : '',
    location:    cls.location ?? 'Studio',
    duration:    cls.duration ? `${cls.duration} mins` : '',
    instructor:  meta.instructor,
    type:        meta.type,
    category:    meta.category,
    desc:        meta.desc,
    rating:      meta.rating,
    lead:        `Lead: ${meta.instructor}`,
    img:         meta.img,
    status:      cls.status,
  }
}

// Map a raw booking from backend → booking object used by the UI
function rawBookingToUi(rawBooking, practiceMap) {
  const practice = practiceMap[rawBooking.class_id]
  return {
    bookingId:  rawBooking.booking_id,
    classId:    rawBooking.class_id,
    name:       practice?.name        ?? `Class #${rawBooking.class_id}`,
    img:        practice?.img         ?? imgFallback,
    date:       practice?.shortDate   ?? rawBooking.booked_at?.slice(0, 10) ?? '',
    time:       practice?.time        ?? '',
    instructor: practice?.instructor  ?? '',
    location:   practice?.location    ?? '',
    credits:    practice?.credits     ?? 1,
    canCancel:  rawBooking.status === 'booked',
    status:     rawBooking.status,
  }
}

function parseSpotCount(spotsLabel) {
  const match = String(spotsLabel).match(/\d+/)
  return match ? Number(match[0]) : 0
}

function formatSpotCount(count) {
  return `${Math.max(count, 0)} SPOTS LEFT`
}

function updatePracticeSpots(practices, classId, delta) {
  return practices.map((p) =>
    p.classId !== classId ? p : { ...p, spots: formatSpotCount(parseSpotCount(p.spots) + delta) }
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RadiantSanctuary({ onSwitchToAdmin }) {
  const [history, setHistory]           = useState(['homepage'])
  const screen                          = history[history.length - 1]

  const [user, setUser]                 = useState({ id: USER_ID, name: 'Elena Lim', img: null })
  const [walletBalance, setWalletBalance] = useState(null)
  const [practices, setPractices]       = useState([])
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])
  const [loading, setLoading]           = useState(true)

  const [selectedBookingId, setSelectedBookingId]   = useState(null)
  const [selectedPracticeId, setSelectedPracticeId] = useState(null)
  const [lastBookedPracticeId, setLastBookedPracticeId] = useState(null)
  const [bookedClassIds, setBookedClassIds]         = useState([])

  const [isCancelling, setIsCancelling]     = useState(false)
  const [cancellationError, setCancellationError] = useState('')
  const [lastCancellation, setLastCancellation]   = useState(null)
  const [bookingError, setBookingError]     = useState('')

  // ── Handle Stripe top-up redirect ────────────────────────────────────────────
  useEffect(() => {
    const params  = new URLSearchParams(window.location.search)
    const status  = params.get('topup')
    const credits = params.get('credits')
    if (status === 'success' && credits) {
      // Navigate to wallet tab so user sees the success banner
      setHistory(['wallet'])
    }
  }, [])

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [userData, walletData, classesRaw, bookingsRaw] = await Promise.allSettled([
          fetchUser(USER_ID),
          fetchWalletBalance(USER_ID),
          fetchClasses(),
          fetchUserBookings(USER_ID),
        ])

        if (userData.status === 'fulfilled') {
          setUser((prev) => ({ ...prev, ...userData.value, name: userData.value.name || prev.name }))
        }

        if (walletData.status === 'fulfilled') {
          setWalletBalance(walletData.value.balance)
        }

        const classes = classesRaw.status === 'fulfilled' ? classesRaw.value : []
        const scheduledClasses = classes.filter((c) => c.status === 'Scheduled')
        const practiceList = scheduledClasses.map(classToPractice)
        setPractices(practiceList)

        const practiceMap = {}
        practiceList.forEach((p) => { practiceMap[p.classId] = p })

        if (bookingsRaw.status === 'fulfilled') {
          const allBookings = bookingsRaw.value
          const upcoming = allBookings
            .filter((b) => b.status === 'booked')
            .map((b) => rawBookingToUi(b, practiceMap))
          const past = allBookings
            .filter((b) => b.status !== 'booked')
            .map((b) => rawBookingToUi(b, practiceMap))
          setUpcomingBookings(upcoming)
          setPastBookings(past)
          setBookedClassIds(upcoming.map((b) => b.classId))
          if (upcoming.length) setSelectedBookingId(upcoming[0].bookingId)
        }

        if (practiceList.length) setSelectedPracticeId(practiceList[0].classId)

      } catch (err) {
        console.error('Failed to load initial data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // ── Navigation ────────────────────────────────────────────────────────────
  const setScreen = (nextScreen) => {
    setHistory((prev) => {
      const current = prev[prev.length - 1]
      if (current === nextScreen) return prev
      if (tabScreens.has(nextScreen)) return [nextScreen]
      return [...prev, nextScreen]
    })
    setTimeout(() => {
      const el = document.querySelector('[data-radiant-scroll]') || window
      if (el.scrollTo) el.scrollTo(0, 0)
    }, 0)
  }

  const goBack = (fallback = 'homepage') => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : [fallback]))
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const nextBooking       = upcomingBookings[0] ?? null
  const selectedBooking   = upcomingBookings.find((b) => b.bookingId === selectedBookingId) ?? nextBooking
  const selectedPractice  = practices.find((p) => p.classId === selectedPracticeId) ?? practices[0] ?? null
  const confirmationPractice = practices.find((p) => p.classId === lastBookedPracticeId) ?? selectedPractice ?? null

  const isPracticeBooked  = (practice) => !!practice?.classId && bookedClassIds.includes(practice.classId)

  // ── Actions ───────────────────────────────────────────────────────────────
  const openPractice = (practice, nextScreen) => {
    if (practice?.classId) setSelectedPracticeId(practice.classId)
    setScreen(nextScreen)
  }

  const openBooking = (booking, nextScreen = 'classDetails') => {
    if (booking?.bookingId) setSelectedBookingId(booking.bookingId)
    if (booking?.classId)   setSelectedPracticeId(booking.classId)
    setScreen(nextScreen)
  }

  const startCancellation = (booking) => {
    if (!booking?.bookingId) return
    setSelectedBookingId(booking.bookingId)
    setCancellationError('')
    setScreen('cancelBooking')
  }

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) { setCancellationError('Missing booking id.'); return }
    const booking = upcomingBookings.find((b) => b.bookingId === bookingId) ?? null
    setIsCancelling(true)
    setCancellationError('')
    try {
      const result = await cancelBooking({ bookingId, userId: USER_ID })
      const nextBalance = Number(result?.wallet?.balance)
      if (Number.isFinite(nextBalance)) setWalletBalance(nextBalance)
      if (booking?.classId) {
        setBookedClassIds((prev) => prev.filter((id) => id !== booking.classId))
        setPractices((prev) => updatePracticeSpots(prev, booking.classId, 1))
      }
      setLastCancellation({ booking, result })
      setUpcomingBookings((prev) => prev.filter((b) => b.bookingId !== bookingId))
      setSelectedBookingId(null)
      setScreen('bookingCancellation')
    } catch (error) {
      setCancellationError(error.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleConfirmBooking = async () => {
    const practice = selectedPractice
    if (!practice) return
    setBookingError('')
    setLastBookedPracticeId(practice.classId)

    if (!isPracticeBooked(practice)) {
      try {
        const result = await bookClass({ userId: USER_ID, classId: practice.backendClassId ?? practice.classId })
        const realBookingId = result?.booking?.booking_id
        const newBalance    = result?.wallet?.balance

        if (Number.isFinite(newBalance)) setWalletBalance(newBalance)

        const newBooking = {
          bookingId:  realBookingId,
          classId:    practice.classId,
          name:       practice.name,
          img:        practice.img,
          date:       practice.shortDate,
          time:       practice.time,
          instructor: practice.instructor,
          location:   practice.location,
          credits:    practice.credits,
          canCancel:  true,
          status:     'booked',
        }

        setUpcomingBookings((prev) => [newBooking, ...prev])
        setBookedClassIds((prev) => prev.includes(practice.classId) ? prev : [...prev, practice.classId])
        setPractices((prev) => updatePracticeSpots(prev, practice.classId, -1))
        setSelectedBookingId(realBookingId)
      } catch (error) {
        console.error('Booking failed:', error)
        setBookingError(error.message)
      }
    }

    setScreen('bookingConfirmed')
  }

  // ── Shared props ──────────────────────────────────────────────────────────
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
    setWalletBalance,
    loading,
    isCancelling,
    cancellationError,
    bookingError,
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
    homepage:           <Homepage         {...sharedProps} />,
    explore:            <Explore          {...sharedProps} />,
    bookings:           <Bookings         {...sharedProps} />,
    wallet:             <Wallet           {...sharedProps} />,
    profile:            <Profile          {...sharedProps} onSwitchToAdmin={onSwitchToAdmin} />,
    filter:             <Filter           {...sharedProps} />,
    confirmBooking:     <ConfirmBooking   {...sharedProps} />,
    cancelBooking:      <CancelBooking    {...sharedProps} />,
    bookingCancellation:<BookingCancellation {...sharedProps} />,
    classDetails:       <ClassDetails     {...sharedProps} />,
    bookingConfirmed:   <BookingConfirmed  {...sharedProps} />,
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
