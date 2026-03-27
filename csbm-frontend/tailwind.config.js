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
                // Primary Palette: Professional Blue
                primary: {
                    DEFAULT: '#3B82F6', // Blue 500
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                    950: '#172554',
                },
                // Secondary Palette: Creative Violet
                secondary: {
                    DEFAULT: '#8B5CF6', // Violet 500
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                    950: '#2E1065',
                },
                // Accent Colors
                accent: {
                    teal: '#14B8A6',   // Teal 500
                    rose: '#F43F5E',   // Rose 500
                    amber: '#F59E0B',  // Amber 500
                },
                // Dark Mode Background Hierarchy
                dark: {
                    bg: '#0F172A',      // Slate 900 (Main Background)
                    surface: '#1E293B', // Slate 800 (Card/Sidebar)
                    border: '#334155',  // Slate 700 (Borders)
                    hover: '#334155',   // Slate 700 (Hover State)
                }
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                display: ['Lexend', 'sans-serif'],
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
