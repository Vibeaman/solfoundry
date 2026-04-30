/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'sol-purple': '#9945FF',
        'sol-green': '#14F195',
        'sol-dark': '#0D0D0D',
        'sol-gray': '#1A1A1A'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
