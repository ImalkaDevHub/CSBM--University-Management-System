import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApplyFlow } from './hooks/useApplyFlow';
import Logo from './components/Logo';
import heroImage from './assets/programs-hero.png';
import computingImg   from './assets/computing.png';
import managementImg  from './assets/management.png';
import engineeringImg from './assets/engineering.png';
import languageImg    from './assets/language.png';

const COURSES = [
    {
        id: 1,
        title: "Diploma in IT",
        desc: "Learn software development, networking fundamentals, and modern database management systems.",
        type: "DIPLOMA",
        category: "IT",
        code: "IT-DIP-101",
        intake: "Sep 2026",
        deadline: "Aug 15, 2026",
        fee: "150,000",
        duration: "1 Year",
        mode: "Full Time",
        img: computingImg,
    },
    {
        id: 2,
        title: "BSc in Business Management",
        desc: "Comprehensive business strategy, financial accounting, and organizational management leadership.",
        type: "DEGREE",
        category: "Business",
        code: "BM-BSC-301",
        intake: "Oct 2026",
        deadline: "Sep 01, 2026",
        fee: "450,000",
        duration: "3 Years",
        mode: "Hybrid",
        img: managementImg,
    },
    {
        id: 3,
        title: "HND in Engineering",
        desc: "Advanced engineering principles and hands-on technical training in electronics and civil design.",
        type: "HND",
        category: "Engineering",
        code: "ENG-HND-201",
        intake: "Jan 2027",
        deadline: "Dec 10, 2026",
        fee: "300,000",
        duration: "2 Years",
        mode: "Full Time",
        img: engineeringImg,
    },
    {
        id: 4,
        title: "Certificate in English",
        desc: "Enhance your professional communication skills and prepare for global academic opportunities.",
        type: "CERTIFICATE",
        category: "Other",
        code: "ENG-CERT-01",
        intake: "Every Month",
        deadline: "Rolling",
        fee: "45,000",
        duration: "6 Months",
        mode: "Part Time",
        img: languageImg,
    },
    {
        id: 5,
        title: "BSc (Hons) in Computer Science",
        desc: "Master software engineering, artificial intelligence, and cloud architecture for the modern tech industry.",
        type: "DEGREE",
        category: "IT",
        code: "IT-BSC-401",
        intake: "Oct 2026",
        deadline: "Sep 01, 2026",
        fee: "550,000",
        duration: "3 Years",
        mode: "Full Time",
        img: computingImg,
    },
    {
        id: 6,
        title: "MBA in International Business",
        desc: "Advanced leadership training and global business strategies for working professionals.",
        type: "POSTGRADUATE",
        category: "Business",
        code: "BM-MBA-501",
        intake: "Jan 2027",
        deadline: "Dec 15, 2026",
        fee: "850,000",
        duration: "2 Years",
        mode: "Weekend",
        img: managementImg,
    },
    {
        id: 7,
        title: "Diploma in Digital Marketing",
        desc: "Learn SEO, social media strategy, and data-driven marketing campaigns to grow global brands.",
        type: "DIPLOMA",
        category: "Business",
        code: "BM-DIP-202",
        intake: "Nov 2026",
        deadline: "Oct 20, 2026",
        fee: "120,000",
        duration: "1 Year",
        mode: "Hybrid",
        img: managementImg,
    },
    {
        id: 8,
        title: "Advanced Certificate in Cyber Security",
        desc: "Practical training in network defense, ethical hacking, and information security management.",
        type: "CERTIFICATE",
        category: "IT",
        code: "IT-CERT-03",
        intake: "Every Month",
        deadline: "Rolling",
        fee: "80,000",
        duration: "6 Months",
        mode: "Part Time",
        img: computingImg,
    }
];

const TABS = ['All Programs', 'Undergraduate', 'Postgraduate', 'Diploma', 'Short Courses'];

