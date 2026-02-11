/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          bg: '#141414',
          card: '#181818',
          red: '#E50914',
          muted: '#B3B3B3',
        },
      },
      boxShadow: {
        glow: '0 20px 35px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(20,20,20,0.2) 0%, rgba(20,20,20,0.9) 70%, #141414 100%)',
      },
    },
  },
  plugins: [],
};
