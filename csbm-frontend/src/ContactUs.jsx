import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplyFlow } from './hooks/useApplyFlow';
import Logo from './components/Logo';

const FAQ_ITEMS = [
    {
        q: "How do I apply for a program at CSBM?",
        a: "You can apply online through our Admissions page. Select your desired program, complete the application form, and submit your supporting documents. Our team will review and contact you within 5–7 working days."
    },
    {
        q: "What are the entry requirements?",
        a: "Entry requirements vary by program. Generally, you need a minimum of 3 A/L passes for undergraduate programs. Use our Eligibility Checker on the Programs page to verify your specific qualifications."
    },
    {
        q: "Are there scholarships available?",
        a: "Yes, CSBM offers merit-based and need-based scholarships. Contact our Financial Aid office at financial@csbm.edu.lk for more details and application procedures."
    },
    {
        q: "Can I visit the campus before applying?",
        a: "Absolutely! We welcome campus visits and open days. Contact us to schedule a guided tour or attend one of our monthly open day events."
    },
    {
        q: "How long do programs take to complete?",
        a: "Program durations vary: Short Courses take 3–6 months, Diplomas take 1 year, HNDs take 2 years, and Degree programs take 3–4 years depending on the field of study."
    },
    {
        q: "Is online or part-time study available?",
        a: "Yes, several programs are offered in hybrid and part-time modes. Check individual program details on our Programs page or contact admissions for guidance."
    }
];

