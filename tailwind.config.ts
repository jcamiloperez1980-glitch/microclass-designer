import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1e3a8a",
          accent: "#0ea5e9",
          warm: "#b91c1c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
