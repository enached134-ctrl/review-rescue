import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070b16",
          900: "#0b1224",
          850: "#0e1730",
          800: "#131d3a",
        },
        txt: "#e8edf9",
        mut: "#9fb0cf",
        dim: "#5b6b8c",
        brand: {
          cyan: "#22d3ee",
          sky: "#38bdf8",
          violet: "#8b5cf6",
          indigo: "#6366f1",
        },
        risk: {
          green: "#34d399",
          amber: "#fbbf24",
          red: "#fb7185",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 48px -10px rgba(34,211,238,0.55)",
        "glow-violet": "0 0 48px -10px rgba(139,92,246,0.55)",
        glass: "0 12px 40px rgba(2,6,18,0.55)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(1100px 700px at 78% -10%, rgba(139,92,246,0.20), transparent 60%)," +
          "radial-gradient(1000px 640px at 6% 110%, rgba(34,211,238,0.16), transparent 55%)," +
          "linear-gradient(160deg, #070b16, #0b1224)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        rise: "rise 0.5s ease-out both",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
