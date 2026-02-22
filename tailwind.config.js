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
        primary: "#4a6b5a",
        "bg-light": "#f0f1f3",
        "bg-dark": "#1e2328",
        gold: "#5a6b5e",
        parchment: "#e8eaed",
        "reflection-blue": "#5c6369",
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
