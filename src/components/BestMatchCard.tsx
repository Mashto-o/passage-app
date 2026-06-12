import React from 'react'
import { Chip } from './Chip'

// ── Types ──────────────────────────────────────────────────────────────────

export interface BestMatchCardProps {
  /** Short explanatory tags from getBestMatch (e.g. "No barriers", "Fastest option"). */
  tags: string[]
  /** The rendered route card (RouteCard / StandardRouteCard) — passes the interactive element through. */
  children: React.ReactNode
}

// ── Component ──────────────────────────────────────────────────────────────

export const BestMatchCard: React.FC<BestMatchCardProps> = ({ tags, children }) => (
  <div className="bg-success-100 border border-success-500 rounded-[24px] p-md flex flex-col gap-md">

    {/* "Best match" badge */}
    <div className="self-start">
      <span className={[
        'bg-success-500 text-neutral-0 rounded-full',
        'px-sm py-2xs',
        'text-caption-md',
      ].join(' ')}>
        Best match for you
      </span>
    </div>

    {/* Route card (RouteCard / StandardRouteCard — preserves interactive behaviour) */}
    {children}

    {/* Tags row */}
    {tags.length > 0 && (
      <div className="flex flex-wrap gap-xs">
        {tags.map(tag => (
          <Chip key={tag} label={tag} variant="success" size="sm" />
        ))}
      </div>
    )}

  </div>
)
