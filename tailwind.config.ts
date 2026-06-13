import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: { DEFAULT: 'var(--panel)', 2: 'var(--panel-2)', raise: 'var(--raise)' },
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },
        fg: { DEFAULT: 'var(--fg)', muted: 'var(--fg-muted)', faint: 'var(--fg-faint)' },
        accent: { DEFAULT: 'var(--accent)', deep: 'var(--accent-deep)', bright: 'var(--accent-bright)', soft: 'var(--accent-soft)' },
      },
      fontFamily: {
        display: ['var(--font-display-next)', 'var(--font-display)'],
        body: ['var(--font-body-next)', 'var(--font-body)'],
      },
      borderRadius: { DEFAULT: 'var(--radius)', sm: 'var(--radius-sm)' },
      maxWidth: { wrap: 'var(--maxw)' },
    },
  },
  plugins: [],
};
export default config;
