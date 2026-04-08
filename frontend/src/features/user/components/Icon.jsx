export default function Icon({ name, size = 16, color = '#5b5d74', strokeWidth = 1.9 }) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }

  switch (name) {
    case 'home':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 11.5 12 4l8 7.5V20h-5v-5H9v5H4z" {...common} />
        </svg>
      )
    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" {...common} />
          <path d="M16 16l4 4" {...common} />
        </svg>
      )
    case 'calendar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" {...common} />
          <path d="M7 3.5v3M17 3.5v3M3.5 9.5h17" {...common} />
        </svg>
      )
    case 'card':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5.5" width="18" height="13" rx="3" {...common} />
          <path d="M3 10h18M7 15h4" {...common} />
        </svg>
      )
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6.5 9.4a5.5 5.5 0 0 1 11 0v4.1l1.6 2.2H4.9l1.6-2.2V9.4" {...common} />
          <path d="M10 18a2.2 2.2 0 0 0 4 0" {...common} />
        </svg>
      )
    case 'person':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" {...common} />
          <path d="M5.5 19.5c1.7-3 4-4.5 6.5-4.5s4.8 1.5 6.5 4.5" {...common} />
        </svg>
      )
    case 'pin':
    case 'location':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21s6-5.4 6-10a6 6 0 0 0-12 0c0 4.6 6 10 6 10z" {...common} />
          <circle cx="12" cy="11" r="2" {...common} />
        </svg>
      )
    case 'time':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path d="M12 7.5v5l3 2.5" {...common} />
        </svg>
      )
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 3.8 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.3l-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.8Z" fill={color} />
        </svg>
      )
    case 'sparkles':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4l1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4z" {...common} />
          <path d="M6 15l.8 2 .2.8.8.2 2 .8-2 .8-.8.2-.2.8-.8 2-.8-2-.2-.8-.8-.2-2-.8 2-.8.8-.2.2-.8.8-2z" {...common} />
        </svg>
      )
    case 'fire':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12.4 3.5c.9 2.6-.4 4.1-1.7 5.4-1.5 1.5-3.2 3.1-2.8 6 .3 2.1 2.2 4.1 4.7 4.1 2.6 0 4.8-1.8 4.8-4.6 0-2.2-1.2-3.8-2.5-5.1-1-.9-2-1.8-2.5-3.2z" {...common} />
        </svg>
      )
    case 'meditate':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="5.5" r="2.2" {...common} />
          <path d="M9 11c.8-1.5 1.8-2.2 3-2.2S14.2 9.5 15 11M8.5 14.5c1.1.8 2.2 1.2 3.5 1.2s2.4-.4 3.5-1.2M6.5 19c1.3-2 3.1-3 5.5-3s4.2 1 5.5 3" {...common} />
        </svg>
      )
    case 'pulse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h4l2.2-4.5 4.1 9 2.4-4.5H21" {...common} />
        </svg>
      )
    case 'activeMinutes':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v7l4 2.5" {...common} />
          <circle cx="12" cy="12" r="8.5" {...common} />
        </svg>
      )
    case 'sessionsCompleted':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="3" {...common} />
          <path d="m8.5 12 2.2 2.2L15.5 9.5" {...common} />
        </svg>
      )
    case 'creditsSpent':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </svg>
      )
    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 4h8v3.5A4 4 0 0 1 12 11.5 4 4 0 0 1 8 7.5V4Z" {...common} />
          <path d="M8 5H5.5A2.5 2.5 0 0 0 8 9M16 5h2.5A2.5 2.5 0 0 1 16 9M12 11.5v3.5M9 19h6" {...common} />
        </svg>
      )
    case 'zenMaster':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" {...common} />
          <path d="M7 13c1.4 1.7 3.1 2.5 5 2.5s3.6-.8 5-2.5M9 10h.01M15 10h.01" {...common} />
        </svg>
      )
    case 'tenSessions':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 6h10v12H7z" {...common} />
          <path d="M9.5 9h.5v6M12.5 9h4v1.5h-2.4c1.3 0 2.4.8 2.4 2.2 0 1.3-1 2.3-2.5 2.3-1 0-1.9-.4-2.5-1.1" {...common} />
        </svg>
      )
    case 'recovery':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 19c-3.8-2.2-6-5-6-8.1A3.9 3.9 0 0 1 10 7.1c.9 0 1.7.3 2 .9.3-.6 1.1-.9 2-.9a3.9 3.9 0 0 1 4 3.8c0 3.1-2.2 5.9-6 8.1Z" {...common} />
        </svg>
      )
    case 'undo':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 9H4v5M4 14a8 8 0 1 0 2.3-5.7L4 9" {...common} />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 6 6 6-6 6" {...common} />
        </svg>
      )
    case 'x':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" {...common} />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      )
  }
}
