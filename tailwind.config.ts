import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBFBFA", // calm, warm studio white
        surface: "#FFFFFF",
        subtle: "#F5F5F4",
        border: "#EEEEEC",
        accent: {
          DEFAULT: "#18181B",
          hover: "#27272A",
          subtle: "#F4F4F5",
          foreground: "#FFFFFF",
        },
        violet: {
          accent: "#2563EB",
          subtle: "#EFF6FF",
        },
        text: {
          primary: "#18181B",
          secondary: "#52525B",
          muted: "#71717A",
        }
      },
      borderRadius: {
        card: "2px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        "soft-md": "0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "soft-lg": "0 16px 40px -6px rgba(0, 0, 0, 0.08), 0 6px 16px -3px rgba(0, 0, 0, 0.03)",
        "soft-subtle": "0 2px 12px -1px rgba(0, 0, 0, 0.03)",
        "soft-float": "0 20px 50px -10px rgba(0, 0, 0, 0.07)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
