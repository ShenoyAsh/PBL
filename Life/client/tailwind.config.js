/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#16A34A', // Main green
        'light-green': '#D1FAE5', // Light green for backgrounds
        'dark-green': '#15803D',
      },
      fontFamily: {
        // Add 'Inter' as the default sans-serif font
        sans: ['Inter', 'sans-serif'],
        // Add 'Great Vibes' for the cursive logo
        cursive: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}