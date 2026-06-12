import type { MobilityAid } from '../context/OnboardingContext'

// Simulated aggregate community ratings — represents the output of accumulated ReviewScreen feedback in a real system.
export const ROUTE_COMMUNITY_RATINGS: Record<string, Record<MobilityAid, { accessiblePercent: number; reviewCount: number }>> = {

  // ── Transit routes ───────────────────────────────────────────────────────
  'transit-1': {
    'wheelchair-manual':   { accessiblePercent: 88, reviewCount: 15 },
    'wheelchair-electric': { accessiblePercent: 85, reviewCount: 10 },
    'cane':                { accessiblePercent: 91, reviewCount: 20 },
    'stroller':            { accessiblePercent: 82, reviewCount: 13 },
    'prosthesis':          { accessiblePercent: 90, reviewCount: 17 },
    'no-aid':              { accessiblePercent: 94, reviewCount: 25 },
  },
  'transit-2': {
    'wheelchair-manual':   { accessiblePercent: 65, reviewCount: 12 },
    'wheelchair-electric': { accessiblePercent: 60, reviewCount: 8  },
    'cane':                { accessiblePercent: 78, reviewCount: 15 },
    'stroller':            { accessiblePercent: 62, reviewCount: 10 },
    'prosthesis':          { accessiblePercent: 75, reviewCount: 14 },
    'no-aid':              { accessiblePercent: 88, reviewCount: 22 },
  },
  'transit-3': {
    'wheelchair-manual':   { accessiblePercent: 42, reviewCount: 8  },
    'wheelchair-electric': { accessiblePercent: 38, reviewCount: 5  },
    'cane':                { accessiblePercent: 65, reviewCount: 12 },
    'stroller':            { accessiblePercent: 48, reviewCount: 7  },
    'prosthesis':          { accessiblePercent: 62, reviewCount: 11 },
    'no-aid':              { accessiblePercent: 78, reviewCount: 18 },
  },
  'transit-4': {
    'wheelchair-manual':   { accessiblePercent: 35, reviewCount: 5  },
    'wheelchair-electric': { accessiblePercent: 30, reviewCount: 4  },
    'cane':                { accessiblePercent: 58, reviewCount: 9  },
    'stroller':            { accessiblePercent: 40, reviewCount: 6  },
    'prosthesis':          { accessiblePercent: 55, reviewCount: 8  },
    'no-aid':              { accessiblePercent: 72, reviewCount: 14 },
  },

  // ── Car routes ───────────────────────────────────────────────────────────
  'car-1': {
    'wheelchair-manual':   { accessiblePercent: 90, reviewCount: 18 },
    'wheelchair-electric': { accessiblePercent: 88, reviewCount: 16 },
    'cane':                { accessiblePercent: 93, reviewCount: 21 },
    'stroller':            { accessiblePercent: 91, reviewCount: 17 },
    'prosthesis':          { accessiblePercent: 92, reviewCount: 19 },
    'no-aid':              { accessiblePercent: 95, reviewCount: 25 },
  },
  'car-2': {
    'wheelchair-manual':   { accessiblePercent: 72, reviewCount: 9  },
    'wheelchair-electric': { accessiblePercent: 68, reviewCount: 7  },
    'cane':                { accessiblePercent: 85, reviewCount: 16 },
    'stroller':            { accessiblePercent: 75, reviewCount: 12 },
    'prosthesis':          { accessiblePercent: 82, reviewCount: 14 },
    'no-aid':              { accessiblePercent: 91, reviewCount: 20 },
  },
  'car-uklon': {
    'wheelchair-manual':   { accessiblePercent: 95, reviewCount: 22 },
    'wheelchair-electric': { accessiblePercent: 93, reviewCount: 19 },
    'cane':                { accessiblePercent: 95, reviewCount: 23 },
    'stroller':            { accessiblePercent: 94, reviewCount: 21 },
    'prosthesis':          { accessiblePercent: 96, reviewCount: 24 },
    'no-aid':              { accessiblePercent: 97, reviewCount: 25 },
  },
  'car-social-taxi': {
    'wheelchair-manual':   { accessiblePercent: 91, reviewCount: 20 },
    'wheelchair-electric': { accessiblePercent: 89, reviewCount: 17 },
    'cane':                { accessiblePercent: 90, reviewCount: 18 },
    'stroller':            { accessiblePercent: 88, reviewCount: 16 },
    'prosthesis':          { accessiblePercent: 91, reviewCount: 19 },
    'no-aid':              { accessiblePercent: 93, reviewCount: 22 },
  },

  // ── Walking routes ───────────────────────────────────────────────────────
  'walk-1': {
    'wheelchair-manual':   { accessiblePercent: 87, reviewCount: 14 },
    'wheelchair-electric': { accessiblePercent: 82, reviewCount: 12 },
    'cane':                { accessiblePercent: 92, reviewCount: 22 },
    'stroller':            { accessiblePercent: 89, reviewCount: 18 },
    'prosthesis':          { accessiblePercent: 91, reviewCount: 20 },
    'no-aid':              { accessiblePercent: 96, reviewCount: 25 },
  },
  'walk-2': {
    'wheelchair-manual':   { accessiblePercent: 74, reviewCount: 11 },
    'wheelchair-electric': { accessiblePercent: 70, reviewCount: 9  },
    'cane':                { accessiblePercent: 88, reviewCount: 17 },
    'stroller':            { accessiblePercent: 76, reviewCount: 13 },
    'prosthesis':          { accessiblePercent: 84, reviewCount: 15 },
    'no-aid':              { accessiblePercent: 90, reviewCount: 20 },
  },
}
