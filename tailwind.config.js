/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#22C55E",
        "bg-light": "#F0FDF4",
        "bg-dark": "#14532D",
        gold: "#166534",
        parchment: "#DCFCE7",
        "reflection-blue": "#166534",
      },
      fontFamily: {
        "work-sans": ["WorkSans_400Regular"],
        "work-sans-medium": ["WorkSans_500Medium"],
        "work-sans-semibold": ["WorkSans_600SemiBold"],
        "work-sans-bold": ["WorkSans_700Bold"],
        merriweather: ["Merriweather_400Regular"],
        "merriweather-bold": ["Merriweather_700Bold"],
        playfair: ["PlayfairDisplay_400Regular"],
        "playfair-bold": ["PlayfairDisplay_700Bold"],
        "playfair-italic": ["PlayfairDisplay_400Regular_Italic"],
        "playfair-bold-italic": ["PlayfairDisplay_700Bold_Italic"],
      },
    },
  },
  plugins: [],
};
