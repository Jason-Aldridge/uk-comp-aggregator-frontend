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
        "rr-bg": "var(--bg)",
        "rr-surface": "var(--surface)",
        "rr-elevated": "var(--elevated)",
        "rr-border": "var(--border)",
        "rr-primary": "var(--text-primary)",
        "rr-secondary": "var(--text-secondary)",
        "rr-muted": "var(--text-muted)",
        "rr-bg-light": "#f3f4f6",
        "rr-surface-light": "#ffffff",
        "rr-elevated-light": "#f9fafb",
        "rr-border-light": "#e5e7eb",
        "rr-green": "var(--accent)",
        "rr-green-dark": "#16a34a",
        "rr-green-bg": "var(--accent-bg)",
        "rr-green-border": "var(--accent-border)",
        "rr-on-accent": "var(--accent-foreground)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;