/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors:{
          primary:{
            light:'#FFFFFF',
            dark: '#0A0A0A',
          },
          secondary: {
            light: '#C3D4DF',
            dark: '#053840',
          },
          highlight:{
            light: '#969696',
            dark: '#2F2F2F',
          },
      },
    },
  },
  plugins: [],
}