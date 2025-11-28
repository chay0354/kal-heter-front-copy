/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "01-primitives-colours-grayscale-0":
          "var(--01-primitives-colours-grayscale-0)",
      },
    },
  },
  plugins: [],
};
