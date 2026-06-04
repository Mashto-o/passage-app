import React, { useEffect, useState } from 'react'
import { Button } from '../components'
import Logo from '../assets/icons/Logo.svg?react'

export const Onboarding1: React.FC = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Tiny rAF delay ensures the browser has painted the initial
    // hidden state before we trigger the transitions.
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // ── Transition helpers ──────────────────────────────────────────
  // Each element shares the same base transition; only the delay differs.
  // `ready` flips every element from its hidden → visible state.

  const tx = (delay: string, extra = '') =>
    [
      'transition-[opacity,transform]',
      'duration-400',
      'ease-out',
      extra,
      ready ? 'opacity-100 translate-y-0 translate-x-0' : '',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <div
      className="relative flex flex-col w-full min-h-screen overflow-hidden bg-primary-500"
      style={{ fontFamily: 'Onest, sans-serif' }}
    >
      {/* ── Logo (top-left) ─────────────────────────────────────── */}
      {/* Delay 200 ms · slides down from above */}
      <div
        className={[
          'absolute top-lg left-lg z-10',
          'flex items-center gap-xs',
          'transition-[opacity,transform] duration-[400ms] ease-out',
          ready
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-3',
        ].join(' ')}
        style={{ transitionDelay: ready ? '200ms' : '0ms' }}
      >
        <Logo width={94} height={25} aria-label="Passage" />
      </div>

      {/* ── Hero text (middle of upper half) ────────────────────── */}
      <div className="absolute inset-x-0 top-0 flex flex-col justify-center px-lg z-10"
        style={{ top: '18%' }}
      >
        {/* Heading · delay 500 ms */}
        <h1
          className={[
            'text-display-xl text-neutral-0',
            'transition-[opacity,transform] duration-[400ms] ease-out',
            ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
          style={{ transitionDelay: ready ? '500ms' : '0ms' }}
        >
          Passage
        </h1>

        {/* Subtitle · delay 650 ms */}
        <p
          className={[
            'mt-xs text-body-lg text-primary-100',
            'transition-[opacity,transform] duration-[400ms] ease-out',
            ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
          style={{ transitionDelay: ready ? '650ms' : '0ms' }}
        >
          Routes that adapt to you
        </p>
      </div>

      {/* ── Arch shape ───────────────────────────────────────────── */}
      {/* Rises from translateY(100%) → translateY(0) over 700ms */}
      <div
        className={[
          'absolute bottom-0 left-1/2 -translate-x-1/2',
          'w-[150%] bg-accent-100 rounded-t-[50%]',
          'transition-transform duration-[700ms] ease-out',
          ready ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{
          height: '62%',
          transitionDelay: '0ms',
        }}
        aria-hidden="true"
      />

      {/* ── Bottom CTA (sits above the arch) ─────────────────────── */}
      {/* Fade in · delay 900 ms */}
      <div
        className={[
          'absolute bottom-0 inset-x-0 z-10',
          'flex flex-col items-center gap-sm pb-2xl px-lg',
          'transition-[opacity,transform] duration-[400ms] ease-out',
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        ].join(' ')}
        style={{ transitionDelay: ready ? '900ms' : '0ms' }}
      >
        <Button
          variant="primary"
          label="Get started"
          fullWidth
        />
        <p className="text-caption-md text-neutral-700">
          Setup takes less than 2 minutes
        </p>
      </div>
    </div>
  )
}
