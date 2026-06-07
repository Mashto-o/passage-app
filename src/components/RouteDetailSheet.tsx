import React, { useState, useRef, useEffect } from 'react'
import {
  Users, Bookmark, Share2, Construction, Accessibility,
  Bus, TramFront, Train, Car, ChevronDown,
} from 'lucide-react'
import { Button, Divider } from './index'
import type { Route } from './RoutePlanningSheet'

// ── Static dropdown content ────────────────────────────────────────────────

const STATIONS = ['Maidan Nezalezhnosti', 'Khreschatyk', 'Teatralna', 'Palats Sportu']
const BARRIERS = ['Uneven pavement near Khreschatyk St.', 'Narrow kerb at pedestrian crossing']

// ── Props ──────────────────────────────────────────────────────────────────

type RouteDetailSheetProps = {
  isOpen: boolean
  route: Route | null
  destinationName: string
  onClose: () => void
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getTransportIcon(type: string) {
  switch (type) {
    case 'bus':   return <Bus      size={16} strokeWidth={1.5} className="text-neutral-0" />
    case 'tram':  return <TramFront size={16} strokeWidth={1.5} className="text-neutral-0" />
    case 'metro': return <Train    size={16} strokeWidth={1.5} className="text-neutral-0" />
    default:      return <Car      size={16} strokeWidth={1.5} className="text-neutral-0" />
  }
}

function getSegmentTime(route: Route, segIndex: number): string {
  const [h, m] = route.departureTime.split(':').map(Number)
  const totalMinutes = m + route.segments
    .slice(0, segIndex)
    .reduce((sum, s) => sum + s.durationMin, 0)
  const hours = Math.floor((h * 60 + totalMinutes) / 60) % 24
  const mins = totalMinutes % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

// ── Station row sub-component ──────────────────────────────────────────────

type StationRowProps = {
  label: string
  time: string
  iconType: 'starting-point' | 'dot'
  lineInfo?: { line?: string; direction?: string }
}

const StationRow: React.FC<StationRowProps> = ({ label, time, iconType, lineInfo }) => (
  <div className="flex items-center justify-between py-[8px]">
    <div className="flex items-center gap-[16px]">
      {/* Left icon */}
      <div className="w-[26px] flex items-center justify-center shrink-0">
        {iconType === 'dot'
          ? <div className="w-[10px] h-[10px] rounded-full bg-primary-500 mx-auto" />
          : <img src="/src/assets/icons/starting-point-icon.svg" alt="" className="w-[18px]" />
        }
      </div>
      {/* Label — optionally with line badge + direction below */}
      {lineInfo
        ? (
          <div className="flex flex-col gap-[2px]">
            <span className="font-normal text-[16px] leading-[1.5] text-neutral-900">{label}</span>
            <div className="flex items-center gap-[4px]">
              {lineInfo.line && (
                <div className="bg-primary-500 px-[4px] py-[2px] rounded-[4px]">
                  <span className="text-[12px] font-medium text-primary-100 tracking-[0.12px]">
                    {lineInfo.line}
                  </span>
                </div>
              )}
              {lineInfo.direction && (
                <span className="font-normal text-[14px] text-neutral-700">{lineInfo.direction}</span>
              )}
            </div>
          </div>
        )
        : <span className="font-normal text-[16px] leading-[1.5] text-neutral-900">{label}</span>
      }
    </div>
    <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900 shrink-0 pl-[8px]">
      {time}
    </span>
  </div>
)

// ── Component ──────────────────────────────────────────────────────────────

export const RouteDetailSheet: React.FC<RouteDetailSheetProps> = ({
  isOpen,
  route,
  destinationName,
  onClose,
}) => {
  const [dragStartY,     setDragStartY]     = useState(0)
  const [dragDelta,      setDragDelta]      = useState(0)
  const [openDropdowns,  setOpenDropdowns]  = useState<Record<string, boolean>>({})
  const DRAG_THRESHOLD = 80

  const toggleDropdown = (key: string) =>
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }))

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = 0
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

  // ── Timeline renderer ──────────────────────────────────────────────────────

  const renderTimeline = () => {
    if (!route) return null

    const { segments } = route
    const stationNames = route.stationNames ?? []
    let transportIdx = 0
    const items: React.ReactNode[] = []
    let keyIdx = 0
    const nextKey = () => `tl-${keyIdx++}`

    segments.forEach((seg, i) => {
      const prevSeg = i > 0 ? segments[i - 1] : null
      const time    = getSegmentTime(route, i)
      const isLast  = i === segments.length - 1

      // ── Station row before this segment ─────────────────────────────────

      if (i === 0) {
        // First segment
        if (seg.type === 'walk') {
          items.push(
            <StationRow key={nextKey()} label="Current location" time={time} iconType="starting-point" />
          )
        } else {
          // First segment is transport — no walk prefix, show boarding station
          const sName = stationNames[transportIdx]
          items.push(
            <StationRow
              key={nextKey()}
              label={sName?.boardAt ?? 'Board here'}
              time={time}
              iconType="starting-point"
              lineInfo={{ line: seg.line, direction: sName?.direction }}
            />
          )
        }
      } else {
        const prev = prevSeg!
        if (prev.type === 'walk' && seg.type !== 'walk') {
          // Walk → Transport: boarding station
          const sName = stationNames[transportIdx]
          items.push(
            <StationRow
              key={nextKey()}
              label={sName?.boardAt ?? 'Board here'}
              time={time}
              iconType="starting-point"
              lineInfo={{ line: seg.line, direction: sName?.direction }}
            />
          )
        } else if (prev.type !== 'walk' && seg.type !== 'walk') {
          // Transport → Transport: transfer station with dot icon
          const nextSName = stationNames[transportIdx]
          items.push(
            <StationRow
              key={nextKey()}
              label={stationNames[transportIdx - 1]?.alightAt ?? 'Transfer'}
              time={time}
              iconType="dot"
              lineInfo={{ line: seg.line, direction: nextSName?.direction }}
            />
          )
        } else if (prev.type !== 'walk' && seg.type === 'walk') {
          // Transport → Walk: alight station
          items.push(
            <StationRow
              key={nextKey()}
              label={stationNames[transportIdx - 1]?.alightAt ?? 'Alight here'}
              time={time}
              iconType="starting-point"
            />
          )
        } else {
          // Walk → Walk
          items.push(
            <StationRow key={nextKey()} label="Transfer point" time={time} iconType="starting-point" />
          )
        }
      }

      // ── Segment frame ────────────────────────────────────────────────────

      if (seg.type === 'walk') {
        const showBarriers = route.barrierCount > 0 && isLast
        items.push(
          <div key={nextKey()} className="flex gap-[0px]">
            {/* Left bar */}
            <div className="w-[26px] shrink-0 bg-primary-100 rounded-[24px] flex flex-col items-center justify-center py-[32px]">
              <Accessibility size={16} strokeWidth={1.5} className="text-primary-500" />
            </div>
            {/* Right content */}
            <div className="flex-1 flex flex-col justify-center py-[32px] pl-[16px]">
              <div className="flex flex-col gap-[8px] w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                    walk for {seg.durationMin} min
                  </span>
                  {showBarriers && (
                    <button
                      type="button"
                      onClick={() => toggleDropdown(`barriers-${i}`)}
                      className="flex items-center gap-[8px] bg-warning-100 px-[8px] py-[4px] rounded-[16px] shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none transition-colors duration-200"
                    >
                      <Construction size={16} strokeWidth={1.5} className="text-warning-500 shrink-0" />
                      <span className="font-normal text-[14px] text-warning-500 whitespace-nowrap">2</span>
                      <ChevronDown
                        size={16}
                        className={`text-warning-500 transition-transform duration-200 ${openDropdowns[`barriers-${i}`] ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
                {showBarriers && openDropdowns[`barriers-${i}`] && (
                  <div className="bg-warning-100 rounded-[16px] p-[16px] flex flex-col gap-[12px] w-full">
                    {BARRIERS.map((b, bi) => (
                      <span key={bi} className="font-normal text-[14px] leading-[1.5] text-warning-700">{b}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      } else {
        // Transport frame
        items.push(
          <div key={nextKey()} className="flex gap-[0px]">
            {/* Left bar — transport icon only */}
            <div className="w-[26px] shrink-0 bg-primary-500 rounded-[24px] flex flex-col items-center justify-center py-[32px]">
              {getTransportIcon(seg.type)}
            </div>
            {/* Right content */}
            <div className="flex-1 flex flex-col py-[32px] pl-[16px] gap-[32px]">
              <div className="flex flex-col gap-[8px] w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                    ride for {seg.durationMin} minutes
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleDropdown(`stations-${i}`)}
                    className="flex items-center gap-[8px] bg-primary-100 px-[8px] py-[4px] rounded-[16px] shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none transition-colors duration-200"
                  >
                    <span className="font-normal text-[14px] text-primary-700 whitespace-nowrap">
                      4 stations
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-primary-700 transition-transform duration-200 ${openDropdowns[`stations-${i}`] ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {openDropdowns[`stations-${i}`] && (
                  <div className="bg-primary-100 rounded-[16px] p-[16px] flex flex-col gap-[12px] w-full">
                    {STATIONS.map((s, si) => (
                      <span key={si} className="font-normal text-[14px] leading-[1.5] text-primary-700">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-[8px]">
                <Users size={16} strokeWidth={1.5} className="text-success-500 shrink-0" />
                <span className="text-[12px] font-medium text-success-500 tracking-[0.12px]">
                  2 people confirmed this {seg.type} is accessible
                </span>
              </div>
            </div>
          </div>
        )
        transportIdx++
      }
    })

    // ── Final station row after last transport segment ───────────────────────

    const lastSeg = segments[segments.length - 1]
    if (lastSeg.type !== 'walk') {
      const finalTime = getSegmentTime(route, segments.length)
      items.push(
        <StationRow
          key={nextKey()}
          label={stationNames[transportIdx - 1]?.alightAt ?? 'Alight here'}
          time={finalTime}
          iconType="starting-point"
        />
      )
    }

    // ── End point row ────────────────────────────────────────────────────────

    items.push(
      <div key={nextKey()} className="flex items-center justify-between py-[8px]">
        <div className="flex items-center gap-[16px]">
          <div className="w-[26px] flex items-center justify-center shrink-0">
            <img src="/src/assets/icons/end-point-icon.png" alt="" className="w-[24px]" />
          </div>
          <span className="font-normal text-[16px] leading-[1.5] text-neutral-900">{destinationName}</span>
        </div>
        <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">{route.arrivalTime}</span>
      </div>
    )

    return <div className="flex flex-col w-full">{items}</div>
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[75]" onClick={onClose} />
      )}

      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 top-[248px] z-[80] bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] flex flex-col transition-transform duration-300 ease-in-out ${
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
          className="flex-1 overflow-y-auto px-[24px] flex flex-col gap-[24px] pb-[24px]"
        >
          {route && (
            <>
              {/* Back button */}
              <div className="pt-[8px]">
                <Button variant="back" onClick={onClose}>Back</Button>
              </div>

              {/* Header block */}
              <div className="flex flex-col gap-[16px]">
                {/* Row 1: title + actions */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-[4px]">
                    <span className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900">
                      Route details
                    </span>
                    <div className="flex items-center gap-[16px]">
                      <span className="font-normal text-[14px] text-neutral-700">
                        Arriving {route.arrivalTime}
                      </span>
                      <div className="w-px h-[10px] bg-neutral-200" />
                      <span className="font-normal text-[14px] text-neutral-700">
                        {route.distanceKm} km
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-[12px]">
                    <button
                      type="button"
                      className="border border-neutral-200 rounded-[48px] p-[14px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      aria-label="Bookmark"
                      onClick={() => console.log('Bookmark route', route.id)}
                    >
                      <Bookmark size={20} strokeWidth={1.5} className="text-neutral-900" />
                    </button>
                    <button
                      type="button"
                      className="border border-neutral-200 rounded-[48px] p-[14px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      aria-label="Share"
                      onClick={() => console.log('Share route', route.id)}
                    >
                      <Share2 size={20} strokeWidth={1.5} className="text-neutral-900" />
                    </button>
                  </div>
                </div>

                {/* Row 2: badge row */}
                <div className="flex gap-[10px] items-center h-[36px]">
                  <div className="bg-success-100 px-[8px] py-[4px] rounded-[24px]">
                    <span className="text-[12px] font-medium text-success-700 tracking-[0.12px]">
                      80% Accessible
                    </span>
                  </div>
                  {route.barrierCount > 0 && (
                    <div className="flex items-center gap-[6px] bg-warning-100 px-[8px] py-[4px] rounded-[24px]">
                      <Construction size={16} strokeWidth={1.5} className="text-warning-500" />
                      <span className="text-[12px] font-medium text-warning-500 tracking-[0.12px]">
                        {route.barrierCount} barriers
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Route timeline */}
              {renderTimeline()}
            </>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 px-[24px] py-[16px] bg-neutral-0 border-t border-neutral-200">
          <button
            type="button"
            className="w-full h-[48px] bg-primary-500 rounded-[24px] flex items-center justify-center font-semibold text-[16px] text-neutral-0 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={() => console.log('Start route', route?.id)}
          >
            Start route
          </button>
        </div>
      </div>
    </>
  )
}
