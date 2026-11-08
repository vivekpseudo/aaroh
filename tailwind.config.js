/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aaroh: {
          ink: '#1F1F1F',
          ground: '#F8F5ED',
          paper: '#FFFDF8',
          sand: '#EFE9DC',
          card: '#E9E2D3',
          panel: '#F2ECDF',
          line: '#E3DACA',
          gold: '#7A5C24', // text-safe gold on light grounds
          accent: '#C9A96A', // bright gold on dark grounds
          brass: '#D7C9A6',
          muted: '#5B5548',
          body: '#3A372F',
          soft: '#4A463C',
          mist: '#D8D2C4',
          rule: '#3A3833',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      maxWidth: { page: '1360px' },
    },
  },
  plugins: [],
};
