import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        'surface-elevated': '#1A1A1A',
        border: '#222222',
        accent: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245, 158, 11, 0.08)',
          hover: '#d97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [typographyPlugin],
};

export default config;
