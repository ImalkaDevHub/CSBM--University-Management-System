import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useApplyFlow } from './hooks/useApplyFlow';
import Logo from './components/Logo';

// CountUp Component for Stats Bar
const CountUp = ({ end, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;
        
        let startTimestamp = null;
        const duration = 2000;
        const startValue = 0;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart easing
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * (end - startValue) + startValue));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, isInView]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
};

export default function About() {
    const { handleApplyNow } = useApplyFlow();
    return (
        <div className="flex min-h-screen w-full flex-col font-sans bg-white text-slate-900 antialiased overflow-x-hidden">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-300">
                <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-12" theme="light" />
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">About</Link>
                        <Link to="/programs" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Programs</Link>
                        <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
                        <Link to="/student-life" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Student Life</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                            Log In
                        </Link>
                        <Link to="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* HERO SECTION */}
                <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-16">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    
                    {/* Floating Hero Elements */}
                    <div className="absolute inset-0 z-15 overflow-hidden pointer-events-none">
                        {/* Element 1 */}
                        <motion.div
                            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/20"
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Element 2 */}
                        <motion.div
                            className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-yellow-400/10 border border-yellow-400/20"
                            animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />
                        {/* Element 3 */}
                        <motion.div
                            className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-sky-400/15 border border-sky-400/20"
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        />
                    </div>

                    <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 lg:px-16">
                        <div className="max-w-2xl text-left pb-16">
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-6xl md:text-7xl font-black leading-tight tracking-tight"
                            >
                                <div className="text-white">Shaping Futures,</div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent pb-2">Building Leaders</div>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-lg text-white/80 mt-6 max-w-xl leading-relaxed"
                            >
                                CSBM is dedicated to fostering excellence in IT, Science, Business, and Management. We empower our students to lead in an ever-evolving global landscape through innovation and rigorous academic inquiry.
                            </motion.p>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="mt-8 flex gap-4"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <Link to="/programs" className="bg-blue-600 text-white rounded-lg px-8 py-4 font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg block">
                                        Explore Programs
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <button className="bg-white/20 backdrop-blur text-white border border-white/30 rounded-lg px-8 py-4 font-semibold hover:bg-white/30 transition-all">
                                        Virtual Tour
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* STATS BAR */}
                <section className="bg-white border-b border-slate-200 py-8 shadow-sm relative z-30">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16">
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-3xl font-black text-blue-600"><CountUp end={500} suffix="+" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Students</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-3xl font-black text-blue-600"><CountUp end={20} suffix="+" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Programs</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-3xl font-black text-blue-600"><CountUp end={15} /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Years Excellence</p>
                            </div>
                            <div className="text-center w-full md:w-auto">
                                <h3 className="text-3xl font-black text-blue-600"><CountUp end={95} suffix="%" /></h3>
                                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Employment Rate</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* OUR STORY SECTION */}
                <section className="py-24 bg-slate-50">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-7xl mx-auto px-8"
                    >
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    viewport={{ once: true }}
                                    className="inline-flex mb-4"
                                >
                                    <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                        OUR STORY
                                    </span>
                                </motion.div>
                                <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">A Tradition of Academic Excellence</h2>
                                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                                    <p>Founded 15 years ago, the College of IT, Science, Business &amp; Management (CSBM) began with a single vision: to bridge the gap between theoretical education and industry demands. What started as a small technical institute has flourished into a premier university known for its research-driven curriculum.</p>
                                    <p>Our journey is marked by a commitment to diversity, academic rigor, and the success of our graduates. We believe in providing an environment where intellectual curiosity meets practical application.</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative">
                                    {/* Background photo */}
                                    <img
                                        alt="Campus Life"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop"
                                    />
                                    {/* Dark gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

                                    {/* Text content on top */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
                                        <p className="text-white/70 text-xs font-bold tracking-[0.4em] uppercase mb-3">Welcome to</p>
                                        <h3
                                            className="text-white font-black leading-none tracking-tight"
                                            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
                                        >
                                            CAMPUS<br />LIFE
                                        </h3>
                                        <div className="mt-5 w-12 h-0.5 bg-white/50 mx-auto rounded-full" />
                                        <p className="text-white/80 text-sm font-semibold tracking-widest uppercase mt-4">
                                            Natural to Natural<br />Safe to Work
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 p-8 rounded-2xl shadow-xl hidden md:block">
                                    <p className="text-blue-600 font-black text-4xl">15+</p>
                                    <p className="text-slate-500 font-bold text-sm uppercase tracking-tighter mt-1">Years of Legacy</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* MISSION, VISION, VALUES */}
                <section className="py-24 bg-white border-y border-slate-200">
                    <motion.div
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 }} }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                        className="max-w-7xl mx-auto px-8"
                    >
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Mission */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-blue-600 text-3xl">flag</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Mission</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">To empower students with the knowledge and skills necessary to excel in their chosen fields through innovative teaching and holistic development.</p>
                            </motion.div>
                            
                            {/* Vision */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-200 transition-all"
                            >
                                <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-sky-500 text-3xl">visibility</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Vision</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">To be a leading global institution recognized for excellence in research, academic leadership, and societal contribution.</p>
                            </motion.div>
                            
                            {/* Values */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                            >
                                <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-indigo-500 text-3xl">verified_user</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Our Values</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">Integrity, Innovation, and Inclusivity form the bedrock of everything we do, ensuring a respectful and forward-thinking campus community.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* LEADERSHIP TEAM */}
                <section className="py-24 bg-slate-50">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-7xl mx-auto px-8"
                    >
                        <div className="text-center mb-16">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                viewport={{ once: true }}
                                className="inline-flex mb-4"
                            >
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                    OUR TEAM
                                </span>
                            </motion.div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Meet the Leadership</h2>
                        </div>
                        
                        <motion.div 
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 }} }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-4 gap-8"
                        >
                            {/* Leader 1 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 text-center transition-all group"
                            >
                                <img alt="Focus" className="w-24 h-24 rounded-full border-4 border-blue-100 mx-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaqMe7YpG_7TgH-XkQE6d-KdE_CLLgmhr8YuhYFKGfvQE4KsOMzIvdFE8U5RSb4qDGGERkHeVLyHfjiu5ogDz7nOmonlbXuQWxSyiHDVSfRFdk4TsvKguZoborhcks69KgdpaX6AHjVOCk0cJU-E-YaY9LusTaDB9I7yueabe9H56HkPM5k6aoHN66i8T3rQ0o-nPFS0lpoKEfUcHY52Q8mdFd34YNx2N2RF4cD_85zQghWwPTg8STsmnlA1Cep7qS1XMAxaxbLME"/>
                                <h4 className="text-lg font-black text-slate-900 mt-5">Dr. Arthur Vance</h4>
                                <p className="text-blue-600 text-sm font-semibold mt-1">President &amp; Chancellor</p>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">Leading CSBM with over 30 years of academic experience in global management systems.</p>
                            </motion.div>
                            {/* Leader 2 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 text-center transition-all group"
                            >
                                <img alt="Leadership" className="w-24 h-24 rounded-full border-4 border-blue-100 mx-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSfDUAA8U6Cc-gFNlSIKsAV54ejxZmbpivr-sPlYB5zwAwPuB0BkPdif8wwLB_25FiPWck2qHq__z89ps1fvH4aPM5Wwa0CG_C5eI-ZtJZYVKp6NWw85o1wTaEziyZGH-7haXbuNTTJ7r0lbYh-eq2Rb9IcQCz_skyWU4rs9onvV7JR4DbYnXURyMZhISNDK-IIl_DcNp4LZJ9PW74spGTlyTp3JbRVdIUXc-6IVZWGXJtA7MUz2rLZinUqqWs9rb5tekIo3beDII"/>
                                <h4 className="text-lg font-black text-slate-900 mt-5">Dr. Elena Rodriguez</h4>
                                <p className="text-blue-600 text-sm font-semibold mt-1">Dean of Academics</p>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">A pioneer in computer science education and research ethics.</p>
                            </motion.div>
                            {/* Leader 3 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 text-center transition-all group"
                            >
                                <img alt="Leadership" className="w-24 h-24 rounded-full border-4 border-blue-100 mx-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZEb7dyK-5uSJ-B-JyzBmVLiaXqVVhBPawYt4FCGXFh9zjTNxuV_dgn4NSQCTITeHf94T4TkDCzzWcZnGPdXf2FY3YQEEC0Fw8nR2kEJ1hHqdmX5OfA7ZBcYxifeterh70KQ9RJ6L9iGM6Ivj46xq1dwaQLyjpQ5POtSi74AsRqguPsb-b3sz9DGUCwawVq-32jnBJFnpK2iRQjiXt13SsFjIml360FjM_gSMRcg70F-encbbogdQ3mMShG3PZ3kkQNaeCSNVRYQ8"/>
                                <h4 className="text-lg font-black text-slate-900 mt-5">Prof. Julian Thorne</h4>
                                <p className="text-blue-600 text-sm font-semibold mt-1">Director of Research</p>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">Driving innovation through interdisciplinary science programs and grant acquisitions.</p>
                            </motion.div>
                            {/* Leader 4 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 text-center transition-all group"
                            >
                                <img alt="Leadership" className="w-24 h-24 rounded-full border-4 border-blue-100 mx-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGWTZzCNyomTveHRWf3lPOb03S2xgWm53seO5qamDA6P-2kVNhOFlvNTum7z9UOOyaZ6XjHW0kzF06QCKWgjmiodqnpdWwBQWrkU01wSWVs1d3joA7uXQ1nAvDFVyhCzbEvqF38a-UHrO4vgoSnPxWsHTNrSas5bwqBgogpim_lbR5kGQYMQpDhwsGvtM5WvyGfG2zTYrh3VKSnb1C6lmv6OMboQj4hs0BrY5U8M4d8LvVoJy0rzv9f2VE-nxuZCqMJx7h4Aj6hVE"/>
                                <h4 className="text-lg font-black text-slate-900 mt-5">Sarah Jenkins</h4>
                                <p className="text-blue-600 text-sm font-semibold mt-1">Head of Admissions</p>
                                <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed font-medium">Ensuring a seamless journey for every student from application to graduation.</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ACCREDITATIONS */}
                <section className="py-16 bg-white border-b border-slate-200">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-7xl mx-auto px-8"
                    >
                        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-10">Recognized &amp; Accredited by leading bodies</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="text-2xl font-black text-slate-800 tracking-tight">ISO-9001</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">AACSB</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">ABET</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">EQUIS</div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">AMBA</div>
                        </div>
                    </motion.div>
                </section>

                {/* TESTIMONIALS */}
                <section className="py-24 bg-slate-50">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-7xl mx-auto px-8"
                    >
                        <div className="text-center mb-16">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                viewport={{ once: true }}
                                className="inline-flex mb-4"
                            >
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                    TESTIMONIALS
                                </span>
                            </motion.div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">What Our Students Say</h2>
                        </div>
                        
                        <motion.div 
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 }} }}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {/* Testimonial 1 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 border border-slate-200 transition-all"
                            >
                                <div className="flex text-yellow-400 mb-4">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                                <p className="text-slate-600 italic mb-8 font-medium">"The hands-on projects in the IT program gave me the confidence to apply for senior roles before I even graduated. The faculty is incredible."</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                                        <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHf45XPb9H2MJxVe3FiHD0cGZH6AkDPlqKuzDQWiyxFdMkqBTAuhOfp5NZKr3Aj5qCBF4LjnCnlWsWMFB9lRrteBv4LYFFSS6Ii8mIopJkvCns5sk3CUvqjzD0gqwPdKaXd16qBL1MX7ukLDPcCyF-ksfQNfwOmATJIwjsZf06iN_Z4nhbfmvumfneCGUcNGWj5jcHNBnjlIjdqdXeZ0XwO0yof4LR9rUx9yrxTGFwOXxFXQErk8qExAPmETPweOxOEQ5_v3DbzB0"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 tracking-tight">Marcus Chen</p>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">BSc Information Technology</p>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Testimonial 2 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 border border-slate-200 transition-all"
                            >
                                <div className="flex text-yellow-400 mb-4">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                                <p className="text-slate-600 italic mb-8 font-medium">"CSBM's business management program is world-class. The networking opportunities with alumni were vital for my career shift."</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                                        <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZiszZQDK_LMyZeKMg3DEGpGYz082HpsD-AIrwLecIjWuyPEgacs3MtKW5CPTJf1UbLpkMi1Sku5gdNxW8sIaJTkRdeZirx8UHWpJroDs4OeeDlq5Yfsyyz-rk5cq6dJ-m9NK7CIjQNdHdFLJuQ5cnQS5I4tY6TwJ9zMNEh-ROpX5i9ItEU3ImzwJyFIXRRsB_1qwJQYejckz8yFRpEstBEkx2bVf40DKAnjcHndb99vIT7v7XdYq3SQBzDR72qtIPdT5v1ew_4Oc"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 tracking-tight">Lila Watson</p>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">MBA Graduate</p>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Testimonial 3 */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 border border-slate-200 transition-all"
                            >
                                <div className="flex text-yellow-400 mb-4">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                                </div>
                                <p className="text-slate-600 italic mb-8 font-medium">"The research labs are top-notch. I felt supported throughout my science thesis by mentors who are leaders in their fields."</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                                        <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNFw8tO89CsDjdSrsjA6g8EkkgTpCX6Wl09caVuLyqbbQxmI3RTL9PFdhMvGPT52U7Osa6VeWppPdbWJ3YcQ7WBqPpn-QHDIfqlNe0DISyBmUsv1CBz55kvG__RbbAhDrH1Uj0Ku_3Or5ThkftBNgLD9t0Qy8RF84WokosRZf6jl94rRxJNMSIKbF4mMjiMyd5svaXe0kXs6MhOi8Rhl2e0RongBkU2fISEjt66uThq7EHnq_g_T578Qn_F5KCqmjIMVkEUNTrsxg"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 tracking-tight">David Okafor</p>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">MSc Biomedical Science</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* CTA BANNER */}
                <section className="bg-white py-12 px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                        className="bg-blue-600 rounded-[2.5rem] max-w-5xl mx-auto py-16 px-8 sm:px-12 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 my-16"
                    >
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-blue-500 mix-blend-multiply opacity-50 blur-3xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-sky-400 mix-blend-multiply opacity-50 blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                                Ready to Begin Your Journey?
                            </h2>
                            <p className="text-white/80 text-lg sm:text-xl mt-4 max-w-2xl mx-auto font-medium">
                                Applications for the next intake are now open. Join a community that celebrates your potential and supports your dreams.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <button onClick={() => handleApplyNow()} className="bg-white text-blue-600 font-black rounded-full px-10 py-4 text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl block">
                                        Apply Now →
                                    </button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <Link to="/contact" className="bg-transparent border-2 border-white/30 text-white font-bold rounded-full px-10 py-4 text-lg hover:bg-white/10 transition-all block">
                                        Contact Us
                                    </Link>
                                </motion.div>
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
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-xs font-medium">
                                Empowering students to reach their full potential through innovation, integrity, and excellence in education.
                            </p>
                            <div className="flex gap-4 mt-auto">
                                <a href="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-facebook-f font-sans">f</i>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-instagram font-sans">in</i>
                                </a>
                                <a href="#" className="text-slate-400 hover:text-white text-xl transition-colors">
                                    <i className="fab fa-linkedin-in font-sans">Li</i>
                                </a>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight">Academics</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Undergraduate</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Graduate</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Online Learning</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Library</a></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight">Support</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Admissions</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Financial Aid</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">IT Help</a></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight">Campus Life</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Athletics</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Housing</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors font-medium">Health &amp; Activities</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm font-medium">© 2026 CSBM Campus. All rights reserved.</p>
                        <p className="text-slate-500 text-sm font-medium">Designed for future leaders.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
