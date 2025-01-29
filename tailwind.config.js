/* istanbul ignore file */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#FF4B2B", // Add your primary color here
        secondary: "#FF416C", // Add your secondary color here
        // Add any other custom colors here
      },
      fontWeight: {
        extraheavy: 1100, // Custom font weight
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        custom: ["YourCustomFont", "sans-serif"], // Customize font family if needed
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
