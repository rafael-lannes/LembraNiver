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
        brand: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f7d5da',
          300: '#f0b3be',
          400: '#e58597',
          500: '#d75a74',
          600: '#c13d5a',
          700: '#a22f48',
          800: '#872a3f',
          900: '#732739',
          950: '#40111d',
        },
      },
    },
  },
  plugins: [],
}
