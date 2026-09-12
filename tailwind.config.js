/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#e8eaf6',
            100: '#c5cae9',
            200: '#9fa8da',
            300: '#7986cb',
            400: '#5c6bc0',
            500: '#3f51b5',
            600: '#3949ab',
            700: '#010C3E',
            800: '#000832',
            900: '#010A3C',
          },
          gold: {
            50: '#fdf8f0',
            100: '#fbeade',
            200: '#f6d4b8',
            300: '#f0b88a',
            400: '#eb9e5c',
            500: '#bb914a',
            600: '#a0762f',
            700: '#8a6428',
            800: '#735220',
            900: '#5c4018',
          }
        },
        fontFamily: {
          oswald: ['Oswald', 'sans-serif'],
          nunito: ['NunitoSans', 'sans-serif'],
        },
        spacing: {
          '34': '8.5rem',
          '56': '14rem',
        }
      },
    },
    plugins: [],
  }