import React from 'react'
import { useTranslation } from 'react-i18next'
import type { MobilityAid } from '../context/OnboardingContext'
import type { RouteSortKey } from './RoutePlanningSheet'

// ── Types ──────────────────────────────────────────────────────────────────

export interface BestMatchCardProps {
  /** Short explanatory tags from getBestMatch (e.g. "No barriers", "Fastest option"). */
  tags: string[]
  /** The currently active sort-by category — the badge mirrors this. */
  sortValue: RouteSortKey
  /**
   * Fallback driver for the badge text when sortValue is 'shortest-distance'
   * (not one of the three sort categories the badge has copy for): wheelchair
   * users see "flattest", others see "fastest" — same as before this state
   * was tied to the sort control.
   */
  mobilityAid: MobilityAid
  /** The rendered route card (RouteCard / StandardRouteCard) — passes the interactive element through. */
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────

export const BestMatchCard: React.FC<BestMatchCardProps> = ({ sortValue, mobilityAid, children }) => {
  const { t } = useTranslation()

  const badgeLabel = (() => {
    switch (sortValue) {
      case 'fewest-barriers': return t('bestMatch.recommendedFewestBarriers')
      case 'flattest':        return t('bestMatch.recommendedFlattest')
      case 'fastest':         return t('bestMatch.recommendedFastest')
      default:
        // 'shortest-distance' has no dedicated copy — fall back to the
        // mobility-aid-driven text used before the badge tracked sort state.
        return mobilityAid === 'wheelchair-manual' || mobilityAid === 'wheelchair-electric'
          ? t('bestMatch.recommendedFlattest')
          : t('bestMatch.recommendedFastest')
    }
  })()

  return (
    <div className="relative">

      {/* "Recommended" badge — overlaps top border */}
      <span className={[
        'absolute top-0 left-[24px] -translate-y-1/2',
        'bg-success-500 text-neutral-0 font-semibold text-[14px]',
        'px-md py-[6px] rounded-full',
      ].join(' ')}>
        {badgeLabel}
      </span>

      {/* Card */}
      <div className="bg-success-100 border-2 border-success-500 rounded-[32px] pt-[24px] px-md pb-md">
        {children}
      </div>

    </div>
  )
}
