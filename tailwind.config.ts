import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "#f0f5fa",
          100: "#d9e5f3",
          200: "#b3cce7",
          300: "#80abdb",
          400: "#4d89cf",
          500: "#276dc0",
          600: "#1a54a0",
          700: "#144280",
          800: "#0e2d58",
          900: "#091c38",
          950: "#050e1d",
        },
        medical: {
          50: "#effaf9",
          100: "#c7f2ee",
          200: "#90e6de",
          300: "#54d3c9",
          400: "#22b9af",
          500: "#0d9488",
          600: "#0a7970",
          700: "#0b615a",
          800: "#0d4e49",
          900: "#0f413d",
        },
        gold: {
          50: "#fdfbf2",
          100: "#faf4dc",
          200: "#f4e7b4",
          300: "#edd482",
          400: "#e3bd52",
          500: "#d4a22b",
          600: "#b88120",
          700: "#935f1c",
          800: "#794c1d",
          900: "#653f1d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(13, 148, 136, 0.3)",
        "gold-glow": "0 0 35px -5px rgba(212, 162, 43, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        ticker: "ticker 35s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
