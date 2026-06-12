import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDistance } from '../utils/formatUnits'
import { getLocalizedField } from '../utils/localizedField'
import {
  Bookmark, Share2, Zap, Construction,
  DoorOpen, Sofa, ChevronUp, ChevronDown, ThumbsUp, ThumbsDown,
  Toilet,
} from 'lucide-react'
import WheelchairManual from '../assets/illustrations/wheelchair-manual.svg?react'
import { Place, getAccessibilityVariant } from '../screens/MapScreen'
import { getCategoryIcon } from '../utils/categoryIcon'
import {
  AccessibilityBadge, StatusBadge, Button, Divider,
  PlacePhotoCard, ReviewCard,
} from './index'

// ── Score helpers ──────────────────────────────────────────────────────────

function toStatusVariant(score: number): 'positive' | 'warning' | 'negative' {
  if (score >= 80) return 'positive'
  if (score >= 40) return 'warning'
  return 'negative'
}

function toA11yVariant(score: number): 'accessible' | 'partial' | 'inaccessible' {
  return getAccessibilityVariant(score)
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface FactorRowProps {
  variant: 'accessible' | 'partial' | 'inaccessible' | 'unknown'
  title: string
  subtitle: string
  showFirstToCheck?: boolean
  firstToCheckLabel?: string
}

const FactorRow: React.FC<FactorRowProps> = ({
  variant,
  title,
  subtitle,
  showFirstToCheck,
  firstToCheckLabel = '',
}) => (
  <div className="flex gap-sm items-start">
    <AccessibilityBadge variant={variant} size="sm" />
    <div className="flex flex-col gap-2xs">
      <span className="text-heading-sm text-neutral-900">{title}</span>
      <span className="text-body-sm text-neutral-500">{subtitle}</span>
      {showFirstToCheck && (
        <span className="text-body-sm font-semibold text-primary-500 underline">
          {firstToCheckLabel}
        </span>
      )}
    </div>
  </div>
)

interface SectionProps {
  icon: React.ReactNode
  label: string
  summary: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ icon, label, summary, isOpen, onToggle, children }) => (
  <div className="flex flex-col gap-md">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex flex-col gap-2xs items-start">
        <div className="flex items-center gap-xs">
          <span className="text-neutral-700">{icon}</span>
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {label}
          </span>
        </div>
        <span className="text-body-sm text-neutral-700">{summary}</span>
      </div>
      {isOpen
        ? <ChevronUp size={20} strokeWidth={1.5} className="text-neutral-500 shrink-0" />
        : <ChevronDown size={20} strokeWidth={1.5} className="text-neutral-500 shrink-0" />
      }
    </button>

    {isOpen && (
      <div className="flex flex-col gap-lg">
        <div className="flex gap-lg overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <PlacePhotoCard
            src={undefined}
            location={label}
            updatedAt="1 week ago"
            className="w-[165px] shrink-0"
          />
          <PlacePhotoCard
            src={undefined}
            location={label}
            updatedAt="1 week ago"
            className="w-[165px] shrink-0"
          />
          <PlacePhotoCard
            src={undefined}
            location={label}
            updatedAt="1 week ago"
            className="w-[165px] shrink-0"
          />
        </div>
        <div className="flex flex-col gap-sm">
          {children}
        </div>
      </div>
    )}
  </div>
)

// ── Props ──────────────────────────────────────────────────────────────────

type PlaceDetailSheetProps = {
  place: Place | null
  isOpen: boolean
  onClose: () => void
  onBuildRoute: (destinationName: string) => void
}

// ── Component ──────────────────────────────────────────────────────────────

