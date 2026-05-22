// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf5',
          100: '#d3f4e1',
          200: '#a9e6c4',
          300: '#6cd59b',
          400: '#37be74',
          500: '#1c9b5a',
          600: '#157948',
          700: '#145f3d',
          800: '#144c33',
          900: '#113f2b'
        }
      },
      boxShadow: {
        glow: '0 0 40px rgba(28, 155, 90, 0.25)'
      }
    }
  },
  plugins: []
};
