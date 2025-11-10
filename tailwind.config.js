/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#78B9B5',
          light: '#9CCCC9',
          dark: '#5FA09C',
        },
        secondary: {
          DEFAULT: '#0F828C',
          light: '#1A9BA6',
          dark: '#0A6973',
        },
        accent: {
          DEFAULT: '#065084',
          light: '#0868A8',
          dark: '#043860',
        },
        dark: {
          DEFAULT: '#320A6B',
          light: '#4A1A8F',
          dark: '#1F0647',
        },
      },
    },
  },
  plugins: [],
}