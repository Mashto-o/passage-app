/**
 * Formats a distance value (in metres) into a human-readable string
 * with the appropriate unit for the given language.
 *
 * EN: "700 m" / "5.1 km"
 * UK: "700 м" / "5.1 км"
 */
export function formatDistance(metres: number, lang: string): string {
  const isUk = lang === 'uk'
  if (metres < 1000) {
    return isUk ? `${metres} м` : `${metres} m`
  }
  const km = (metres / 1000).toFixed(1).replace(/\.0$/, '')
  return isUk ? `${km} км` : `${km} km`
}

/**
 * Formats a duration (in minutes) into a human-readable string.
 *
 * EN: "15 min"
 * UK: "15 хв"
 */
export function formatDuration(minutes: number, lang: string): string {
  return lang === 'uk' ? `${minutes} хв` : `${minutes} min`
}
