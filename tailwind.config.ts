import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colours come from the active institution config (see app/layout.tsx).
        brand: {
          DEFAULT: "rgb(var(--brand-rgb, 30 58 138) / <alpha-value>)",
          accent: "rgb(var(--brand-accent-rgb, 14 165 233) / <alpha-value>)",
          warm: "#b91c1c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
