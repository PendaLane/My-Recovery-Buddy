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
      },
      borderRadius: {
        'firm': '14px',
        'soft': '20px',
      },
    },
  },
  plugins: [],
}
