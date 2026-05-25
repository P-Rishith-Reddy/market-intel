/**
 * Utility functions
 */

/**
 * Format ISO timestamp to readable string
 */
export const formatTime = (isoString) => {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  } catch {
    return isoString
  }
}

/**
 * Get color classes for sentiment labels
 */
export const getSentimentColor = (label) => {
  switch (label?.toLowerCase()) {
    case 'positive': return 'text-emerald-400'
    case 'negative': return 'text-red-400'
    default: return 'text-blue-300'
  }
}

export const getSentimentBg = (label) => {
  switch (label?.toLowerCase()) {
    case 'positive': return 'bg-emerald-500/10 border-emerald-500/30'
    case 'negative': return 'bg-red-500/10 border-red-500/30'
    default: return 'bg-blue-500/10 border-blue-500/30'
  }
}

export const getSentimentBadgeClass = (label) => {
  switch (label?.toLowerCase()) {
    case 'positive': return 'badge-positive'
    case 'negative': return 'badge-negative'
    default: return 'badge-neutral'
  }
}

/**
 * Format sector name for display
 */
export const formatSector = (sector) =>
  sector.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * Truncate text to max length
 */
export const truncate = (text, max = 120) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

/**
 * Convert confidence (0-1) to percentage display
 */
export const confidencePct = (conf) => `${Math.round(conf * 100)}%`

/**
 * Sentiment icon + color for stock direction
 */
export const getDirectionConfig = (direction) => {
  if (direction === 'bullish') {
    return {
      icon: '↑',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      label: 'BULLISH',
    }
  }
  return {
    icon: '↓',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    label: 'BEARISH',
  }
}
