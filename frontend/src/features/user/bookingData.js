// bookingData.js
// UI metadata and practice/booking data structures

import {
  imgBreathwork,
  imgEXHiit,
  imgEXMeditation,
  imgEXPilates,
  imgMorningYoga,
} from './assets.js'

// Fallback image when no metadata match is found
export const imgFallback = imgMorningYoga

// Metadata for practices by class ID
export const practiceMetadata = {
  default: {
    instructor: 'Studio Instructor',
    type:       'Yoga • Med',
    category:   'Yoga • Medium Intensity',
    desc:       'A mindful session designed to restore balance and build strength.',
    rating:     '4.8',
    img:        imgMorningYoga,
  },
  101: {
    instructor: 'Sasha Gray',
    type:       'Pilates • Med',
    category:   'Pilates • Medium Intensity',
    desc:       'A low-impact, high-intensity session focusing on core stability.',
    rating:     '4.9',
    img:        imgEXPilates,
  },
  102: {
    instructor: 'David Chen',
    type:       'HIIT • High',
    category:   'HIIT • High Intensity',
    desc:       'Push your limits with high-octane intervals.',
    rating:     '4.8',
    img:        imgEXHiit,
  },
  103: {
    instructor: 'Aria Veda',
    type:       'Yoga • Low',
    category:   'Yoga • Low Intensity',
    desc:       'A restorative practice focused on deep relaxation.',
    rating:     '5.0',
    img:        imgEXMeditation,
  },
  104: {
    instructor: 'Julian Sol',
    type:       'Breathwork • Low',
    category:   'Breathwork • Low Intensity',
    desc:       'Breathing techniques to reduce stress.',
    rating:     '4.7',
    img:        imgBreathwork,
  },
  105: {
    instructor: 'Elena Thorne',
    type:       'Yoga • Med',
    category:   'Yoga • Medium Intensity',
    desc:       'A flowing practice to awaken and focus the mind.',
    rating:     '4.9',
    img:        imgMorningYoga,
  },
  106: {
    instructor: 'Marcus Reid',
    type:       'Pilates • High',
    category:   'Pilates • High Intensity',
    desc:       'Advanced pilates for maximum core activation.',
    rating:     '4.8',
    img:        imgEXPilates,
  },
}

// Available classes/practices for booking
export const explorePractices = [
  {
    classId: 101,
    name: 'Morning Reformer',
    credits: 15,
    duration: '50 min',
    category: 'Pilates',
    type: 'Pilates • Medium Intensity',
    instructor: 'Sasha Gray',
    date: 'Thu 11 Apr',
    shortDate: 'Thu 11 Apr',
    time: '08:30 AM',
    location: 'Studio A, West Mall',
    img: imgEXPilates,
    spots: '8 SPOTS LEFT',
  },
  {
    classId: 102,
    name: 'Ignite HIIT',
    credits: 20,
    duration: '40 min',
    category: 'HIIT',
    type: 'HIIT • High Intensity',
    instructor: 'David Chen',
    date: 'Fri 12 Apr',
    shortDate: 'Fri 12 Apr',
    time: '19:00 PM',
    location: 'Skyline Studio, ION Orchard',
    img: imgEXHiit,
    spots: '2 SPOTS LEFT',
  },
  {
    classId: 103,
    name: 'Lunar Yin Yoga',
    credits: 18,
    duration: '60 min',
    category: 'Yoga',
    type: 'Yoga • Low Intensity',
    instructor: 'Aria Veda',
    date: 'Sat 13 Apr',
    shortDate: 'Sat 13 Apr',
    time: '18:30 PM',
    location: 'Moon Hall, Riverfront',
    img: imgEXMeditation,
    spots: '5 SPOTS LEFT',
  },
  {
    classId: 104,
    name: 'Sunrise Flow',
    credits: 17,
    duration: '55 min',
    category: 'Yoga',
    type: 'Yoga • Medium Intensity',
    instructor: 'Julian Sol',
    date: 'Wed 10 Apr',
    shortDate: 'Wed 10 Apr',
    time: '07:00 AM',
    location: 'Studio B, West Mall',
    img: imgMorningYoga,
    spots: '6 SPOTS LEFT',
  },
  {
    classId: 105,
    name: 'Core Sculpt',
    credits: 16,
    duration: '45 min',
    category: 'Pilates',
    type: 'Pilates • Medium Intensity',
    instructor: 'Elena Thorne',
    date: 'Wed 9 Apr',
    shortDate: 'Wed 9 Apr',
    time: '17:30 PM',
    location: 'Studio C, Orchard',
    img: imgEXPilates,
    spots: '3 SPOTS LEFT',
  },
  {
    classId: 106,
    name: 'Evening Stretch',
    credits: 12,
    duration: '45 min',
    category: 'Yoga',
    type: 'Yoga • Low Intensity',
    instructor: 'Marcus Reid',
    date: 'Tue 8 Apr',
    shortDate: 'Tue 8 Apr',
    time: '18:00 PM',
    location: 'Skyline Studio, ION Orchard',
    img: imgBreathwork,
    spots: '4 SPOTS LEFT',
  },
]

// Helper function to create an upcoming booking object
export function createUpcomingBooking(practice, bookingId, overrides = {}) {
  return {
    bookingId,
    classId: practice.classId,
    name: practice.name,
    img: practice.img,
    date: practice.date,
    shortDate: practice.shortDate,
    time: practice.time,
    instructor: practice.instructor,
    location: practice.location,
    credits: practice.credits,
    duration: practice.duration,
    category: practice.category,
    type: practice.type,
    ...overrides,
  }
}

// Initial upcoming bookings (fetched from backend on app mount)
export const initialUpcomingBookings = []

// Past bookings for history
export const initialPastBookings = [
  {
    img: imgMorningYoga,
    date: 'Tue 8 Apr',
    name: 'Solar Gratitude',
    stars: 5,
    credits: 15,
  },
  {
    img: imgBreathwork,
    date: 'Sun 6 Apr',
    name: 'Lunar Breath',
    stars: 5,
    credits: 12,
  },
]
