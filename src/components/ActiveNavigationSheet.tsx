import React, { useState, useEffect, useRef } from 'react'
import { Button, NavigationCard, BarrierCheckModal } from './index'
import type { Route } from './RoutePlanningSheet'
import kerbImage from '../assets/images/kerb.png'

// ── Types ──────────────────────────────────────────────────────────────────

type NavState = 'default' | 'noHazard' | 'arrived'

type ActiveNavigationSheetProps = {
  isOpen: boolean
  route: Route | null
  destinationName: string
  onClose: () => void // closes and returns to RouteDetailSheet
  onPanelHeightChange?: (height: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────

export const ActiveNavigationSheet: React.FC<ActiveNavigationSheetProps> = ({
  isOpen,
  route,
  destinationName,
  onClose,
  onPanelHeightChange,
}) => {
  const [navState, setNavState] = useState<NavState>('default')
  const [barrierCheckOpen, setBarrierCheckOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Measure bottom panel height and report it to parent
  useEffect(() => {
    const el = panelRef.current
    if (!el || !onPanelHeightChange) return
    const observer = new ResizeObserver(() => {
      onPanelHeightChange(el.getBoundingClientRect().height)
    })
    observer.observe(el)
    // Report initial height
    onPanelHeightChange(el.getBoundingClientRect().height)
    return () => observer.disconnect()
  }, [onPanelHeightChange])

  useEffect(() => {
    if (!isOpen) return
    setNavState('default')

    const timer1 = setTimeout(() => setNavState('noHazard'), 15000)
    const timer2 = setTimeout(() => setNavState('arrived'), 27000) // 15 + 12
    const timerBarrier = setTimeout(() => setBarrierCheckOpen(true), 8000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timerBarrier)
    }
  }, [isOpen])

  // Derive NavigationCard props from current navState
  const cardDirection  = navState === 'default'  ? 'turn-left' as const
                       : navState === 'noHazard' ? 'turn-right' as const
                       : undefined

  const cardInstruction = navState === 'arrived' ? 'You have arrived'
                        : navState === 'noHazard' ? 'Turn right'
                        : 'Turn left'

  const cardStreetName  = navState === 'arrived' ? destinationName
                        : navState === 'noHazard' ? 'onto vul. Baseyna'
                        : 'onto vul. Khreschyatyk'

  const cardDistance    = navState === 'arrived' ? undefined
                        : navState === 'noHazard' ? '120m'
                        : '80m'

  return (
    <>
      {/* Full-screen takeover — covers everything including map */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">

          {/* Map area — fills all space above the bottom sheet */}
          <div className="flex-1 relative overflow-hidden">

            {/* NavigationCard — floats over the map area */}
            <div className="absolute top-[56px] left-[24px] right-[24px] z-[101]">
              <NavigationCard
                state={navState}
                direction={cardDirection}
                instruction={cardInstruction}
                streetName={cardStreetName}
                distanceToTurn={cardDistance}
                hazardBoldPrefix={navState === 'default' ? 'Moderate incline' : undefined}
                hazardText={navState === 'default' ? 'Moderate incline ahead in 10m' : undefined}
              />
            </div>

          </div>

          {/* Bottom sheet — fixed height, never scrolls */}
          <div ref={panelRef} className="bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] px-[24px] pb-[48px] flex flex-col gap-[16px] shrink-0">

            {/* Drag handle */}
            <div className="flex justify-center pt-[24px] pb-[8px]">
              <div className="bg-neutral-400 h-[3px] w-[40px] rounded-full" />
            </div>

            {/* Destination row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900 whitespace-nowrap">
                {destinationName}
              </span>
              <div className="flex items-center gap-[16px]">
                <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                  {navState === 'arrived' ? 'You have arrived' : `Arriving ${route?.arrivalTime}`}
                </span>
                {navState !== 'arrived' && (
                  <>
                    <div className="w-px h-[10px] bg-neutral-200" />
                    <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                      {route?.distanceKm} km left
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-[24px] items-center w-full">
              <Button
                variant="secondary"
                label="Report Difficulty"
                className="w-[165px]"
                onClick={() => console.log('Report difficulty')}
              />
              <Button
                variant="destructive"
                label="End route"
                className="flex-1"
                onClick={onClose}
              />
            </div>

          </div>
        </div>
      )}

      {/* Barrier check modal — z-110, above the navigation sheet */}
      <BarrierCheckModal
        isOpen={barrierCheckOpen}
        barrierLabel="Kerb without dropped kerb"
        barrierImageSrc={kerbImage}
        onYes={() => { console.log('Barrier: Yes, still there'); setBarrierCheckOpen(false) }}
        onNo={() => { console.log('Barrier: No, it\'s gone'); setBarrierCheckOpen(false) }}
        onSkip={() => { console.log('Barrier: Skip'); setBarrierCheckOpen(false) }}
      />
    </>
  )
}
