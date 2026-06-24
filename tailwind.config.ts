import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nyosi: {
          orange: "#F97316",
          brown: "#7C3AED",
        },
      },
    },
  },
  plugins: [],
};

export default config;
