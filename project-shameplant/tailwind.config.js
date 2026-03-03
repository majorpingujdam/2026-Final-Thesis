/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'plant-green': '#4ade80',
        'plant-dark': '#166534',
        'danger-red': '#ef4444',
        'severe-red': '#dc2626',
        'calm-teal': '#14b8a6',
        'card-bg': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(74, 222, 128, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
