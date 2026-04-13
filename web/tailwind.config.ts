import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Red Mode Core Colors
                "aurora-red": "var(--aurora-red)",
                "aurora-red-dim": "var(--aurora-red-dim)",
                "aurora-black": "var(--aurora-black)",
            },
            fontFamily: {
                // Add font variables later if needed
            }
        },
    },
    plugins: [],
} satisfies Config;
