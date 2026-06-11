import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import {
  Button, AccessibilityCard, ToggleButton, Chip, CommentInput, MediaInputButton,
} from '../components'

// ── Section label style (matches FilterScreen) ─────────────────────────────

const sectionLabel = 'font-medium text-[14px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700'

// ── Screen ──────────────────────────────────────────────────────────────────

export const RouteCompleteScreen: React.FC = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { distanceKm, durationMin } = (location.state as { distanceKm?: number; durationMin?: number }) ?? {}

  // ── Local state ──────────────────────────────────────────────────────────
  const [visible,        setVisible]        = useState(false)
  const [routeRating,    setRouteRating]    = useState<'accessible' | 'partiallyAccessible' | 'inaccessible' | null>(null)
  const [barrierAnswer,  setBarrierAnswer]  = useState<'yes' | 'no' | null>(null)
  const [comment,        setComment]        = useState('')

  // Trigger slide-up after initial hidden state is painted
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleRatingClick = (value: 'accessible' | 'partiallyAccessible' | 'inaccessible') => {
    const next = routeRating === value ? null : value
    setRouteRating(next)
    console.log('route rating:', next)
  }

  return (
    <div
      className={[
        'fixed inset-0 bg-neutral-50 overflow-y-auto',
        'transition-transform duration-500 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
    >
      <div className="px-[24px] pb-[48px] flex flex-col gap-[32px]">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-[4px] mt-[80px]">

          {/* Icon */}
          <div className="bg-primary-100 rounded-[48px] p-[16px] mb-[4px]">
            <BadgeCheck size={24} strokeWidth={1.5} className="text-primary-500" />
          </div>

          {/* Title */}
          <span className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900">
            Route complete!
          </span>

          {/* Subtitle row — distance · duration */}
          <div className="flex items-center gap-[8px]">
            <span className="text-neutral-700 text-[14px] font-normal leading-[1.5]">
              {distanceKm ?? '—'} km
            </span>
            <div className="w-px h-[10px] bg-neutral-200" />
            <span className="text-neutral-700 text-[14px] font-normal leading-[1.5]">
              {durationMin ?? '—'} min
            </span>
          </div>

        </div>

        {/* ── How was the route ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-[16px]">
          <span className={sectionLabel}>How was the route</span>
          <div className="flex flex-row gap-[8px]">
            <AccessibilityCard
              accessibility="accessible"
              selected={routeRating === 'accessible'}
              onClick={() => handleRatingClick('accessible')}
            />
            <AccessibilityCard
              accessibility="partiallyAccessible"
              selected={routeRating === 'partiallyAccessible'}
              onClick={() => handleRatingClick('partiallyAccessible')}
            />
            <AccessibilityCard
              accessibility="inaccessible"
              selected={routeRating === 'inaccessible'}
              onClick={() => handleRatingClick('inaccessible')}
            />
          </div>
        </div>

        {/* ── Barriers ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[16px]">
          <span className={sectionLabel}>Barriers</span>
          <div className="flex flex-col gap-[4px]">
            <span className="text-neutral-700 text-[14px] font-normal leading-[1.5]">
              Were the barriers we warned you about accurate?
            </span>
            <span className="text-neutral-700 text-[14px] font-normal leading-[1.5]">
              Optional - but helpful to others
            </span>
          </div>
          {/* Barrier row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-neutral-900 text-[16px] font-normal leading-[1.5] w-[189px]">
              Kerb without dropped kerb
            </span>
            <ToggleButton
              value={barrierAnswer}
              onChange={(val) => {
                setBarrierAnswer(val)
                console.log('barrier answer:', val)
              }}
            />
          </div>
        </div>

        {/* ── Add a comment ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[16px]">
          <span className={sectionLabel}>Add a comment</span>
          <span className="text-neutral-700 text-[14px] font-normal leading-[1.5]">
            Optional - but helpful to others
          </span>

          {/* Prompt chips */}
          <div className="flex flex-row gap-[12px]">
            <Chip variant="secondary" label="The main barrier was..." />
            <Chip variant="secondary" label="Helpful for users who..." />
          </div>

          {/* Text comment */}
          <CommentInput
            value={comment}
            onChange={setComment}
            placeholder="Anything others should know before they go?..."
          />

          {/* OR divider + voice */}
          <div className="flex flex-col gap-[8px]">
            <span className={`${sectionLabel} text-center`}>OR</span>
            <span className="text-neutral-700 text-[14px] font-normal leading-[1.5] text-center">
              Leave a voice comment. Our AI assistant will sum it up for you.
            </span>
            <MediaInputButton
              variant="voice"
              className="w-full"
              onPress={() => console.log('voice')}
            />
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[12px] items-center w-full">
          <Button
            variant="primary"
            label="Submit"
            fullWidth
            onClick={() => navigate('/profile')}
          />
          <Button
            variant="ghost"
            label="Skip"
            fullWidth
            onClick={() => navigate('/map')}
          />
        </div>

      </div>
    </div>
  )
}
