import {
  imgBreathwork,
  imgEXHiit,
  imgEXMeditation,
  imgEXPilates,
  imgMorningYoga,
} from './assets.js'

export const explorePractices = [
  {
    classId: 101,
    img: imgEXPilates,
    spots: '8 SPOTS LEFT',
    name: 'Morning Reformer',
    credits: 15,
    desc: 'A low-impact, high-intensity session focusing on core stability and alignment.',
    type: 'Pilates • Med',
    category: 'Pilates • Medium Intensity',
    duration: '50 mins',
    instructor: 'Sasha Gray',
    rating: '4.9',
    date: 'Friday 11 April',
    shortDate: 'Fri 11 Apr',
    time: '08:30 AM',
    location: 'Studio A, West Mall',
    lead: 'Lead: Sasha Gray',
  },
  {
    classId: 102,
    img: imgEXHiit,
    spots: '2 SPOTS LEFT',
    name: 'Ignite HIIT',
    credits: 25,
    desc: 'Push your limits with high-octane intervals designed to boost metabolism.',
    type: 'HIIT • High',
    category: 'HIIT • High Intensity',
    duration: '40 mins',
    instructor: 'David Chen',
    rating: '4.8',
    date: 'Saturday 12 April',
    shortDate: 'Sat 12 Apr',
    time: '07:00 PM',
    location: 'Skyline Studio, ION Orchard',
    lead: 'Lead: David Chen',
  },
  {
    classId: 103,
    img: imgEXMeditation,
    spots: '5 SPOTS LEFT',
    name: 'Lunar Yin Yoga',
    credits: 18,
    desc: 'A restorative practice focused on deep connective tissue and meditation.',
    type: 'Yoga • Low',
    category: 'Yoga • Low Intensity',
    duration: '60 mins',
    instructor: 'Aria Veda',
    rating: '5.0',
    date: 'Sunday 13 April',
    shortDate: 'Sun 13 Apr',
    time: '06:30 PM',
    location: 'Moon Hall, Riverfront',
    lead: 'Lead: Aria Veda',
  },
]

export const initialUpcomingBookings = []

export function createUpcomingBooking(practice, bookingId, overrides = {}) {
  return {
    bookingId,
    classId: practice.classId,
    img: practice.img,
    date: practice.shortDate,
    time: practice.time,
    name: practice.name,
    instructor: practice.instructor,
    location: practice.location,
    credits: practice.credits,
    canCancel: true,
    ...overrides,
  }
}

export const initialPastBookings = [
  { img: imgMorningYoga, date: 'Tue 8 Apr', name: 'Solar Gratitude', stars: 5, credits: -45 },
  { img: imgBreathwork, date: 'Sun 6 Apr', name: 'Lunar Breath', stars: 5, credits: -60 },
]
