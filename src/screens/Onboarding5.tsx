import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Mail } from 'lucide-react'
import { Button, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'
import IllustrationOnboarding from '../assets/illustrations/IllustrationOnboarding.svg?react'

export const Onboarding5: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col overflow-hidden relative">

      {/* ── Top zone ──────────────────────────────────────────────── */}
      <div className="px-lg pt-xl flex flex-col gap-lg shrink-0">

        {/* Logo */}
        <div className="mb-2xl">
          <Logo width={94} height={25} aria-label="Passage" className="text-primary-500" />
        </div>

        {/* Progress + Heading */}
        <div className="flex flex-col gap-xl">

          {/* Progress row */}
          <div className="flex items-center justify-between">
            <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
              {t('common.onboardingLabel')}
            </span>
            <OnboardingProgress currentStep={4} totalSteps={4} />
          </div>

          {/* Heading block */}
          <div className="flex flex-col gap-xs">
            <h1 className="text-display-lg text-neutral-900">
              {t('onboarding5.title')}
            </h1>
            <p className="text-body-md text-neutral-700">
              {t('onboarding5.subtitle')}
            </p>
          </div>

        </div>
      </div>

      {/* ── Middle zone — illustration (fills remaining space) ────── */}
      <div className="flex-1 relative">
        <IllustrationOnboarding
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full h-auto"
          aria-hidden
        />
      </div>

      {/* ── Bottom zone — buttons ─────────────────────────────────── */}
      <div className="px-lg pb-xl flex flex-col gap-md shrink-0">
        <Button
          variant="primary"
          label={t('onboarding5.signUpPhone')}
          fullWidth
          icon={<Phone size={20} />}
          iconPosition="right"
          onClick={() => navigate('/map')}
        />
        <Button
          variant="secondary"
          label={t('onboarding5.signUpEmail')}
          fullWidth
          icon={<Mail size={20} />}
          iconPosition="right"
          onClick={() => navigate('/map')}
        />
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="text-heading-sm text-neutral-700 text-center w-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {t('onboarding5.continueGuest')}
        </button>
      </div>

    </main>
  )
}
