import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, NavigationCard } from './index'
import type { Route } from './RoutePlanningSheet'

// ── Types ──────────────────────────────────────────────────────────────────

type NavState = 'default' | 'noHazard' | 'arrived'

type ActiveNavigationSheetProps = {
  isOpen: boolean
  route: Route | null
  destinationName: string
  onClose: () => void // closes and returns to RouteDetailSheet
  onNavStateChange: (state: NavState) => void // called every time navState changes
  onPanelHeightChange?: (height: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────

export const ActiveNavigationSheet: React.FC<ActiveNavigationSheetProps> = ({
  isOpen,
  route,
  destinationName,
  onClose,
  onNavStateChange,
  onPanelHeightChange,
}) => {
  const { t } = useTranslation()
  const [navState,          setNavState]          = useState<NavState>('default')
  const [displayedNavState, setDisplayedNavState] = useState<NavState>('default')
  const [cardVisible,       setCardVisible]       = useState(true)
  const [panelVisible,      setPanelVisible]      = useState(true)
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

  // Auto-advance timer + reset on close
  useEffect(() => {
    if (!isOpen) {
      setCardVisible(true)
      setPanelVisible(true)
      setDisplayedNavState('default')
      return
    }
    setNavState('default')

    const timer1 = setTimeout(() => { setNavState('noHazard'); onNavStateChange('noHazard') }, 7500)
    const timer2 = setTimeout(() => { setNavState('arrived');  onNavStateChange('arrived')  }, 13500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isOpen])

  // Slide-out / slide-in on navState change; hide panel on arrival
  useEffect(() => {
    setCardVisible(false)
    const timeout = setTimeout(() => {
      setDisplayedNavState(navState)
      setCardVisible(true)
    }, 300)
    // Slide the bottom panel down 500ms after the card transition starts
    let panelTimeout: ReturnType<typeof setTimeout> | null = null
    if (navState === 'arrived') {
      panelTimeout = setTimeout(() => setPanelVisible(false), 500)
    }
    return () => {
      clearTimeout(timeout)
      if (panelTimeout) clearTimeout(panelTimeout)
    }
  }, [navState])

  // Derive NavigationCard props from displayedNavState (the rendered state)
  const cardDirection = displayedNavState === 'default'  ? 'turn-left' as const
                      : displayedNavState === 'noHazard' ? 'turn-right' as const
                      : undefined

  const cardInstruction = displayedNavState === 'arrived'  ? t('navigation.youHaveArrived')
                        : displayedNavState === 'noHazard' ? t('navigation.turnRight')
                        : t('navigation.turnLeft')

  const cardStreetName = displayedNavState === 'arrived'  ? destinationName
                       : displayedNavState === 'noHazard' ? t('navigation.ontoStreet', { street: t('navigation.streetBaseyna') })
                       : t('navigation.ontoStreet', { street: t('navigation.streetKhreschyatyk') })

  const cardDistance = displayedNavState === 'arrived' ? undefined
                     : displayedNavState === 'noHazard' ? '120m'
                     : '80m'

  return (
    <>
      {/* Full-screen takeover — covers everything including map */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">

          {/* Map area — fills all space above the bottom sheet; overflow-hidden clips card during slide */}
          <div className="flex-1 relative overflow-hidden">

            {/* NavigationCard — slides out downward, slides in from above */}
            <div
              className={[
                'absolute top-[56px] left-[24px] right-[24px] z-[101]',
                'transition-transform transition-opacity duration-300 ease-in-out',
                cardVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-[calc(-100%-56px)] opacity-0',
              ].join(' ')}
            >
              <NavigationCard
                state={displayedNavState}
                direction={cardDirection}
                instruction={cardInstruction}
                streetName={cardStreetName}
                distanceToTurn={cardDistance}
                hazardBoldPrefix={displayedNavState === 'default' ? t('navigation.hazardBoldPrefix') : undefined}
                hazardText={displayedNavState === 'default' ? t('navigation.hazardText') : undefined}
              />
            </div>

          </div>

          {/* Bottom sheet — slides down out of view on arrival */}
          <div
            ref={panelRef}
            className={[
              'bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] px-[24px] pb-[48px] flex flex-col gap-[16px] shrink-0',
              'transition-transform duration-500 ease-in-out',
              panelVisible ? 'translate-y-0' : 'translate-y-full',
            ].join(' ')}
          >

            {/* Drag handle */}
            <div className="flex justify-center pt-[24px] pb-[8px]">
              <div className="bg-neutral-400 h-[3px] w-[40px] rounded-full" />
            </div>

            {/* Destination row */}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900 flex-1">
                {destinationName}
              </span>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                  {navState === 'arrived'
                    ? t('navigation.youHaveArrived')
                    : t('navigation.arriving', { time: route?.arrivalTime })}
                </span>
                {navState !== 'arrived' && (
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-700 whitespace-nowrap">
                    {t('navigation.kmLeft', { km: route?.distanceKm })}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-md w-full">
              <Button
                variant="secondary"
                label={t('navigation.reportBarrier')}
                className="flex-1"
                onClick={() => console.log('Report barrier')}
              />
              <Button
                variant="destructive"
                label={t('navigation.endRoute')}
                className="flex-1"
                onClick={onClose}
              />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
