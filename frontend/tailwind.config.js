/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ner-dark': '#0B1120',
        'ner-card': '#1E293B',
        'ner-card-hover': '#283548',
        'ner-border': '#334155',
        'ner-cyan': '#06B6D4',
        'ner-accent': '#3B82F6',
        'ner-alert-green': '#10B981',
        'ner-alert-yellow': '#F59E0B',
        'ner-alert-orange': '#F97316',
        'ner-alert-red': '#EF4444'
      }
    },
  },
  plugins: [],
}
