/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'penda-purple': '#5b3a6f',
        'penda-light': '#a178a6',
        'penda-bg': '#f4e8d9',
        'penda-text': '#2f1f17',
        'penda-border': '#e5d5c1',
        'penda-tan': '#f0e1cd',
        'penda-purple': '#4f46e5',
        'penda-light': '#818cf8',
        'penda-bg': '#eef2ff',
        'penda-text': '#0f172a',
        'penda-border': '#e2e8f0',
      },
      borderRadius: {
        'firm': '14px',
        'soft': '20px',
      },
    },
  },
  plugins: [],
}
