/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bluePrimary: "#334495",
        blueSecondary: "#6A7BA2",
        gold: "#D4AF37",
        gradientWhite1: "#F3F7FF",
        gradientWhite2: "#CED6E8",
        gradientWhite3: "#FFFFFF",
        softbg: "#FAF3E0",
        paragraph: "#2D2D2D",
        lightgray: "#E3E3E3",
        secbutton: "#6A7BA2",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        heroGradient:
          "linear-gradient(to bottom right, #334495 0%, #6A7BA2 50%, #D4AF37 100%)",
      },
      textGradientColors: {
        heroText: [
          "#D4AF37",
          "#F3F7FF",
          "#CED6E8",
          "#FFFFFF",
        ],
      },
    },
  },
  plugins: [],
};
