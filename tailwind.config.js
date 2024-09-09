/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
      },
      colors:{
        'pageBackGround': '#E6E6E6',
      }
    },
  },
  plugins: [],
}




