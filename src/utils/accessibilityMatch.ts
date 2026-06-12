import type { MobilityAid } from '../context/OnboardingContext'
import i18n from '../i18n'

// Match score is computed from the route's own segment-level accessibility data against the
// user's mobility profile — not from other users' reviews of this specific route, which would
// be statistically meaningless for a one-off A-to-B route.

// ── Types ──────────────────────────────────────────────────────────────────

/** Minimal shape getBestMatch needs; Route satisfies this structurally. */
interface MatchableRoute {
  barrierCount: number
  durationMin:  number
  segments:     { accessible?: boolean }[]
}

type BarrierSensitivity = 'high' | 'medium' | 'low'

// ── Helpers ────────────────────────────────────────────────────────────────

function getSensitivity(mobilityAid: MobilityAid): BarrierSensitivity {
  if (
    mobilityAid === 'wheelchair-manual' ||
    mobilityAid === 'wheelchair-electric' ||
    mobilityAid === 'stroller'
  ) return 'high'
  if (mobilityAid === 'cane' || mobilityAid === 'prosthesis') return 'medium'
  return 'low' // no-aid
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Returns the route that best fits the user's mobility profile, plus a short array
 * of human-readable tags explaining why it was chosen.
 *
 * Returns null when there are no routes, or when highlighting would not be meaningful
 * for the user's profile (e.g. a low-sensitivity profile with at least one barrier on
 * every available route).
 */
export function getBestMatch<T extends MatchableRoute>(
  routes: T[],
  mobilityAid: MobilityAid,
): { route: T; tags: string[] } | null {
  if (routes.length === 0) return null

  const sensitivity = getSensitivity(mobilityAid)

  // Pick the route with the lowest barrierCount; ties broken by fastest durationMin.
  const best = routes.reduce((a, b) => {
    if (a.barrierCount !== b.barrierCount) return a.barrierCount < b.barrierCount ? a : b
    return a.durationMin <= b.durationMin ? a : b
  })

  // For low-sensitivity profiles, skip when all routes have barriers — not meaningful to call
  // out a "best match" when the user is not particularly affected by route barriers.
  if (sensitivity === 'low' && best.barrierCount > 0) return null

  // Build tags (up to 3)
  const tags: string[] = []

  if (best.barrierCount === 0) {
    tags.push(i18n.t('bestMatch.noBarriers'))
  } else {
    tags.push(i18n.t('bestMatch.fewestBarriers', { count: best.barrierCount }))
  }

  if (best.segments.every(s => s.accessible !== false)) {
    tags.push(i18n.t('bestMatch.accessibleThroughout'))
  }

  const minDuration = Math.min(...routes.map(r => r.durationMin))
  if (best.durationMin === minDuration) {
    tags.push(i18n.t('bestMatch.fastestOption'))
  }

  return { route: best, tags }
}
