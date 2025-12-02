/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'penda-purple': '#7A0050',
        'penda-light': '#b33a89',
        'penda-bg': '#f3ecde',
        'penda-text': '#2d1b27',
        'penda-border': '#e5cfe0',
        'penda-soft': '#f6e6f1',
        'penda-tan': '#e9ddc7',
      },
      borderRadius: {
        'firm': '14px',
        'soft': '20px',
      },
    },
  },
  plugins: [],
}
