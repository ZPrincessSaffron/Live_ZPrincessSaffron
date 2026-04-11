import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
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
                "royal-purple": {
                    DEFAULT: "hsl(var(--royal-purple))",
                    light: "hsl(var(--royal-purple-light))",
                    dark: "hsl(var(--royal-purple-dark))",
                },
                gold: {
                    DEFAULT: "hsl(var(--gold))",
                    light: "hsl(var(--gold-light))",
                    dark: "hsl(var(--gold-dark))",
                },
                ivory: {
                    DEFAULT: "hsl(var(--ivory))",
                    dark: "hsl(var(--ivory-dark))",
                },
                charcoal: "hsl(var(--charcoal))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                elegant: "0 10px 40px -10px hsla(270, 45%, 25%, 0.2)",
                gold: "0 4px 20px -4px hsla(43, 76%, 55%, 0.3)",
                card: "0 4px 24px -4px hsla(270, 30%, 20%, 0.08)",
                "gold-glow": "0 0 20px hsla(43, 76%, 55%, 0.5)",
            },
            fontFamily: {
                cinzel: ["Cinzel", "serif"],         
                serif: ["Playfair Display" , "serif"],
                
                
                sans: ['Manrope', 'sans-serif'],
                
                rr: ['Manrope'],
                 outfit: ["Outfit", "sans-serif"],
            },
            letterSpacing: {
                'widest-rr': '0.2em',
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
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out forwards",
                shimmer: "shimmer 2s linear infinite",
                float: "float 3s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
