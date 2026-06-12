import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, PreferenceCard } from '../components'
import { useOnboarding } from '../context/OnboardingContext'

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

export const AccessibilityPreferencesScreen: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    doorWidth: door,    setDoorWidth: setDoor,
    stairs,             setStairs,
    slope,              setSlope,
    surface,            setSurface,
  } = useOnboarding()

  return (
    <main className="min-h-screen bg-neutral-50 px-lg pt-xl pb-xl flex flex-col gap-lg overflow-y-auto">

      {/* ── Back button ───────────────────────────────────────────── */}
      <Button variant="back" label={t('common.back')} onClick={() => navigate('/profile')} />

      {/* ── Heading ───────────────────────────────────────────────── */}
      <h1 className="text-display-lg text-neutral-900">{t('accessibilityPreferences.title')}</h1>

      {/* ── Preference groups ─────────────────────────────────────── */}
      <div className="flex flex-col gap-lg">

        {/* Door width */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('onboarding4.doorWidth')}
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<DoorWidth90  width={36} height={36} />} label={t('onboarding4.doorNarrow')} selected={door === '90'}  onClick={() => setDoor('90')}  />
            <PreferenceCard icon={<DoorWidth100 width={36} height={36} />} label={t('onboarding4.doorMedium')} selected={door === '100'} onClick={() => setDoor('100')} />
            <PreferenceCard icon={<DoorWidth120 width={36} height={36} />} label={t('onboarding4.doorWide')}   selected={door === '120'} onClick={() => setDoor('120')} />
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

      {/* ── Spacer + Save button ──────────────────────────────────── */}
      <div className="flex-1" />
      <Button variant="primary" label={t('common.save')} fullWidth onClick={() => navigate('/profile')} />

    </main>
  )
}
