import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AnimatedHeroBackground = () => {
    // Generate random bokeh particles once per render
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            size: Math.random() * 80 + 10,
            xStart: Math.random() * 100,
            yStart: Math.random() * 100,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * 5,
            opacityRange: [Math.random() * 0.1, Math.random() * 0.3 + 0.1, Math.random() * 0.1]
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#020617]">
            {/* Top ambient glow */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.25, 0.1],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-[#135bec] rounded-full blur-[150px] mix-blend-screen"
            />

            {/* Bottom wave glow */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    y: [50, -20, 50],
                    scale: [1, 1.3, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[60%] bg-cyan-600 rounded-full blur-[160px] mix-blend-screen"
            />

            {/* Horizontal ethereal light streaks (aurora-like wave) */}
            <motion.div
                animate={{
                    opacity: [0.15, 0.35, 0.15],
                    rotate: [-3, 3, -3],
                    scaleY: [1, 1.5, 1],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[45%] left-[-20%] right-[-20%] h-[150px] bg-gradient-to-r from-transparent via-[#135bec]/40 to-transparent blur-[60px] rounded-[100%] transform -rotate-12 mix-blend-screen"
            />

            <motion.div
                animate={{
                    opacity: [0.1, 0.25, 0.1],
                    rotate: [2, -2, 2],
                    scaleY: [1, 1.2, 1],
                    y: [0, 20, 0]
                }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="absolute bottom-[20%] left-[-10%] right-[-10%] h-[100px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[50px] rounded-[100%] transform -rotate-6 mix-blend-screen"
            />

            {/* Bokeh Particles */}
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-blue-100"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.xStart}%`,
                        top: `${p.yStart}%`,
                        filter: `blur(${p.size * 0.3}px)`,
                    }}
                    animate={{
                        y: [0, -200, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: p.opacityRange,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: p.delay,
                    }}
                />
            ))}

            {/* Dark gradient overlay to fade edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617] z-10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-[0.03] z-10 mix-blend-overlay"></div>
        </div>
    );
};

export default AnimatedHeroBackground;
