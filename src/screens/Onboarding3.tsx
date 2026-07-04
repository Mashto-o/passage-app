import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { Button, PhotoCard, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'

import imgKerb          from '../assets/images/kerb.png'
import imgCobblestone   from '../assets/images/cobblestone.png'
import imgNarrowDoorway from '../assets/images/narrow-doorway.png'
import imgSteepSlope    from '../assets/images/steep-slope.png'
import imgSingleStep    from '../assets/images/single-step.png'
import imgDrainChannel  from '../assets/images/drain-channel.png'

const barrierImages: Record<string, string> = {
  kerb:             imgKerb,
  cobblestone:      imgCobblestone,
  'narrow-doorway': imgNarrowDoorway,
  'steep-slope':    imgSteepSlope,
  'single-step':    imgSingleStep,
  'drain-channel':  imgDrainChannel,
}

const BARRIER_IDS = [
  'kerb',
  'cobblestone',
  'narrow-doorway',
  'steep-slope',
  'single-step',
  'drain-channel',
] as const

const NONE_APPLY_ID = 'none'

export const Onboarding3: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()
  // selected = barriers the user CANNOT manage (question polarity inverted)
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev.filter(s => s !== NONE_APPLY_ID), id]
    )

  const toggleNoneApply = () =>
    setSelected(prev => (prev.includes(NONE_APPLY_ID) ? [] : [NONE_APPLY_ID]))

  const handleNext = () => {
    navigate('/onboarding/4')
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-lg pt-xl pb-xl flex flex-col overflow-y-auto">

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="mb-2xl">
        <Logo width={94} height={25} aria-label="Passage" className="text-primary-500" />
      </div>

      {/* ── Progress row ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-xl">
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
          <OnboardingProgress currentStep={3} totalSteps={5} />
        </div>

        {/* ── Heading block ───────────────────────────────────────── */}
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-lg text-neutral-900">
            {t('onboarding3.title')}
          </h1>
          <p className="text-body-md text-neutral-700">
            {t('onboarding3.subtitle')}
          </p>
        </div>
      </div>

      {/* ── Photo grid ────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between gap-md mt-xl">
        {BARRIER_IDS.map(id => (
          <div key={id} className="w-[calc(50%-8px)]">
            <PhotoCard
              src={barrierImages[id]}
              alt=""
              label={t(`onboarding3.barriers.${id}`)}
              selected={selected.includes(id)}
              onClick={() => toggle(id)}
            />
          </div>
        ))}
      </div>

      {/* ── None-apply option (mutually exclusive with barrier cards) ─ */}
      <button
        type="button"
        aria-pressed={selected.includes(NONE_APPLY_ID)}
        onClick={toggleNoneApply}
        className={[
          'mt-md w-full text-left p-md rounded-[24px] border',
          'text-heading-sm transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          selected.includes(NONE_APPLY_ID)
            ? 'bg-primary-100 border-primary-500 text-primary-500'
            : 'bg-neutral-0 border-neutral-200 text-neutral-900',
        ].join(' ')}
      >
        {t('onboarding3.noneApply')}
      </button>

      {/* ── Spacer pushes button to bottom ────────────────────────── */}
      <div className="flex-1" />

      {/* ── Next button ───────────────────────────────────────────── */}
      <div className="mt-xl">
        <Button
          variant="primary"
          label={t('common.next')}
          fullWidth
          disabled={selected.length === 0}
          onClick={handleNext}
        />
      </div>

    </main>
  )
}
