import React from 'react'
import {
  ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight,
  ArrowDownLeft, ArrowDownRight, ArrowUp, Undo2,
  MapPinCheckInside, BadgeAlert,
  type LucideIcon,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

export type Direction =
  | 'turn-left'
  | 'turn-right'
  | 'slight-left'
  | 'slight-right'
  | 'sharp-left'
  | 'sharp-right'
  | 'go-straight'
  | 'u-turn'
  | 'arrive'

export interface NavigationCardProps {
  state: 'default' | 'noHazard' | 'arrived'
  direction?: Direction
  instruction?: string
  streetName?: string
  distanceToTurn?: string
  hazardText?: string
  hazardBoldPrefix?: string
  className?: string
}

// ── Direction icon map ─────────────────────────────────────────────────────

const directionIcons: Record<Direction, LucideIcon> = {
  'turn-left':    ArrowLeft,
  'turn-right':   ArrowRight,
  'slight-left':  ArrowUpLeft,
  'slight-right': ArrowUpRight,
  'sharp-left':   ArrowDownLeft,
  'sharp-right':  ArrowDownRight,
  'go-straight':  ArrowUp,
  'u-turn':       Undo2,
  'arrive':       MapPinCheckInside,
}

// ── Component ─────────────────────────────────────────────────────────────

export const NavigationCard: React.FC<NavigationCardProps> = ({
  state,
  direction,
  instruction,
  streetName,
  distanceToTurn,
  hazardText,
  hazardBoldPrefix,
  className = '',
}) => {
  const showHazard = state === 'default'
  const isArrived  = state === 'arrived'

  // Build hazard text segments
  let hazardRest = hazardText ?? ''
  if (hazardBoldPrefix && hazardText?.startsWith(hazardBoldPrefix)) {
    hazardRest = hazardText.slice(hazardBoldPrefix.length)
  }

  // State-dependent instruction row background
  const instructionRowBg = isArrived
    ? 'bg-primary-100 border border-primary-500'
    : state === 'noHazard'
      ? 'bg-success-100 border border-success-500'
      : 'bg-neutral-0 border border-neutral-200'

  return (
    <div className={`flex flex-col items-start w-full ${showHazard ? 'gap-[12px]' : ''} ${className}`}>

      {/* ── Instruction row ── */}
      <div className={`flex items-center justify-between w-full ${instructionRowBg} rounded-[48px] px-[16px] py-[20px]`}>

        {isArrived ? (
          /* Arrived state */
          <div className="flex items-center justify-start gap-[12px] w-full">
            <MapPinCheckInside size={24} strokeWidth={1.5} className="text-primary-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-display-md text-[22px] leading-[1.3] text-neutral-900 whitespace-nowrap">
                You have arrived!
              </span>
              <span className="text-body-sm text-neutral-700 whitespace-nowrap">
                {streetName}
              </span>
            </div>
          </div>
        ) : (
          /* Default / noHazard state */
          <>
            {/* Left: icon + text */}
            <div className="flex items-center gap-[12px]">
              {direction && (() => {
                const Icon = directionIcons[direction]
                return <Icon size={24} strokeWidth={1.5} className="text-primary-500 shrink-0" />
              })()}
              <div className="flex flex-col">
                <span className="text-display-md text-[22px] leading-[1.3] text-neutral-900 whitespace-nowrap">
                  {instruction}
                </span>
                <span className="text-body-sm text-neutral-700 whitespace-nowrap">
                  {streetName}
                </span>
              </div>
            </div>

            {/* Right: distance */}
            {distanceToTurn && (
              <span className="text-heading-sm text-neutral-900 whitespace-nowrap shrink-0">
                {distanceToTurn}
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Hazard banner ── */}
      {showHazard && hazardText && (
        <div className="flex items-center gap-[8px] w-full bg-warning-100 rounded-[24px] px-[24px] py-[12px]">
          <BadgeAlert size={24} strokeWidth={1.5} className="text-warning-500 shrink-0" />
          <p className="text-warning-500">
            {hazardBoldPrefix && (
              <span className="text-body-sb">{hazardBoldPrefix}</span>
            )}
            <span className="text-body-sm">{hazardRest}</span>
          </p>
        </div>
      )}

    </div>
  )
}
