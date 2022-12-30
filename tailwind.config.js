/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      zinc50: "#F5F5F5",
      zinc300: "#d4d4d8",
      zinc600: "#52525B",
      zinc800: "#27272A",
      peach400: "#EDDBD0",
      lime400: "#EDEAD0",
      lightBlue: "#E2E8F0",
      darkBlue: "#475569",
      black: "#000",
      transparent: "#ffffff00",
    },
    fontFamily: {
      serifHeading: "'Playfair Display', serif",
      sansHeading: "'Raleway', sans-serif",
      bodyFont: "'Roboto', sans-serif",
    },
    extend: {
      boxShadow: {
        DEFAULT: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        vignette50: "0 0 50px rgba(0,0,0,0.4) inset",
        vignett100: "0 0 80px rgba(0,0,0,0.7) inset",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
