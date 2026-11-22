/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mindease: {
          50: "#FBF9FE",
          100: "#F4EFFC",
          200: "#E9E0F8",
          300: "#D5C4F2",
          400: "#B79EE7",
          500: "#9B7BDC",
          600: "#7E57C2",
          700: "#6845AA",
          800: "#54368B",
          900: "#40296C",
        },
        pastel: {
          mint: "#E8F8F0",
          mintText: "#2B8A5A",
          lavender: "#F1ECFD",
          lavenderBorder: "#DDD3F7",
          card: "#FAF8FE",
          yellow: "#FEF9E7",
          yellowText: "#D97706",
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        pulseBreath: {
          "0%, 100%": { transform: "scale(0.85)", opacity: "0.85" },
          "50%": { transform: "scale(1.25)", opacity: "1" },
        },
        floatCloud: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        breath: "pulseBreath 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "floatCloud 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
