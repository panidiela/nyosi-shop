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
          "green-dark": "#075E54",
          green:        "#25D366",
          bg:           "#F0F2F5",
          text:         "#1A1A1A",
          muted:        "#667781",
          border:       "#E8E8E4",
          yellow:       "#FCB001",
          black:        "#000000",
          white:        "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
