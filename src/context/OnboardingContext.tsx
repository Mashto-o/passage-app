import React, { createContext, useContext, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────

export type MobilityAid =
  | 'wheelchair-manual'
  | 'wheelchair-electric'
  | 'cane'
  | 'prosthesis'
  | 'stroller'
  | 'no-aid'

interface OnboardingContextValue {
  mobilityAid: MobilityAid | null
  setMobilityAid: (aid: MobilityAid | null) => void
}

// ── Context ────────────────────────────────────────────────────────

const STORAGE_KEY = 'passage_mobility_aid'

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobilityAid, setMobilityAidState] = useState<MobilityAid | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (stored as MobilityAid) : null
    } catch {
      return null
    }
  })

  const setMobilityAid = (aid: MobilityAid | null) => {
    setMobilityAidState(aid)
    try {
      if (aid === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, aid)
      }
    } catch {
      // localStorage unavailable — state-only fallback
    }
  }

  return (
    <OnboardingContext.Provider value={{ mobilityAid, setMobilityAid }}>
      {children}
    </OnboardingContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>')
  return ctx
}
