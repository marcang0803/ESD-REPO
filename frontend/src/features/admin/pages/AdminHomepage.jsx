import TopAppBar from '../components/TopAppBar.jsx'
import ClassCard from '../components/ClassCard.jsx'
import ReviewCard from '../components/ReviewCard.jsx'
import Icon from '../components/Icons.jsx'
import { colors, fonts, radius, shadows } from '../tokens.js'

const imgReviewer1 = '/assets/img/elena-vance.png'
const imgReviewer2 = '/assets/img/elena-user.png'

const CLASSES = [
  { month: 'Oct', day: '12', title: 'Solar Flow',            time: '10:30 AM', students: '12 Students', isActive: true  },
  { month: 'Oct', day: '12', title: 'Power Yoga',            time: '4:00 PM',  students: '8 Students',  isActive: false },
  { month: 'Oct', day: '13', title: 'Restorative Alignment', time: '09:00 AM', students: '15 Students', isActive: false },
]

const REVIEWS = [
  {
    quote:     'Loved the energy! The focus on intentional breathing during the flow was exactly what I needed.',
    reviewer:  'Sarah K.',
    avatarSrc: imgReviewer1,
    rating:    5,
  },
  {
    quote:     'Elena is a master of her craft. The class felt personal even with 12 others in the room.',
    reviewer:  'David M.',
    avatarSrc: imgReviewer2,
    rating:    5,
  },
]

export default function AdminHomepage() {
  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingBottom: 120 }}>
      <TopAppBar />

      <main style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* ── Welcome Hero ─────────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            style={{
              fontFamily:    fonts.sans,
              fontWeight:    500,
              fontSize:      13,
              color:         'rgba(111,55,32,0.7)',
              textTransform: 'uppercase',
              letterSpacing: 1.4,
            }}
          >
            Welcome back
          </span>

          <div>
            <h1
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize:   36,
                color:      colors.textDark,
                margin:     0,
                lineHeight: 1.25,
              }}
            >
              Good Morning,
            </h1>
            <h1
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize:   36,
                color:      colors.brownDark,
                margin:     0,
                lineHeight: 1.25,
              }}
            >
              Elena.
            </h1>
          </div>

          <p
            style={{
              fontFamily: fonts.serif,
              fontSize:   17,
              color:      colors.textMid,
              margin:     0,
              lineHeight: 1.6,
            }}
          >
            Your studio is ready for today's sessions. You have 3 classes scheduled.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              style={{
                backgroundColor: colors.brownDark,
                color:           colors.white,
                fontFamily:      fonts.sans,
                fontWeight:      600,
                fontSize:        15,
                border:          'none',
                borderRadius:    9999,
                padding:         '14px 28px',
                cursor:          'pointer',
                boxShadow:       '0px 10px 15px -3px rgba(111,55,32,0.2)',
              }}
            >
              Create New Class
            </button>
          </div>
        </section>

        {/* ── Upcoming Schedule ────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>
              Upcoming Schedule
            </h2>
            <button
              style={{
                background:  'none',
                border:      'none',
                fontFamily:  fonts.sans,
                fontWeight:  700,
                fontSize:    13,
                color:       colors.brownDark,
                cursor:      'pointer',
                padding:     0,
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CLASSES.map((c, i) => (
              <ClassCard key={i} {...c} />
            ))}
          </div>
        </section>

        {/* ── Recent Reviews ───────────────────────────── */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: fonts.serif, fontWeight: 700, fontSize: 22, color: colors.textDark, margin: 0 }}>
              Recent Reviews
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={13} color="#e29578" />
              <span style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, color: colors.brownDark }}>
                4.9
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {REVIEWS.map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
