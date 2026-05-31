/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      // ── COLOURS ──────────────────────────────
      colors: {
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
      },

      // ── SPACING ───────────────────────────────
      spacing: {
        '2xs': '4px',
        'xs':  '8px',
        'sm':  '12px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '32px',
        '2xl': '48px',
      },

      // ── BORDER RADIUS ─────────────────────────
      borderRadius: {
        'xs':   '8px',
        'sm':   '12px',
        'md':   '16px',
        'lg':   '24px',
        'xl':   '32px',
        'xxl':  '48px',
        'full': '9999px',
      },

      // ── FONT FAMILY ───────────────────────────
      fontFamily: {
        sans: ['Onest', 'sans-serif'],
      },

      // ── LETTER SPACING ───────────────────────
      // Named by the typography group that uses them.
      // em values scale proportionally with font size.
      letterSpacing: {
        'display':     '-0.02em',  // display xl/lg/md
        'heading':     '-0.01em',  // heading lg/md
        'normal':      '0em',      // heading sm/xsm, all body
        'caption-md':  '0.04em',
        'caption-sm':  '0.01em',
      },

      // ── ANIMATIONS ───────────────────────────
      keyframes: {
        'ring-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'ring-pulse': 'ring-pulse 2.5s ease-in-out infinite',
      },

      // ── FONT SIZE + LINE HEIGHT ───────────────
      // Format: [fontSize, { lineHeight, fontWeight }]
      fontSize: {
        'display-xl':  ['40px', { lineHeight: '1.2'  }],
        'display-lg':  ['32px', { lineHeight: '1.25' }],
        'display-md':  ['24px', { lineHeight: '1.3'  }],

        'heading-lg':  ['22px', { lineHeight: '1.3'  }],
        'heading-md':  ['18px', { lineHeight: '1.4'  }],
        'heading-sm':  ['16px', { lineHeight: '1.4'  }],
        'heading-xsm': ['14px', { lineHeight: '1.4'  }],

        'body-lg':     ['17px', { lineHeight: '1.5'  }],
        'body-md':     ['16px', { lineHeight: '1.5'  }],
        'body-sm':     ['14px', { lineHeight: '1.5'  }],
        'body-sb':     ['14px', { lineHeight: '1.5'  }],

        'caption-md':  ['14px', { lineHeight: '1.4'  }],
        'caption-sm':  ['12px', { lineHeight: '1.4'  }],
      },

    },
  },
  plugins: [],
}
