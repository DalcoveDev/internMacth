/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3C53",   // Dark Teal
        secondary: "#234A63", // Navy
        info: "#43627A",      // Slate Blue
        muted: "#6B7C8C",     // Gray-Blue
        surface: "#D9C9C1",   // Beige
        success: "#10B981",
        warning: "#F59E0B",
        error: "#DC2626",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        accent: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
}