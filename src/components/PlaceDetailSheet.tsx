import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bookmark, Share2, Zap, Construction,
  DoorOpen, Sofa, ChevronUp, ChevronDown, ThumbsUp, ThumbsDown,
  Toilet,
} from 'lucide-react'
import WheelchairManual from '../assets/illustrations/wheelchair-manual.svg?react'
import { PLACES, Place, getAccessibilityVariant } from '../screens/MapScreen'
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
}

const FactorRow: React.FC<FactorRowProps> = ({ variant, title, subtitle, showFirstToCheck }) => (
  <div className="flex gap-[12px] items-start">
    <AccessibilityBadge variant={variant} size="sm" />
    <div className="flex flex-col gap-[4px]">
      <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">{title}</span>
      <span className="font-normal text-[14px] leading-[1.5] text-neutral-500">{subtitle}</span>
      {showFirstToCheck && (
        <span className="font-semibold text-[14px] text-primary-500 underline">
          Be the first to check
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
  <div className="flex flex-col gap-[16px]">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex flex-col gap-[4px] items-start">
        <div className="flex items-center gap-[8px]">
          <span className="text-neutral-700">{icon}</span>
          <span className="font-medium text-[14px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700">
            {label}
          </span>
        </div>
        <span className="font-normal text-[14px] leading-[1.5] text-neutral-700">{summary}</span>
      </div>
      {isOpen
        ? <ChevronUp size={20} strokeWidth={1.5} className="text-neutral-500 shrink-0" />
        : <ChevronDown size={20} strokeWidth={1.5} className="text-neutral-500 shrink-0" />
      }
    </button>

    {isOpen && (
      <div className="flex flex-col gap-[24px]">
        <div className="flex gap-[24px] overflow-x-auto [&::-webkit-scrollbar]:hidden">
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
        <div className="flex flex-col gap-[12px]">
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
          className="flex justify-center pt-[24px] pb-[8px] shrink-0 cursor-grab active:cursor-grabbing"
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
          className="flex-1 overflow-y-auto px-[24px] flex flex-col gap-[24px]"
        >
          {place && (
            <>
              {/* Back button — first item */}
              <div className="pt-[8px]">
                <Button variant="back" onClick={onClose}>Back</Button>
              </div>

              {/* Lift warning banner */}
              {place.isLiftDependent && (
                <div className="flex items-center gap-[12px] bg-warning-100 rounded-[48px] p-[16px] w-full">
                  <Zap size={16} strokeWidth={1.5} className="text-warning-700 shrink-0" />
                  <p className="text-[14px] font-normal leading-[1.5] text-warning-700 flex-1">
                    This place has a lift. Check conditions before relying on it.
                  </p>
                </div>
              )}

              {/* Header block */}
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[10px] h-[36px]">
                  <AccessibilityBadge variant={a11yVariant} size="sm" icon={categoryIcon} />
                  <StatusBadge variant={scoreVariant} label={`${place.accessibilityScore}% Accessible`} />
                  {place.barrierCount > 0 && (
                    <StatusBadge
                      variant="warning"
                      label={`${place.barrierCount} barriers`}
                      icon={<Construction size={16} strokeWidth={1.5} className="text-warning-500" />}
                    />
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-[8px]">
                  <span className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900 flex-1">
                    {place.name}
                  </span>
                  <span className="font-semibold text-[14px] leading-[1.5] text-neutral-900 shrink-0">
                    {place.distance}
                  </span>
                </div>

                <span className="font-normal text-[14px] leading-[1.5] text-neutral-900">
                  {place.address}
                </span>
              </div>

              {/* Action row */}
              <div className="flex gap-[12px] items-center">
                <div className="flex-1">
                  <Button
                    variant="primary"
                    label="Build a route"
                    fullWidth
                    onClick={() => onBuildRoute(place.name)}
                  />
                </div>
                <button
                  type="button"
                  className={[
                    'w-[48px] h-[48px] flex items-center justify-center shrink-0',
                    'border border-neutral-200 rounded-[48px]',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  ].join(' ')}
                  aria-label="Bookmark"
                  onClick={() => console.log('Bookmark', place.id)}
                >
                  <Bookmark size={20} strokeWidth={1.5} className="text-neutral-900" />
                </button>
                <button
                  type="button"
                  className={[
                    'w-[48px] h-[48px] flex items-center justify-center shrink-0',
                    'border border-neutral-200 rounded-[48px]',
                    'transition-colors duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                  ].join(' ')}
                  aria-label="Share"
                  onClick={() => console.log('Share', place.id)}
                >
                  <Share2 size={20} strokeWidth={1.5} className="text-neutral-900" />
                </button>
              </div>

              <Divider />

              {/* Profile match banner */}
              <div className="bg-primary-100 flex items-center justify-center p-[8px] rounded-[24px] w-full">
                <p className="font-semibold text-[14px] leading-[1.4] text-neutral-900">
                  8/10 key factors confirmed for your profile
                </p>
              </div>

              {/* Entrance section */}
              <Section
                icon={<DoorOpen size={16} strokeWidth={1.5} />}
                label="Entrance"
                summary="3 confirmed · 1 issue · 1 to check"
                isOpen={entranceOpen}
                onToggle={() => setEntranceOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title="Step-free entry confirmed"
                  subtitle="Reported by 2 manual wheelchair users" />
                <Divider />
                <FactorRow variant="accessible"
                  title="Door width comfortable for your chair"
                  subtitle="Reported by 3 manual wheelchair users" />
                <Divider />
                <FactorRow variant="accessible"
                  title="Door can be opened independently"
                  subtitle="Reported by 2 manual wheelchair users" />
                <Divider />
                <FactorRow variant="partial"
                  title="Ramp slope reported as steep"
                  subtitle="1 of 3 manual wheelchair users flagged this" />
              </Section>

              <Divider />

              {/* Toilet section */}
              <Section
                icon={<Toilet size={16} strokeWidth={1.5} />}
                label="Toilet"
                summary="2 confirmed · 1 to check"
                isOpen={toiletOpen}
                onToggle={() => setToiletOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title="Accessible toilet confirmed available"
                  subtitle="Reported by 4 users" />
                <Divider />
                <FactorRow variant="accessible"
                  title="Space to manoeuvre beside toilet"
                  subtitle="Reported by 3 manual wheelchair users" />
                <Divider />
                <FactorRow variant="unknown"
                  title="Grab bars present"
                  subtitle="No data yet for your wheelchair type"
                  showFirstToCheck />
              </Section>

              <Divider />

              {/* Inside section */}
              <Section
                icon={<Sofa size={16} strokeWidth={1.5} />}
                label="Inside"
                summary="2 confirmed · 1 to check"
                isOpen={insideOpen}
                onToggle={() => setInsideOpen(v => !v)}
              >
                <FactorRow variant="accessible"
                  title="Accessible toilet confirmed available"
                  subtitle="Reported by 4 users" />
                <Divider />
                <FactorRow variant="accessible"
                  title="Space to manoeuvre beside toilet"
                  subtitle="Reported by 3 manual wheelchair users" />
                <Divider />
                <FactorRow variant="unknown"
                  title="Grab bars present"
                  subtitle="No data yet for your wheelchair type"
                  showFirstToCheck />
              </Section>

              <Divider />

              {/* Comments */}
              <p className="font-medium text-[14px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700 text-left">
                Comments
              </p>

              <div className="flex flex-col gap-[16px]">
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

              <div className="pb-[24px]" />
            </>
          )}
        </div>

        {/* Feedback row — pinned to bottom, never scrolls */}
        <div className="shrink-0 px-[24px] py-[16px] flex gap-[16px] items-center border-t border-neutral-200 bg-neutral-0">
          <button
            type="button"
            onClick={() => place && console.log('Thumbs down', place.id)}
            className={[
              'w-[48px] h-[48px] shrink-0 rounded-[48px]',
              'bg-danger-100 border border-danger-500',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label="Not helpful"
          >
            <ThumbsDown size={24} strokeWidth={1.5} className="text-danger-500" />
          </button>
          <button
            type="button"
            onClick={() => place && console.log('Thumbs up', place.id)}
            className={[
              'w-[48px] h-[48px] shrink-0 rounded-[48px]',
              'bg-success-100 border border-success-500',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
            ].join(' ')}
            aria-label="Helpful"
          >
            <ThumbsUp size={24} strokeWidth={1.5} className="text-success-500" />
          </button>
          <div className="flex-1">
            <Button
              variant="primary"
              label="Leave a review"
              fullWidth
              onClick={() => place && navigate('/review', {
              state: { placeId: place.id, placeName: place.name, address: place.address },
            })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
