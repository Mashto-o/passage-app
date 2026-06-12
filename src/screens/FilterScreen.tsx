import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, UserPlus } from 'lucide-react'
import { Button, AccessibilityBadge, Toggle } from '../components'
import { useFilterContext } from '../context/FilterContext'

// Re-export types so MapScreen can import from one place if needed
export type { FilterState } from '../context/FilterContext'
export { DEFAULT_FILTER_STATE } from '../context/FilterContext'

// ── Section label style ────────────────────────────────────────────────────

const sectionLabel = 'font-medium text-[14px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700'

// ── Screen ─────────────────────────────────────────────────────────────────

export const FilterScreen: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? 'map'
  const { filterState, toggleAccessibility, setAvoidLifts, setHasCompanion, handleReset } = useFilterContext()

  const ACCESSIBILITY_OPTIONS: {
    value: string
    variant: 'accessible' | 'inaccessible' | 'partial' | 'unknown'
    label: string
  }[] = [
    { value: 'accessible',   variant: 'accessible',   label: 'Accessible'           },
    { value: 'inaccessible', variant: 'inaccessible', label: 'Inaccessible'         },
    { value: 'partial',      variant: 'partial',      label: 'Partially accessible' },
    { value: 'unknown',      variant: 'unknown',      label: 'Unknown'              },
  ]

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="px-[24px] pt-[56px] flex flex-col gap-[24px]">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[12px]">
          <Button
            variant="back"
            onClick={() => {
              if (from === 'search') {
                navigate('/map', { state: { returnToSearch: true } })
              } else {
                navigate(-1)
              }
            }}
          >
            Back
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="font-medium text-[24px] leading-[1.3] tracking-[-0.48px] text-neutral-900">
              Filter
            </h1>
            <button
              type="button"
              onClick={handleReset}
              className={[
                'text-primary-500 font-semibold text-[16px] leading-[1.4]',
                'bg-transparent transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[36px]">

          {/* Section 1 — Places */}
          <div className="flex flex-col gap-[16px]">
            <span className={sectionLabel}>Places</span>
            <span className="font-normal text-[16px] leading-[1.5] text-neutral-900">
              Which places do you want to see?
            </span>

            {/* Accessibility cards */}
            <div className="grid grid-cols-2 gap-[24px] w-full">
              {ACCESSIBILITY_OPTIONS.map(({ value, variant, label }) => {
                const selected = filterState.accessibility.has(value)
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleAccessibility(value)}
                    className={[
                      'w-full h-[72px]',
                      'flex items-center gap-[16px] px-[16px]',
                      'rounded-[24px] border',
                      selected ? 'bg-primary-100 border-primary-500' : 'bg-neutral-0 border-neutral-200',
                      'transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                    ].join(' ')}
                  >
                    <AccessibilityBadge
                      variant={variant}
                      size="md"
                      className="w-[36px] h-[36px] shrink-0"
                    />
                    <span className="font-semibold text-[14px] leading-[1.4] text-neutral-900 text-left">
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Avoid lifts toggle */}
            <div className="flex items-center justify-between w-full pt-[16px]">
              <div className="flex gap-[12px] items-start flex-1">
                <Zap size={24} strokeWidth={1.5} className="text-neutral-900 shrink-0" aria-hidden />
                <div className="flex flex-col gap-[4px]">
                  <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">
                    Avoid lift-dependent places
                  </span>
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-900 max-w-[230px]">
                    Excludes places that rely on powered infrastructure
                  </span>
                </div>
              </div>
              <Toggle
                value={filterState.avoidLifts}
                onChange={setAvoidLifts}
              />
            </div>
          </div>

          {/* Section 2 — Company */}
          <div className="flex flex-col gap-[16px]">
            <span className={sectionLabel}>Company</span>

            {/* Companion toggle */}
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-[12px] items-start flex-1">
                <UserPlus size={24} strokeWidth={1.5} className="text-neutral-900 shrink-0" aria-hidden />
                <div className="flex flex-col gap-[4px]">
                  <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">
                    I'm travelling with a companion
                  </span>
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-900 max-w-[230px]">
                    More places become accessible with help
                  </span>
                </div>
              </div>
              <Toggle
                value={filterState.hasCompanion}
                onChange={setHasCompanion}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
