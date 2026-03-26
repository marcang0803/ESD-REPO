/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0f172a',
        'navy-dark': '#0a0e27',
        'navy-light': '#1e293b',
        cyan: '#06b6d4',
        'cyan-light': '#67e8f9',
        accent: '#3b82f6',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
