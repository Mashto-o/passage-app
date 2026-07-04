import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, User, Users } from 'lucide-react'
import { Button, SelectionCard, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'
import { useOnboarding } from '../context/OnboardingContext'

export const Onboarding3b: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { travelsWithCompanion: selected, setTravelsWithCompanion } = useOnboarding()

  const handleNext = () => {
    navigate('/onboarding/3')
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
          <OnboardingProgress currentStep={2} totalSteps={5} />
        </div>

        {/* ── Heading block ───────────────────────────────────────── */}
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-lg text-neutral-900">
            {t('onboarding3b.title')}
          </h1>
          <p className="text-body-md text-neutral-700">
            {t('onboarding3b.subtitle')}
          </p>
        </div>
      </div>

      {/* ── Options ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-sm mt-xl">
        <SelectionCard
          icon={<User width={32} height={32} />}
          label={t('onboarding3b.alone')}
          subtitle=""
          selected={selected === false}
          onClick={() => setTravelsWithCompanion(false)}
        />
        <SelectionCard
          icon={<Users width={32} height={32} />}
          label={t('onboarding3b.withCompanion')}
          subtitle=""
          selected={selected === true}
          onClick={() => setTravelsWithCompanion(true)}
        />
      </div>

      {/* ── Changeable notice ─────────────────────────────────────── */}
      <p className="text-body-md text-neutral-500 mt-sm">
        {t('onboarding3b.changeableNotice')}
      </p>

      {/* ── Spacer pushes button to bottom ────────────────────────── */}
      <div className="flex-1" />

      {/* ── Next button ───────────────────────────────────────────── */}
      <div className="mt-xl">
        <Button
          variant="primary"
          label={t('common.next')}
          fullWidth
          disabled={selected === null}
          onClick={handleNext}
        />
      </div>

    </main>
  )
}
