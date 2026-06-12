import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components'
import Logo from '../assets/icons/Logo.svg?react'
import Arch from '../assets/illustrations/arch.svg?react'

export const Onboarding1: React.FC = () => {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Tiny rAF delay ensures the browser has painted the initial
    // hidden state before we trigger the transitions.
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <main className="relative flex flex-col w-full min-h-screen overflow-hidden bg-primary-500">

      {/* ── Logo (top-left) · slides down · delay 200 ms ────────────── */}
      <div
        className={[
          'absolute top-lg left-lg z-10',
          'flex items-center gap-xs',
          'transition-[opacity,transform] duration-[400ms] ease-out',
          ready ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 -translate-y-3 delay-0',
        ].join(' ')}
      >
        <Logo width={94} height={25} aria-label="Passage" className="text-accent-100" />
      </div>

      {/* ── Hero text (upper ~18% from top) ─────────────────────────── */}
      <div className="absolute inset-x-0 top-[18%] flex flex-col justify-center px-lg z-10">

        {/* Heading · delay 500 ms */}
        <h1
          className={[
            'text-display-xl text-neutral-0',
            'transition-[opacity,transform] duration-[400ms] ease-out',
            ready ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-4 delay-0',
          ].join(' ')}
        >
          Passage
        </h1>

        {/* Subtitle · delay 650 ms */}
        <p
          className={[
            'mt-xs text-heading-lg text-neutral-0',
            'transition-[opacity,transform] duration-[400ms] ease-out',
            ready ? 'opacity-100 translate-y-0 delay-[650ms]' : 'opacity-0 translate-y-4 delay-0',
          ].join(' ')}
        >
          Routes that adapt to you
        </p>
      </div>

      {/* ── Arch SVG · rises from bottom · no delay ────────────────── */}
      <Arch
        className={[
          'absolute bottom-[-20px] left-1/2 -translate-x-1/2 z-0',
          'w-full h-auto scale-x-[1.05]',
          'transition-transform duration-[700ms] ease-out',
          ready ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* ── Bottom CTA · fade in · delay 900 ms ─────────────────────── */}
      <div
        className={[
          'absolute bottom-0 inset-x-0 z-10',
          'flex flex-col items-center gap-sm pb-2xl px-lg',
          'transition-[opacity,transform] duration-[400ms] ease-out',
          ready ? 'opacity-100 translate-y-0 delay-[900ms]' : 'opacity-0 translate-y-4 delay-0',
        ].join(' ')}
      >
        <Button
          variant="primary"
          label="Get started"
          fullWidth
          onClick={() => navigate('/onboarding/2')}
        />
        <p className="text-caption-md text-neutral-700">
          Setup takes less than 2 minutes
        </p>
      </div>

    </main>
  )
}
