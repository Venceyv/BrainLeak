/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Josefin-sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        gemini: ['Gemini-moon2', 'Gemini-moon'],
      },

      colors: {
        'primary-black': '#181818',
        'secondary-black': '#202020',
      },
    },
  },
  plugins: [],
};
