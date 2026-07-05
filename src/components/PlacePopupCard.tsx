import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Bookmark, Share2 } from 'lucide-react'
import { AccessibilityBadge } from './AccessibilityBadge'
import { StatusBadge } from './StatusBadge'
import { Button } from './Button'

// ── "Seen once per session" hint helpers ────────────────────────────────────
// sessionStorage (not localStorage) — the hint should reappear on a fresh
// browser session, unlike onboarding/preference values which persist forever.

const TAP_HINT_SESSION_KEY = 'passage_seen_place_popup_hint'

function hasSeenTapHint(): boolean {
  try {
    return sessionStorage.getItem(TAP_HINT_SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function markTapHintSeen() {
  try {
    sessionStorage.setItem(TAP_HINT_SESSION_KEY, 'true')
  } catch {
    // sessionStorage unavailable — state-only fallback
  }
}

// Not currently rendered — kept for potential reuse elsewhere.
// (MapScreen's marker-tap flow now navigates straight to PlaceDetailSheet
// instead of opening this popup.)

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
  coverPhoto?: string
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
  coverPhoto,
}) => {
  const { t } = useTranslation()

  // Show the "Tap for details" hint the first time the popup opens in this
  // session only — decided once per open transition so it doesn't flicker
  // away while the same popup instance stays visible.
  const wasVisible = useRef(false)
  const [showTapHint, setShowTapHint] = useState(false)

  useEffect(() => {
    if (visible && !wasVisible.current) {
      if (!hasSeenTapHint()) {
        setShowTapHint(true)
        markTapHintSeen()
      } else {
        setShowTapHint(false)
      }
    }
    wasVisible.current = visible
  }, [visible])

  return (
    <div
      className={[
        'fixed bottom-[125px] left-lg right-lg z-[60]',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+125px)]',
      ].join(' ')}
    >
      <div className="bg-neutral-0 rounded-[32px] pt-sm px-md pb-md flex flex-col gap-sm shadow-lg">

        {/* Close button row */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={[
              'flex items-center justify-center',
              'w-[32px] h-[32px] rounded-full',
              'text-neutral-900',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label={t('common.close')}
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Photo + info — tappable to open details */}
        <button
          type="button"
          onClick={onCardClick}
          className="text-left w-full bg-transparent flex flex-col gap-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none rounded-xl"
        >
          {/* Photo */}
          {coverPhoto
            ? <img src={coverPhoto} alt={name} className="w-full h-[120px] object-cover rounded-[16px]" />
            : <div className="w-full h-[120px] rounded-[16px] bg-neutral-200" />
          }

          {/* Info section */}
          <div className="flex flex-col gap-sm pt-xs w-full">
            <div className="flex items-center gap-xs">
              <AccessibilityBadge
                variant={accessibilityVariant}
                size="sm"
                icon={categoryIcon}
              />
              <StatusBadge
                variant={scoreVariant}
                label={t('map.accessiblePercent', { score: accessibilityScore })}
              />
            </div>
            <div className="flex flex-col gap-2xs">
              <div className="flex items-center justify-between">
                <span className="text-heading-sm text-neutral-900 flex-1">{name}</span>
                <span className="text-body-sb text-neutral-900">{distance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-neutral-500 flex-1">{address}</span>
              </div>
            </div>
            {showTapHint && (
              <span className="text-caption-sm text-primary-500">
                {t('map.tapForDetails')}
              </span>
            )}
          </div>
        </button>

        {/* Action row */}
        <div className="flex items-center gap-xs">
          <div className="flex-1">
            <Button
              variant="primary"
              label={t('map.buildRoute')}
              fullWidth
              onClick={onRoute}
            />
          </div>
          <button
            type="button"
            onClick={onBookmark}
            className={[
              'flex items-center justify-center shrink-0',
              'w-[48px] h-[48px] rounded-full',
              'bg-neutral-0 border border-neutral-200 text-neutral-700',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label={t('common.bookmark')}
          >
            <Bookmark size={20} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onShare}
            className={[
              'flex items-center justify-center shrink-0',
              'w-[48px] h-[48px] rounded-full',
              'bg-neutral-0 border border-neutral-200 text-neutral-700',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label={t('common.share')}
          >
            <Share2 size={20} aria-hidden />
          </button>
        </div>

      </div>
    </div>
  )
}
