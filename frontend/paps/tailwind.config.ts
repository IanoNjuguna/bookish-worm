import type { Config } from 'tailwindcss';

/**
 * paps is dark-only. The four frozen surface decisions live as prose in
 * src/index.css; this file only makes them addressable as class names.
 * No other colour, radius or font-size key belongs in here.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* 1. canvas warmth — one stepped ladder, warm hue on every step */
        canvas: 'hsl(var(--canvas) / <alpha-value>)',
        panel: 'hsl(var(--panel) / <alpha-value>)',
        'panel-2': 'hsl(var(--panel-2) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        fg: 'hsl(var(--fg) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        /* legacy name for the canvas, kept so pre-freeze classes still resolve */
        bg: 'hsl(var(--canvas) / <alpha-value>)',

        /* 2. one accent — primary action and progress only, never decorative.
           `brand` is an alias of the same colour, not a second accent. */
        accent: 'hsl(var(--accent) / <alpha-value>)',
        brand: 'hsl(var(--accent) / <alpha-value>)',

        /* direction and PnL only. Never the accent, never decorative. */
        long: 'rgb(var(--long) / <alpha-value>)',
        short: 'rgb(var(--short) / <alpha-value>)',
      },
      borderRadius: {
        /* 3. exactly three radii */
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
        pill: 'var(--radius-pill)',

        /* pre-freeze utility names, aliased onto the same three so existing
           components keep resolving without keeping a fourth radius alive */
        '2xl': 'var(--radius-card)',
        xl: 'var(--radius-control)',
        lg: 'var(--radius-control)',
        DEFAULT: 'var(--radius-control)',
        full: 'var(--radius-pill)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        /* 4. exactly five steps. No arbitrary text-[13px] once a step exists. */
        hero: ['34px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        title: ['16px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        body: ['12px', { lineHeight: '1.45' }],
        small: ['11px', { lineHeight: '1.4' }],
        micro: ['10px', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
