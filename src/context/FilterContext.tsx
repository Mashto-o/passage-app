import React, { createContext, useContext, useState } from 'react'
import { useOnboarding } from './OnboardingContext'

// ── Types ──────────────────────────────────────────────────────────────────

export type FilterState = {
  accessibility: Set<string> // 'accessible' | 'inaccessible' | 'partial' | 'unknown'
  avoidLifts: boolean
  hasCompanion: boolean
}

export const DEFAULT_FILTER_STATE: FilterState = {
  accessibility: new Set(['accessible', 'inaccessible', 'partial']),
  avoidLifts: false,
  hasCompanion: false,
}

// ── Context value ──────────────────────────────────────────────────────────

type FilterContextValue = {
  filterState: FilterState
  toggleAccessibility: (variant: string) => void
  setAvoidLifts: (value: boolean) => void
  setHasCompanion: (value: boolean) => void
  handleReset: () => void
  restoreFilterState: (state: FilterState) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { travelsWithCompanion } = useOnboarding()
  const [filterState, setFilterState] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    // Always create a new Set — never share the module-level reference
    accessibility: new Set(DEFAULT_FILTER_STATE.accessibility),
    hasCompanion: travelsWithCompanion ?? false,
  })

  const toggleAccessibility = (variant: string) => {
    setFilterState((prev) => {
      const next = new Set(prev.accessibility) // new Set — never mutate prev
      if (next.has(variant)) {
        next.delete(variant)
      } else {
        next.add(variant)
      }
      return { ...prev, accessibility: next }
    })
  }

  const setAvoidLifts = (value: boolean) =>
    setFilterState((prev) => ({ ...prev, avoidLifts: value }))

  const setHasCompanion = (value: boolean) =>
    setFilterState((prev) => ({ ...prev, hasCompanion: value }))

  const handleReset = () => {
    setFilterState({
      // Fresh Set literal — never reuse the module-level DEFAULT_FILTER_STATE.accessibility Set
      accessibility: new Set(['accessible', 'inaccessible', 'partial']),
      avoidLifts: false,
      hasCompanion: false,
    })
  }

  const restoreFilterState = (state: FilterState) => {
    setFilterState({
      ...state,
      // Fresh Set — never share the caller's reference
      accessibility: new Set(state.accessibility),
    })
  }

  return (
    <FilterContext.Provider
      value={{ filterState, toggleAccessibility, setAvoidLifts, setHasCompanion, handleReset, restoreFilterState }}
    >
      {children}
    </FilterContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export const useFilterContext = (): FilterContextValue => {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilterContext must be used inside FilterProvider')
  return ctx
}
