/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        muted: "#5f6f7a",
        panel: "#ffffff",
        line: "#d8e1e8",
        ocean: "#19647e",
        mint: "#2a9d8f",
        amber: "#d18b27",
        rose: "#c84c61"
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(23, 32, 38, 0.08)"
      }
    }
  },
  plugins: []
};
