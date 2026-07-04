import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { Button, PreferenceCard, OnboardingProgress } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import Logo from '../assets/icons/Logo.svg?react'

import DoorWidth90        from '../assets/icons/door-width-90.svg?react'
import DoorWidth100       from '../assets/icons/door-width-100.svg?react'
import DoorWidth120       from '../assets/icons/door-width-120.svg?react'
import StairsMultiple     from '../assets/icons/stairs-multiple.svg?react'
import StairsSingle       from '../assets/icons/stairs-single.svg?react'
import StairsAvoided      from '../assets/icons/stairs-avoided.svg?react'
import SlopeSteep         from '../assets/icons/slope-steep.svg?react'
import SlopeModerate      from '../assets/icons/slope-moderate.svg?react'
import SlopeNone          from '../assets/icons/slope-none.svg?react'
import SurfaceCobblestone from '../assets/icons/surface-cobblestone.svg?react'
import SurfaceUneven      from '../assets/icons/surface-uneven.svg?react'
import SurfaceSmooth      from '../assets/icons/surface-smooth.svg?react'

export const Onboarding4: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    doorWidth: door,    setDoorWidth: setDoor,
    stairs,             setStairs,
    slope,              setSlope,
    surface,            setSurface,
  } = useOnboarding()

  const handleNext = () => {
    navigate('/onboarding/5')
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-lg pt-xl pb-xl flex flex-col gap-lg overflow-y-auto">

      {/* ── Top block: Logo, Progress + Heading ───────────────────── */}
      <div className="flex flex-col">

        {/* Logo */}
        <div className="mb-xl">
          <Logo width={94} height={25} aria-label="Passage" className="text-primary-500" />
        </div>

        {/* Progress + Heading */}
        <div className="flex flex-col gap-xl">

          {/* Progress row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label={t('common.back')}
              className="flex items-center gap-xs -m-xs p-xs rounded-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden className="text-primary-500" />
              <span className="text-caption-md tracking-caption-md uppercase text-primary-500">
                {t('common.onboardingLabel')}
              </span>
            </button>
            <OnboardingProgress currentStep={3} totalSteps={4} />
          </div>

          {/* Heading block */}
          <div className="flex flex-col gap-xs">
            <h1 className="text-display-lg text-neutral-900">
              {t('onboarding4.title')}
            </h1>
            <p className="text-body-md text-neutral-700">
              {t('onboarding4.subtitle')}
            </p>
          </div>
        </div>{/* end Progress + Heading */}
      </div>{/* end Top block */}

      {/* ── Preference groups ─────────────────────────────────────── */}
      <div className="flex flex-col gap-lg">

        {/* Door width */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('onboarding4.doorWidth')}
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<DoorWidth90  width={36} height={36} />} label={t('onboarding4.doorNarrow')} selected={door === '90'}   onClick={() => setDoor('90')}   />
            <PreferenceCard icon={<DoorWidth100 width={36} height={36} />} label={t('onboarding4.doorMedium')} selected={door === '100'}  onClick={() => setDoor('100')}  />
            <PreferenceCard icon={<DoorWidth120 width={36} height={36} />} label={t('onboarding4.doorWide')}   selected={door === '120'}  onClick={() => setDoor('120')}  />
          </div>
        </div>

        {/* Stairs */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('onboarding4.stairs')}
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<StairsMultiple width={36} height={36} />} label={t('onboarding4.stairsStandard')} selected={stairs === 'multiple'} onClick={() => setStairs('multiple')} />
            <PreferenceCard icon={<StairsSingle   width={36} height={36} />} label={t('onboarding4.stairsLow')}      selected={stairs === 'single'}   onClick={() => setStairs('single')}   />
            <PreferenceCard icon={<StairsAvoided  width={36} height={36} />} label={t('onboarding4.stairsRamp')}     selected={stairs === 'avoided'}  onClick={() => setStairs('avoided')}  />
          </div>
        </div>

        {/* Slope */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('onboarding4.slope')}
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<SlopeSteep    width={36} height={36} />} label={t('onboarding4.slopeSteep')}    selected={slope === 'steep'}    onClick={() => setSlope('steep')}    />
            <PreferenceCard icon={<SlopeModerate width={36} height={36} />} label={t('onboarding4.slopeModerate')} selected={slope === 'moderate'} onClick={() => setSlope('moderate')} />
            <PreferenceCard icon={<SlopeNone     width={36} height={36} />} label={t('onboarding4.slopeFlat')}     selected={slope === 'none'}     onClick={() => setSlope('none')}     />
          </div>
        </div>

        {/* Surface */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('onboarding4.surface')}
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<SurfaceCobblestone width={36} height={36} />} label={t('onboarding4.surfaceCobblestone')} selected={surface === 'cobblestone'} onClick={() => setSurface('cobblestone')} />
            <PreferenceCard icon={<SurfaceUneven      width={36} height={36} />} label={t('onboarding4.surfaceUneven')}      selected={surface === 'uneven'}      onClick={() => setSurface('uneven')}      />
            <PreferenceCard icon={<SurfaceSmooth      width={36} height={36} />} label={t('onboarding4.surfaceSmooth')}      selected={surface === 'smooth'}      onClick={() => setSurface('smooth')}      />
          </div>
        </div>

      </div>

      {/* ── Spacer pushes button to bottom on short screens ───────── */}
      <div className="flex-1" />

      {/* ── Next button ───────────────────────────────────────────── */}
      <Button
        variant="primary"
        label={t('common.next')}
        fullWidth
        onClick={handleNext}
      />

    </main>
  )
}
