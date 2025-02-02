/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontSize: {
        // Small screen (default) sizes
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],

        // Medium screen specific sizes
        "md-base": ["1.125rem", { lineHeight: "1.75rem" }],
        "md-lg": ["1.25rem", { lineHeight: "1.75rem" }],
        "md-xl": ["1.5rem", { lineHeight: "2rem" }],
        "md-2xl": ["1.875rem", { lineHeight: "2.25rem" }],

        // Large screen specific sizes
        "lg-base": ["1.25rem", { lineHeight: "1.75rem" }],
        "lg-lg": ["1.5rem", { lineHeight: "2rem" }],
        "lg-xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "lg-2xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      fontFamily: {
        sans: ["Times New Roman", "serif"],
      },
      spacing: {
        "custom-width": "700px",
        "custom-height": "400px",
        "navbar-height": "80px",
        "content-height": "400px",
      },
      colors: {
        bgPrimary: "#1D4ED8",
        bgSecondary: "#212121",
      },
    },
  },
  plugins: [],
};
