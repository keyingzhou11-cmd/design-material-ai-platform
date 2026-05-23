import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#EBE4DC',
          300: '#D9CFC4',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#6B6560',
          faint: '#A39E98',
        },
        accent: {
          DEFAULT: '#E85D04',
          hover: '#D45303',
          light: '#FEF3EC',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 20px rgba(26, 26, 26, 0.06)',
        card: '0 1px 3px rgba(26, 26, 26, 0.04), 0 4px 12px rgba(26, 26, 26, 0.04)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
