import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const API_BASE = 'http://localhost:8080/api/courses';
const API_CHECK = 'http://localhost:8080/api/courses/check-eligibility';

const getCategoryStyle = (courseName) => {
  const name = (courseName || '').toLowerCase();
  if (name.includes('it') || name.includes('computing') || name.includes('software') || name.includes('cybersecurity') || name.includes('computer')) {
    return 'from-[#1e3a8a] to-[#3b82f6]'; // IT & Computing: blue gradient
  } else if (name.includes('business') || name.includes('management') || name.includes('accounting') || name.includes('finance')) {
    return 'from-[#14532d] to-[#22c55e]'; // Business: green gradient
  } else if (name.includes('engineering')) {
    return 'from-[#7c2d12] to-[#f97316]'; // Engineering: orange gradient
  }
  return 'from-slate-700 to-slate-400'; // Fallback
};

function CourseCatalog() {
  const navigate = useNavigate();
  const [applyModal, setApplyModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  // Eligibility Checker State
  const [eligibilityCourse, setEligibilityCourse] = useState('');
  const [stream, setStream] = useState('');
  const [passes, setPasses] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    loadCourses();
    const fetchApplied = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/applications/my-courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplied(data.map(c => c.courseId));
        }
      } catch { }
    };
    fetchApplied();
  }, []);

  const handleApplyNow = async (course) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('/api/applications/my-application', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const app = await res.json();
        // Since my previous backend fix changed 404 to 200 { application: null }
        if (!app || !app.status || app.status !== 'APPROVED') {
          setWarningModal(true);
          return;
        }
      } else {
        setWarningModal(true);
        return;
      }
    } catch {
      setWarningModal(true);
      return;
    }
    setSelectedCourse(course);
    setApplyModal(true);
  };

  const handleConfirmApply = async (course) => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/applications/apply-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: course.id || course._id,
          courseName: course.name,
          courseCode: course.code || course.courseCode,
          courseFee: course.courseFee || course.fee,
          intake: course.intakeStatus || 'Intake 2026'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplied(prev => [...prev, course.id || course._id]);
        setApplyModal(false);
        setSuccessMessage(`Successfully applied for ${course.name}!`);
        setTimeout(() => setSuccessMessage(''), 4000);
        window.dispatchEvent(new Event('courseApplied'));
      } else {
        alert(data.message || 'Application failed');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_BASE);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Automated Eligibility Check Function
  const handleCheckEligibility = async () => {
    if (!eligibilityCourse || !stream || !passes) {
      alert("Please select a Program, Stream, and Number of Passes first!");
      return;
    }

    setIsChecking(true);
    setEligibilityResult(null);

    try {
      const response = await axios.post(API_CHECK, {
        courseId: eligibilityCourse,
        stream: stream,
        passes: passes
      });
      setEligibilityResult(response.data);
    } catch (error) {
      console.error("Full error details:", error);

      // NUCLEAR DEBUGGER ERROR HANDLER
      if (error.response) {
        const errorData = typeof error.response.data === 'string'
          ? error.response.data.substring(0, 100)
          : JSON.stringify(error.response.data);

        alert(`HTTP Status: ${error.response.status}\n\nServer Said: ${errorData}`);
      } else {
        alert(`Network Error: ${error.message}`);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatFee = (fee) => {
    if (fee == null) return '—';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(Number(fee));
  };

  // Filter courses based on search AND category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.code || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Very basic category matching based on course name keywords (you can expand this)
    const matchesCategory =
      activeCategory === 'All Categories' ? true :
        activeCategory === 'IT & Computing' ? (course.name || '').toLowerCase().includes('it') || (course.name || '').toLowerCase().includes('computing') || (course.name || '').toLowerCase().includes('software') :
          activeCategory === 'Business' ? (course.name || '').toLowerCase().includes('business') || (course.name || '').toLowerCase().includes('management') :
            activeCategory === 'Engineering' ? (course.name || '').toLowerCase().includes('engineering') : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f6f6f8] text-slate-900 min-h-screen font-display">
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-green-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg text-sm">
          ✅ {successMessage}
        </div>
      )}
      
      {warningModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-black text-slate-900">Application Required</h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              You need to submit and get your application approved before enrolling in a course.
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => setWarningModal(false)} className="bg-slate-100 text-slate-700 rounded-full px-6 py-3 font-semibold hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={() => { setWarningModal(false); navigate('/apply'); }} className="bg-[#135bec] text-white rounded-full px-6 py-3 font-bold hover:bg-blue-700">
                Apply Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {applyModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#135bec] p-6 text-white">
              <h3 className="text-xl font-black">Course Application</h3>
              <p className="text-blue-100 text-sm mt-1">You are applying for:</p>
              <p className="text-white font-bold text-lg mt-1">{selectedCourse.name}</p>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Course Code</p>
                    <p className="text-slate-900 font-bold text-sm mt-1">{selectedCourse.code || selectedCourse.courseCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Course Fee</p>
                    <p className="text-slate-900 font-bold text-sm mt-1">{formatFee(selectedCourse.courseFee || selectedCourse.fee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Next Intake</p>
                    <p className="text-slate-900 font-bold text-sm mt-1">{formatDate(selectedCourse.intakeDate) || 'TBA'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Deadline</p>
                    <p className="text-slate-900 font-bold text-sm mt-1">{formatDate(selectedCourse.applicationDeadline) || 'TBA'}</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                By clicking "Confirm Application", you are enrolling in this course. This will be visible in your Student Dashboard.
              </p>
              {applied.includes(selectedCourse.id || selectedCourse._id) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-4 text-green-700 text-sm font-semibold text-center">
                  ✅ Already applied for this course
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => { setApplyModal(false); setSelectedCourse(null); }} className="bg-slate-100 text-slate-700 rounded-full px-6 py-3 font-semibold hover:bg-slate-200">
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmApply(selectedCourse)} 
                disabled={applying || applied.includes(selectedCourse.id || selectedCourse._id)}
                className={`rounded-full px-6 py-3 font-bold text-white transition ${applying || applied.includes(selectedCourse.id || selectedCourse._id) ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#135bec] hover:bg-blue-700'}`}
              >
                {applying ? 'Applying...' : applied.includes(selectedCourse.id || selectedCourse._id) ? '✓ Applied' : 'Confirm Application →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

          {/* HEADER */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 lg:px-10 py-3 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-8">
            </div>
            <div className="flex flex-1 justify-end gap-4 items-center">
              <Link to="/student-portal" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal hover:bg-[#135bec]/90 transition-all shadow-md">
                <span>Student Portal</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-8">

            {/* HERO SECTION */}
            <div className="flex flex-col gap-6 mb-10">
              <div>
                <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Academic Catalog</h1>
                <p className="text-slate-600 text-lg font-normal max-w-2xl mt-2">Discover your future path. Browse through our extensive range of accredited academic programs and specialized courses.</p>
              </div>
            </div>

            {/* UPGRADE: ELIGIBILITY CHECKER SECTION */}
            <div className="my-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-slate-900 font-bold text-xl mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">verified_user</span>
                Automated Eligibility Checker
              </h2>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-slate-600 text-sm font-medium mb-2">Select Program</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm cursor-pointer"
                    value={eligibilityCourse}
                    onChange={(e) => setEligibilityCourse(e.target.value)}
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-slate-600 text-sm font-medium mb-2">A/L Stream</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm cursor-pointer"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                  >
                    <option value="">Select Stream...</option>
                    <option value="Maths">Maths</option>
                    <option value="Bio">Biology</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-slate-600 text-sm font-medium mb-2">Results (Passes)</label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm cursor-pointer"
                    value={passes}
                    onChange={(e) => setPasses(e.target.value)}
                  >
                    <option value="">Number of Passes...</option>
                    <option value="3">3 Passes</option>
                    <option value="2">2 Passes</option>
                    <option value="1">1 Pass</option>
                    <option value="0">0 Passes</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckEligibility}
                  disabled={isChecking}
                  className="w-full md:w-auto bg-blue-600 text-white rounded-xl px-8 py-3 font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isChecking ? 'Checking...' : 'Check Status'}
                </button>
              </div>

              {/* Eligibility Result Display */}
              {eligibilityResult && (
                <div className={`${eligibilityResult.eligible ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border rounded-xl p-4 mt-4 font-semibold animate-fade-in`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {eligibilityResult.eligible ? '✅' : '❌'}
                    </div>
                    <div className="w-full">
                      <h3 className="text-lg font-bold">
                        {eligibilityResult.eligible ? 'Eligible to Apply!' : 'Not Eligible'}
                      </h3>
                      <p className={`mt-1 font-normal ${eligibilityResult.eligible ? 'text-green-800' : 'text-red-800'}`}>{eligibilityResult.reason}</p>

                      {eligibilityResult.eligible && eligibilityResult.courseFee && (
                        <div className="mt-4 inline-flex items-center bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                          <span className="text-slate-500 text-sm mr-2 font-medium">Total Course Fee: </span>
                          <span className="text-green-700 font-bold text-lg">{formatFee(eligibilityResult.courseFee)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CATALOG LAYOUT */}
            <div className="flex flex-col lg:flex-row gap-8">

              {/* FUNCTIONAL SIDEBAR */}
              <aside className="w-full lg:w-64 shrink-0 space-y-8">
                {/* Search Box moved to sidebar for cleaner UI */}
                <div>
                  <h3 className="text-slate-900 text-base font-bold mb-3">Search</h3>
                  <div className="flex w-full items-center rounded-lg shadow-sm border border-slate-200 bg-white overflow-hidden px-3 py-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm mr-2">search</span>
                    <input
                      className="w-full border-none bg-transparent focus:outline-none text-slate-900 text-sm"
                      placeholder="Course name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-slate-900 text-base font-bold mb-4">Categories</h3>
                  <div className="flex flex-col gap-2">
                    {['All Categories', 'IT & Computing', 'Business', 'Engineering'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === category ? 'bg-[#135bec] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* COURSE GRID */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm font-medium text-slate-600">Showing <span className="text-slate-900 font-bold">{filteredCourses.length}</span> programs</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#135bec]"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.length === 0 ? (
                      <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
                        <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">search_off</span>
                        <p className="text-slate-500 font-medium">No courses found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredCourses.map((course) => (
                        <div key={course.id || course.code} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">

                          {/* UPGRADE: Dynamic Intake Badges */}
                          <div className="absolute top-4 right-4 z-10">
                            {course.intakeStatus === 'OPEN' ? (
                              <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">Intake Open</span>
                            ) : course.intakeStatus === 'CLOSED' ? (
                              <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">Intake Closed</span>
                            ) : (
                              <span className="bg-slate-600 text-amber-400 border border-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">Coming Soon</span>
                            )}
                          </div>

                          <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${getCategoryStyle(course.name)}`}>
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 transition-transform group-hover:scale-110 duration-500">
                               <span className="material-symbols-outlined text-9xl text-white">school</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white font-black text-2xl tracking-widest drop-shadow-md">
                                {course.code || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 text-xl leading-tight mb-3 group-hover:text-[#135bec] transition-colors">{course.name}</h3>

                            {/* UPGRADE: Deadlines Display */}
                            <div className="space-y-2 mb-6">
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">event</span>
                                Next Intake: <strong className="ml-1 text-slate-800">{formatDate(course.intakeDate)}</strong>
                              </div>
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">schedule</span>
                                Deadline: <strong className="ml-1 text-slate-800">{formatDate(course.applicationDeadline)}</strong>
                              </div>
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Course Fee</span>
                                <span className="text-sm font-black text-slate-800">{formatFee(course.courseFee)}</span>
                              </div>

                              {course.intakeStatus === 'OPEN' ? (
                                <button onClick={() => handleApplyNow(course)} className="bg-[#135bec]/10 text-[#135bec] hover:bg-[#135bec] hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                                  Apply Now
                                </button>
                              ) : course.intakeStatus === 'UPCOMING' ? (
                                <button disabled className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                                  Apply Now
                                </button>
                              ) : (
                                <button disabled className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                                  Closed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-12 px-6 lg:px-10 mt-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-1">
                <p className="text-slate-500 text-sm leading-relaxed">Empowering the next generation of leaders through world-class education and innovation.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Resources</h4>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li><Link className="hover:text-[#135bec]" to="#">E-Library</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Academic Calendar</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Student Handbook</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Research Portal</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li><Link className="hover:text-[#135bec]" to="#">How to Apply</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Scholarships</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Campus Life</Link></li>
                  <li><Link className="hover:text-[#135bec]" to="#">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Connect</h4>
                <div className="flex gap-4 mb-6">
                  <Link className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#135bec] hover:text-white transition-colors" to="#">
                    <span className="material-symbols-outlined text-sm">public</span>
                  </Link>
                  <Link className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#135bec] hover:text-white transition-colors" to="#">
                    <span className="material-symbols-outlined text-sm">mail</span>
                  </Link>
                  <Link className="size-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-[#135bec] hover:text-white transition-colors" to="#">
                    <span className="material-symbols-outlined text-sm">call</span>
                  </Link>
                </div>
                <p className="text-xs text-slate-500">© 2024 CSBM Campus. All rights reserved.</p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}

export default CourseCatalog;