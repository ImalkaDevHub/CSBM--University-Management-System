import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const StudentApplicationForm = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [stream, setStream] = useState('');
    const [passes, setPasses] = useState('');
    const [eligibilityResult, setEligibilityResult] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/api/courses');
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!selectedCourseId || !stream || !passes) {
            setEligibilityResult(null);
            return;
        }

        const course = courses.find((c) => (c.id || c.code) == selectedCourseId);
        if (!course) return;

        const requiredPasses = course.minALPasses || 3;
        const requiredStream = course.streamReq || "Any";

        const isStreamValid = requiredStream === "Any" || requiredStream === stream;
        const isPassesValid = parseInt(passes) >= requiredPasses;

        if (isStreamValid && isPassesValid) {
            setEligibilityResult('eligible');
        } else {
            setEligibilityResult('not-eligible');
        }
    }, [selectedCourseId, stream, passes, courses]);

    const formatFee = (fee) => {
        if (fee == null) return '—';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(fee));
    };

    const selectedCourse = courses.find((c) => (c.id || c.code) == selectedCourseId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (eligibilityResult !== 'eligible') return;
        navigate('/student-dashboard');
    };

    return (
        <div className="bg-[#f6f6f8] text-slate-900 min-h-screen font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-10 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div />
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-slate-600 hover:text-[#135bec] transition-colors" to="/programs">Programs</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-[#135bec] transition-colors" to="#">Admissions</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-[#135bec] transition-colors" to="#">Campus Life</Link>
                        <Link className="text-sm font-medium text-slate-600 hover:text-[#135bec] transition-colors" to="#">Support</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-[#135bec]/10 border-2 border-[#135bec]/20 flex items-center justify-center overflow-hidden">
                            <img alt="Profile" className="w-full h-full object-cover" data-alt="Student profile avatar placeholder" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlxcQJQ0vaSaV6rVbSmk5hsA3ONafvEMmMiAn2fuanJdCWlavo4ZCkaC1HWurKA_t5N727unnH9uXrFDc96lZ3R77rRI-YRPvgXmUbXKbCpIFDkS19WK82MHPX5OEqk_sCGedF1N0f4z-92ZCXQ_PzU8ikZGx4auhn-t2folHr16l7XWtm1e4l8c1OFILJqkor0MKJOYxmn19sdgtXrXc2g_fprXnRIFs7t4AEwbsaSbngKGWoTJl0UOSKKBaF8_chpxbhkeE7oMQ" />
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-10">
                {/* Header Section */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-900 mb-3">Student Application Form</h1>
                    <p className="text-slate-500 max-w-2xl">Start your journey with us. Please fill out the form below with accurate information to apply for the upcoming academic intake.</p>
                </div>
                {/* Application Progress */}
                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                        <div className="relative z-10 bg-[#135bec] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                        <div className="relative z-10 bg-white text-slate-400 border-2 border-slate-200 w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                        <div className="relative z-10 bg-white text-slate-400 border-2 border-slate-200 w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span className="text-[#135bec]">Personal Details</span>
                        <span>Academic Info</span>
                        <span>Program Selection</span>
                    </div>
                </div>
                <form className="space-y-10" onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <span className="material-symbols-outlined text-[#135bec]">person</span>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">First Name</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="John" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="Doe" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="john.doe@example.com" type="email" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="+1 (555) 000-0000" type="tel" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Gender</label>
                                <select className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    {/* Program Selection Section */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <span className="material-symbols-outlined text-[#135bec]">auto_stories</span>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Program Selection</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Desired Program of Study</label>
                                <select
                                    className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a Program</option>
                                    {courses.map(course => (
                                        <option key={course.id || course.code} value={course.id || course.code}>
                                            {course.name || course.courseName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Fee Display Panel */}
                            {selectedCourse && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Total Program Fee</p>
                                            <p className="text-xl font-black text-slate-900">{formatFee(selectedCourse.fee || selectedCourse.courseFee)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-[#135bec] bg-[#135bec]/10 px-3 py-1 rounded-full inline-block">
                                            Financial Aid Available
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Preferred Intake</label>
                                    <div className="flex gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <input className="hidden peer" name="intake" type="radio" required />
                                            <div className="p-3 text-center border-2 border-slate-100 rounded-lg peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 transition-all">
                                                <span className="text-sm font-medium">Fall intake 2026</span>
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <input className="hidden peer" name="intake" type="radio" required />
                                            <div className="p-3 text-center border-2 border-slate-100 rounded-lg peer-checked:border-[#135bec] peer-checked:bg-[#135bec]/5 transition-all">
                                                <span className="text-sm font-medium">Spring 2026</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Study Mode</label>
                                    <select className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" required>
                                        <option value="full-time">Full-Time (On Campus)</option>
                                        <option value="part-time">Part-Time (Evening)</option>
                                        <option value="hybrid">Hybrid Learning</option>
                                        <option value="online">100% Online</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Academic History Section */}
                    <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <span className="material-symbols-outlined text-[#135bec]">history_edu</span>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic History & Eligibility</h2>
                        </div>
                        <div className="space-y-6">

                            {/* Eligibility Check Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-6 mt-4">
                                <div className="col-span-full mb-2">
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">verified</span>
                                        Automated Eligibility Checker
                                    </h3>
                                    <p className="text-sm text-slate-500">Provide your A/L results to instantly verify your eligibility for the selected program.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">A/L Stream</label>
                                    <select
                                        className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4"
                                        value={stream}
                                        onChange={(e) => setStream(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Stream</option>
                                        <option value="Maths">Physical Science (Maths)</option>
                                        <option value="Bio">Biological Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                        <option value="Tech">Technology</option>
                                        <option value="Any">Other / Any</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Results (Passes)</label>
                                    <select
                                        className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4"
                                        value={passes}
                                        onChange={(e) => setPasses(e.target.value)}
                                        required
                                    >
                                        <option value="">Number of Passes</option>
                                        <option value="3">3 Passes (S/C/B/A)</option>
                                        <option value="2">2 Passes</option>
                                        <option value="1">1 Pass</option>
                                        <option value="0">0 Passes</option>
                                    </select>
                                </div>

                                {/* Eligibility Result Display */}
                                {eligibilityResult && (
                                    <div className={`col-span-full mt-2 p-4 rounded-xl border flex gap-4 items-center ${eligibilityResult === 'eligible'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        : 'bg-red-50 border-red-200 text-red-800'
                                        }`}>
                                        {eligibilityResult === 'eligible' ? (
                                            <>
                                                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                                <div>
                                                    <p className="font-bold">You are Eligible!</p>
                                                    <p className="text-sm">Your qualifications meet the entry requirements for this program.</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-red-600">cancel</span>
                                                <div>
                                                    <p className="font-bold">Requirements Not Met</p>
                                                    <p className="text-sm">You do not meet the minimum stream ({selectedCourse?.streamReq}) or passes ({selectedCourse?.minALPasses}) required for this program.</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Highest Qualification Obtained</label>
                                <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="High School Diploma / Bachelor's Degree" type="text" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Institution Name</label>
                                    <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="University of Example" type="text" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">GPA / Final Grade</label>
                                    <input className="w-full h-12 rounded-lg border-slate-200 text-slate-900 focus:ring-[#135bec] focus:border-[#135bec] transition-all px-4" placeholder="3.8 / 4.0" type="text" required />
                                </div>
                            </div>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">upload_file</span>
                                <p className="text-sm font-medium text-slate-700">Upload Academic Transcripts (PDF)</p>
                                <p className="text-xs text-slate-500 mt-1">Maximum file size: 5MB</p>
                                <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-[#135bec] hover:bg-slate-50 transition-colors" type="button">Choose Files</button>
                            </div>
                        </div>
                    </section>
                    {/* Bottom Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                        <div className="flex items-start gap-3">
                            <input className="mt-1 rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]" id="terms" type="checkbox" required />
                            <label className="text-xs text-slate-500" htmlFor="terms">
                                I agree to the <Link className="text-[#135bec] hover:underline" to="#">Terms &amp; Conditions</Link> and <Link className="text-[#135bec] hover:underline" to="#">Privacy Policy</Link> of CSBM Campus. I confirm that the information provided is accurate.
                            </label>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-8 py-3 rounded-lg font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors" type="button">
                                Save Draft
                            </button>
                            <button
                                className="flex-1 sm:flex-none px-8 py-3 rounded-lg font-bold text-white bg-[#135bec] hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/25 transition-all transform hover:-translate-y-0.5 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                                type="submit"
                                disabled={eligibilityResult !== 'eligible'}
                            >
                                Continue to Next Step
                            </button>
                        </div>
                    </div>
                </form>
                {/* Footer Help */}
                <footer className="mt-20 py-10 border-t border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                        <span className="material-symbols-outlined text-sm">contact_support</span>
                        <span className="text-sm">Need help with your application?</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <span className="material-symbols-outlined text-[#135bec] text-base">call</span>
                            +1 (234) 567-8910
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <span className="material-symbols-outlined text-[#135bec] text-base">mail</span>
                            admissions@csbm.edu
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <span className="material-symbols-outlined text-[#135bec] text-base">chat</span>
                            Live Admissions Chat
                        </div>
                    </div>
                    <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest">© 2024 CSBM Campus. All academic rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default StudentApplicationForm;
