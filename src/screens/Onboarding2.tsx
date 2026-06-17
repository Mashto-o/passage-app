import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, SelectionCard, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'
import { useOnboarding } from '../context/OnboardingContext'
import type { MobilityAid } from '../context/OnboardingContext'

import WheelchairManual   from '../assets/illustrations/wheelchair-manual.svg?react'
import WheelchairElectric from '../assets/illustrations/wheelchair-electric.svg?react'
import Cane               from '../assets/illustrations/cane.svg?react'
import Prosthesis         from '../assets/illustrations/prosthesis.svg?react'
import Stroller           from '../assets/illustrations/stroller.svg?react'
import NoWheelchair       from '../assets/illustrations/no-wheelchair.svg?react'

export const Onboarding2: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mobilityAid: selected, setMobilityAid } = useOnboarding()

  const toggle = (id: MobilityAid) =>
    setMobilityAid(selected === id ? null : id)

  const handleNext = () => {
    navigate('/onboarding/3')
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-lg py-xl flex flex-col gap-lg overflow-y-auto">

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="mb-2xl">
        <Logo width={94} height={25} aria-label="Passage" className="text-primary-500" />
      </div>

      {/* ── Progress + Heading ────────────────────────────────────── */}
      <div className="flex flex-col gap-xl">

        {/* Progress row */}
        <div className="flex items-center justify-between">
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            {t('common.onboardingLabel')}
          </span>
          <OnboardingProgress currentStep={1} totalSteps={4} />
        </div>

        {/* Heading block */}
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-lg text-neutral-900">
            {t('onboarding2.title')}
          </h1>
          <p className="text-body-md text-neutral-700">
            {t('onboarding2.subtitle')}
          </p>
        </div>
      </div>{/* end Progress + Heading */}

      {/* ── Wheelchair section ────────────────────────────────────── */}
      <div className="flex flex-col gap-sm">
        <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
          {t('onboarding2.wheelchairSection')}
        </span>
        <div className="flex flex-row items-stretch gap-md">
          <div className="w-[calc(50%-8px)]">
            <SelectionCard
              icon={<WheelchairManual width={32} height={32} />}
              label={t('onboarding2.manual')}
              subtitle=""
              selected={selected === 'wheelchair-manual'}
              onClick={() => toggle('wheelchair-manual')}
            />
          </div>
          <div className="w-[calc(50%-8px)]">
            <SelectionCard
              icon={<WheelchairElectric width={32} height={32} />}
              label={t('onboarding2.electric')}
              subtitle=""
              selected={selected === 'wheelchair-electric'}
              onClick={() => toggle('wheelchair-electric')}
            />
          </div>
        </div>
      </div>

      {/* ── Other section ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-sm">
        <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
          {t('onboarding2.otherSection')}
        </span>
        <div className="flex flex-col gap-xs">
          <div className="flex items-stretch gap-xs">
            <div className="w-[calc(50%-4px)]">
              <SelectionCard
                icon={<Cane width={32} height={32} />}
                label={t('onboarding2.cane')}
                subtitle=""
                selected={selected === 'cane'}
                onClick={() => toggle('cane')}
              />
            </div>
            <div className="w-[calc(50%-4px)]">
              <SelectionCard
                icon={<Prosthesis width={32} height={32} />}
                label={t('onboarding2.limbAid')}
                subtitle=""
                selected={selected === 'prosthesis'}
                onClick={() => toggle('prosthesis')}
              />
            </div>
          </div>
          <div className="flex items-stretch gap-xs">
            <div className="w-[calc(50%-4px)]">
              <SelectionCard
                icon={<Stroller width={32} height={32} />}
                label={t('onboarding2.stroller')}
                subtitle=""
                selected={selected === 'stroller'}
                onClick={() => toggle('stroller')}
              />
            </div>
            <div className="w-[calc(50%-4px)]">
              <SelectionCard
                icon={<NoWheelchair width={32} height={32} />}
                label={t('onboarding2.noAid')}
                subtitle=""
                selected={selected === 'no-aid'}
                onClick={() => toggle('no-aid')}
              />
            </div>
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
        disabled={selected === null}
        onClick={handleNext}
      />

    </main>
  )
}
