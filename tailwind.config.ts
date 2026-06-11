import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        "rr-bg": "#0d1117",
        "rr-surface": "#111827",
        "rr-elevated": "#1f2937",
        "rr-border": "#374151",
        "rr-muted": "#6b7280",
        "rr-secondary": "#9ca3af",
        "rr-bg-light": "#f3f4f6",
        "rr-surface-light": "#ffffff",
        "rr-elevated-light": "#f9fafb",
        "rr-border-light": "#e5e7eb",
        "rr-green": "#22c55e",
        "rr-green-dark": "#16a34a",
        "rr-green-bg": "#052e16",
        "rr-green-border": "#166534",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;