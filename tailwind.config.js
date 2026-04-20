module.exports = {
  content: [
    "./layout/**/*.liquid",
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid",
    "./templates/**/*.liquid",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Spartan League", "Inter", "sans-serif"],
        heading: ["Spartan League", "Inter", "sans-serif"],
        ui: ["Inter", "sans-serif"],
        body: ["Mulish", "sans-serif"],
        serif: ["Playfair Display", "serif"]
      },
      colors: {
        gold: "#d4af37",
        "gold-dark": "#b38a2e",
        "soleil-cream": "#faf7f2",
        "soleil-blush": "#f7e8e3"
      }
    }
  },
  plugins: [],
};
