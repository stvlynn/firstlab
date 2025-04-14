import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 艺术主题色
        art: {
          ink: "#2D3748", // 墨水黑
          charcoal: "#4A5568", // 炭笔灰
          pencil: "#718096", // 铅笔灰
          watercolor: {
            blue: "#3182CE", // 水彩蓝
            teal: "#319795", // 水彩青
            green: "#38A169", // 水彩绿
            purple: "#805AD5", // 水彩紫
          },
          canvas: "#F7FAFC", // 画布白
          parchment: "#FFF8E1", // 羊皮纸
          highlight: "#FEEBC8", // 高亮黄
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-in": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(20px)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        "brush-stroke": {
          "0%": { 
            width: "0%", 
            opacity: "0" 
          },
          "100%": { 
            width: "100%", 
            opacity: "1" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-in": "float-in 0.6s ease-out forwards",
        "brush-stroke": "brush-stroke 0.8s ease-out forwards",
      },
      backgroundImage: {
        'canvas-texture': "url('/images/textures/canvas.png')",
        'watercolor-paper': "url('/images/textures/watercolor-paper.png')",
        'torn-edge': "url('/images/textures/torn-edge.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config; 