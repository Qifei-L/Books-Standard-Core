/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        // ── Semantic design-token aliases (theme-switchable via data-theme) ───
        header:    'var(--c-header)',
        action:    'var(--c-action)',
        page:      'var(--c-bg-page)',
        workspace: 'var(--c-bg-workspace)',
        surface:   'var(--c-surface)',
        'border-base':   'var(--c-border)',
        'border-strong': 'var(--c-border-strong)',
        text: { DEFAULT: 'var(--c-text)', muted: 'var(--c-text-muted)' },
        success:   'var(--c-success)',
        warning:   'var(--c-warning)',
        danger:    'var(--c-danger)',
        info:      'var(--c-info)',

        // ── shadcn/ui CSS-variable tokens ──────────────────────────────────
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary:    { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))' },
        secondary:  { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))' },
        destructive:{ DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted:      { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))' },
        accent:     { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))' },
        card:       { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))' },

        // ── Paper-document design tokens (invoice / quote / DN / credit note) ─
        ink:  { DEFAULT: '#26282f', soft: '#5a5e68', faint: '#8b8f99' },
        paper: '#fdfcf9',
        desk:  '#e7e5df',
        hair:  { DEFAULT: '#e7e2d6', strong: '#cfc9ba' },
        stamp: '#2b3566',   // accent for Total value, primary button, active tab
      },

      // ── Paper fonts ─────────────────────────────────────────────────────────
      fontFamily: {
        serif: ['Spectral', 'Georgia', 'serif'],
        sans:  ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono:  ['IBM Plex Mono', 'ui-monospace', '"Fira Code"', 'monospace'],
      },

      // ── Three-layer paper shadow ─────────────────────────────────────────────
      boxShadow: {
        sheet: '0 1px 1px rgba(50,45,35,.05), 0 5px 12px rgba(50,45,35,.07), 0 22px 48px rgba(50,45,35,.12)',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
