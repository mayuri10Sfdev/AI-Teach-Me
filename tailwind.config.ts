import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#14213D',
        primary: '#2164EE',
        focus: '#36B985',
        background: '#F3F7FC',
        surface: '#FFFFFF',
        'surface-alt': '#EFF5FD',
        secondaryText: '#657692',
        border: '#E2EAF5',
        warning: '#E99B2E',
        error: '#DC5E66',
        success: '#13A579'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        h1: ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        label: ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }]
      }
    }
  },
  plugins: []
};

export default config;
