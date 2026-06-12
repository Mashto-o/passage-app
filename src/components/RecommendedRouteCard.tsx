import React from 'react'
import { Sparkles } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

export interface RecommendedRouteCardProps {
  /** The route card rendered as a child (RouteCard / StandardRouteCard). */
  children: React.ReactNode
  /** Percentage of similar users who found the route accessible. */
  accessiblePercent: number
  /** Number of reviews that produced this rating. */
  reviewCount: number
  /** Human-readable label for the user's mobility aid group. */
  mobilityAidLabel: string
}

// ── Component ──────────────────────────────────────────────────────────────

export const RecommendedRouteCard: React.FC<RecommendedRouteCardProps> = ({
  children,
  accessiblePercent,
  reviewCount,
  mobilityAidLabel,
}) => (
  <div className="bg-primary-100 rounded-[24px] p-md flex flex-col gap-md">

    {/* Header row */}
    <div className="flex items-center gap-xs">
      <Sparkles size={20} strokeWidth={1.5} className="text-primary-500 shrink-0" />
      <span className="text-caption-md uppercase tracking-[0.56px] text-primary-500">
        Recommended for you
      </span>
    </div>

    {/* Route card content (e.g. RouteCard / StandardRouteCard) */}
    {children}

    {/* Community rating footer */}
    <p className="text-body-sm text-neutral-700">
      {accessiblePercent}% of {mobilityAidLabel} found this route accessible ({reviewCount} reviews)
    </p>

  </div>
)
