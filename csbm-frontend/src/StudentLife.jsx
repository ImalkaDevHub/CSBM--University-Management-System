import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApplyFlow } from './hooks/useApplyFlow';
import Logo from './components/Logo';

// Simple CountUp animation component
const CountUp = ({ end, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            setCount(Math.floor(end * percentage));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
};

export default function StudentLife() {
    const { handleApplyNow } = useApplyFlow();
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="flex min-h-screen w-full flex-col font-sans bg-white text-slate-900 antialiased overflow-x-hidden">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-300">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-10" theme="light" />
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                        <Link to="/programs" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Programs</Link>
                        <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
                        <Link to="/student-life" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">Student Life</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            style={{
                                background: '#1e3a8a',
                                color: '#ffffff',
                                textDecoration: 'none',
                                boxShadow: '0 2px 8px rgba(30, 58, 138, 0.35)',
                            }}
                            className="inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-semibold text-white hover:bg-blue-900 transition-all shadow-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* SECTION 1 — Hero (Photo Background) */}
                <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-16 sm:pb-24 overflow-hidden">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop')" }}
                    />
                    {/* Sweeping full-height linear gradient overlay on the left */}
                    <div 
                        className="absolute inset-0 z-10 pointer-events-none" 
                        style={{
                            background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 42%, rgba(15, 23, 42, 0.25) 75%, transparent 100%)',
                        }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden pointer-events-none" />
                    
                    <motion.div 
                         initial="hidden"
                         animate="visible"
                         variants={staggerContainer}
                         className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 flex justify-start"
                    >
                        <div className="max-w-2xl text-left">
                            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight sm:leading-tight drop-shadow-md">
                                <div className="text-white">Life at CSBM,</div>
                                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent pb-2">Your Community</div>
                            </motion.h1>
                            
                            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-100 mt-4 sm:mt-6 max-w-xl leading-relaxed font-normal drop-shadow-sm">
                                Join a community of bold thinkers and passionate creators. From academic rigor to artistic expression, your future starts here.
                            </motion.p>
                            
                            <motion.div variants={fadeInUp} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-start">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <button 
                                        style={{
                                            background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
                                            color: '#0f172a',
                                            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4), 0 0 20px rgba(250, 204, 21, 0.25)',
                                            border: 'none',
                                        }}
                                        className="inline-flex items-center justify-center font-black rounded-full px-8 py-4 text-lg text-slate-900 shadow-xl transition-all hover:brightness-105 cursor-pointer"
                                    >
                                        <span style={{ color: '#0f172a' }} className="font-black text-slate-900">Join a Club</span>
                                        <span style={{ color: '#0f172a' }} className="ml-2 font-black text-slate-900">→</span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Stats Bar */}
                <section className="bg-white border-b border-slate-200 py-10 shadow-sm relative z-30">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={fadeInUp}
                        className="max-w-6xl mx-auto px-6"
                    >
                        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16">
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600"><CountUp end={2500} suffix="+" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Students Enrolled</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600"><CountUp end={40} suffix="+" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Clubs &amp; Societies</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600"><CountUp end={15} suffix="+" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Sports Teams</p>
                            </div>
                            <div className="text-center w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600"><CountUp end={98} suffix="%" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Student Satisfaction</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 2 — Campus Life Bento Grid */}
                <section className="bg-slate-50 py-24 px-6">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center mb-4">
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                    Campus Life
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900">Everything Campus Life Offers</h2>
                            <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto">
                                From academics to adventure — there's something for everyone at CSBM.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Large Card: Clubs */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="md:col-span-2 bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-10 text-white shadow-lg overflow-hidden relative">
                                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <span className="bg-white/20 text-white text-xs font-bold rounded-full px-3 py-1 tracking-wider">SOCIAL</span>
                                    <h3 className="text-3xl font-black mt-4">Clubs &amp; Societies</h3>
                                    <p className="text-white/80 text-lg mt-3 font-medium max-w-sm">
                                        40+ student-led organizations where leadership meets friendship.
                                    </p>
                                    <div className="flex gap-3 mt-6">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">👥</div>
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🚀</div>
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🎨</div>
                                    </div>
                                    <button className="bg-white text-blue-600 font-bold rounded-full px-6 py-3 mt-8 inline-block hover:bg-slate-50 transition-colors shadow-sm">
                                        Explore Clubs →
                                    </button>
                                </div>
                            </motion.div>

                            {/* Small Card: Career */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm transition-all flex flex-col justify-center">
                                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5">💼</div>
                                <h4 className="font-bold text-slate-900 text-xl">Career Guidance</h4>
                                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                                    Expert counseling and placement support to bridge the gap between education and your dream career.
                                </p>
                                <button className="text-blue-600 font-semibold text-sm mt-5 self-start hover:underline">
                                    Book a Session →
                                </button>
                            </motion.div>

                            {/* Small Card: Sports */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm transition-all flex flex-col justify-center">
                                <div className="bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5">🏀</div>
                                <h4 className="font-bold text-slate-900 text-xl">Sports &amp; Rec</h4>
                                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                                    15+ sports teams and modern recreational facilities for every athlete.
                                </p>
                            </motion.div>

                            {/* Small Card: Wellness */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm transition-all flex flex-col justify-center">
                                <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 text-indigo-500">💙</div>
                                <h4 className="font-bold text-slate-900 text-xl">Wellness Center</h4>
                                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                                    24/7 mental health and counseling support for every student.
                                </p>
                            </motion.div>

                            {/* Small Card: Housing */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm transition-all flex flex-col justify-center">
                                <div className="bg-amber-50 w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5">🏠</div>
                                <h4 className="font-bold text-slate-900 text-xl">Campus Housing</h4>
                                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                                    A place that feels like home. Secure, modern, and community-driven.
                                </p>
                            </motion.div>

                            {/* Small Card: Gala (Orange) */}
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="md:col-span-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10 flex-1">
                                    <h3 className="font-black text-2xl sm:text-3xl">Annual Gala 2025</h3>
                                    <p className="text-white/80 font-medium mt-2">October 24th • Grand Ballroom</p>
                                    <p className="text-white/70 text-sm mt-2">+120 attending</p>
                                    <button className="bg-white text-orange-600 font-bold rounded-full px-6 py-3 mt-6 hover:scale-105 transition-transform shadow-sm">
                                        Get Tickets →
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 3 — Upcoming Events */}
                <section className="bg-white py-24 px-6 border-b border-slate-100">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900">Upcoming Events</h2>
                                <p className="text-slate-500 mt-2 text-lg">Mark your calendars for what's next.</p>
                            </div>
                            <Link to="#" className="text-blue-600 font-semibold hover:underline flex items-center gap-1 pb-1">
                                View Full Calendar →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Event 1 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex gap-5 items-start cursor-pointer group">
                                <div className="bg-slate-100 text-slate-700 rounded-xl px-4 py-3 text-center min-w-[64px] group-hover:bg-slate-200 transition-colors">
                                    <span className="block text-xs font-semibold uppercase tracking-wider">Sep</span>
                                    <span className="block text-2xl font-black mt-0.5">12</span>
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Hackathon 2025</h4>
                                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">🕐</span> 9:00 AM
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">📍</span> Tech Lab 1
                                    </p>
                                </div>
                            </motion.div>

                            {/* Event 2 (Featured) */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex gap-5 items-start cursor-pointer group">
                                <div className="bg-blue-600 text-white rounded-xl px-4 py-3 text-center min-w-[64px] shadow-sm group-hover:bg-blue-700 transition-colors">
                                    <span className="block text-xs font-semibold uppercase tracking-wider">Sep</span>
                                    <span className="block text-2xl font-black mt-0.5">18</span>
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Music Festival</h4>
                                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">🕐</span> 5:00 PM
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">📍</span> Campus Green
                                    </p>
                                </div>
                            </motion.div>

                            {/* Event 3 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex gap-5 items-start cursor-pointer group">
                                <div className="bg-emerald-500 text-white rounded-xl px-4 py-3 text-center min-w-[64px] shadow-sm group-hover:bg-emerald-600 transition-colors">
                                    <span className="block text-xs font-semibold uppercase tracking-wider">Sep</span>
                                    <span className="block text-2xl font-black mt-0.5">25</span>
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Inter-Uni Cricket</h4>
                                    <p className="text-slate-400 text-sm mt-2 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">🕐</span> 2:00 PM
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1 font-medium">
                                        <span className="text-[16px]">📍</span> Sports Complex
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 4 — Student Testimonials */}
                <section className="bg-slate-50 py-24 px-6">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center mb-4">
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                    Student Voices
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900">What Students Say</h2>
                            <p className="text-slate-500 text-lg mt-4">Real stories from the CSBM community.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-yellow-400 text-lg tracking-widest">⭐⭐⭐⭐⭐</div>
                                <p className="text-slate-600 text-base leading-relaxed mt-4 italic line-clamp-4 min-h-[100px]">
                                    "The campus life here is incredible. I found my passion through the robotics club and landed my dream internship."
                                </p>
                                <div className="border-t border-slate-100 mt-6 pt-6 flex items-center gap-3">
                                    <img src="https://ui-avatars.com/api/?name=Aisha+Perera&background=2563eb&color=fff&size=80" alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    <div>
                                        <h5 className="font-semibold text-slate-900 text-sm">Aisha Perera</h5>
                                        <p className="text-slate-400 text-xs mt-0.5">BSc Computer Science, Year 2</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-yellow-400 text-lg tracking-widest">⭐⭐⭐⭐⭐</div>
                                <p className="text-slate-600 text-base leading-relaxed mt-4 italic line-clamp-4 min-h-[100px]">
                                    "Career guidance helped me secure a placement before graduation. The support system at CSBM is unmatched."
                                </p>
                                <div className="border-t border-slate-100 mt-6 pt-6 flex items-center gap-3">
                                    <img src="https://ui-avatars.com/api/?name=Rohan+Silva&background=8b5cf6&color=fff&size=80" alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    <div>
                                        <h5 className="font-semibold text-slate-900 text-sm">Rohan Silva</h5>
                                        <p className="text-slate-400 text-xs mt-0.5">Diploma in Business, Year 1</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 3 */}
                            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-yellow-400 text-lg tracking-widest">⭐⭐⭐⭐⭐</div>
                                <p className="text-slate-600 text-base leading-relaxed mt-4 italic line-clamp-4 min-h-[100px]">
                                    "From the wellness center to the sports facilities, CSBM truly cares about student wellbeing beyond academics."
                                </p>
                                <div className="border-t border-slate-100 mt-6 pt-6 flex items-center gap-3">
                                    <img src="https://ui-avatars.com/api/?name=Nimasha+Fernando&background=10b981&color=fff&size=80" alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                                    <div>
                                        <h5 className="font-semibold text-slate-900 text-sm">Nimasha Fernando</h5>
                                        <p className="text-slate-400 text-xs mt-0.5">HND Engineering, Year 3</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 5 — CTA Banner */}
                <section className="bg-white py-12 px-6">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-blue-600 rounded-[2.5rem] max-w-5xl mx-auto py-16 px-8 sm:px-12 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
                    >
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-blue-500 mix-blend-multiply opacity-50 blur-3xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-sky-400 mix-blend-multiply opacity-50 blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                                Ready to Be Part of <br className="hidden sm:block" />the CSBM Family?
                            </h2>
                            <p className="text-blue-100 text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
                                Apply today and start your journey with thousands of students already thriving on campus.
                            </p>
                            <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <button 
                                    onClick={() => handleApplyNow()} 
                                    style={{ color: '#2563eb' }}
                                    className="inline-flex items-center justify-center bg-white font-black rounded-full px-10 py-4 text-lg hover:bg-blue-50 transition-all shadow-xl cursor-pointer"
                                >
                                    <span style={{ color: '#2563eb' }} className="font-black text-blue-600">Apply Now</span>
                                    <span style={{ color: '#2563eb' }} className="ml-2 font-black text-blue-600">→</span>
                                </button>
                                <Link 
                                    to="/contact" 
                                    style={{
                                        color: '#ffffff',
                                        borderColor: 'rgba(255, 255, 255, 0.85)',
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                        background: 'transparent',
                                        textDecoration: 'none',
                                    }}
                                    className="inline-flex items-center justify-center font-bold rounded-full px-10 py-4 text-lg text-white hover:bg-white/15 hover:border-white transition-all shadow-sm"
                                >
                                    <span style={{ color: '#ffffff' }} className="font-bold text-white">Contact Admissions</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-white py-16 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Col 1 */}
                        <div className="flex flex-col">
                            <Logo className="h-10 text-white mb-6" theme="dark" />
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-xs">
                                Empowering students to lead and innovate through a holistic campus experience.
                            </p>
                            <div className="flex gap-4 mt-auto">
                                <Link to="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-facebook-f font-sans">f</i>
                                </Link>
                                <Link to="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-instagram font-sans">in</i>
                                </Link>
                                <Link to="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-linkedin-in font-sans">Li</i>
                                </Link>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg">Academics</h3>
                            <ul className="space-y-4">
                                <li><Link to="/faculties" className="text-slate-400 hover:text-white text-sm transition-colors">Faculties</Link></li>
                                <li><Link to="/research" className="text-slate-400 hover:text-white text-sm transition-colors">Research</Link></li>
                                <li><Link to="/library" className="text-slate-400 hover:text-white text-sm transition-colors">Library</Link></li>
                                <li><Link to="/exams" className="text-slate-400 hover:text-white text-sm transition-colors">Exams</Link></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg">Quick Links</h3>
                            <ul className="space-y-4">
                                <li><Link to="/news" className="text-slate-400 hover:text-white text-sm transition-colors">News &amp; Events</Link></li>
                                <li><Link to="/careers" className="text-slate-400 hover:text-white text-sm transition-colors">Careers</Link></li>
                                <li><Link to="/alumni" className="text-slate-400 hover:text-white text-sm transition-colors">Alumni</Link></li>
                                <li><Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg">Stay Connected</h3>
                            <p className="text-slate-400 text-sm mb-4">Subscribe to our student life newsletter.</p>
                            <div className="flex flex-col gap-3">
                                <input className="bg-slate-800 border border-slate-600 rounded-full px-4 py-3 text-white text-sm w-full placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Email Address" type="email" />
                                <button className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-full px-6 py-3 text-white text-sm font-semibold shadow-md w-full">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2025 CSBM Campus. All rights reserved.</p>
                        <p className="text-slate-500 text-sm">Built for the leaders of tomorrow.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
