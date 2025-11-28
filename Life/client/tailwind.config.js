/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined Green Palette (Calming, Trustworthy)
        'primary-green': '#10B981', // Emerald 500
        'dark-green': '#047857',    // Emerald 700
        'light-green': '#D1FAE5',   // Emerald 100
        'accent-red': '#EF4444',    // Red 500 (for emergency/heartbeat)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}