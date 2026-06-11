import React from 'react'
import { X, Bookmark, Share2 } from 'lucide-react'
import { AccessibilityBadge } from './AccessibilityBadge'
import { StatusBadge } from './StatusBadge'
import { Button } from './Button'

// ── Prop types ─────────────────────────────────────────────────────────────

export interface PlacePopupCardProps {
  name: string
  address: string
  distance: string
  barrierCount: number
  accessibilityScore: number
  categoryIcon?: React.ReactNode
  accessibilityVariant: 'accessible' | 'partial' | 'inaccessible'
  scoreVariant: 'positive' | 'warning' | 'negative'
  visible: boolean
  onClose: () => void
  onRoute?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onCardClick?: () => void
}

// ── Component ──────────────────────────────────────────────────────────────

export const PlacePopupCard: React.FC<PlacePopupCardProps> = ({
  name,
  address,
  distance,
  barrierCount,
  accessibilityScore,
  categoryIcon,
  accessibilityVariant,
  scoreVariant,
  visible,
  onClose,
  onRoute,
  onBookmark,
  onShare,
  onCardClick,
}) => {
  return (
    <div
      className={[
        'fixed bottom-[125px] left-lg right-lg z-[60]',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+125px)]',
      ].join(' ')}
    >
      {/* Entire card body is tappable — buttons stop propagation so they don't trigger this */}
      <div
        className="bg-neutral-0 rounded-[32px] pt-sm px-md pb-md flex flex-col gap-sm shadow-lg cursor-pointer"
        onClick={onCardClick}
      >

        {/* Close button row */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className={[
              'flex items-center justify-center',
              'w-[32px] h-[32px] rounded-full',
              'text-neutral-900',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Photo */}
        <img
          src="https://placehold.co/354x120"
          alt={name}
          className="h-[120px] w-full rounded-xl object-cover bg-neutral-100"
        />

        {/* Info section */}
        <div className="flex flex-col gap-xs pt-xs">
          <div className="flex items-center gap-xs">
            <AccessibilityBadge
              variant={accessibilityVariant}
              size="sm"
              icon={categoryIcon}
            />
            <StatusBadge
              variant={scoreVariant}
              label={`${accessibilityScore}% Accessible`}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-heading-sm text-neutral-900 flex-1">{name}</span>
            <span className="text-body-sb text-neutral-900">{distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-neutral-500 flex-1">{address}</span>
            <span className="text-body-sm text-neutral-500">{barrierCount} barriers</span>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-xs">
          <div className="flex-1">
            <Button
              variant="primary"
              label="Build a route"
              fullWidth
              onClick={(e) => { e.stopPropagation(); onRoute?.() }}
            />
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBookmark?.() }}
            className={[
              'flex items-center justify-center shrink-0',
              'w-[48px] h-[48px] rounded-full',
              'bg-neutral-0 border border-neutral-200 text-neutral-700',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label="Bookmark"
          >
            <Bookmark size={20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onShare?.() }}
            className={[
              'flex items-center justify-center shrink-0',
              'w-[48px] h-[48px] rounded-full',
              'bg-neutral-0 border border-neutral-200 text-neutral-700',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label="Share"
          >
            <Share2 size={20} aria-hidden />
          </button>
        </div>

      </div>
    </div>
  )
}