export default function ContactUs() {
    const { handleApplyNow } = useApplyFlow();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        phone: '', subject: 'General Inquiry', message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setFormData({
                firstName: '', lastName: '', email: '',
                phone: '', subject: 'General Inquiry', message: ''
            });
        }, 1500);
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
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
                        <Link to="/programs" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Programs</Link>
                        <Link to="/contact" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1 transition-colors">Contact</Link>
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
                <section className="relative w-full h-[70vh] min-h-[500px] flex items-end pb-16">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                    
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
                        }}
                        className="relative z-20 w-full max-w-[1280px] mx-auto px-6 lg:px-16"
                    >
                        <div className="max-w-2xl text-left">

                            
                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-black leading-tight">
                                <div className="text-white">Contact</div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent pb-2">Our Team</div>
                            </motion.h1>
                            
                            <motion.p variants={fadeInUp} className="text-lg text-white/80 mt-6 max-w-xl">
                                We're here to help. Reach out to us for admissions, academic inquiries, or general campus information.
                            </motion.p>
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 1 — Contact Info Cards */}
                <section className="bg-white py-16 px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Card 1 */}
                        <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center">
                            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center text-2xl mx-auto">
                                📍
                            </div>
                            <h3 className="font-black text-slate-900 text-xl mt-4">Visit Us</h3>
                            <p className="text-slate-600 mt-2 font-medium">123 University Drive</p>
                            <p className="text-slate-500">Knowledge Park, Colombo 03</p>
                            <p className="text-slate-500">Sri Lanka</p>
                            <a href="#" className="text-blue-600 font-semibold text-sm mt-4 block hover:underline">Get Directions →</a>
                        </motion.div>

                        {/* Card 2 (Featured) */}
                        <motion.div variants={fadeInUp} className="bg-blue-600 text-white rounded-2xl p-8 shadow-lg shadow-blue-200 text-center transform md:-translate-y-2">
                            <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center text-2xl mx-auto backdrop-blur-sm">
                                📞
                            </div>
                            <h3 className="font-black text-white text-xl mt-4">Call Us</h3>
                            <p className="text-white mt-2 font-semibold tracking-wide">+94 11 234 5678</p>
                            <p className="text-white/80 tracking-wide">+94 77 234 5678</p>
                            <p className="text-white/70 text-sm mt-2">Mon–Fri: 8:00 AM – 5:00 PM</p>
                            <a href="tel:+94112345678" className="bg-white text-blue-600 font-bold rounded-full px-5 py-2 text-sm mt-4 inline-block hover:bg-blue-50 transition-colors shadow-sm">
                                Call Now →
                            </a>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center">
                            <div className="bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center text-2xl mx-auto">
                                ✉️
                            </div>
                            <h3 className="font-black text-slate-900 text-xl mt-4">Email Us</h3>
                            <p className="text-slate-600 mt-2 font-medium">info@csbm.edu.lk</p>
                            <p className="text-slate-500">admissions@csbm.edu.lk</p>
                            <p className="text-slate-500">support@csbm.edu.lk</p>
                            <a href="mailto:info@csbm.edu.lk" className="text-blue-600 font-semibold text-sm mt-4 block hover:underline">Send Email →</a>
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECTION 2 — Contact Form + Map */}
                <section className="bg-slate-50 py-24 px-6 border-y border-slate-200">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* LEFT — Form */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInLeft}
                            className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm"
                        >
                            <h2 className="text-3xl font-black text-slate-900">Send Us a Message</h2>
                            <p className="text-slate-500 text-sm mt-2 mb-8">
                                Fill out the form and we'll get back to you within 24 hours.
                            </p>

                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-700 text-center flex flex-col items-center justify-center min-h-[300px]"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mb-4">
                                        ✓
                                    </div>
                                    <p className="text-lg font-bold">Message sent successfully!</p>
                                    <p className="mt-1">We'll be in touch soon.</p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-emerald-600 font-semibold text-sm hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-slate-700 text-sm font-semibold mb-2 block">First Name</label>
                                            <input 
                                                type="text" name="firstName" required
                                                value={formData.firstName} onChange={handleInputChange}
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-400 text-sm transition-all"
                                                placeholder="John" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-700 text-sm font-semibold mb-2 block">Last Name</label>
                                            <input 
                                                type="text" name="lastName" required
                                                value={formData.lastName} onChange={handleInputChange}
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-400 text-sm transition-all"
                                                placeholder="Doe" 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-slate-700 text-sm font-semibold mb-2 block">Email Address</label>
                                        <input 
                                            type="email" name="email" required
                                            value={formData.email} onChange={handleInputChange}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-400 text-sm transition-all"
                                            placeholder="john@example.com" 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-700 text-sm font-semibold mb-2 block">Phone Number</label>
                                        <input 
                                            type="tel" name="phone"
                                            value={formData.phone} onChange={handleInputChange}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-400 text-sm transition-all"
                                            placeholder="+94 77 123 4567" 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-700 text-sm font-semibold mb-2 block">Subject</label>
                                        <select 
                                            name="subject"
                                            value={formData.subject} onChange={handleInputChange}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer text-sm transition-all"
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Admissions">Admissions</option>
                                            <option value="Programs">Programs</option>
                                            <option value="Financial Aid">Financial Aid</option>
                                            <option value="Technical Support">Technical Support</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-slate-700 text-sm font-semibold mb-2 block">Message</label>
                                        <textarea 
                                            name="message" required rows="5"
                                            value={formData.message} onChange={handleInputChange}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-400 text-sm transition-all resize-none"
                                            placeholder="Tell us how we can help you..." 
                                        />
                                    </div>

                                    <button 
                                        type="submit" disabled={loading}
                                        className="w-full mt-4 bg-blue-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Message →"
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* RIGHT — Map & Details */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInRight}
                            className="flex flex-col gap-6"
                        >
                            {/* Map */}
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-72 relative">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798474698644!2d79.8561!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNiJOIDc5wrA1MSczOS42IkU!5e0!3m2!1sen!2slk!4v1234567890"
                                    width="100%" height="100%" 
                                    style={{ border: 0 }} allowFullScreen=""
                                    loading="lazy"
                                    title="CSBM Campus Location"
                                ></iframe>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Office Hours</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600 text-sm">Monday – Friday</span>
                                        <span className="text-slate-900 font-semibold text-sm">8:00 AM – 5:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-600 text-sm">Saturday</span>
                                        <span className="text-slate-900 font-semibold text-sm">9:00 AM – 1:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-600 text-sm">Sunday</span>
                                        <span className="text-red-500 font-semibold text-sm">Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Follow Us</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <a href="#" className="bg-blue-50 text-blue-600 rounded-xl py-3 font-semibold text-sm hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors">
                                        <i className="fab fa-facebook-f text-lg w-5 text-center">f</i> Facebook
                                    </a>
                                    <a href="#" className="bg-pink-50 text-pink-600 rounded-xl py-3 font-semibold text-sm hover:bg-pink-100 flex items-center justify-center gap-2 transition-colors">
                                        <span className="text-lg w-5 text-center">📷</span> Instagram
                                    </a>
                                    <a href="#" className="bg-sky-50 text-sky-600 rounded-xl py-3 font-semibold text-sm hover:bg-sky-100 flex items-center justify-center gap-2 transition-colors">
                                        <i className="fab fa-linkedin-in text-lg w-5 text-center font-serif">in</i> LinkedIn
                                    </a>
                                    <a href="#" className="bg-slate-50 text-slate-700 rounded-xl py-3 font-semibold text-sm hover:bg-slate-100 flex items-center justify-center gap-2 transition-colors">
                                        <span className="text-lg w-5 text-center font-serif">𝕏</span> Twitter
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SECTION 3 — FAQ */}
                <section className="bg-white py-24 px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center mb-4">
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase">
                                    COMMON QUESTIONS
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
                            <p className="text-slate-500 mt-4 text-lg">
                                Can't find what you're looking for? Contact us directly.
                            </p>
                        </div>

                        <div className="mt-8">
                            {FAQ_ITEMS.map((item, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div key={index} className="bg-white border border-slate-200 rounded-xl mb-3 overflow-hidden shadow-sm transition-all hover:border-blue-200">
                                        <button 
                                            onClick={() => toggleFaq(index)}
                                            className={`w-full flex justify-between items-center p-6 text-left transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                        >
                                            <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                                            <span className={`text-blue-600 font-bold text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                                                +
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-100 mt-2 mx-6 px-0 pb-6">
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </section>

                {/* SECTION 4 — CTA Banner */}
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
                                Still Have Questions?
                            </h2>
                            <p className="text-white/80 text-lg sm:text-xl mt-4 max-w-2xl mx-auto">
                                Our admissions team is ready to help you find the right program.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => handleApplyNow()} className="bg-white text-blue-600 font-black rounded-full px-10 py-4 text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl">
                                    Apply Now →
                                </button>
                                <a href="tel:+94112345678" className="bg-transparent border-2 border-white/30 text-white font-bold rounded-full px-10 py-4 text-lg hover:bg-white/10 transition-all">
                                    Call Us Now
                                </a>
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
                            <h3 className="text-white font-semibold mb-6 text-lg">Academics</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Undergraduate</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Graduate</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Online Learning</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Library</a></li>
                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg">Support</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Admissions</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Financial Aid</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">IT Help</a></li>
                                <li><Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Col 4 */}
                        <div>
                            <h3 className="text-white font-semibold mb-6 text-lg">Campus Life</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Athletics</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Housing</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Health & Activities</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© 2025 CSBM Campus. All rights reserved.</p>
                        <p className="text-slate-500 text-sm">Designed for future leaders.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
