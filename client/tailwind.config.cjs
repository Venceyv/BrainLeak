/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Josefin-sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        gemini: ['Gemini-moon2', 'Gemini-moon'],
        virgil: ['Virgil'],
        cascadia: ['Cascadia'],
      },

      colors: {
        'primary-black': '#181818',
        'secondary-black': '#202020',
        'border-black': '#474748',
      },

      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
