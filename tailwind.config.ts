import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — Computing Services SARL
        navy: {
          DEFAULT: "#0a1b3d",
          50: "#eef2f9",
          100: "#d5deef",
          600: "#122a57",
          700: "#0d2149",
          800: "#0a1b3d",
          900: "#071530",
          950: "#050f24",
        },
        brand: {
          blue: "#1d4ed8",
          blueLight: "#2563eb",
          orange: "#f97316",
          orangeDark: "#ea580c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1200px",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        pulseDot: "pulseDot 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
