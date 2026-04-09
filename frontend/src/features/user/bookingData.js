// bookingData.js
// This file contains only UI metadata (images, descriptions, instructor names)
// that enriches class data fetched from the backend.
// NO hardcoded class IDs, slots, prices, or bookings.

import {
  imgBreathwork,
  imgEXHiit,
  imgEXMeditation,
  imgEXPilates,
  imgMorningYoga,
} from './assets.js'

// Fallback image when no metadata match is found
export const imgFallback = imgMorningYoga

// Round-robin assignment of UI metadata to backend classes.
// Keys are backend class_ids — add entries as new classes are seeded.
// Any unmapped class_id falls through to 'default'.
export const practiceMetadata = {
  default: {
    instructor: 'Studio Instructor',
    type:       'Yoga • Med',
    category:   'Yoga • Medium Intensity',
    desc:       'A mindful session designed to restore balance and build strength.',
    rating:     '4.8',
    img:        imgMorningYoga,
  },
  1: {
    instructor: 'Sasha Gray',
    type:       'Pilates • Med',
    category:   'Pilates • Medium Intensity',
    desc:       'A low-impact, high-intensity session focusing on core stability and alignment.',
    rating:     '4.9',
    img:        imgEXPilates,
  },
  2: {
    instructor: 'David Chen',
    type:       'HIIT • High',
    category:   'HIIT • High Intensity',
    desc:       'Push your limits with high-octane intervals designed to boost metabolism.',
    rating:     '4.8',
    img:        imgEXHiit,
  },
  3: {
    instructor: 'Aria Veda',
    type:       'Yoga • Low',
    category:   'Yoga • Low Intensity',
    desc:       'A restorative practice focused on deep connective tissue and meditation.',
    rating:     '5.0',
    img:        imgEXMeditation,
  },
  4: {
    instructor: 'Julian Sol',
    type:       'Breathwork • Low',
    category:   'Breathwork • Low Intensity',
    desc:       'Breathing techniques to reduce stress and expand lung capacity.',
    rating:     '4.7',
    img:        imgBreathwork,
  },
  5: {
    instructor: 'Elena Thorne',
    type:       'Yoga • Med',
    category:   'Yoga • Medium Intensity',
    desc:       'A flowing morning practice to awaken the body and focus the mind.',
    rating:     '4.9',
    img:        imgMorningYoga,
  },
}
