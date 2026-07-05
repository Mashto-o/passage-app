import React, { useState, useRef, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { formatDistance, formatDuration } from '../utils/formatUnits'
import { Zap, Construction, Bus, TramFront, Train, Car, CarTaxiFront, Accessibility } from 'lucide-react'
import {
  Button, SortControl, SortSheet, TransportSwitcher, AccessibilityBadge,
  BestMatchCard,
} from './index'
import { RouteTimeline } from './RouteTimeline'
import type { RouteSegment as TimelineSegment, MobilityAid } from './RouteTimeline'
import { useOnboarding } from '../context/OnboardingContext'
import { getBestMatch } from '../utils/accessibilityMatch'

// ── Sort key type ──────────────────────────────────────────────────────────

export type RouteSortKey = 'fewest-barriers' | 'shortest-distance' | 'fastest' | 'flattest'

// Third-party brand colours — hardcoded intentionally, not Passage tokens
const UKLON_YELLOW          = '#F5DB00'
const UKLON_BLACK           = '#222426'
const SOCIAL_TAXI_YELLOW    = '#FED428'
const SOCIAL_TAXI_DARK_BLUE = '#253362'

// TEMPORARY PLACEHOLDER — replace with the real Social Taxi provider number
const SOCIAL_TAXI_PHONE = '+380 67 499 3010'

// ── Types ──────────────────────────────────────────────────────────────────

type RouteSegment = {
  type: 'walk' | 'bus' | 'tram' | 'metro' | 'car'
  durationMin: number
  line?: string
  accessible?: boolean
  hasBarriers?: boolean // walk/car segments only — drives warning colour on map
}

type RouteCoordinates = {
  segments: {
    type: string
    hasBarriers?: boolean
    coords: [number, number][] // [lng, lat]
  }[]
}

export type Route = {
  id: string
  distanceKm: number
  barrierCount: number
  departureTime: string
  durationMin: number
  arrivalTime: string
  cardType: 'standard' | 'uklon' | 'social-taxi'
  segments: RouteSegment[]
  coordinates: RouteCoordinates
  stationNames?: {
    boardAt?: string
    boardAtUk?: string
    direction?: string
    directionUk?: string
    alightAt?: string
    alightAtUk?: string
  }[]
}

// ── Static route data ──────────────────────────────────────────────────────

const TRANSIT_ROUTES: Route[] = [
  {
    id: 'transit-1',
    distanceKm: 1.2,
    barrierCount: 2,
    departureTime: '15:50',
    durationMin: 15,
    arrivalTime: '16:05',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 2,  hasBarriers: false },
      { type: 'bus',  durationMin: 10, line: '103', accessible: true },
      { type: 'walk', durationMin: 3,  hasBarriers: true },
    ],
    stationNames: [
      { boardAt: 'Maidan Nezalezhnosti', boardAtUk: 'Майдан Незалежності', direction: 'towards Lukyanivska', directionUk: 'у напрямку Лук\'янівська', alightAt: 'Palats Sportu', alightAtUk: 'Палац Спорту' },
    ],
    coordinates: {
      segments: [
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5228, 50.4492],
            [30.5220, 50.4485],
          ],
        },
        {
          type: 'bus',
          coords: [
            [30.5220, 50.4485],
            [30.5210, 50.4478],
            [30.5198, 50.4468],
            [30.5185, 50.4458],
            [30.5172, 50.4450],
            [30.5158, 50.4442],
            [30.5145, 50.4435],
            [30.5118, 50.4422],
          ],
        },
        {
          type: 'walk',
          hasBarriers: true,
          coords: [
            [30.5118, 50.4422],
            [30.5108, 50.4418],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'transit-2',
    distanceKm: 4.8,
    barrierCount: 5,
    departureTime: '15:50',
    durationMin: 32,
    arrivalTime: '16:22',
    cardType: 'standard',
    segments: [
      { type: 'bus',   durationMin: 12, line: '15',  accessible: true },
      { type: 'metro', durationMin: 16, line: 'M1',  accessible: false },
      { type: 'walk',  durationMin: 4,  hasBarriers: true },
    ],
    stationNames: [
      { boardAt: 'Khreschatyk', boardAtUk: 'Хрещатик', direction: 'towards Teatralna', directionUk: 'у напрямку Театральна', alightAt: 'Teatralna', alightAtUk: 'Театральна' },
      { boardAt: 'Teatralna', boardAtUk: 'Театральна', direction: 'towards Universytet', directionUk: 'у напрямку Університет', alightAt: 'Universytet', alightAtUk: 'Університет' },
    ],
    coordinates: {
      segments: [
        {
          type: 'bus',
          coords: [
            [30.5234, 50.4501],
            [30.5248, 50.4498],
            [30.5262, 50.4494],
            [30.5275, 50.4489],
            [30.5289, 50.4483],
            [30.5301, 50.4476],
          ],
        },
        {
          type: 'metro',
          coords: [
            [30.5301, 50.4476],
            [30.5312, 50.4461],
            [30.5318, 50.4445],
            [30.5321, 50.4428],
            [30.5318, 50.4412],
            [30.5118, 50.4422],
          ],
        },
        {
          type: 'walk',
          hasBarriers: true,
          coords: [
            [30.5118, 50.4422],
            [30.5108, 50.4418],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'transit-3',
    distanceKm: 2.1,
    barrierCount: 8,
    departureTime: '15:50',
    durationMin: 25,
    arrivalTime: '16:15',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 12, hasBarriers: false },
      { type: 'tram', durationMin: 10, line: '14', accessible: false },
      { type: 'walk', durationMin: 3,  hasBarriers: false },
    ],
    stationNames: [
      { boardAt: 'Sahaidachnoho', boardAtUk: 'Сагайдачного', direction: 'towards Kontraktova', directionUk: 'у напрямку Контрактова', alightAt: 'Kontraktova Ploscha', alightAtUk: 'Контрактова площа' },
    ],
    coordinates: {
      segments: [
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5225, 50.4518],
            [30.5215, 50.4535],
            [30.5205, 50.4552],
            [30.5198, 50.4568],
          ],
        },
        {
          type: 'tram',
          coords: [
            [30.5198, 50.4568],
            [30.5188, 50.4552],
            [30.5175, 50.4535],
            [30.5161, 50.4518],
            [30.5145, 50.4501],
            [30.5128, 50.4485],
            [30.5115, 50.4468],
          ],
        },
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5115, 50.4468],
            [30.5106, 50.4441],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'transit-4',
    distanceKm: 7.1,
    barrierCount: 12,
    departureTime: '15:50',
    durationMin: 38,
    arrivalTime: '16:28',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 3,  hasBarriers: false },
      { type: 'bus',  durationMin: 18, line: '103', accessible: false },
      { type: 'bus',  durationMin: 14, line: '55',  accessible: false },
      { type: 'walk', durationMin: 3,  hasBarriers: true },
    ],
    stationNames: [
      { boardAt: 'Maidan Nezalezhnosti', boardAtUk: 'Майдан Незалежності', direction: 'towards Pechersk', directionUk: 'у напрямку Печерськ', alightAt: 'Klovska', alightAtUk: 'Кловська' },
      { boardAt: 'Klovska', boardAtUk: 'Кловська', direction: 'towards Vydubychi', directionUk: 'у напрямку Видубичі', alightAt: 'Slavy Square', alightAtUk: 'Площа Слави' },
    ],
    coordinates: {
      segments: [
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5242, 50.4495],
            [30.5251, 50.4489],
          ],
        },
        {
          type: 'bus',
          coords: [
            [30.5251, 50.4489],
            [30.5268, 50.4475],
            [30.5285, 50.4461],
            [30.5302, 50.4447],
            [30.5318, 50.4434],
            [30.5335, 50.4421],
          ],
        },
        {
          type: 'bus',
          coords: [
            [30.5335, 50.4421],
            [30.5318, 50.4421],
            [30.5298, 50.4420],
            [30.5275, 50.4419],
            [30.5248, 50.4418],
            [30.5220, 50.4416],
          ],
        },
        {
          type: 'walk',
          hasBarriers: true,
          coords: [
            [30.5220, 50.4416],
            [30.5158, 50.4415],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
]

const CAR_ROUTES: Route[] = [
  {
    id: 'car-1',
    distanceKm: 3.2,
    barrierCount: 1,
    departureTime: '15:50',
    durationMin: 10,
    arrivalTime: '16:00',
    cardType: 'standard',
    segments: [{ type: 'car', durationMin: 10, hasBarriers: false }],
    coordinates: {
      segments: [
        {
          type: 'car',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5220, 50.4480],
            [30.5198, 50.4462],
            [30.5172, 50.4448],
            [30.5145, 50.4436],
            [30.5118, 50.4424],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'car-2',
    distanceKm: 5.8,
    barrierCount: 3,
    departureTime: '15:50',
    durationMin: 18,
    arrivalTime: '16:08',
    cardType: 'standard',
    segments: [{ type: 'car', durationMin: 18, hasBarriers: true }],
    coordinates: {
      segments: [
        {
          type: 'car',
          hasBarriers: true,
          coords: [
            [30.5234, 50.4501],
            [30.5255, 50.4488],
            [30.5278, 50.4472],
            [30.5298, 50.4455],
            [30.5312, 50.4440],
            [30.5298, 50.4428],
            [30.5265, 50.4420],
            [30.5198, 50.4416],
            [30.5145, 50.4415],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'car-uklon',
    distanceKm: 3.2,
    barrierCount: 0,
    departureTime: '15:50',
    durationMin: 12,
    arrivalTime: '16:02',
    cardType: 'uklon',
    segments: [{ type: 'car', durationMin: 12, hasBarriers: false }],
    coordinates: {
      segments: [
        {
          type: 'car',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5220, 50.4480],
            [30.5198, 50.4462],
            [30.5172, 50.4448],
            [30.5145, 50.4436],
            [30.5118, 50.4424],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'car-social-taxi',
    distanceKm: 4.1,
    barrierCount: 0,
    departureTime: '15:50',
    durationMin: 20,
    arrivalTime: '16:10',
    cardType: 'social-taxi',
    segments: [{ type: 'car', durationMin: 20, hasBarriers: true }],
    coordinates: {
      segments: [
        {
          type: 'car',
          hasBarriers: true,
          coords: [
            [30.5234, 50.4501],
            [30.5255, 50.4488],
            [30.5278, 50.4472],
            [30.5298, 50.4455],
            [30.5312, 50.4440],
            [30.5298, 50.4428],
            [30.5265, 50.4420],
            [30.5198, 50.4416],
            [30.5145, 50.4415],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
]

const WALKING_ROUTES: Route[] = [
  {
    id: 'walk-1',
    distanceKm: 0.8,
    barrierCount: 1,
    departureTime: '15:50',
    durationMin: 12,
    arrivalTime: '16:02',
    cardType: 'standard',
    segments: [{ type: 'walk', durationMin: 12, hasBarriers: false }],
    coordinates: {
      segments: [
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5218, 50.4485],
            [30.5198, 50.4468],
            [30.5172, 50.4450],
            [30.5145, 50.4435],
            [30.5118, 50.4422],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
  {
    id: 'walk-2',
    distanceKm: 1.4,
    barrierCount: 0,
    departureTime: '15:50',
    durationMin: 20,
    arrivalTime: '16:10',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 12, hasBarriers: false },
      { type: 'walk', durationMin: 8,  hasBarriers: true },
    ],
    coordinates: {
      segments: [
        {
          type: 'walk',
          hasBarriers: false,
          coords: [
            [30.5234, 50.4501],
            [30.5218, 50.4490],
            [30.5198, 50.4478],
            [30.5172, 50.4462],
          ],
        },
        {
          type: 'walk',
          hasBarriers: true,
          coords: [
            [30.5172, 50.4462],
            [30.5145, 50.4445],
            [30.5118, 50.4430],
            [30.5098, 50.4415], // ← shared end point
          ],
        },
      ],
    },
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

const ROUTE_SORT_KEYS: RouteSortKey[] = ['fewest-barriers', 'shortest-distance', 'fastest', 'flattest']

function sortRoutes(routes: Route[], sortKey: RouteSortKey): Route[] {
  const sorted = [...routes]
  switch (sortKey) {
    case 'fewest-barriers':   return sorted.sort((a, b) => a.barrierCount - b.barrierCount)
    case 'shortest-distance': return sorted.sort((a, b) => a.distanceKm - b.distanceKm)
    case 'fastest':           return sorted.sort((a, b) => a.durationMin - b.durationMin)
    case 'flattest':          return sorted.sort((a, b) => a.barrierCount - b.barrierCount)
    default: return sorted
  }
}

function getActiveRoutes(tab: 'transit' | 'car' | 'walking'): Route[] {
  switch (tab) {
    case 'transit': return TRANSIT_ROUTES
    case 'car':     return CAR_ROUTES
    case 'walking': return WALKING_ROUTES
  }
}

function getSegmentIcon(type: RouteSegment['type']) {
  switch (type) {
    case 'bus':   return Bus
    case 'tram':  return TramFront
    case 'metro': return Train
    case 'car':   return Car
    default:      return Bus
  }
}

function getSegmentWidthPercent(segmentDuration: number, totalDuration: number): number {
  return Math.max((segmentDuration / totalDuration) * 100, 10) // minimum 10% so icon always fits
}

// ── Shared helpers for transit / walking cards ─────────────────────────────

const BadgeRow: React.FC<{ route: Route }> = ({ route }) => {
  const { t, i18n } = useTranslation()
  const vehicleSegment = route.segments.find(s => s.type !== 'walk' && s.type !== 'car')

  return (
    <div className="flex gap-[10px] items-center flex-wrap">
      <div className="flex items-center px-[8px] py-[4px] bg-primary-100 rounded-[24px]">
        <span className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-700">
          {formatDistance(route.distanceKm * 1000, i18n.language)}
        </span>
      </div>

      {vehicleSegment && (() => {
        const Icon = getSegmentIcon(vehicleSegment.type)
        const accessible = vehicleSegment.accessible ?? false
        return (
          <div className={[
            'flex items-center gap-[6px] px-[8px] py-[4px] rounded-[24px]',
            accessible ? 'bg-success-100' : 'bg-danger-100',
          ].join(' ')}>
            <Icon size={16} strokeWidth={1.5} className={accessible ? 'text-success-700' : 'text-danger-500'} />
            <span className={[
              'text-[12px] font-medium leading-[1.4] tracking-[0.12px] whitespace-nowrap',
              accessible ? 'text-success-700' : 'text-danger-500',
            ].join(' ')}>
              {accessible ? t('routePlanning.accessibleVehicle') : t('routePlanning.inaccessibleVehicle')}
            </span>
          </div>
        )
      })()}

      {route.barrierCount > 0 && (
        <div className={[
          'flex items-center gap-[6px] px-[8px] py-[4px] rounded-[24px]',
          vehicleSegment?.accessible !== false ? 'bg-warning-100' : 'bg-danger-100',
        ].join(' ')}>
          <Construction
            size={16}
            strokeWidth={1.5}
            className={vehicleSegment?.accessible !== false ? 'text-warning-700' : 'text-danger-500'}
          />
          <span className={[
            'text-[12px] font-medium leading-[1.4] tracking-[0.12px] whitespace-nowrap',
            vehicleSegment?.accessible !== false ? 'text-warning-700' : 'text-danger-500',
          ].join(' ')}>
            {t('map.barriers', { count: route.barrierCount })}
          </span>
        </div>
      )}
    </div>
  )
}

const TimeRow: React.FC<{ route: Route }> = ({ route }) => {
  const { i18n } = useTranslation()
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900">{route.departureTime}</span>
      <div className="flex items-center gap-[6px]">
        <span className="font-normal text-[14px] leading-[1.4] tracking-[0.12px] text-neutral-700">
          {formatDuration(route.durationMin, i18n.language)}
        </span>
        <span className="font-normal text-[14px] leading-[1.4] text-neutral-300">|</span>
        <span className="font-normal text-[14px] leading-[1.4] tracking-[0.12px] text-neutral-700">
          {formatDistance(route.distanceKm * 1000, i18n.language)}
        </span>
      </div>
      <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900">{route.arrivalTime}</span>
    </div>
  )
}

function mergeConsecutiveWalkSegments(segments: RouteSegment[]): RouteSegment[] {
  const merged: RouteSegment[] = []
  for (const seg of segments) {
    const last = merged[merged.length - 1]
    if (seg.type === 'walk' && last?.type === 'walk') {
      merged[merged.length - 1] = {
        ...last,
        durationMin: last.durationMin + seg.durationMin,
        hasBarriers: last.hasBarriers || seg.hasBarriers,
      }
    } else {
      merged.push(seg)
    }
  }
  return merged
}

function adaptSegments(segments: Route['segments'], forceAccessible = false): TimelineSegment[] {
  const mapped: TimelineSegment[] = []
  for (const seg of segments) {
    if (seg.type === 'walk') {
      const last = mapped[mapped.length - 1]
      if (last?.type === 'walking') {
        last.durationMinutes += seg.durationMin
      } else {
        mapped.push({ type: 'walking', durationMinutes: seg.durationMin })
      }
    } else {
      mapped.push({
        type: 'transport',
        mode: seg.type as 'bus' | 'tram' | 'metro' | 'car',
        routeNumber: seg.line,
        accessibility: forceAccessible ? 'accessible' : seg.accessible === true ? 'accessible' : seg.accessible === false ? 'inaccessible' : 'unknown',
        durationMinutes: seg.durationMin,
      })
    }
  }
  return mapped
}

function SegmentTimeline({ route, isCarTab }: { route: Route; isCarTab: boolean }) {
  const displaySegments = mergeConsecutiveWalkSegments(route.segments)
  const total = displaySegments.reduce((sum, s) => sum + s.durationMin, 0)

  return (
    <div className={`h-[36px] rounded-[48px] w-full flex overflow-hidden ${isCarTab ? 'bg-primary-500' : 'bg-primary-100'}`}>
      {displaySegments.map((seg, i) => {
        const widthPercent = getSegmentWidthPercent(seg.durationMin, total)
        const isWalk = seg.type === 'walk'
        const isShortTransfer = seg.durationMin <= 3 && i > 0

        if (isCarTab) {
          return (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{ width: `${widthPercent}%` }}
            >
              {!isShortTransfer && (
                <Car size={20} strokeWidth={1.5} className="text-neutral-0" />
              )}
            </div>
          )
        }

        if (isWalk) {
          return (
            <div
              key={i}
              className="flex items-center justify-center bg-primary-100"
              style={{ width: `${widthPercent}%` }}
            >
              {!isShortTransfer && (
                <Accessibility size={20} strokeWidth={1.5} className="text-primary-500" />
              )}
            </div>
          )
        }

        const Icon = seg.type === 'bus' ? Bus
          : seg.type === 'tram' ? TramFront
          : seg.type === 'metro' ? Train
          : Car

        const isNarrow = seg.durationMin <= 5

        return (
          <div
            key={i}
            className="flex items-center justify-center bg-primary-500 rounded-[48px]"
            style={{ width: `${widthPercent}%` }}
          >
            {!isNarrow ? (
              <div className="flex items-center gap-[6px] px-[8px]">
                <AccessibilityBadge
                  variant={seg.accessible ? 'accessible' : 'inaccessible'}
                  size="sm"
                />
                <Icon size={16} strokeWidth={1.5} className="text-neutral-0" />
                {seg.line && (
                  <span className="text-[12px] font-semibold text-neutral-0 whitespace-nowrap">
                    {seg.line}
                  </span>
                )}
              </div>
            ) : (
              <Icon size={16} strokeWidth={1.5} className="text-neutral-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Transit / walking card ─────────────────────────────────────────────────

const RouteCard: React.FC<{ route: Route; onSelect: (r: Route) => void; mobilityAid: MobilityAid }> = ({ route, onSelect, mobilityAid }) => (
  <button
    type="button"
    onClick={() => onSelect(route)}
    className={[
      'flex flex-col gap-[12px] p-[16px]',
      'bg-neutral-0 border border-neutral-200 rounded-[24px] w-full text-left',
      'transition-colors duration-200',
      'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
    ].join(' ')}
  >
    <TimeRow route={route} />
    <RouteTimeline segments={adaptSegments(route.segments)} mobilityAid={mobilityAid} />
  </button>
)

// ── Car tab — own car card ─────────────────────────────────────────────────

const StandardRouteCard: React.FC<{ route: Route; onSelect: (r: Route) => void; mobilityAid: MobilityAid }> = ({ route, onSelect, mobilityAid }) => {
  const { i18n } = useTranslation()
  return (
  <button
    type="button"
    onClick={() => onSelect(route)}
    className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0 w-full text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
  >
    {/* Time row */}
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] text-neutral-900">{route.departureTime}</span>
      <div className="flex items-center gap-[6px]">
        <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">
          {formatDuration(route.durationMin, i18n.language)}
        </span>
        <span className="font-normal text-[14px] text-neutral-300">|</span>
        <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">
          {formatDistance(route.distanceKm * 1000, i18n.language)}
        </span>
      </div>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline */}
    <RouteTimeline segments={adaptSegments(route.segments)} mobilityAid={mobilityAid} />
  </button>
  )
}

// ── Car tab — Uklon card ───────────────────────────────────────────────────

const UklonCard: React.FC<{ route: Route; onSelect: (r: Route) => void; mobilityAid: MobilityAid }> = ({ route, onSelect, mobilityAid }) => {
  const { t, i18n } = useTranslation()
  return (
  <div className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0">
    {/* Logo */}
    <img
      src="/src/assets/icons/Uklon_Logo_2018.png"
      alt={t('routePlanning.uklonAlt')}
      className="h-[16px] object-contain self-start"
    />

    {/* Time row */}
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] text-neutral-900">{route.departureTime}</span>
      <div className="flex items-center gap-[6px]">
        <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">
          {formatDuration(route.durationMin, i18n.language)}
        </span>
        <span className="font-normal text-[14px] text-neutral-300">|</span>
        <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">
          {formatDistance(route.distanceKm * 1000, i18n.language)}
        </span>
      </div>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline */}
    <RouteTimeline segments={adaptSegments(route.segments, true)} mobilityAid={mobilityAid} />

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: UKLON_YELLOW, color: UKLON_BLACK }}
      onClick={() => onSelect(route)}
    >
      {t('routePlanning.orderUklon')}
    </button>
  </div>
  )
}

// ── Car tab — Social Taxi card ─────────────────────────────────────────────

const SocialTaxiCard: React.FC<{ route: Route; onSelect: (r: Route) => void; mobilityAid: MobilityAid }> = ({ route, onSelect, mobilityAid }) => {
  const { t } = useTranslation()
  return (
  <div className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0">
    {/* Booking notice */}
    <p className="font-normal text-[14px] leading-[1.4] tracking-[0.12px] text-neutral-700">
      <Trans
        i18nKey="routePlanning.socialTransportNotice"
        values={{ phone: SOCIAL_TAXI_PHONE }}
        components={{ bold: <span className="font-semibold text-neutral-900" /> }}
      />
    </p>

    {/* Timeline */}
    <RouteTimeline segments={adaptSegments(route.segments, true)} mobilityAid={mobilityAid} />

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: SOCIAL_TAXI_DARK_BLUE, color: SOCIAL_TAXI_YELLOW }}
      onClick={() => onSelect(route)}
    >
      {t('routePlanning.scheduleRide')}
    </button>
  </div>
  )
}

// ── Section label ──────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-medium text-[12px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700">
    {children}
  </p>
)

// ── Props ──────────────────────────────────────────────────────────────────

type RoutePlanningSheetProps = {
  isOpen: boolean
  destinationName: string
  onClose: () => void
  onRouteSelect: (route: Route) => void
  overrideTop?: number | null
  maxHeight?: number
}

// ── Sheet ──────────────────────────────────────────────────────────────────

export const RoutePlanningSheet: React.FC<RoutePlanningSheetProps> = ({
  isOpen,
  destinationName,
  onClose,
  onRouteSelect,
  overrideTop,
  maxHeight,
}) => {
  const [routeSortValue, setRouteSortValue] = useState<RouteSortKey>('fewest-barriers')
  const [routeSortOpen,  setRouteSortOpen]  = useState(false)
  const [activeTab,      setActiveTab]      = useState<'transit' | 'car' | 'walking'>('transit')
  const [dragStartY,     setDragStartY]     = useState(0)
  const [dragDelta,      setDragDelta]      = useState(0)
  const [sheetHeight,    setSheetHeight]    = useState(() => window.innerHeight)
  const DRAG_THRESHOLD = 80

  const { mobilityAid } = useOnboarding()
  const { t } = useTranslation()

  const routeSortOptions = ROUTE_SORT_KEYS.map(key => ({ key, label: t(`sort.${key}`) }))
  const routeSortLabel   = t(`sort.${routeSortValue}`)

  const scrollRef  = useRef<HTMLDivElement>(null)
  const sheetRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    if (sheetRef.current) {
      const h = sheetRef.current.getBoundingClientRect().height
      if (h > 0) setSheetHeight(h)
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
    if (dragDelta > DRAG_THRESHOLD) onClose()
    setDragDelta(0)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div aria-hidden="true" className="fixed inset-0 z-[65]" onClick={onClose} />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bottom-0 z-[70] bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] flex flex-col"
        style={{
          top: overrideTop !== null && overrideTop !== undefined
            ? overrideTop
            : isOpen ? 248 : window.innerHeight,
          transform: `translateY(${dragDelta}px)`,
          transition: 'top 0.3s ease',
          ...(maxHeight !== undefined ? { maxHeight, overflow: 'hidden' } : {}),
        }}
      >
        {/* Drag handle */}
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
          className="flex-1 overflow-y-auto px-[24px] flex flex-col gap-[24px] pb-[48px]"
        >
          {/* Back button */}
          <div className="pt-[8px]">
            <Button variant="back" onClick={onClose}>{t('common.back')}</Button>
          </div>

          {/* Destination heading */}
          <h2 className="text-display-md text-neutral-900">
            {t('routePlanning.routesTo', { destination: destinationName })}
          </h2>

          {/* Power outage warning */}
          <div className="flex gap-[12px] items-center p-[16px] bg-warning-100 rounded-[48px] w-full">
            <Zap size={16} strokeWidth={1.5} className="text-warning-700 shrink-0" />
            <p className="text-[14px] font-normal leading-[1.5] text-warning-700 flex-1">
              {t('routePlanning.powerOutageWarning')}
            </p>
          </div>

          {/* Transport switcher + sort control */}
          <div className="flex flex-col gap-[16px]">
            <TransportSwitcher value={activeTab} onChange={setActiveTab} mobilityAid={mobilityAid ?? 'no-aid'} />
            <SortControl value={routeSortLabel} onPress={() => setRouteSortOpen(true)} />
          </div>

          {/* Route cards */}
          {activeTab === 'car' ? (() => {
            const ownCarRoute = CAR_ROUTES.filter(r => r.cardType === 'standard').slice(0, 1)

            return (
              <div className="flex flex-col gap-[24px]">

                {/* Own car section — single result, no best-match badge */}
                {ownCarRoute.length > 0 && (
                  <div className="flex flex-col gap-[16px]">
                    <SectionLabel>{t('routePlanning.ownCar')}</SectionLabel>
                    {ownCarRoute.map(route => (
                      <StandardRouteCard key={route.id} route={route} onSelect={onRouteSelect} mobilityAid={mobilityAid ?? 'no-aid'} />
                    ))}
                  </div>
                )}

                {/* Taxi section */}
                <div className="flex flex-col gap-[16px]">
                  <SectionLabel>{t('routePlanning.taxi')}</SectionLabel>
                  {CAR_ROUTES.filter(r => r.cardType === 'uklon').map(route => (
                    <UklonCard key={route.id} route={route} onSelect={onRouteSelect} mobilityAid={mobilityAid ?? 'no-aid'} />
                  ))}
                </div>

                {/* Social Taxi section */}
                <div className="flex flex-col gap-[16px]">
                  <SectionLabel>{t('routePlanning.socialTaxiLabel')}</SectionLabel>
                  {CAR_ROUTES.filter(r => r.cardType === 'social-taxi').map(route => (
                    <SocialTaxiCard key={route.id} route={route} onSelect={onRouteSelect} mobilityAid={mobilityAid ?? 'no-aid'} />
                  ))}
                </div>

              </div>
            )
          })() : (() => {
            const activeRoutes  = getActiveRoutes(activeTab)
            const match         = mobilityAid ? getBestMatch(activeRoutes, mobilityAid) : null
            const regularRoutes = sortRoutes(
              match ? activeRoutes.filter(r => r.id !== match.route.id) : activeRoutes,
              routeSortValue,
            )

            return (
              <div className="flex flex-col gap-md">

                {/* Best match pinned card */}
                {match && (
                  <BestMatchCard tags={match.tags}>
                    <RouteCard route={match.route} onSelect={onRouteSelect} mobilityAid={mobilityAid ?? 'no-aid'} />
                  </BestMatchCard>
                )}

                {/* Regular sorted list */}
                {regularRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} onSelect={onRouteSelect} mobilityAid={mobilityAid ?? 'no-aid'} />
                ))}

              </div>
            )
          })()}
        </div>
      </div>

      {/* SortSheet — must be outside sheet div to avoid overflow:hidden clipping */}
      <SortSheet
        isOpen={routeSortOpen}
        options={routeSortOptions}
        value={routeSortValue}
        onChange={(key) => setRouteSortValue(key as RouteSortKey)}
        onClose={() => setRouteSortOpen(false)}
        height={sheetHeight}
      />
    </>
  )
}
