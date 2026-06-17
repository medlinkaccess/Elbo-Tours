import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#C8960C', light: '#F0C040', dark: '#9A700A' },
        morocco: { DEFAULT: '#1A1A2E', light: '#2d2d4e' },
        terracotta: { DEFAULT: '#C8440A', light: '#E8603A' },
      },
      fontFamily: {
        display: ['"Playfair Display"','Georgia','serif'],
        body: ['Inter','system-ui','sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

