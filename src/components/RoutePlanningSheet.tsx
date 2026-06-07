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

type Route = {
  id: string
  distanceKm: number
  barrierCount: number
  departureTime: string
  durationMin: number
  arrivalTime: string
  cardType: 'standard' | 'uklon' | 'social-taxi'
  segments: RouteSegment[]
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
    <span className="font-medium text-[12px] leading-[1.4] tracking-[0.12px] text-neutral-700">{route.durationMin} min</span>
    <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900">{route.arrivalTime}</span>
  </div>
)

const StandardTimeline: React.FC<{ route: Route }> = ({ route }) => {
  const isWalkOnly = route.segments.every(s => s.type === 'walk')

  if (isWalkOnly) {
    return (
      <div className="bg-primary-100 h-[36px] rounded-[48px] w-full flex items-center justify-center">
        <Accessibility size={20} strokeWidth={1.5} className="text-primary-500" />
      </div>
    )
  }

  return (
    <div className="bg-primary-100 h-[36px] rounded-[48px] w-full relative overflow-hidden flex items-center justify-center gap-[8px] px-[8px]">
      {route.segments.map((seg, i) => {
        if (seg.type === 'walk') {
          return <Accessibility key={i} size={20} strokeWidth={1.5} className="text-primary-500 shrink-0" />
        }
        const Icon = getSegmentIcon(seg.type)
        return (
          <div key={i} className="flex items-center gap-[6px] px-[10px] py-[4px] bg-primary-500 rounded-[48px] shrink-0">
            <AccessibilityBadge variant={seg.accessible ? 'accessible' : 'inaccessible'} size="sm" />
            <Icon size={16} strokeWidth={1.5} className="text-neutral-0" />
            {seg.line && (
              <span className="text-[14px] font-semibold text-neutral-0 whitespace-nowrap">{seg.line}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Transit / walking card ─────────────────────────────────────────────────

const RouteCard: React.FC<{ route: Route }> = ({ route }) => (
  <button
    type="button"
    onClick={() => console.log('Route selected', route.id)}
    className={[
      'flex flex-col gap-[12px] p-[16px]',
      'bg-neutral-0 border border-neutral-200 rounded-[24px] w-full text-left',
      'transition-colors duration-200',
      'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
    ].join(' ')}
  >
    <BadgeRow route={route} />
    <TimeRow route={route} />
    <StandardTimeline route={route} />
  </button>
)

// ── Car tab — own car card ─────────────────────────────────────────────────

const StandardRouteCard: React.FC<{ route: Route }> = ({ route }) => (
  <div className="border border-neutral-200 rounded-[24px] p-[16px] flex flex-col gap-[12px] bg-neutral-0">
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
      <span className="font-medium text-[12px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline — Car icon centered */}
    <div className="bg-primary-100 h-[36px] rounded-[48px] w-full flex items-center justify-center">
      <Car size={20} strokeWidth={1.5} className="text-primary-500" />
    </div>
  </div>
)

// ── Car tab — Uklon card ───────────────────────────────────────────────────

const UklonCard: React.FC<{ route: Route }> = ({ route }) => (
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
      <span className="font-medium text-[12px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline — taxi icon centered */}
    <div className="bg-primary-100 h-[36px] rounded-[48px] w-full flex items-center justify-center">
      <CarTaxiFront size={20} strokeWidth={1.5} className="text-primary-500" />
    </div>

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: UKLON_YELLOW, color: UKLON_BLACK }}
      onClick={() => console.log('Order Uklon')}
    >
      Order Uklon
    </button>
  </div>
)

// ── Car tab — Social Taxi card ─────────────────────────────────────────────

const SocialTaxiCard: React.FC<{ route: Route }> = ({ route }) => (
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
      <span className="font-medium text-[12px] text-neutral-700 tracking-[0.12px]">{route.durationMin} min</span>
      <span className="font-semibold text-[14px] text-neutral-900">{route.arrivalTime}</span>
    </div>

    {/* Timeline — taxi icon centered */}
    <div className="bg-primary-100 h-[36px] rounded-[48px] w-full flex items-center justify-center">
      <CarTaxiFront size={20} strokeWidth={1.5} className="text-primary-500" />
    </div>

    {/* CTA */}
    <button
      type="button"
      className="w-full h-[48px] rounded-[48px] flex items-center justify-center font-semibold text-[16px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{ backgroundColor: SOCIAL_TAXI_DARK_BLUE, color: SOCIAL_TAXI_YELLOW }}
      onClick={() => console.log('Schedule a ride')}
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
}

// ── Sheet ──────────────────────────────────────────────────────────────────

export const RoutePlanningSheet: React.FC<RoutePlanningSheetProps> = ({
  isOpen,
  destinationName,
  onClose,
}) => {
  const [routeSortValue, setRouteSortValue] = useState('Fewest barriers')
  const [routeSortOpen,  setRouteSortOpen]  = useState(false)
  const [activeTab,      setActiveTab]      = useState<'transit' | 'car' | 'walking'>('transit')
  const [dragStartY,     setDragStartY]     = useState(0)
  const [dragDelta,      setDragDelta]      = useState(0)
  const DRAG_THRESHOLD = 80

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
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
        className={`fixed left-0 right-0 bottom-0 top-[248px] z-[70] bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transform: isOpen ? `translateY(${dragDelta}px)` : 'translateY(100%)' }}
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
                  <StandardRouteCard key={route.id} route={route} />
                ))}
              </div>

              {/* Taxi section */}
              <div className="flex flex-col gap-[16px]">
                <SectionLabel>Taxi</SectionLabel>
                {CAR_ROUTES.filter(r => r.cardType !== 'standard').map(route =>
                  route.cardType === 'uklon'
                    ? <UklonCard key={route.id} route={route} />
                    : <SocialTaxiCard key={route.id} route={route} />
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {sortRoutes(getActiveRoutes(activeTab), routeSortValue).map((route) => (
                <RouteCard key={route.id} route={route} />
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
          height={600}
        />
      </div>
    </>
  )
}
