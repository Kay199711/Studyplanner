/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#ffffff',
        'light-secondary': '#d1d5db',
        'light-text': '#111827',

        'dark-bg': '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-text': '#e2e8f0',
      },
    },
  },
  plugins: [],
}