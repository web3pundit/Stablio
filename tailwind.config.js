/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#93c5fd',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#6ee7b7',
        },
        base: {
          light: '#ffffff',
          DEFAULT: '#f9fafb',
          dark: '#1f2937',
        },
        text: {
          DEFAULT: '#1f2937',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
