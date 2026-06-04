import React from 'react'
import { Phone, Mail } from 'lucide-react'
import { Button, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'
import IllustrationOnboarding from '../assets/illustrations/IllustrationOnboarding.svg?react'

export const Onboarding5: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col overflow-hidden relative">

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
              Onboarding
            </span>
            <OnboardingProgress currentStep={4} totalSteps={4} />
          </div>

          {/* Heading block */}
          <div className="flex flex-col gap-xs">
            <h1 className="text-display-lg text-neutral-900">
              Save your preferences?
            </h1>
            <p className="text-body-md text-neutral-700">
              Sign up to keep your routes and reviews across devices.
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
          label="Sign up with phone"
          fullWidth
          icon={<Phone size={20} />}
          iconPosition="right"
          onClick={() => console.log('Sign up with phone')}
        />
        <Button
          variant="secondary"
          label="Sign up with e-mail"
          fullWidth
          icon={<Mail size={20} />}
          iconPosition="right"
          onClick={() => console.log('Sign up with e-mail')}
        />
        <button
          type="button"
          onClick={() => console.log('Continue as guest')}
          className="text-heading-sm text-neutral-700 text-center w-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Continue as guest
        </button>
      </div>

    </div>
  )
}
