/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        dark: '#0B1220',
        accent: '#22C55E'
      }
    }
  },
  plugins: []
};
