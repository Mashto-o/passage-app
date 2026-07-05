import React from 'react'
import { Bus, TramFront, Train, CarTaxiFront, Car, type LucideIcon } from 'lucide-react'
import WheelchairManual   from '../assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from '../assets/illustrations/wheelchair-electric.svg?react'
import Cane               from '../assets/illustrations/cane.svg?react'
import Stroller           from '../assets/illustrations/stroller.svg?react'
import Prosthesis         from '../assets/illustrations/prosthesis.svg?react'
import NoWheelchair       from '../assets/illustrations/no-wheelchair.svg?react'
import { AccessibilityBadge } from './AccessibilityBadge'
import type { MobilityAid } from '../context/OnboardingContext'

export type { MobilityAid }

// ── Types ──────────────────────────────────────────────────────────────────

export type TransportSegment = {
  type: 'transport'
  mode: 'bus' | 'tram' | 'metro' | 'taxi' | 'car'
  routeNumber?: string
  accessibility: 'accessible' | 'inaccessible' | 'unknown'
  durationMinutes: number
}

export type WalkingSegment = {
  type: 'walking'
  durationMinutes: number
}

export type RouteSegment = TransportSegment | WalkingSegment

export interface RouteTimelineProps {
  segments: RouteSegment[]
  mobilityAid: MobilityAid
  className?: string
}

// ── Icon maps ──────────────────────────────────────────────────────────────

const mobilityIllustrations: Record<MobilityAid, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'wheelchair-manual':   WheelchairManual,
  'wheelchair-electric': WheelchairElectric,
  'cane':                Cane,
  'stroller':            Stroller,
  'prosthesis':          Prosthesis,
  'no-aid':              NoWheelchair,
}

const transportIcons: Record<TransportSegment['mode'], LucideIcon> = {
  bus:   Bus,
  tram:  TramFront,
  metro: Train,
  taxi:  CarTaxiFront,
  car:   Car,
}

// ── Component ─────────────────────────────────────────────────────────────

export const RouteTimeline: React.FC<RouteTimelineProps> = ({
  segments,
  mobilityAid,
  className = '',
}) => {
  const totalDuration = segments.reduce((sum, s) => sum + s.durationMinutes, 0)
  const MobilityIllustration = mobilityIllustrations[mobilityAid]

  return (
    <div
      className={[
        'flex items-center h-[36px] w-full bg-primary-100 rounded-[48px] overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {segments.map((segment, i) => {
        const flexGrow = segment.durationMinutes / totalDuration

        if (segment.type === 'walking') {
          return (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{ flexGrow }}
            >
              <MobilityIllustration width={28} height={28} className="text-primary-500" />
            </div>
          )
        }

        const TransportIcon = transportIcons[segment.mode]

        return (
          <div
            key={i}
            className="flex items-center justify-center gap-[8px] bg-primary-200 rounded-[48px] px-[12px] py-[6px] h-full"
            style={{ flexGrow }}
          >
            <AccessibilityBadge variant={segment.accessibility} size="sm" />
            <TransportIcon size={20} strokeWidth={1.5} className="text-primary-500 shrink-0" />
            {segment.routeNumber && (
              <span className="text-body-sb text-primary-500 whitespace-nowrap">
                {segment.routeNumber}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
