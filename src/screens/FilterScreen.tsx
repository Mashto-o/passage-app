import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap, UserPlus } from 'lucide-react'
import { Button, AccessibilityBadge, Toggle } from '../components'
import { useFilterContext, FilterState } from '../context/FilterContext'

// Re-export types so MapScreen can import from one place if needed
export type { FilterState } from '../context/FilterContext'
export { DEFAULT_FILTER_STATE } from '../context/FilterContext'

const UNDO_TIMEOUT_MS = 3000

// ── Section label style ────────────────────────────────────────────────────

const sectionLabel = 'font-medium text-[14px] leading-[1.4] tracking-[0.56px] uppercase text-neutral-700'

// ── Screen ─────────────────────────────────────────────────────────────────

export const FilterScreen: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? 'map'
  const reviewMode = location.state?.reviewMode ?? false
  const { filterState, toggleAccessibility, setAvoidLifts, setHasCompanion, handleReset, restoreFilterState } = useFilterContext()

  const [showResetSnackbar, setShowResetSnackbar] = useState(false)
  const preResetStateRef = useRef<FilterState | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleResetWithUndo = () => {
    preResetStateRef.current = {
      ...filterState,
      accessibility: new Set(filterState.accessibility),
    }
    handleReset()
    setShowResetSnackbar(true)

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => {
      setShowResetSnackbar(false)
      preResetStateRef.current = null
    }, UNDO_TIMEOUT_MS)
  }

  const handleUndoReset = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    if (preResetStateRef.current) {
      restoreFilterState(preResetStateRef.current)
      preResetStateRef.current = null
    }
    setShowResetSnackbar(false)
  }

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    }
  }, [])

  const ACCESSIBILITY_OPTIONS: {
    value: string
    variant: 'accessible' | 'inaccessible' | 'partial' | 'unknown'
    label: string
  }[] = [
    { value: 'accessible',   variant: 'accessible',   label: t('accessibility.accessible')   },
    { value: 'inaccessible', variant: 'inaccessible', label: t('accessibility.inaccessible') },
    { value: 'partial',      variant: 'partial',      label: t('accessibility.partial')      },
    { value: 'unknown',      variant: 'unknown',      label: t('accessibility.unknown')      },
  ]

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="px-lg pt-[56px] flex flex-col gap-lg">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-sm">
          <Button
            variant="back"
            onClick={() => {
              if (from === 'search') {
                navigate('/map', { state: { returnToSearch: true, reviewMode: reviewMode } })
              } else {
                navigate(-1)
              }
            }}
          >
            {t('common.back')}
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-display-md text-neutral-900">
              {t('filter.title')}
            </h1>
            <button
              type="button"
              onClick={handleResetWithUndo}
              className={[
                'text-primary-500 font-semibold text-[16px] leading-[1.4]',
                'bg-transparent transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              {t('filter.reset')}
            </button>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-[36px]">

          {/* Section 1 — Places */}
          <div className="flex flex-col gap-md">
            <span className={sectionLabel}>{t('filter.placesSection')}</span>
            <span className="font-normal text-[16px] leading-[1.5] text-neutral-900">
              {t('filter.placesSubtitle')}
            </span>

            {/* Accessibility cards */}
            <div className="grid grid-cols-2 gap-lg w-full">
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
                      'flex items-center gap-md px-md',
                      'rounded-xl border',
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
            <div className="flex items-center justify-between w-full pt-md">
              <div className="flex gap-sm items-start flex-1">
                <Zap size={24} strokeWidth={1.5} className="text-neutral-900 shrink-0" aria-hidden />
                <div className="flex flex-col gap-2xs">
                  <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">
                    {t('filter.avoidLifts')}
                  </span>
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-900 max-w-[230px]">
                    {t('filter.avoidLiftsDesc')}
                  </span>
                </div>
              </div>
              <Toggle
                value={filterState.avoidLifts}
                onChange={setAvoidLifts}
                label={t('filter.avoidLifts')}
              />
            </div>
          </div>

          {/* Section 2 — Company */}
          <div className="flex flex-col gap-md">
            <span className={sectionLabel}>{t('filter.companySection')}</span>

            {/* Companion toggle */}
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-sm items-start flex-1">
                <UserPlus size={24} strokeWidth={1.5} className="text-neutral-900 shrink-0" aria-hidden />
                <div className="flex flex-col gap-2xs">
                  <span className="font-semibold text-[16px] leading-[1.4] text-neutral-900">
                    {t('filter.companion')}
                  </span>
                  <span className="font-normal text-[14px] leading-[1.5] text-neutral-900 max-w-[230px]">
                    {t('filter.companionDesc')}
                  </span>
                </div>
              </div>
              <Toggle
                value={filterState.hasCompanion}
                onChange={setHasCompanion}
                label={t('filter.companion')}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Reset undo snackbar */}
      {showResetSnackbar && (
        <div className="fixed bottom-lg left-lg right-lg z-[120] flex justify-center">
          <div
            className={[
              'bg-neutral-900 text-neutral-0 rounded-lg px-md py-sm',
              'flex items-center gap-md',
              'text-[14px] leading-[1.5]',
            ].join(' ')}
          >
            <span>{t('filter.resetConfirm')}</span>
            <button
              type="button"
              onClick={handleUndoReset}
              className={[
                'text-primary-300 font-semibold',
                'bg-transparent transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              ].join(' ')}
            >
              {t('filter.undo')}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
