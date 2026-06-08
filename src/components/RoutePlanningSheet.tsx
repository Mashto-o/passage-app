import React, { useState, useRef, useEffect } from 'react'
import { Zap, Construction, Bus, TramFront, Train, Car, CarTaxiFront, Accessibility } from 'lucide-react'
import {
  Button, SortControl, SortSheet, TransportSwitcher, AccessibilityBadge,
} from './index'

// Third-party brand colours — hardcoded intentionally, not Passage tokens
const UKLON_YELLOW          = '#F5DB00'
const UKLON_BLACK           = '#222426'
const SOCIAL_TAXI_YELLOW    = '#FED428'
const SOCIAL_TAXI_DARK_BLUE = '#253362'

// ── Types ──────────────────────────────────────────────────────────────────

type RouteSegment = {
  type: 'walk' | 'bus' | 'tram' | 'metro' | 'car'
  durationMin: number
  line?: string
  accessible?: boolean
}

type RouteCoordinates = {
  segments: {
    type: 'walk' | 'bus' | 'tram' | 'metro' | 'car'
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
    direction?: string
    alightAt?: string
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
      { type: 'walk', durationMin: 2 },
      { type: 'bus', durationMin: 10, line: '103', accessible: true },
      { type: 'walk', durationMin: 3 },
    ],
    stationNames: [
      { boardAt: 'Maidan Nezalezhnosti', direction: 'towards Lukyanivska', alightAt: 'Palats Sportu' },
    ],
    coordinates: {
      segments: [
        { type: 'walk', coords: [[30.5234, 50.4501], [30.5241, 50.4497]] },
        { type: 'bus',  coords: [[30.5241, 50.4497], [30.5260, 50.4510], [30.5275, 50.4523], [30.5289, 50.4535]] },
        { type: 'walk', coords: [[30.5289, 50.4535], [30.5298, 50.4541]] },
      ],
    },
  },
  {
    id: 'transit-2',
    distanceKm: 4.8,
    barrierCount: 5,
    departureTime: '15:50',
    durationMin: 28,
    arrivalTime: '16:18',
    cardType: 'standard',
    segments: [
      { type: 'bus', durationMin: 12, line: '15', accessible: true },
      { type: 'metro', durationMin: 16, line: 'M1', accessible: false },
    ],
    stationNames: [
      { boardAt: 'Khreschatyk', direction: 'towards Teatralna', alightAt: 'Teatralna' },
      { boardAt: 'Teatralna', direction: 'towards Universytet', alightAt: 'Universytet' },
    ],
    coordinates: {
      segments: [
        { type: 'bus',   coords: [[30.5234, 50.4501], [30.5220, 50.4488], [30.5198, 50.4476]] },
        { type: 'metro', coords: [[30.5198, 50.4476], [30.5170, 50.4460], [30.5145, 50.4445]] },
      ],
    },
  },
  {
    id: 'transit-3',
    distanceKm: 2.1,
    barrierCount: 8,
    departureTime: '15:50',
    durationMin: 22,
    arrivalTime: '16:12',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 12 },
      { type: 'tram', durationMin: 10, line: '14', accessible: false },
    ],
    stationNames: [
      { boardAt: 'Sahaidachnoho', direction: 'towards Kontraktova', alightAt: 'Kontraktova Ploscha' },
    ],
    coordinates: {
      segments: [
        { type: 'walk', coords: [[30.5234, 50.4501], [30.5210, 50.4530], [30.5190, 50.4558]] },
        { type: 'tram', coords: [[30.5190, 50.4558], [30.5165, 50.4580], [30.5140, 50.4601]] },
      ],
    },
  },
  {
    id: 'transit-4',
    distanceKm: 7.1,
    barrierCount: 12,
    departureTime: '15:50',
    durationMin: 35,
    arrivalTime: '16:25',
    cardType: 'standard',
    segments: [
      { type: 'walk', durationMin: 3 },
      { type: 'bus', durationMin: 18, line: '103', accessible: false },
      { type: 'bus', durationMin: 14, line: '55', accessible: false },
    ],
    stationNames: [
      { boardAt: 'Maidan Nezalezhnosti', direction: 'towards Pechersk', alightAt: 'Klovska' },
      { boardAt: 'Klovska', direction: 'towards Vydubychi', alightAt: 'Slavy Square' },
    ],
    coordinates: {
      segments: [
        { type: 'walk', coords: [[30.5234, 50.4501], [30.5240, 50.4495]] },
        { type: 'bus',  coords: [[30.5240, 50.4495], [30.5260, 50.4478], [30.5285, 50.4461], [30.5310, 50.4445]] },
        { type: 'bus',  coords: [[30.5310, 50.4445], [30.5340, 50.4430], [30.5370, 50.4415], [30.5398, 50.4401]] },
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
    segments: [{ type: 'car', durationMin: 10 }],
    coordinates: {
      segments: [
        { type: 'car', coords: [[30.5234, 50.4501], [30.5260, 50.4480], [30.5290, 50.4465]] },
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
    segments: [{ type: 'car', durationMin: 18 }],
    coordinates: {
      segments: [
        { type: 'car', coords: [[30.5234, 50.4501], [30.5260, 50.4480], [30.5290, 50.4465]] },
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
    segments: [{ type: 'car', durationMin: 12 }],
    coordinates: {
      segments: [
        { type: 'car', coords: [[30.5234, 50.4501], [30.5260, 50.4480], [30.5290, 50.4465]] },
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
    segments: [{ type: 'car', durationMin: 20 }],
    coordinates: {
      segments: [
        { type: 'car', coords: [[30.5234, 50.4501], [30.5260, 50.4480], [30.5290, 50.4465]] },
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
    segments: [{ type: 'walk', durationMin: 12 }],
    coordinates: {
      segments: [
        { type: 'walk', coords: [[30.5234, 50.4501], [30.5245, 50.4510], [30.5255, 50.4518]] },
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
    segments: [{ type: 'walk', durationMin: 20 }],
    coordinates: {
      segments: [
        { type: 'walk', coords: [[30.5234, 50.4501], [30.5245, 50.4510], [30.5255, 50.4518]] },
      ],
    },
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

const ROUTE_SORT_OPTIONS = ['Fewest barriers', 'Shortest distance', 'Fastest', 'Flattest route']

function sortRoutes(routes: Route[], sortValue: string): Route[] {
  const sorted = [...routes]
  switch (sortValue) {
    case 'Fewest barriers':   return sorted.sort((a, b) => a.barrierCount - b.barrierCount)
    case 'Shortest distance': return sorted.sort((a, b) => a.distanceKm - b.distanceKm)
    case 'Fastest':           return sorted.sort((a, b) => a.durationMin - b.durationMin)
    case 'Flattest route':    return sorted.sort((a, b) => a.barrierCount - b.barrierCount)
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
  const vehicleSegment = route.segments.find(s => s.type !== 'walk' && s.type !== 'car')

  return (
    <div className="flex gap-[10px] items-center flex-wrap">
      <div className="flex items-center px-[8px] py-[4px] bg-primary-100 rounded-[24px]">
        <span className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-700">
          {route.distanceKm} km
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
              {accessible ? 'Accessible vehicle' : 'Inaccessible vehicle'}
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
            {route.barrierCount} barriers
          </span>
        </div>
      )}
    </div>
  )
}

const TimeRow: React.FC<{ route: Route }> = ({ route }) => (
  <div className="flex items-center justify-between">
    <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900">{route.departureTime}</span>
    <span className="font-normal text-[14px] leading-[1.4] tracking-[0.12px] text-neutral-700">{route.durationMin} min</span>
    <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900">{route.arrivalTime}</span>
  </div>
)

function SegmentTimeline({ route, isCarTab }: { route: Route; isCarTab: boolean }) {
  const total = route.segments.reduce((sum, s) => sum + s.durationMin, 0)

  return (
    <div className={`h-[36px] rounded-[48px] w-full flex overflow-hidden ${isCarTab ? 'bg-primary-500' : 'bg-primary-100'}`}>
      {route.segments.map((seg, i) => {
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

const RouteCard: React.FC<{ route: Route; onSelect: (r: Route) => void }> = ({ route, onSelect }) => (
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
    <BadgeRow route={route} />
    <TimeRow route={route} />
    <SegmentTimeline route={route} isCarTab={false} />
  </button>
)

// ── Car tab — own car card ─────────────────────────────────────────────────

const StandardRouteCard: React.FC<{ route: Route; onSelect: (r: Route) => void }> = ({ route, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(route)}
    className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0 w-full text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
  >
    {/* Badge row */}
    <div className="flex items-center gap-[10px]">
      <div className="bg-primary-100 px-[8px] py-[4px] rounded-[24px]">
        <span className="text-[12px] font-medium text-primary-700 tracking-[0.12px]">
          {route.distanceKm} km
        </span>
      </div>
      {route.barrierCount > 0 && (
        <div className="flex items-center gap-[8px] bg-warning-100 px-[8px] py-[4px] rounded-[24px]">
          <Construction size={16} strokeWidth={1.5} className="text-warning-500" />
          <span className="text-[12px] font-medium text-warning-500 tracking-[0.12px]">
            {route.barrierCount} barriers
          </span>
        </div>
      )}
    </div>

    {/* Time row */}
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] text-neutral-900">{route.departureTime}</span>
      <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline */}
    <SegmentTimeline route={route} isCarTab={true} />
  </button>
)

// ── Car tab — Uklon card ───────────────────────────────────────────────────

const UklonCard: React.FC<{ route: Route; onSelect: (r: Route) => void }> = ({ route, onSelect }) => (
  <div className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0">
    {/* Top row: distance badge left, Uklon logo right */}
    <div className="flex items-center justify-between">
      <div className="bg-primary-100 px-[8px] py-[4px] rounded-[24px]">
        <span className="text-[12px] font-medium text-primary-700 tracking-[0.12px]">
          {route.distanceKm} km
        </span>
      </div>
      <img
        src="/src/assets/icons/Uklon_Logo_2018.png"
        alt="Uklon"
        className="h-[16px] object-contain"
      />
    </div>

    {/* Time row */}
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] text-neutral-900">{route.departureTime}</span>
      <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline — taxi icon centered */}
    <div className="bg-primary-500 h-[36px] rounded-[48px] w-full flex items-center justify-center">
      <CarTaxiFront size={20} strokeWidth={1.5} className="text-neutral-0" />
    </div>

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: UKLON_YELLOW, color: UKLON_BLACK }}
      onClick={() => onSelect(route)}
    >
      Order Uklon
    </button>
  </div>
)

// ── Car tab — Social Taxi card ─────────────────────────────────────────────

const SocialTaxiCard: React.FC<{ route: Route; onSelect: (r: Route) => void }> = ({ route, onSelect }) => (
  <div className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0">
    {/* Top row: distance badge left, Social Taxi logo right */}
    <div className="flex items-center justify-between">
      <div className="bg-primary-100 px-[8px] py-[4px] rounded-[24px]">
        <span className="text-[12px] font-medium text-primary-700 tracking-[0.12px]">
          {route.distanceKm} km
        </span>
      </div>
      <img
        src="/src/assets/icons/SocialTaxi_Logo.png"
        alt="Соціальне таксі"
        className="h-[24px] object-contain"
      />
    </div>

    {/* Time row */}
    <div className="flex items-center justify-between">
      <span className="font-semibold text-[14px] text-neutral-900">{route.departureTime}</span>
      <span className="font-normal text-[14px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline — taxi icon centered */}
    <div className="bg-primary-500 h-[36px] rounded-[48px] w-full flex items-center justify-center">
      <CarTaxiFront size={20} strokeWidth={1.5} className="text-neutral-0" />
    </div>

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: SOCIAL_TAXI_DARK_BLUE, color: SOCIAL_TAXI_YELLOW }}
      onClick={() => onSelect(route)}
    >
      Schedule a ride
    </button>
  </div>
)

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
}

// ── Sheet ──────────────────────────────────────────────────────────────────

export const RoutePlanningSheet: React.FC<RoutePlanningSheetProps> = ({
  isOpen,
  destinationName,
  onClose,
  onRouteSelect,
  overrideTop,
}) => {
  const [routeSortValue, setRouteSortValue] = useState('Fewest barriers')
  const [routeSortOpen,  setRouteSortOpen]  = useState(false)
  const [activeTab,      setActiveTab]      = useState<'transit' | 'car' | 'walking'>('transit')
  const [dragStartY,     setDragStartY]     = useState(0)
  const [dragDelta,      setDragDelta]      = useState(0)
  const [sheetHeight,    setSheetHeight]    = useState(600)
  const DRAG_THRESHOLD = 80

  const scrollRef  = useRef<HTMLDivElement>(null)
  const sheetRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    if (sheetRef.current) {
      setSheetHeight(sheetRef.current.getBoundingClientRect().height)
    }
  }, [isOpen])

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
        <div className="fixed inset-0 z-[65]" onClick={onClose} />
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
        }}
      >
        {/* Drag handle */}
        <div
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
            <Button variant="back" onClick={onClose}>Back</Button>
          </div>

          {/* Destination heading */}
          <h2 className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900">
            Routes to {destinationName}
          </h2>

          {/* Power outage warning */}
          <div className="flex gap-[12px] items-center p-[16px] bg-warning-100 rounded-[48px] w-full">
            <Zap size={16} strokeWidth={1.5} className="text-warning-700 shrink-0" />
            <p className="text-[14px] font-normal leading-[1.5] text-warning-700 flex-1">
              Power outage expected in ~30 min. We recommend the shortest route.
            </p>
          </div>

          {/* Transport switcher + sort control */}
          <div className="flex flex-col gap-[16px]">
            <TransportSwitcher value={activeTab} onChange={setActiveTab} />
            <SortControl value={routeSortValue} onPress={() => setRouteSortOpen(true)} />
          </div>

          {/* Route cards */}
          {activeTab === 'car' ? (
            <div className="flex flex-col gap-[24px]">

              {/* Own car section */}
              <div className="flex flex-col gap-[16px]">
                <SectionLabel>Own car</SectionLabel>
                {sortRoutes(
                  CAR_ROUTES.filter(r => r.cardType === 'standard'),
                  routeSortValue
                ).map(route => (
                  <StandardRouteCard key={route.id} route={route} onSelect={onRouteSelect} />
                ))}
              </div>

              {/* Taxi section */}
              <div className="flex flex-col gap-[16px]">
                <SectionLabel>Taxi</SectionLabel>
                {CAR_ROUTES.filter(r => r.cardType !== 'standard').map(route =>
                  route.cardType === 'uklon'
                    ? <UklonCard key={route.id} route={route} onSelect={onRouteSelect} />
                    : <SocialTaxiCard key={route.id} route={route} onSelect={onRouteSelect} />
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {sortRoutes(getActiveRoutes(activeTab), routeSortValue).map((route) => (
                <RouteCard key={route.id} route={route} onSelect={onRouteSelect} />
              ))}
            </div>
          )}
        </div>

        {/* Sort sheet — outside scrollable area */}
        <SortSheet
          isOpen={routeSortOpen}
          options={ROUTE_SORT_OPTIONS}
          value={routeSortValue}
          onChange={(val) => setRouteSortValue(val)}
          onClose={() => setRouteSortOpen(false)}
          height={sheetHeight}
        />
      </div>
    </>
  )
}
