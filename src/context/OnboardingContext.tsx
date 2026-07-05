import React, { createContext, useContext, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────

export type MobilityAid =
  | 'wheelchair-manual'
  | 'wheelchair-electric'
  | 'cane'
  | 'prosthesis'
  | 'stroller'
  | 'no-aid'

export type DoorWidth = '90' | '100' | '120'
export type Stairs    = 'multiple' | 'single' | 'avoided'
export type Slope     = 'steep' | 'moderate' | 'none'
export type Surface   = 'cobblestone' | 'uneven' | 'smooth'

// ── Context shape ──────────────────────────────────────────────────

interface OnboardingContextValue {
  mobilityAid:    MobilityAid | null
  setMobilityAid: (aid: MobilityAid | null) => void

  travelsWithCompanion:    boolean | null
  setTravelsWithCompanion: (v: boolean | null) => void

  doorWidth:    DoorWidth | null
  setDoorWidth: (v: DoorWidth | null) => void

  stairs:    Stairs | null
  setStairs: (v: Stairs | null) => void

  slope:    Slope | null
  setSlope: (v: Slope | null) => void

  surface:    Surface | null
  setSurface: (v: Surface | null) => void

  unmanageableBarriers:    string[]
  setUnmanageableBarriers: (v: string[]) => void
}

// ── Storage keys ───────────────────────────────────────────────────

const KEYS = {
  mobilityAid:          'passage_mobility_aid',
  travelsWithCompanion: 'passage_travels_with_companion',
  doorWidth:            'passage_pref_door_width',
  stairs:               'passage_pref_stairs',
  slope:                'passage_pref_slope',
  surface:              'passage_pref_surface',
  unmanageableBarriers: 'passage_unmanageable_barriers',
} as const

// ── Helpers ────────────────────────────────────────────────────────

function loadItem<T extends string>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (stored as T) : fallback
  } catch {
    return fallback
  }
}

function loadItemNullable<T extends string>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (stored as T) : null
  } catch {
    return null
  }
}

function loadBooleanNullable(key: string): boolean | null {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? null : stored === 'true'
  } catch {
    return null
  }
}

function persistBoolean(key: string, value: boolean | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, String(value))
    }
  } catch {
    // localStorage unavailable — state-only fallback
  }
}

function persist(key: string, value: string | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    // localStorage unavailable — state-only fallback
  }
}

function loadArray(key: string, fallback: string[]): string[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as string[]) : fallback
  } catch {
    return fallback
  }
}

function persistArray(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage unavailable — state-only fallback
  }
}

// ── Context ────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // mobilityAid — no default (user must choose)
  const [mobilityAid, setMobilityAidState] = useState<MobilityAid | null>(
    () => loadItemNullable<MobilityAid>(KEYS.mobilityAid),
  )
  const setMobilityAid = (aid: MobilityAid | null) => {
    setMobilityAidState(aid)
    persist(KEYS.mobilityAid, aid)
  }

  // travelsWithCompanion — no default (user must choose)
  const [travelsWithCompanion, setTravelsWithCompanionState] = useState<boolean | null>(
    () => loadBooleanNullable(KEYS.travelsWithCompanion),
  )
  const setTravelsWithCompanion = (v: boolean | null) => {
    setTravelsWithCompanionState(v)
    persistBoolean(KEYS.travelsWithCompanion, v)
  }

  // doorWidth — defaults to '100'
  const [doorWidth, setDoorWidthState] = useState<DoorWidth | null>(
    () => loadItem<DoorWidth>(KEYS.doorWidth, '100'),
  )
  const setDoorWidth = (v: DoorWidth | null) => {
    setDoorWidthState(v)
    persist(KEYS.doorWidth, v)
  }

  // stairs — defaults to 'avoided'
  const [stairs, setStairsState] = useState<Stairs | null>(
    () => loadItem<Stairs>(KEYS.stairs, 'avoided'),
  )
  const setStairs = (v: Stairs | null) => {
    setStairsState(v)
    persist(KEYS.stairs, v)
  }

  // slope — defaults to 'moderate'
  const [slope, setSlopeState] = useState<Slope | null>(
    () => loadItem<Slope>(KEYS.slope, 'moderate'),
  )
  const setSlope = (v: Slope | null) => {
    setSlopeState(v)
    persist(KEYS.slope, v)
  }

  // surface — defaults to 'uneven'
  const [surface, setSurfaceState] = useState<Surface | null>(
    () => loadItem<Surface>(KEYS.surface, 'uneven'),
  )
  const setSurface = (v: Surface | null) => {
    setSurfaceState(v)
    persist(KEYS.surface, v)
  }

  // unmanageableBarriers — defaults to empty array
  const [unmanageableBarriers, setUnmanageableBarriersState] = useState<string[]>(
    () => loadArray(KEYS.unmanageableBarriers, []),
  )
  const setUnmanageableBarriers = (v: string[]) => {
    setUnmanageableBarriersState(v)
    persistArray(KEYS.unmanageableBarriers, v)
  }

  return (
    <OnboardingContext.Provider value={{
      mobilityAid, setMobilityAid,
      travelsWithCompanion, setTravelsWithCompanion,
      doorWidth,   setDoorWidth,
      stairs,      setStairs,
      slope,       setSlope,
      surface,     setSurface,
      unmanageableBarriers, setUnmanageableBarriers,
    }}>
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
