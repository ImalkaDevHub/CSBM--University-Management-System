import React from 'react';

const Logo = ({ className = "h-10", showText = true, layout = "horizontal", theme = "dark" }) => {
    return (
        <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} items-center gap-4 ${className} select-none`}>
            {/* High-quality responsive SVG Crest - Hidden in Vertical Layout */}
            {layout !== 'vertical' && (
                <svg
                    viewBox="0 0 100 120"
                    className="h-full w-auto drop-shadow-md"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Shadow behind the shield */}
                    <path d="M12 17 L88 17 L88 77 C88 100 50 115 50 115 C50 115 12 100 12 77 Z" fill="rgba(0,0,0,0.15)" transform="translate(1, 2)" />

                    {/* Outer Gold Border of Shield */}
                    <path d="M10 15 L90 15 L90 75 C90 98 50 113 50 113 C50 113 10 98 10 75 Z" fill="#eab308" />

                    {/* Inner Shield Split - Red Top */}
                    <path d="M14 19 L86 19 L86 60 C70 65 30 65 14 60 Z" fill="#dc2626" />

                    {/* Inner Shield Split - Blue Bottom */}
                    <path d="M14 60 C30 65 70 65 86 60 L86 73 C86 93 50 107 50 107 C50 107 14 93 14 73 Z" fill="#1e3a8a" />
                    <path d="M14 60 L86 60" stroke="#fcd34d" strokeWidth="1" /> {/* Subtle divider */}

                    {/* Eagle (Gold/Yellow) */}
                    <g transform="translate(0, -2)">
                        {/* Wings */}
                        <path d="M50 25 C40 35 25 30 22 42 C32 40 40 32 46 45 L50 48 L54 45 C60 32 68 40 78 42 C75 30 60 35 50 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
                        {/* Body/Head */}
                        <circle cx="50" cy="27" r="3" fill="#fbbf24" />
                        <path d="M47 30 L53 30 L51 45 L49 45 Z" fill="#fbbf24" />
                    </g>

                    {/* Book (White/Silver) */}
                    <g transform="translate(0, 5)">
                        {/* Left Page */}
                        <path d="M30 60 C 38 60 48 65 48 65 L 48 85 C 48 85 38 78 30 78 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                        {/* Right Page */}
                        <path d="M70 60 C 62 60 52 65 52 65 L 52 85 C 52 85 62 78 70 78 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
                        {/* Book Spine */}
                        <path d="M48 65 L52 65 L52 85 L48 85 Z" fill="#94a3b8" />
                        {/* Page Lines */}
                        <line x1="33" y1="65" x2="45" y2="68" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="33" y1="70" x2="45" y2="73" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="33" y1="75" x2="45" y2="78" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="67" y1="65" x2="55" y2="68" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="67" y1="70" x2="55" y2="73" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                        <line x1="67" y1="75" x2="55" y2="78" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Bottom Ribbon / Scroll */}
                    <g transform="translate(0, 102)">
                        {/* Shadow Behind Ribbon */}
                        <path d="M12 -3 L25 5 L25 -10 Z" fill="#1e40af" />
                        <path d="M88 -3 L75 5 L75 -10 Z" fill="#1e40af" />

                        {/* Ribbon Tails */}
                        <path d="M5 -5 L20 -5 L20 7 L12 2 Z" fill="#2563eb" />
                        <path d="M95 -5 L80 -5 L80 7 L88 2 Z" fill="#2563eb" />

                        {/* Center Banner */}
                        <path d="M15 -10 C35 -5 65 -5 85 -10 L85 0 C65 5 35 5 15 0 Z" fill="#60a5fa" />
                        <path d="M15 -10 C35 -5 65 -5 85 -10" stroke="#bfdbfe" strokeWidth="1" fill="none" />

                        {/* Banner Text Simulation */}
                        <path d="M25 -5 C40 -2 60 -2 75 -5" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                    </g>
                </svg>
            )}

            {showText && (
                <div className={`flex ${layout === 'vertical' ? 'flex-col items-center mt-2' : 'flex-row items-center'} gap-4`}>
                    {layout === 'horizontal' && (
                        <div className={`w-[1px] h-10 ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-600'} opacity-60 rounded-full`} />
                    )}
                    <div className="flex flex-col justify-center">
                        <span
                            className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} font-serif tracking-[0.05em] leading-[1] drop-shadow-sm ${layout === 'vertical' ? 'text-4xl text-center' : 'text-3xl'}`}
                            style={{ fontFamily: "times new roman, serif" }}
                        >
                            CSBM
                        </span>
                        <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'} font-sans tracking-[0.3em] font-medium leading-[1] mt-1 drop-shadow-sm ${layout === 'vertical' ? 'text-[10px] text-center' : 'text-xs'}`}>
                            CAMPUS
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logo;
