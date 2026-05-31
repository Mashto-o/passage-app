// ─────────────────────────────────────────────
// Passage Design System Tokens
// ─────────────────────────────────────────────

// ── COLOURS ──────────────────────────────────

export const colors = {
  primary: {
    100: '#ebf1ff',
    200: '#C7C7F8',
    300: '#8C8CF1',
    500: '#361ecb',
    600: '#2929BA',
    700: '#1F1F8B',
  },
  neutral: {
    0:   '#ffffff',
    50:  '#FAFAFB',
    100: '#F2F2F4',
    200: '#e4e4e8',
    300: '#c8c8cf',
    400: '#9A9AA3',
    500: '#6e6e78',
    700: '#3f3f47',
    900: '#1f1b24',
  },
  accent: {
    100: '#FFE5E5',
    300: '#FFAAAA',
    500: '#FF6B6B',
    600: '#E04A4A',
    700: '#A82F2F',
  },
  success: {
    100: '#E6F7EC',
    500: '#1FA85B',
    700: '#0E6E3C',
  },
  warning: {
    100: '#FFF4E0',
    500: '#F0A030',
    700: '#9C6010',
  },
  danger: {
    100: '#FDE7E7',
    500: '#D93838',
    700: '#8B1F1F',
  },
} as const

// ── TYPOGRAPHY ────────────────────────────────

export const fontFamily = 'Onest, sans-serif'

export const typography = {
  display: {
    xl:  { fontSize: '40px', lineHeight: 1.2,  fontWeight: 500, letterSpacing: '-0.02em' },
    lg:  { fontSize: '32px', lineHeight: 1.25, fontWeight: 500, letterSpacing: '-0.02em' },
    md:  { fontSize: '24px', lineHeight: 1.3,  fontWeight: 500, letterSpacing: '-0.02em' },
  },
  heading: {
    lg:  { fontSize: '22px', lineHeight: 1.3,  fontWeight: 500, letterSpacing: '-0.01em' },
    md:  { fontSize: '18px', lineHeight: 1.4,  fontWeight: 500, letterSpacing: '-0.01em' },
    sm:  { fontSize: '16px', lineHeight: 1.4,  fontWeight: 600, letterSpacing: '0em'     },
    xsm: { fontSize: '14px', lineHeight: 1.4,  fontWeight: 600, letterSpacing: '0em'     },
  },
  body: {
    lg:  { fontSize: '17px', lineHeight: 1.5,  fontWeight: 400, letterSpacing: '0em' },
    md:  { fontSize: '16px', lineHeight: 1.5,  fontWeight: 400, letterSpacing: '0em' },
    sm:  { fontSize: '14px', lineHeight: 1.5,  fontWeight: 400, letterSpacing: '0em' },
    sb:  { fontSize: '14px', lineHeight: 1.5,  fontWeight: 600, letterSpacing: '0em' },
  },
  caption: {
    md:  { fontSize: '14px', lineHeight: 1.4,  fontWeight: 500, letterSpacing: '0.04em' },
    sm:  { fontSize: '12px', lineHeight: 1.4,  fontWeight: 500, letterSpacing: '0.01em' },
  },
} as const

// ── SPACING (base 4px) ────────────────────────

export const spacing = {
  '2xs': '4px',
  xs:    '8px',
  sm:    '12px',
  md:    '16px',
  lg:    '24px',
  xl:    '32px',
  '2xl': '48px',
} as const

// ── BORDER RADIUS ─────────────────────────────

export const borderRadius = {
  xs:   '8px',
  sm:   '12px',
  md:   '16px',
  lg:   '24px',
  xl:   '32px',
  xxl:  '48px',
  full: '9999px',
} as const
