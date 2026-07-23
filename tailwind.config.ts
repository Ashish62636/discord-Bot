import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#141414",
        sidebar: "#0E0E0C",
        card: {
          DEFAULT: "#1C1B19",
          subtle: "#181714",
          hover: "#252422",
        },
        brand: {
          amber: "#F2A93B",
          teal: "#4FC9AE",
          red: "#E03E3E",
          purple: "#7B6CF6",
          yellow: "#F2D93B",
        },
        surface: {
          DEFAULT: "#252422",
          muted: "#3A3835",
          border: "rgba(237, 235, 228, 0.08)",
          subtleBorder: "rgba(237, 235, 228, 0.04)",
        },
        content: {
          primary: "#EDEBE4",
          secondary: "#8A8880",
          tertiary: "#5A5855",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 12px rgba(242, 169, 59, 0.25)",
        "glow-teal": "0 0 12px rgba(79, 201, 174, 0.25)",
        "glow-red": "0 0 12px rgba(224, 62, 62, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
