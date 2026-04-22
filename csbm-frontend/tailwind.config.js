/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#004ac6",
                "primary-container": "#2563eb",
                "secondary": "#6b38d4",
                "secondary-container": "#8455ef",
                "tertiary": "#005e6e",
                "surface": "#faf8ff",
                "surface-container": "#eaedff",
                "surface-container-low": "#f2f3ff",
                "surface-container-high": "#e2e7ff",
                "surface-container-highest": "#dae2fd",
                "surface-container-lowest": "#ffffff",
                "on-surface": "#131b2e",
                "on-surface-variant": "#434655",
                "on-primary": "#ffffff",
                "on-secondary": "#ffffff",
                "outline": "#737686",
                "outline-variant": "#c3c6d7",
                "error": "#ba1a1a",
                "error-container": "#ffdad6",
                "inverse-surface": "#283044",
                "primary-fixed": "#dbe1ff",
                "primary-fixed-dim": "#b4c5ff",
                "on-primary-fixed": "#00174b",
                "on-primary-fixed-variant": "#003ea8",
                "secondary-fixed": "#e9ddff",
                "tertiary-fixed": "#acedff",
                "on-tertiary-fixed": "#001f26",
                "tertiary-container": "#00788c",
                "on-tertiary-container": "#d7f6ff",
                "inverse-on-surface": "#eef0ff",
                "surface-tint": "#0053db",
                "surface-dim": "#d2d9f4",
                "surface-bright": "#faf8ff",
                "on-secondary-fixed": "#23005c",
                "on-secondary-fixed-variant": "#5516be",
                "on-secondary-container": "#fffbff",
                "on-primary-container": "#eeefff",
                "inverse-primary": "#b4c5ff",
                "surface-variant": "#dae2fd",
                "on-background": "#131b2e",
                "background": "#faf8ff",
            },
            fontFamily: {
                "headline": ["Manrope"],
                "body": ["Inter"],
                "label": ["Inter"],
                // Leaving originals just in case
                poppins: ['Poppins', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                display: ['Lexend', 'sans-serif'],
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem", 
                "xl": "3rem",
                "full": "9999px"
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                'gradient-glow': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
                'dark-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
