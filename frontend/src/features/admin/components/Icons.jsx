// ─── Admin Icon Set ──────────────────────────────────────────────────────────
// Inline SVG icons used across admin pages

export default function Icon({ name, size = 20, color = '#6f3720', strokeWidth = 1.8 }) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }

  switch (name) {
    // Nav icons
    case 'home':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 12L12 4l8 8v8h-5v-5H9v5H4z" {...s} />
      </svg>

    case 'bar-chart':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 20V12M9 20V8M14 20V4M19 20v-7" {...s} />
      </svg>

    case 'wallet':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="14" rx="3" {...s} />
        <path d="M2 10h20" {...s} />
        <circle cx="17" cy="15" r="1" fill={color} />
      </svg>

    case 'person':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" {...s} />
        <path d="M5 20c1.8-3 4.1-4.5 7-4.5s5.2 1.5 7 4.5" {...s} />
      </svg>

    // Action icons
    case 'bell':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0v4l1.5 2.5H5L6.5 13.5z" {...s} />
        <path d="M10 18.5a2 2 0 0 0 4 0" {...s} />
      </svg>

    case 'star':
      return <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 3.4l2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.3 7 18.8l.9-5.6-4-3.9 5.6-.8L12 3.4z"
          fill={color} stroke="none" />
      </svg>

    case 'chevron-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" {...s} />
      </svg>

    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7" {...s} strokeWidth={2} />
      </svg>

    case 'check-circle':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" {...s} />
        <path d="M8 12.5l3 3 5-5" {...s} />
      </svg>

    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" {...s} />
      </svg>

    case 'arrow-up':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12l7-7 7 7" {...s} />
      </svg>

    case 'arrow-right':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" {...s} />
      </svg>

    case 'logout':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" {...s} />
        <path d="M10 17l5-5-5-5M15 12H3" {...s} />
      </svg>

    case 'switch':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" {...s} />
      </svg>

    case 'edit':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s} />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s} />
      </svg>

    case 'lock':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" {...s} />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" {...s} />
      </svg>

    case 'notification':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0v3.5l2 3H4l2-3z" {...s} />
        <path d="M10 18a2 2 0 0 0 4 0" {...s} />
      </svg>

    case 'time':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" {...s} />
        <path d="M12 8v4l2.5 2" {...s} />
      </svg>

    case 'users':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" {...s} />
        <path d="M3 19c1.5-2.5 3.5-4 6-4s4.5 1.5 6 4" {...s} />
        <path d="M16 6a3 3 0 0 1 0 6M21 19c-1-2-3-4-5-4" {...s} />
      </svg>

    default:
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill={color} />
      </svg>
  }
}
