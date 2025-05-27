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
    '0%': {
      transform: 'translateY(8px)',
      opacity: 0.2,
    },
    '50%': {
      transform: 'translateY(-8px)',
      opacity: 1,
    },
    '100%': {
      transform: 'translateY(8px)',
      opacity: 0.2,
    },
  },
},

      animation: {
        'bounce-y': 'bounceY .7s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}