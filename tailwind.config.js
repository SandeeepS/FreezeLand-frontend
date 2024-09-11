/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif','Metal'],
        Metal: ['Metal'],
      },
      colors:{
        'pageBackGround': '#444444',
        'freeze-color' :'#078FDC'
      },
   
    },
  },
  plugins: [],
}




