/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Black Background
        black: "#1A1A1A",        // soft black, luxury feel
        charcoal: "#1F1F1F",     // darker panels / sections
        // Gold Accents
        gold: "#C9A24D",          // main luxury gold
        goldDark: "#B08B3E",      // hover/secondary gold
        // Text
        textPrimary: "#EDEDED",   // readable on black
        textSecondary: "#BDBDBD", // for subtle descriptions
        // Optional extra
        ivory: "#F7F5F0",         // for occasional light sections
        accent: "#0FA3B1",        // emerald blue for buttons/focus
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"], // luxury headers
        sans: ["Inter", "sans-serif"],        // readable body
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