export const PlaceDetailSheet: React.FC<PlaceDetailSheetProps> = ({ place, isOpen, onClose, onBuildRoute }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [entranceOpen, setEntranceOpen] = useState(true)
  const [toiletOpen,   setToiletOpen]   = useState(true)
  const [insideOpen,   setInsideOpen]   = useState(true)
  const [dragStartY,   setDragStartY]   = useState(0)
  const [dragDelta,    setDragDelta]    = useState(0)
  const DRAG_THRESHOLD = 80

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStartY(y)
    setDragDelta(0)
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    const delta = y - dragStartY
    if (delta > 0) setDragDelta(delta)
  }

  const handleDragEnd = () => {
    if (dragDelta > DRAG_THRESHOLD) {
      onClose()
    }
    setDragDelta(0)
  }

  const a11yVariant  = place ? toA11yVariant(place.accessibilityScore)  : 'accessible'
  const scoreVariant = place ? toStatusVariant(place.accessibilityScore) : 'positive'
  const categoryIcon = place ? getCategoryIcon(place.category, 12) : undefined

  return (
    <>
      {/* Backdrop — transparent, closes sheet on tap */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[55]"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 top-[248px] z-[60] bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transform: isOpen ? `translateY(${dragDelta}px)` : 'translateY(100%)' }}
      >
        {/* Drag handle — shrink-0, never scrolls */}
        <div
          aria-hidden="true"
          className="flex justify-center pt-lg pb-xs shrink-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="bg-neutral-400 h-[3px] w-[40px] rounded-full" />
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-lg flex flex-col gap-lg"
        >
          {place && (
            <>
              {/* Back button — first item */}
              <div className="pt-xs">
                <Button variant="back" onClick={onClose}>{t('common.back')}</Button>
              </div>

              {/* Lift warning banner */}
              {place.isLiftDependent && (
                <div className="flex items-center gap-sm bg-warning-100 rounded-[48px] p-md w-full">
                  <Zap size={16} strokeWidth={1.5} className="text-warning-700 shrink-0" />
                  <p className="text-body-sm text-warning-700 flex-1">
                    {t('placeDetail.liftWarning')}
                  </p>
                </div>
              )}

              {/* Header block */}
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-xs h-[36px]">
                  <AccessibilityBadge variant={a11yVariant} size="sm" icon={categoryIcon} />
                  <StatusBadge
                    variant={scoreVariant}
                    label={t('map.accessiblePercent', { score: place.accessibilityScore })}
                  />
                  {place.barrierCount > 0 && (
                    <StatusBadge
                      variant="warning"
                      label={t('map.barriers', { count: place.barrierCount })}
                      icon={<Construction size={16} strokeWidth={1.5} className="text-warning-500" />}
                    />
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-xs">
                  <span className="text-display-md text-neutral-900 flex-1">
                    {getLocalizedField(place, 'name', lang)}
                  </span>
                  <span className="text-heading-sm text-neutral-900 shrink-0">
                    {formatDistance(place.distanceM, lang)}
                  </span>
                </div>

                <span className="text-body-sm text-neutral-900">
                  {getLocalizedField(place, 'address', lang)}
                </span>
              </div>

              {/* Action row */}
              <div className="flex gap-sm items-center">
                <div className="flex-1">
                  <Button
                    variant="primary"
                    label={t('map.buildRoute')}
                    fullWidth
                    onClick={() => onBuildRoute(getLocalizedField(place, 'name', lang))}
                  />
                </div>
                <button
                  type="button"
                  className={[
                    'w-[48px] h-[48px] flex items-center justify-center shrink-0',
                    'border border-neutral-200 rounded-full',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  ].join(' ')}
                  aria-label={t('common.bookmark')}
                  onClick={() => console.log('Bookmark', place.id)}
                >
                  <Bookmark size={20} strokeWidth={1.5} className="text-neutral-900" />
                </button>
                <button
                  type="button"
                  className={[
                    'w-[48px] h-[48px] flex items-center justify-center shrink-0',
                    'border border-neutral-200 rounded-full',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  ].join(' ')}
                  aria-label={t('common.share')}
                  onClick={() => console.log('Share', place.id)}
                >
                  <Share2 size={20} strokeWidth={1.5} className="text-neutral-900" />
                </button>
              </div>

              <Divider />

              {/* Profile match banner */}
              <div className="bg-primary-100 flex items-center justify-center p-xs rounded-[24px] w-full">
                <p className="text-heading-sm text-neutral-900">
                  {t('placeDetail.factorsConfirmed')}
                </p>
              </div>

              {/* Entrance section */}
              <Section
                icon={<DoorOpen size={16} strokeWidth={1.5} />}
                label={t('placeDetail.sections.entrance')}
                summary={t('placeDetail.sectionSummaries.entrance')}
                isOpen={entranceOpen}
                onToggle={() => setEntranceOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.entrance.stepFreeTitle')}
                  subtitle={t('placeDetail.factors.entrance.stepFreeSubtitle')} />
                <Divider />
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.entrance.doorWidthTitle')}
                  subtitle={t('placeDetail.factors.entrance.doorWidthSubtitle')} />
                <Divider />
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.entrance.doorOpenTitle')}
                  subtitle={t('placeDetail.factors.entrance.doorOpenSubtitle')} />
                <Divider />
                <FactorRow variant="partial"
                  title={t('placeDetail.factors.entrance.rampSlopeTitle')}
                  subtitle={t('placeDetail.factors.entrance.rampSlopeSubtitle')} />
              </Section>

              <Divider />

              {/* Toilet section */}
              <Section
                icon={<Toilet size={16} strokeWidth={1.5} />}
                label={t('placeDetail.sections.toilet')}
                summary={t('placeDetail.sectionSummaries.toilet')}
                isOpen={toiletOpen}
                onToggle={() => setToiletOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.toilet.confirmedTitle')}
                  subtitle={t('placeDetail.factors.toilet.confirmedSubtitle')} />
                <Divider />
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.toilet.spaceTitle')}
                  subtitle={t('placeDetail.factors.toilet.spaceSubtitle')} />
                <Divider />
                <FactorRow variant="unknown"
                  title={t('placeDetail.factors.toilet.grabBarsTitle')}
                  subtitle={t('placeDetail.factors.toilet.grabBarsSubtitle')}
                  showFirstToCheck
                  firstToCheckLabel={t('placeDetail.beFirstToCheck')} />
              </Section>

              <Divider />

              {/* Inside section */}
              <Section
                icon={<Sofa size={16} strokeWidth={1.5} />}
                label={t('placeDetail.sections.inside')}
                summary={t('placeDetail.sectionSummaries.inside')}
                isOpen={insideOpen}
                onToggle={() => setInsideOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.inside.confirmedTitle')}
                  subtitle={t('placeDetail.factors.inside.confirmedSubtitle')} />
                <Divider />
                <FactorRow variant="accessible"
                  title={t('placeDetail.factors.inside.spaceTitle')}
                  subtitle={t('placeDetail.factors.inside.spaceSubtitle')} />
                <Divider />
                <FactorRow variant="unknown"
                  title={t('placeDetail.factors.inside.grabBarsTitle')}
                  subtitle={t('placeDetail.factors.inside.grabBarsSubtitle')}
                  showFirstToCheck
                  firstToCheckLabel={t('placeDetail.beFirstToCheck')} />
              </Section>

              <Divider />

              {/* Comments */}
              <p className="text-caption-md tracking-caption-md uppercase text-neutral-700 text-left">
                {t('placeDetail.comments')}
              </p>

              <div className="flex flex-col gap-md">
                <ReviewCard
                  authorName="Name"
                  mobilityIcon={<WheelchairManual width={16} height={16} aria-hidden />}
                  timestamp="1 week ago"
                  reviewText="Smooth ramp at the entrance. Aisles inside are wide enough for an active chair."
                />
                <ReviewCard
                  authorName="Name"
                  mobilityIcon={<WheelchairManual width={16} height={16} aria-hidden />}
                  timestamp="1 week ago"
                  reviewText="Smooth ramp at the entrance. Aisles inside are wide enough for an active chair."
                />
              </div>

              <div className="pb-lg" />
            </>
          )}
        </div>

        {/* Feedback row — pinned to bottom, never scrolls */}
        <div className="shrink-0 px-lg py-md flex gap-md items-center border-t border-neutral-200 bg-neutral-0">
          <button
            type="button"
            onClick={() => place && console.log('Thumbs down', place.id)}
            className={[
              'w-[48px] h-[48px] shrink-0 rounded-full',
              'bg-danger-100 border border-danger-500',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label={t('placeDetail.notHelpful')}
          >
            <ThumbsDown size={24} strokeWidth={1.5} className="text-danger-500" />
          </button>
          <button
            type="button"
            onClick={() => place && console.log('Thumbs up', place.id)}
            className={[
              'w-[48px] h-[48px] shrink-0 rounded-full',
              'bg-success-100 border border-success-500',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label={t('placeDetail.helpful')}
          >
            <ThumbsUp size={24} strokeWidth={1.5} className="text-success-500" />
          </button>
          <div className="flex-1">
            <Button
              variant="primary"
              label={t('placeDetail.leaveReview')}
              fullWidth
              onClick={() => place && navigate('/review', {
              state: {
                placeId:   place.id,
                placeName: getLocalizedField(place, 'name', lang),
                address:   getLocalizedField(place, 'address', lang),
              },
            })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
