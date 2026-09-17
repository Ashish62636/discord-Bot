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
        background: "#0b1020",
        sidebar: "#0d1426",
        card: {
          DEFAULT: "#121b31",
          subtle: "#0f172b",
          hover: "#1a2642",
        },
        brand: {
          amber: "#36D9C0",
          teal: "#5BE38B",
          red: "#FF647C",
          purple: "#9381FF",
          yellow: "#F8D66D",
        },
        surface: {
          DEFAULT: "#1a2642",
          muted: "#2b3b61",
          border: "rgba(182, 204, 255, 0.12)",
          subtleBorder: "rgba(182, 204, 255, 0.06)",
        },
        content: {
          primary: "#edf5ff",
          secondary: "#a9b8d1",
          tertiary: "#647493",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 12px 30px rgba(54, 217, 192, 0.2)",
        "glow-teal": "0 12px 30px rgba(91, 227, 139, 0.18)",
        "glow-red": "0 12px 30px rgba(255, 100, 124, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
