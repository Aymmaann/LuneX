/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        borderGray: '#181818',
        violet: '#a392f9',
        darkBlue: "#0b0c19",
        darkGray: "#05060f"
      }
    },
  },
  plugins: [],
}

