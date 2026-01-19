module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vireoka: {
          indigo: "#1E1B4B",
          graphite: "#334155",
          teal: "#0F766E",
          ash: "#F8FAFC",
          line: "#E5E7EB",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
