/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all files in src with .js, .jsx, .ts, .tsx extensions
    "./public/index.html", // Optionally include your index.html
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Times New Roman", "serif"],
      },
      spacing: {
        "custom-width": "700px", // Custom width
        "custom-height": "400px", // Custom height
        "navbar-height": "80px",
        "content-height": "400px",
      },
      colors: {
        bgPrimary: "#1D4ED8", // bg-gray-800
        bgSecondary: "#212121", // bg-gray-600
      },
    },
  },
  plugins: [],
};
