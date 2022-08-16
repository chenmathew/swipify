/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        210: "210px",
        63: "63px",
        105: "105px",
        32: "32px",
      },
    },
  },
  plugins: [],
};
