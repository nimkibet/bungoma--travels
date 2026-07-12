/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
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
      screens: {
        xsm: "450px",
        "2xsm": "350px",
      },
      fontFamily: {
        // Bungoma Tours brand fonts
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        tradeGothic: ["var(--font-tradegothic)"],
        monserrat: ["var(--font-monserrat)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ── Bungoma African Palette ──
        // Terracotta — earthy, warm, Kenyan clay soil
        terracotta: {
          50: "#fdf4ee",
          100: "#fce8d5",
          200: "#f9cba8",
          300: "#f5a870",
          400: "#ef7d38",
          500: "#eb5d18",
          600: "#dc440f",
          DEFAULT: "#dc440f",
          700: "#b73310",
          800: "#922b14",
          900: "#762514",
        },
        // Savanna Gold — warm afternoon light
        savanna: {
          50: "#fffaeb",
          100: "#fef2c7",
          200: "#fee08a",
          300: "#fdc84b",
          400: "#fbaf21",
          500: "#f59009",
          DEFAULT: "#f59009",
          600: "#d96e04",
          700: "#b44f08",
          800: "#923d0d",
          900: "#78320f",
        },
        // Safari Green — lush vegetation, forest cover
        safari: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          DEFAULT: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Obsidian — deep volcanic, lava rock
        obsidian: {
          DEFAULT: "#1a1a1a",
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#cccccc",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#2d2d2d",
          800: "#1a1a1a",
          900: "#0d0d0d",
          950: "#050505",
        },
        // Sand — neutral Kenyan desert
        sand: {
          50: "#fdfbf7",
          100: "#f8f3e8",
          200: "#ede1c8",
          300: "#dec9a0",
          400: "#ccad72",
          500: "#be9550",
          DEFAULT: "#be9550",
          600: "#a87d40",
          700: "#8c6434",
          800: "#72502c",
          900: "#5e4227",
        },
        // UI system colors (using terracotta/safari as primary)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
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
      },
      backgroundImage: {
        // Kenyan hero gradients
        "bungoma-hero":
          "linear-gradient(135deg, rgba(26,10,5,0.80) 0%, rgba(220,68,15,0.35) 50%, rgba(0,0,0,0.10) 100%)",
        "savanna-gradient":
          "linear-gradient(135deg, #1a1a1a 0%, #3d2007 40%, #8c6434 100%)",
        "forest-gradient":
          "linear-gradient(135deg, #052e16 0%, #166534 60%, #22c55e 100%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
        // Beadwork pattern (Maasai-inspired)
        "beadwork":
          "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(220,68,15,0.08) 8px, rgba(220,68,15,0.08) 16px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(245,144,9,0.06) 8px, rgba(245,144,9,0.06) 16px)",
        "home-header": `linear-gradient(to top, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%)`,
        "flight-header":
          "linear-gradient(90deg, rgba(0, 35, 77, 0.63) 11.46%, rgba(0, 35, 77, 0.00) 77.37%)",
        "stay-header":
          "linear-gradient(90deg, rgba(0, 35, 77, 0.63) 11.46%, rgba(0, 35, 77, 0.00) 77.37%)",
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
        "fade-in": {
          from: { visibility: "visible", opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0, visibility: "hidden" },
        },
        "slide-up": {
          from: { transform: "translateY(24px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-in-right": {
          from: { transform: "translateX(24px)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220,68,15,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(220,68,15,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "beadwork-slide": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "32px 32px" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease",
        "fade-out": "fade-out 0.2s ease",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "beadwork-slide": "beadwork-slide 4s linear infinite",
      },
      boxShadow: {
        "card-terracotta": "0 4px 24px rgba(220,68,15,0.20), 0 1px 4px rgba(0,0,0,0.12)",
        "card-hover": "0 12px 40px rgba(220,68,15,0.30), 0 4px 16px rgba(0,0,0,0.20)",
        "glow-savanna": "0 0 20px rgba(245,144,9,0.4)",
        "glow-safari": "0 0 20px rgba(22,197,94,0.3)",
      },
    },
  },
  safelist: [
    "text-green-700",
    "text-yellow-500",
    "text-destructive",
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
    "text-terracotta-600",
    "text-savanna-500",
    "bg-terracotta-600",
    "bg-safari-700",
  ],
  plugins: [require("tailwindcss-animate")],
};
