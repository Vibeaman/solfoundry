/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'sf-black': '#0D0D0D',
        'sf-white': '#FFFFFF',
        'sf-gray': '#F5F5F5',
        'sf-gray-dark': '#E5E5E5',
        'sf-red': '#E54D4D',
        'sf-blue': '#5B9BD5',
        'sf-light-blue': '#D4E5F7',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
