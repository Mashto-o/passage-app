import React from 'react'
import { useTranslation } from 'react-i18next'

// ── Types ──────────────────────────────────────────────────────────────────

export interface BestMatchCardProps {
  /** Short explanatory tags from getBestMatch (e.g. "No barriers", "Fastest option"). */
  tags: string[]
  /** The rendered route card (RouteCard / StandardRouteCard) — passes the interactive element through. */
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────

export const BestMatchCard: React.FC<BestMatchCardProps> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <div className="relative">

      {/* "Recommended" badge — overlaps top border */}
      <span className={[
        'absolute top-0 left-[24px] -translate-y-1/2',
        'bg-success-500 text-neutral-0 font-semibold text-[14px]',
        'px-md py-[6px] rounded-full',
      ].join(' ')}>
        {t('bestMatch.badge')}
      </span>

      {/* Card */}
      <div className="bg-success-100 border-2 border-success-500 rounded-[32px] pt-[24px] px-md pb-md">
        {children}
      </div>

    </div>
  )
}
