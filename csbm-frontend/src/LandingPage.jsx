import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplyFlow } from './hooks/useApplyFlow';

const StatCounter = ({ end, label, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const duration = 2000;
        const startValue = 0;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * (end - startValue) + startValue));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end]);

    return (
        <div className="flex flex-col items-center">
            <div className="text-3xl font-black text-blue-400">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-widest">
                {label}
            </div>
        </div>
    );
};

// ─── Rotating Text Component ────────────────────────────────────────────
const ROTATING_WORDS = ['Leaders', 'Innovators', 'Achievers', 'Visionaries', 'Champions'];

const RotatingText = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(prev => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <span
            style={{
                display: 'inline-block',
                position: 'relative',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                minWidth: '320px',
            }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={ROTATING_WORDS[index]}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block' }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300"
                >
                    {ROTATING_WORDS[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

// ─── Galaxy Canvas Background ─────────────────────────────────────────────
const GalaxyCanvas = () => {
    const canvasRef = React.useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const STAR_COUNT = 200;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random(),
            y: Math.random(),
            radius: Math.random() * 1.6 + 0.3,
            baseOpacity: Math.random() * 0.55 + 0.2,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.012 + 0.003,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
            driftX: (Math.random() - 0.5) * 0.00015,
            driftY: (Math.random() - 0.5) * 0.00008,
            hue: Math.random() > 0.65 ? `${Math.floor(Math.random() * 60 + 200)}` : '218',
        }));

        let animId;
        const draw = () => {
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            stars.forEach(s => {
                s.opacity += s.twinkleSpeed * s.twinkleDir;
                if (s.opacity > s.baseOpacity + 0.28 || s.opacity < s.baseOpacity - 0.28)
                    s.twinkleDir *= -1;
                s.opacity = Math.max(0.05, Math.min(1, s.opacity));
                s.x = (s.x + s.driftX + 1) % 1;
                s.y = (s.y + s.driftY + 1) % 1;

                const px = s.x * W;
                const py = s.y * H;

                // Glow halo
                const grd = ctx.createRadialGradient(px, py, 0, px, py, s.radius * 6);
                grd.addColorStop(0, `hsla(${s.hue}, 100%, 92%, ${s.opacity * 0.8})`);
                grd.addColorStop(1, `hsla(${s.hue}, 80%, 70%, 0)`);
                ctx.beginPath();
                ctx.arc(px, py, s.radius * 6, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Core dot
                ctx.beginPath();
                ctx.arc(px, py, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, 100%, 98%, ${s.opacity})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 15,
                pointerEvents: 'none',
            }}
        />
    );
};

const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { handleApplyNow } = useApplyFlow();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsModalOpen(false);
        };
        if (isModalOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div
            className="landing-page-root relative flex min-h-screen w-full flex-col overflow-x-hidden text-slate-900 antialiased"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* NAVBAR — Glassmorphism */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.08)',
                    borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: scrolled
                        ? '0 4px 24px rgba(0,0,0,0.08)'
                        : '0 4px 32px rgba(0,0,0,0.15)',
                    transition: 'all 0.35s ease',
                }}
            >
                {/* Glass top highlight line */}
                {!scrolled && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        pointerEvents: 'none'
                    }} />
                )}
                <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-12" theme={scrolled ? 'light' : 'dark'} />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {['About:/about', 'Programs:/programs', 'Contact:/contact', 'Student Life:/student-life'].map((item) => {
                            const [label, path] = item.split(':');
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    style={{ transition: 'color 0.3s ease, text-shadow 0.3s ease' }}
                                    className={`text-sm font-medium ${
                                        scrolled
                                            ? 'text-slate-600 hover:text-blue-600'
                                            : 'text-white/85 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            style={{ transition: 'color 0.3s ease' }}
                            className={`hidden sm:inline-block text-sm font-medium ${
                                scrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/85 hover:text-white'
                            }`}
                        >
                            Log In
                        </Link>

                        {/* Smart Apply Now button */}
                        <button
                            onClick={() => handleApplyNow()}
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                boxShadow: '0 0 0 0 rgba(124,58,237,0)',
                                transition: 'box-shadow 0.3s ease, filter 0.3s ease, transform 0.2s ease',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(124,58,237,0.5)';
                                e.currentTarget.style.filter = 'brightness(1.15)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(124,58,237,0)';
                                e.currentTarget.style.filter = 'brightness(1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            className="inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-semibold text-white"
                        >
                            Apply Now
                        </button>

                        {/* Mobile Menu */}
                        <button
                            style={{ transition: 'color 0.3s ease' }}
                            className={`md:hidden p-2 ${scrolled ? 'text-slate-600' : 'text-white'}`}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-16">
                {/* SECTION 1 — Hero */}
                <section className="relative flex flex-col items-center justify-center min-h-[95vh] py-20 px-6 overflow-hidden">
                    {/* Background Image and Overlay */}
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 z-10 bg-[#0f172a]/80 backdrop-blur-[1px]" />
                    {/* Galaxy star field */}
                    <GalaxyCanvas />
                    <div className="max-w-4xl mx-auto text-center relative z-20 w-full mt-10">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-7xl tracking-tight text-white mt-8 drop-shadow-sm leading-[1.08]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                        >
                            Empowering <br className="hidden sm:block" />
                            Future <RotatingText />
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mt-6 leading-relaxed"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}
                        >
                            High-performance academic programs, advanced learning strategies, and holistic development to help your career grow — delivered fast, priced fairly.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 font-bold text-lg text-white shadow-lg shadow-blue-900/30 hover:bg-blue-700 transition-colors">
                                    Start Your Application <span className="ml-2">→</span>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur px-8 py-4 font-semibold text-lg text-white border border-white/20 hover:bg-white/20 transition-colors">
                                    <span className="text-blue-400 mr-2 text-xl leading-none">▶</span> Watch a Demo
                                </button>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-600/40 shadow-2xl relative z-20"
                        >
                            <StatCounter end={2500} label="Students Enrolled" suffix="+" />
                            <StatCounter end={50} label="Programs Offered" suffix="+" />
                            <StatCounter end={15} label="Years of Excellence" suffix="+" />
                            <StatCounter end={98} label="Graduate Employment" suffix="%" />
                        </motion.div>
                    </div>
                </section>

                {/* SECTION 2 — Trusted By */}
                <section className="bg-slate-50 border-y border-slate-100 py-12">
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
                        <p className="text-slate-600 text-sm font-semibold tracking-widest uppercase text-center mb-8">
                            Trusted by leading institutions &amp; employers
                        </p>
                        <div className="flex justify-center gap-8 md:gap-16 flex-wrap opacity-90">
                            {['UniTech', 'EduGlobal', 'SkillBridge', 'CareerPath', 'InnoLearn'].map((brand, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-slate-900 font-black text-xl md:text-2xl hover:text-black transition-colors cursor-default"
                                >
                                    {brand}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3 — Features (What We Offer) */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="bg-white py-24 sm:py-32"
                >
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest mb-6 uppercase">
                                INTEGRATED ECOSYSTEM
                            </motion.div>
                            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                                Everything you need to succeed
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
                                A seamless educational journey designed for students, faculty, and administration.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Card 1 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
                                <div className="bg-blue-50 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <h3 className="text-slate-900 font-bold text-xl mb-3">Learning Management System</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Access course materials, submit assignments, and track progress effortlessly through our intuitive degree platform.
                                </p>
                                <Link to="/courses" className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Learn more <span>→</span>
                                </Link>
                            </motion.div>

                            {/* Card 2 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 group">
                                <div className="bg-sky-50 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <h3 className="text-slate-900 font-bold text-xl mb-3">Student Portal</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Your central hub. Manage your academic profile, view grades, register for classes, and connect with advisors online.
                                </p>
                                <Link to="/student-dashboard" className="text-sky-600 font-semibold text-sm hover:text-sky-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Access Portal <span>→</span>
                                </Link>
                            </motion.div>

                            {/* Card 3 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 group">
                                <div className="bg-indigo-50 rounded-xl p-3 w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-slate-900 font-bold text-xl mb-3">Faculty Dashboard</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Simplify administrative tasks, manage grading, and focus your energy on delivering quality education and mentorship.
                                </p>
                                <Link to="/admin" className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    View Dashboard <span>→</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 4 — Why Choose CSBM (Bento Grid) */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="bg-slate-50 py-24 sm:py-32 border-t border-slate-100"
                >
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                                Why Choose CSBM?
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
                                Built for the modern student — flexible, affordable, and career-focused.
                            </motion.p>
                        </div>

                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                            
                            {/* Large Card - Spans 2 cols */}
                            <motion.div variants={fadeInUp} className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-10 flex flex-col justify-center text-white relative overflow-hidden shadow-sm group">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                                <div className="relative z-10">
                                    <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider mb-6 backdrop-blur-sm">
                                        FEATURED
                                    </span>
                                    <h3 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">Industry-Relevant Curriculum</h3>
                                    <p className="text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed mb-8">
                                        Our courses are designed in collaboration with industry leaders to ensure you are workforce-ready from day one.
                                    </p>
                                    <Link to="/programs" className="inline-block bg-white text-blue-600 font-bold rounded-full px-8 py-4 shadow-sm hover:shadow-md hover:scale-105 transition-all">
                                        Explore Programs →
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Small Card 1 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl">🎓</div>
                                <h4 className="font-bold text-slate-900 text-xl mb-2">Expert Faculty</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Learn from experienced professionals and respected academics dedicated to your success.</p>
                            </motion.div>

                            {/* Small Card 2 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                                <div className="bg-sky-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl">📅</div>
                                <h4 className="font-bold text-slate-900 text-xl mb-2">Flexible Intakes</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Multiple enrollment periods throughout the year let you start when it's right for you.</p>
                            </motion.div>

                            {/* Small Card 3 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                                <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl">💼</div>
                                <h4 className="font-bold text-slate-900 text-xl mb-2">Career Support</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Resume building, mock interviews, and direct networking with top global employers.</p>
                            </motion.div>

                            {/* Small Card 4 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                                <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl">🏛️</div>
                                <h4 className="font-bold text-slate-900 text-xl mb-2">Modern Campus</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">State-of-the-art facilities designed to foster innovation, collaboration, and comfort.</p>
                            </motion.div>

                        </div>
                    </div>
                </motion.section>

                {/* SECTION 5 — Latest News & Events */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="bg-white py-24 sm:py-32"
                >
                    <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end max-w-6xl mx-auto mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Latest News &amp; Events</h2>
                                <p className="text-slate-500 text-lg mt-3">Stay updated with campus happenings.</p>
                            </div>
                            <Link to="/news" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
                                View all updates <span>→</span>
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Featured large card */}
                            <motion.div variants={fadeInUp} className="lg:col-span-1 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group cursor-pointer">
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src="/science_tech_fair.png"
                                        alt="Annual Science & Technology Innovation Fair"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <span className="bg-white/25 text-white text-xs font-bold rounded-full px-3 py-1 backdrop-blur-md shadow-sm">Feb 2026</span>
                                        <span className="bg-white/25 text-white text-xs font-bold rounded-full px-3 py-1 backdrop-blur-md shadow-sm">Campus Event</span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-slate-900 font-bold text-xl leading-snug group-hover:text-blue-600 transition-colors">Annual Science &amp; Technology Innovation Fair</h3>
                                    <p className="text-slate-500 text-sm mt-4 flex-1 leading-relaxed">
                                        Showcasing the brilliance of innovative projects by our science department students, featuring robotics, AI, and sustainable energy solutions.
                                    </p>
                                </div>
                            </motion.div>

                            {/* 3 small news cards */}
                            <div className="lg:col-span-2 flex flex-col gap-5">
                                {/* Card A */}
                                <motion.div variants={fadeInUp} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-5 items-center cursor-pointer group">
                                    <img src="/academic_icon.png" alt="Academic" className="w-24 h-24 rounded-xl flex-shrink-0 object-cover shadow-sm" />
                                    <div className="flex flex-col justify-center py-2 pr-4">
                                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">Academic</span>
                                        <h4 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">New Master's Program in Data Science Announced</h4>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                                            The newly-designed program is approved to bring edge graduate programs starting next fall focused on big data analytics.
                                        </p>
                                    </div>
                                </motion.div>
                                {/* Card B */}
                                <motion.div variants={fadeInUp} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-5 items-center cursor-pointer group">
                                    <img src="/events_icon.png" alt="Events" className="w-24 h-24 rounded-xl flex-shrink-0 object-cover shadow-sm" />
                                    <div className="flex flex-col justify-center py-2 pr-4">
                                        <span className="text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">Events</span>
                                        <h4 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">Spring Campus Festival Schedule &amp; Activities</h4>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                                            Get ready for a week of music, food, and campus celebrations. Check out the full lineup of student performances.
                                        </p>
                                    </div>
                                </motion.div>
                                {/* Card C */}
                                <motion.div variants={fadeInUp} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-5 items-center cursor-pointer group">
                                    <img src="/alumni_icon.png" alt="Alumni" className="w-24 h-24 rounded-xl flex-shrink-0 object-cover shadow-sm" />
                                    <div className="flex flex-col justify-center py-2 pr-4">
                                        <span className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">Alumni</span>
                                        <h4 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">Alumni Networking Gala Registration Open</h4>
                                        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                                            Connect with fellow graduates and industry leaders at our annual gala where vision and tech-driven alumni unite.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 6 — CTA Banner */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="px-6 pb-24"
                >
                    <div
                        className="py-20 px-8 rounded-3xl max-w-6xl mx-auto text-center relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                    >
                        {/* Decorative glow blobs */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Ready to Begin Your Journey?</h2>
                            <p className="text-slate-400 text-xl mt-6 max-w-2xl mx-auto font-medium">
                                Join 2,500+ students already building their future at CSBM Campus.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                    <Link
                                        to="/register"
                                        className="block sm:inline-block font-black rounded-full px-10 py-4 text-lg text-white transition-all"
                                        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 8px 24px rgba(37,99,235,0.35)' }}
                                    >
                                        Apply Now →
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                    <Link to="/contact" className="block sm:inline-block border border-slate-600 bg-white/5 backdrop-blur-sm text-slate-300 font-bold rounded-full px-10 py-4 text-lg hover:bg-white/10 hover:text-white transition-all">
                                        Contact Us
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Video Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 w-full max-w-4xl rounded-3xl bg-white p-2 sm:p-4 shadow-2xl"
                        >
                            <div className="mb-2 sm:mb-4 flex items-center justify-between px-2 sm:px-4 pt-2">
                                <h3 className="text-lg font-bold text-slate-900">CSBM Campus Overview</h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            </div>
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
                                <iframe
                                    src="https://www.youtube.com/embed/iy4VK6jIB6k?autoplay=1&si=UX6qtmRAeVFasv7V"
                                    title="CSBM Campus Platform Overview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 h-full w-full border-0"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FOOTER */}
            <footer id="contact" className="bg-slate-900 text-white py-16">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {/* Col 1 */}
                        <div className="flex flex-col">
                            <Logo className="h-10 text-white mb-6" theme="dark" />
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
                                Empowering students to reach their full potential through innovation, integrity, and excellence in education.
                            </p>
                            <div className="flex gap-5 mt-auto">
                                <Link to="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                                </Link>
                                <Link to="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                                </Link>
                                <Link to="#" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div className="flex flex-col">
                            <h4 className="text-white font-bold mb-6 tracking-wide">Academics</h4>
                            <ul className="space-y-4">
                                <li><Link to="/undergrad" className="text-slate-400 hover:text-white text-sm transition-colors">Undergraduate</Link></li>
                                <li><Link to="/grad" className="text-slate-400 hover:text-white text-sm transition-colors">Graduate</Link></li>
                                <li><Link to="/online" className="text-slate-400 hover:text-white text-sm transition-colors">Online Learning</Link></li>
                                <li><Link to="/library" className="text-slate-400 hover:text-white text-sm transition-colors">Library</Link></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="flex flex-col">
                            <h4 className="text-white font-bold mb-6 tracking-wide">Support</h4>
                            <ul className="space-y-4">
                                <li><Link to="/register" onClick={() => console.log('PUBLIC APPLY NOW -> /register')} className="text-slate-400 hover:text-white text-sm transition-colors">Admissions</Link></li>
                                <li><Link to="/programs" className="text-slate-400 hover:text-white text-sm transition-colors">Programs</Link></li>
                                <li><Link to="/it-help" className="text-slate-400 hover:text-white text-sm transition-colors">IT Help</Link></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div className="flex flex-col">
                            <h4 className="text-white font-bold mb-6 tracking-wide">Campus Life</h4>
                            <ul className="space-y-4">
                                <li><Link to="/athletics" className="text-slate-400 hover:text-white text-sm transition-colors">Athletics</Link></li>
                                <li><Link to="/housing" className="text-slate-400 hover:text-white text-sm transition-colors">Housing</Link></li>
                                <li><Link to="/health" className="text-slate-400 hover:text-white text-sm transition-colors">Health &amp; Activities</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2026 CSBM Campus. All rights reserved.</p>
                        <p className="text-slate-500 text-sm">Designed for future leaders.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
