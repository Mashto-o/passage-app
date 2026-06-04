import React, { useState } from 'react'
import { Button, PreferenceCard, OnboardingProgress } from '../components'
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
  const [door,    setDoor]    = useState<string>('100')
  const [stairs,  setStairs]  = useState<string>('avoided')
  const [slope,   setSlope]   = useState<string>('moderate')
  const [surface, setSurface] = useState<string>('uneven')

  const handleNext = () => {
    console.log('Next', { door, stairs, slope, surface })
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-lg pt-xl pb-xl flex flex-col gap-lg overflow-y-auto">

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="mb-2xl">
        <Logo width={94} height={25} aria-label="Passage" className="text-primary-500" />
      </div>

      {/* ── Progress + Heading ────────────────────────────────────── */}
      <div className="flex flex-col gap-xl">

        {/* Progress row */}
        <div className="flex items-center justify-between">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Onboarding
          </span>
          <OnboardingProgress currentStep={3} totalSteps={4} />
        </div>

        {/* Heading block */}
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-lg text-neutral-900">
            Based on your data, we've set these preferences for you
          </h1>
          <p className="text-body-md text-neutral-700">
            You can change them now or also any time in your profile
          </p>
        </div>
      </div>{/* end Progress + Heading */}

      {/* ── Preference groups ─────────────────────────────────────── */}
      <div className="flex flex-col gap-lg">

        {/* Door width */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Door width
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<DoorWidth90  width={36} height={36} />} label="< 90 cm"   selected={door === '90'}   onClick={() => setDoor('90')}   />
            <PreferenceCard icon={<DoorWidth100 width={36} height={36} />} label="± 90 cm"   selected={door === '100'}  onClick={() => setDoor('100')}  />
            <PreferenceCard icon={<DoorWidth120 width={36} height={36} />} label="100+ cm"   selected={door === '120'}  onClick={() => setDoor('120')}  />
          </div>
        </div>

        {/* Stairs */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Stairs
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<StairsMultiple width={36} height={36} />} label="Standard"  selected={stairs === 'multiple'} onClick={() => setStairs('multiple')} />
            <PreferenceCard icon={<StairsSingle   width={36} height={36} />} label="Low step"  selected={stairs === 'single'}   onClick={() => setStairs('single')}   />
            <PreferenceCard icon={<StairsAvoided  width={36} height={36} />} label="Ramp only" selected={stairs === 'avoided'}  onClick={() => setStairs('avoided')}  />
          </div>
        </div>

        {/* Slope */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Slope
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<SlopeSteep    width={36} height={36} />} label="Steep"     selected={slope === 'steep'}    onClick={() => setSlope('steep')}    />
            <PreferenceCard icon={<SlopeModerate width={36} height={36} />} label="Moderate"  selected={slope === 'moderate'} onClick={() => setSlope('moderate')} />
            <PreferenceCard icon={<SlopeNone     width={36} height={36} />} label="Flat only" selected={slope === 'none'}     onClick={() => setSlope('none')}     />
          </div>
        </div>

        {/* Surface */}
        <div className="flex flex-col gap-sm">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Surface
          </span>
          <div className="flex flex-row items-stretch gap-xs">
            <PreferenceCard icon={<SurfaceCobblestone width={36} height={36} />} label="Cobblestone"     selected={surface === 'cobblestone'} onClick={() => setSurface('cobblestone')} />
            <PreferenceCard icon={<SurfaceUneven      width={36} height={36} />} label="Uneven pavement" selected={surface === 'uneven'}      onClick={() => setSurface('uneven')}      />
            <PreferenceCard icon={<SurfaceSmooth      width={36} height={36} />} label="Flat only"       selected={surface === 'smooth'}      onClick={() => setSurface('smooth')}      />
          </div>
        </div>

      </div>

      {/* ── Spacer pushes button to bottom on short screens ───────── */}
      <div className="flex-1" />

      {/* ── Next button ───────────────────────────────────────────── */}
      <Button
        variant="primary"
        label="Next"
        fullWidth
        onClick={handleNext}
      />

    </div>
  )
}
