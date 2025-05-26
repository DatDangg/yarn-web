/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': '992px', 
      },
      keyframes: {
        bounceY: {
          '100%': { transform: 'translateY(8px)' , opacity: 0.8  } , 
          '0%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(8px)'} , 
        },
      },
      animation: {
        'bounce-y': 'bounceY 1s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}