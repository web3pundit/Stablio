/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 // tailwind.config.js

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb',    // blue-600
          light: '#93c5fd',   // blue-300
        },
        secondary: {
          DEFAULT: '#10b981', // green-500
          dark: '#059669',    // green-600
          light: '#6ee7b7',   // green-300
        },
        base: {
          light: '#ffffff',
          DEFAULT: '#f9fafb', // gray-100
          dark: '#1f2937',    // gray-800
        },
        text: {
          DEFAULT: '#1f2937', // gray-800
          muted: '#6b7280',   // gray-500
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

