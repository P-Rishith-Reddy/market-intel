/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e8ff',
          300: '#87daff',
          400: '#4ec4ff',
          500: '#25a8ff',
          600: '#0d8cf5',
          700: '#0a72d4',
          800: '#0f5dab',
          900: '#134f87',
        },
        surface: {
          900: '#050a12',
          800: '#0a1628',
          700: '#0f1f3a',
          600: '#152845',
          500: '#1c3255',
        }
      },
      fontFamily: {
        display: ['"Roboto"', 'sans-serif'],
        mono: ['"Roboto"', 'sans-serif'],
        body: ['"Roboto"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(37, 168, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(37, 168, 255, 0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