export default function Programs() {
    const { handleApplyNow } = useApplyFlow();
    const [activeTab, setActiveTab] = useState('All Programs');

    const getBannerGradient = (category) => {
        switch(category) {
            case 'IT': return 'bg-gradient-to-br from-blue-500 to-blue-700';
            case 'Business': return 'bg-gradient-to-br from-emerald-500 to-teal-600';
            case 'Engineering': return 'bg-gradient-to-br from-orange-500 to-amber-600';
            default: return 'bg-gradient-to-br from-slate-500 to-slate-700';
        }
    };

    const getBadgeStyle = (type) => {
        switch(type) {
            case 'DIPLOMA': return 'bg-blue-100 text-blue-700';
            case 'DEGREE': return 'bg-purple-100 text-purple-700';
            case 'POSTGRADUATE': return 'bg-rose-100 text-rose-700';
            case 'HND': return 'bg-amber-100 text-amber-700';
            case 'CERTIFICATE': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex min-h-screen w-full flex-col font-sans bg-white text-slate-900 antialiased overflow-x-hidden">
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-300">
                <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center">
                        <Logo className="h-12" theme="light" />
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                        <Link to="/programs" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">Programs</Link>
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
                {/* SECTION 1 — Hero (Photo Background) */}
                <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-16 sm:pb-24">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
                    
                    <motion.div 
                         initial="hidden"
                         animate="visible"
                         variants={staggerContainer}
                         className="relative z-20 w-full max-w-[1280px] mx-auto px-6 lg:px-8 flex justify-start"
                    >
                        <div className="max-w-2xl text-left sm:text-left text-center mx-auto sm:mx-0">

                            
                            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight sm:leading-tight">
                                <div className="text-white">Our Programs,</div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent pb-2">Your Future</div>
                            </motion.h1>
                            
                            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-white/80 mt-4 sm:mt-6 max-w-xl mx-auto sm:mx-0 leading-relaxed font-light">
                                Empowering the next generation of global leaders through industry-aligned curriculum and hands-on specialized training.
                            </motion.p>
                            
                            <motion.div variants={fadeInUp} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                                <button className="bg-blue-600 text-white rounded-lg px-8 py-4 font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                    View Prospectus <span className="text-xl leading-none align-middle ml-1">↓</span>
                                </button>
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
                                <h3 className="text-4xl font-black text-blue-600">10+</h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Programs Available</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600">3</h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Categories</p>
                            </div>
                            <div className="text-center md:border-r border-slate-200 md:pr-16 w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600">500+</h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Students Enrolled</p>
                            </div>
                            <div className="text-center w-full md:w-auto">
                                <h3 className="text-4xl font-black text-blue-600">95%</h3>
                                <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wide">Employment Rate</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 2 — Filter Tabs */}
                <section className="bg-white border-b border-slate-200 py-6 sticky top-16 z-40 shadow-sm">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex gap-3 justify-center flex-wrap">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-full px-6 py-2 transition-all duration-300 ${
                                        activeTab === tab 
                                        ? 'bg-blue-600 text-white font-semibold shadow-md' 
                                        : 'bg-slate-50 text-slate-600 font-medium hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3 — Available Courses Grid */}
                <section className="bg-slate-50 py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-slate-900">Available Courses</h2>
                                <span className="bg-blue-100 text-blue-600 text-xs font-semibold rounded-full px-3 py-1">8 Active</span>
                            </div>
                        </div>

                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {COURSES.map((course) => (
                                <motion.div 
                                    key={course.id}
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col"
                                >
                                    {/* Card Image Header */}
                                    <div className="h-48 w-full overflow-hidden relative">
                                        <img
                                            src={course.img}
                                            alt={`${course.title} illustration`}
                                            className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Type badge overlaid on image */}
                                        <span className={`absolute top-3 right-3 text-xs font-bold rounded-full px-3 py-1 shadow ${getBadgeStyle(course.type)}`}>
                                            {course.type}
                                        </span>
                                        {/* Course code chip at bottom-left */}
                                        <span className="absolute bottom-3 left-3 text-white/90 text-[10px] font-mono tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                                            {course.code}
                                        </span>
                                    </div>

                                    {/* Card Body — title + intake/deadline */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-slate-900 font-bold text-base line-clamp-2 min-h-[40px]">{course.title}</h3>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                                <span>Intake: <span className="font-semibold text-slate-700">{course.intake}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                                <span>Deadline: <span className="font-semibold text-slate-700">{course.deadline}</span></span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 my-4" />

                                        {/* Apply Now — full width, no price */}
                                        <div className="mt-auto">
                                            <button
                                                onClick={() => handleApplyNow(`?program=${encodeURIComponent(course.title)}`)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-sm transition-colors duration-200 shadow-sm"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* SECTION 4 — CTA Banner */}
                <section className="bg-white py-12 px-6">
                    <div className="bg-blue-600 rounded-[2.5rem] max-w-5xl mx-auto py-16 px-8 sm:px-12 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-blue-500 mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
                            <div className="w-64 h-64 rounded-full bg-sky-400 mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">Ready to Start Your <br className="hidden sm:block"/>Academic Journey?</h2>
                            <p className="text-blue-100 text-lg sm:text-xl mt-6 max-w-2xl mx-auto">
                                Apply today and join hundreds of students already thriving at CSBM Campus. Your future begins here.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => handleApplyNow()} className="bg-white text-blue-600 font-black rounded-full px-10 py-4 text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl">
                                    Apply Now →
                                </button>
                                <Link to="/contact" className="bg-transparent border-2 border-white/30 text-white font-bold rounded-full px-10 py-4 text-lg hover:bg-white/10 transition-all">
                                    Contact Admissions
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {/* Col 1 */}
                        <div className="flex flex-col">
                            <Logo className="h-10 text-white mb-6" theme="dark" />
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
                                Empowering students to reach their full potential through innovation, integrity, and excellence in education.
                            </p>
                            <div className="flex gap-4 mt-auto">
                                <Link to="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all" aria-label="Facebook">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                                </Link>
                                <Link to="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all" aria-label="Instagram">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                                </Link>
                                <Link to="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all" aria-label="LinkedIn">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
                            <ul className="space-y-4">
                                <li><Link to="/programs" className="text-slate-400 hover:text-white transition-colors">Course Finder</Link></li>
                                <li><Link to="/scholarships" className="text-slate-400 hover:text-white transition-colors">Scholarships</Link></li>
                                <li><Link to="/student-life" className="text-slate-400 hover:text-white transition-colors">Student Portal</Link></li>
                                <li><Link to="/library" className="text-slate-400 hover:text-white transition-colors">Library</Link></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Admissions</h3>
                            <ul className="mt-6 space-y-4">
                                <li><button onClick={() => handleApplyNow()} className="text-slate-400 hover:text-white transition-colors">Apply Online</button></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Support</Link></li>
                                <li><Link to="/fees" className="text-slate-400 hover:text-white transition-colors">Fees &amp; Funding</Link></li>
                                <li><Link to="/international" className="text-slate-400 hover:text-white transition-colors">International Students</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div>
                            <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                            <ul className="space-y-4">
                                <li>
                                    <p className="text-slate-400 flex items-start gap-3">
                                        <span className="material-symbols-outlined text-blue-500 text-[20px] mt-0.5">location_on</span>
                                        <span>123 University Drive, Knowledge Park, Colombo 03</span>
                                    </p>
                                </li>
                                <li>
                                    <p className="text-slate-400 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-500 text-[20px]">call</span>
                                        <span>+94 11 234 5678</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 sm:mt-24 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2025 CSBM Campus Management System. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
                            <Link to="/accessibility" className="text-slate-500 hover:text-white text-sm transition-colors">Accessibility</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
