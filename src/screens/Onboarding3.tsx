import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PhotoCard, OnboardingProgress } from '../components'
import Logo from '../assets/icons/Logo.svg?react'

import imgKerb          from '../assets/images/kerb.png'
import imgCobblestone   from '../assets/images/cobblestone.png'
import imgNarrowDoorway from '../assets/images/narrow-doorway.png'
import imgSteepSlope    from '../assets/images/steep-slope.png'
import imgSingleStep    from '../assets/images/single-step.png'
import imgDrainChannel  from '../assets/images/drain-channel.png'

const barriers: { id: string; src: string; label: string }[] = [
  { id: 'kerb',           src: imgKerb,          label: 'Kerb without dropped kerb'     },
  { id: 'cobblestone',    src: imgCobblestone,    label: 'Cobblestone / uneven pavement' },
  { id: 'narrow-doorway', src: imgNarrowDoorway,  label: 'Narrow doorway, < 90 cm'       },
  { id: 'steep-slope',    src: imgSteepSlope,     label: 'Steep slope / gradient'        },
  { id: 'single-step',    src: imgSingleStep,     label: 'Single step at entrance'       },
  { id: 'drain-channel',  src: imgDrainChannel,   label: 'Drain grate'                   },
]

export const Onboarding3: React.FC = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )

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
          <span className="text-caption-md tracking-caption-md uppercase text-neutral-700">
            Onboarding
          </span>
          <OnboardingProgress currentStep={2} totalSteps={4} />
        </div>

        {/* ── Heading block ───────────────────────────────────────── */}
        <div className="flex flex-col gap-xs">
          <h1 className="text-display-lg text-neutral-900">
            Select the barriers you can manage
          </h1>
          <p className="text-body-md text-neutral-700">
            This helps us filter routes that work for you
          </p>
        </div>
      </div>

      {/* ── Photo grid ────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between gap-md mt-xl">
        {barriers.map(({ id, src, label }) => (
          <div key={id} className="w-[calc(50%-8px)]">
            <PhotoCard
              src={src}
              alt={label}
              label={label}
              selected={selected.includes(id)}
              onClick={() => toggle(id)}
            />
          </div>
        ))}

      </div>

      {/* ── Spacer pushes button to bottom ────────────────────────── */}
      <div className="flex-1" />

      {/* ── Next button ───────────────────────────────────────────── */}
      <div className="mt-xl">
        <Button
          variant="primary"
          label="Next"
          fullWidth
          disabled={selected.length === 0}
          onClick={handleNext}
        />
      </div>

    </main>
  )
}
