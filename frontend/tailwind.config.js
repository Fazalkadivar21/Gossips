/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        discord: {
          primary: '#5865F2',
          dark: {
            900: '#202225', // Sidebar
            800: '#2f3136', // Channel list
            700: '#36393f', // Main chat
            600: '#4f545c', // Input background
            500: '#b9bbbe', // Text muted
          },
        },
      },
    },
  },
  plugins: [],
};