import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CourseCatalog from './CourseCatalog';
import WorkshopList from './WorkshopList';
import ApplicationForm from './ApplicationForm';

const calculateDaysUntil = (dateString) => {
  if (!dateString) return 0;
  const due = new Date(dateString);
  const now = new Date();
  const diffTime = due - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

const getWeekDays = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(monday.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString()
    };
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const panelTitles = {
  dashboard: 'Dashboard',
  apply: 'Apply Now',
  courses: 'Course Catalog',
  workshops: 'Events & Workshops',
  payments: 'Payment History',
  settings: 'Settings',
  support: 'Support'
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState('dashboard');

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [application, setApplication] = useState(null);
  const [appChecked, setAppChecked] = useState(false);
  const [appRefresh, setAppRefresh] = useState(0);

  const [myWorkshops, setMyWorkshops] = useState([]);
  const [workshopRefresh, setWorkshopRefresh] = useState(0);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleWorkshopRegistered = () => {
      setWorkshopRefresh(prev => prev + 1);
    };
    
    window.addEventListener('workshopRegistered', handleWorkshopRegistered);
    window.addEventListener('focus', handleWorkshopRegistered);
    
    const handleCourseApplied = () => {
      setAppRefresh(prev => prev + 1);
    };
    window.addEventListener('courseApplied', handleCourseApplied);
    
    return () => {
      window.removeEventListener('workshopRegistered', handleWorkshopRegistered);
      window.removeEventListener('focus', handleWorkshopRegistered);
      window.removeEventListener('courseApplied', handleCourseApplied);
    };
  }, []);

  useEffect(() => {
    const fetchMyWorkshops = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const res = await fetch('/api/workshops/my-registrations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMyWorkshops(data);
          } else {
            setMyWorkshops([]);
          }
        }
      } catch (err) {
        console.error('Workshops fetch error:', err);
      }
    };
    fetchMyWorkshops();
  }, [workshopRefresh]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const fetchSafely = async (endpoint, setter, defaultVal) => {
      try {
        const res = await fetch(endpoint, { headers });
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        if (!res.ok) {
          setter(defaultVal);
          return;
        }
        const data = await res.json();
        setter(data);
      } catch (err) {
        setter(defaultVal);
      }
    };

    const fetchApplication = async () => {
      try {
        const res = await fetch('/api/applications/my-application', { headers });
        if (res.status === 401) { navigate('/login'); return; }
        if (res.ok) {
          const data = await res.json();
          setApplication(data);
        }
      } catch {
      } finally {
        setAppChecked(true);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications/my-notifications', { headers });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) { }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchSafely('/api/users/profile', setUser, null),
        fetchSafely('/api/courses/enrolled', setCourses, []),
        fetchSafely('/api/assignments/upcoming', setAssignments, []),
        fetchSafely('/api/schedule/weekly', setSchedule, []),
        fetchApplication(),
        fetchNotifications(),
      ]);
      setLoading(false);
    };

    fetchAll();
  }, [navigate, appRefresh]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="flex flex-col items-center animate-pulse">
          {/* Skeleton Loaders */}
          <div className="w-full max-w-5xl rounded-3xl h-64 bg-slate-200 mb-8" />
          <div className="w-full max-w-5xl grid grid-cols-4 gap-8 mb-12">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
          </div>
          <p className="mt-4 text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  // Helper for Nav items
  const NavItem = ({ panel, icon, label }) => {
    const isActive = activePanel === panel;
    if (isActive) {
      return (
        <button 
          onClick={() => setActivePanel(panel)}
          className="flex items-center gap-3 px-6 py-3 w-full text-left rounded-xl transition-all duration-200 text-blue-700 font-bold border-l-4 border-blue-600 bg-blue-50/50"
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span>{label}</span>
        </button>
      );
    }
    return (
      <button 
        onClick={() => setActivePanel(panel)}
        className="flex items-center gap-3 px-6 py-3 w-full text-left rounded-xl transition-all duration-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50"
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase();
  };

  const payments = [];

  // PANELS
  const DashboardContent = () => (
    <section className="p-6 lg:p-12 space-y-12 max-w-[1600px] mx-auto w-full">
      
      {/* ROW 1: HERO BANNER */}
      <div className="relative rounded-3xl p-8 lg:p-12 overflow-hidden shadow-xl min-h-[360px] flex items-center" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)' }}>
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase mb-6">STUDENT PORTAL</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight font-headline">Master Your Academic Journey</h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">Your centralized hub for learning resources, course management, and institutional communications at CSBM Campus.</p>
          <button 
            onClick={() => setActivePanel('courses')}
            className="flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            View Dashboard <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Floating Elements */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[400px] h-full pointer-events-none">
          <div className="absolute top-1/4 right-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-float" style={{ animationDelay: '-2s' }}>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-black text-xl flex items-center justify-center">
              {user?.gpa ? user.gpa.toFixed(2) : 'N/A'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">CURRENT GPA</p>
              <p className="text-sm font-black text-slate-900">Distinction Rank</p>
            </div>
          </div>
          <div className="absolute bottom-1/4 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-float z-10" style={{ animationDelay: '-4s' }}>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 font-black text-xl flex items-center justify-center">
              {courses?.length || 0}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">ACTIVE COURSES</p>
              <p className="text-sm font-black text-slate-900">Current Term</p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group" onClick={() => setActivePanel('courses')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <span className="text-xs font-bold text-green-600 px-2 py-1 bg-green-50 rounded-lg">+0.25 pt</span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">GPA Score</p>
          <p className="text-3xl font-black text-slate-900 font-headline">{user?.gpa ? user.gpa.toFixed(2) : 'N/A'}</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group" onClick={() => setActivePanel('courses')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>import_contacts</span>
            </div>
            <span className="text-xs font-bold text-slate-500 px-2 py-1 bg-slate-50 rounded-lg">Full Time</span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Active Courses</p>
          <p className="text-3xl font-black text-slate-900 font-headline">{String(courses?.length || 0).padStart(2, '0')}</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group" onClick={() => setActivePanel('workshops')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <span className="text-xs font-bold text-red-500 px-2 py-1 bg-red-50 rounded-lg">
              {myWorkshops.filter(w => (w.status||'').toLowerCase() === 'pending').length} Pending
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Workshops</p>
          <p className="text-3xl font-black text-slate-900 font-headline">{String(myWorkshops?.length || 0).padStart(2, '0')}</p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group" onClick={() => setActivePanel('apply')}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mt-1.5 mr-1" style={{ backgroundColor: application?.status === 'APPROVED' ? '#10b981' : application?.status === 'REJECTED' ? '#ef4444' : application ? '#eab308' : '#cbd5e1' }}></span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Enrollment Status</p>
          <p className="text-xl font-black font-headline truncate" style={{ color: application?.status === 'APPROVED' ? '#10b981' : application?.status === 'REJECTED' ? '#ef4444' : application ? '#eab308' : '#64748b' }}>
            {application?.status?.toUpperCase() || 'N/A'}
          </p>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
        </div>
      </div>

      {/* ROW 3: MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Course Progress */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 font-headline">Course Progress</h3>
              <button onClick={() => setActivePanel('courses')} className="text-blue-600 font-bold text-sm hover:underline">Full Analytics</button>
            </div>
            
            <div className="space-y-6">
              {courses && courses.length > 0 ? (
                courses.map((course, idx) => {
                  const colors = ['blue', 'purple', 'cyan', 'orange'];
                  const cName = colors[idx % colors.length];
                  const bgClassMap = {
                    'blue': 'bg-blue-600', 'purple': 'bg-purple-600',
                    'cyan': 'bg-cyan-500', 'orange': 'bg-orange-500'
                  };
                  const textClassMap = {
                     'blue': 'text-blue-600', 'purple': 'text-purple-600',
                     'cyan': 'text-cyan-600', 'orange': 'text-orange-600'
                  };
                  return (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-900">{course.name}</span>
                        <span className={`font-black ${textClassMap[cName]}`}>{course.progress || 0}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bgClassMap[cName]}`} style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-medium">📚 No courses enrolled yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 font-headline mb-8">Weekly Schedule</h3>
            
            <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-8">
              {weekDays.map((day, idx) => (
                <div key={idx} className={
                  day.isToday 
                    ? "p-2 sm:p-4 rounded-xl bg-blue-600 text-white text-center shadow-lg -translate-y-2 flex flex-col justify-center transition-all"
                    : "p-2 sm:p-4 rounded-xl bg-slate-50 text-center border-t-4 border-slate-200 flex flex-col justify-center"
                }>
                  <span className={`text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 ${day.isToday ? 'text-white/80' : 'text-slate-500'}`}>{day.name.toUpperCase()}</span>
                  <span className="text-base sm:text-lg font-black font-headline leading-none">{day.date}</span>
                  {day.isToday && <div className="hidden sm:block w-1.5 h-1.5 bg-white rounded-full mx-auto mt-2"></div>}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {schedule && schedule.length > 0 ? (
                schedule.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-xl bg-blue-50/50">
                    <span className="text-sm font-black text-blue-600 sm:w-24 shrink-0">{item.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.subject}</p>
                      <p className="text-xs text-slate-500 truncate">{item.room} {item.teacher ? `• ${item.teacher}` : ''}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 rounded-xl bg-slate-50 opacity-60 h-[80px]">
                  <span className="text-sm font-black text-slate-300 sm:w-24 shrink-0">--:--</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-300">No classes scheduled</p>
                    <p className="text-xs text-slate-300">Enjoy your free time!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-12">
          
          {/* Application Status Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            {application?.status === 'APPROVED' ? (
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-500">
                <span className="material-symbols-outlined text-[3rem]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            ) : application?.status === 'REJECTED' ? (
               <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6 text-red-500">
                <span className="material-symbols-outlined text-[3rem]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              </div>
            ) : application ? (
              <div className="w-24 h-24 rounded-full bg-yellow-50 flex items-center justify-center mb-6 text-yellow-500">
                <span className="material-symbols-outlined text-[3rem]" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-400">
                <span className="material-symbols-outlined text-[3rem]" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
              </div>
            )}
            
            <h3 className="text-xl font-black text-slate-900 mb-2 font-headline">Application Status</h3>
            
            <p className={`font-black text-sm tracking-widest uppercase mb-4 ${
              application?.status === 'APPROVED' ? 'text-green-500' :
              application?.status === 'REJECTED' ? 'text-red-500' :
              application ? 'text-yellow-500' : 'text-slate-400'
            }`}>
              {application?.status === 'APPROVED' ? 'APPROVED' :
               application?.status === 'REJECTED' ? 'NOT APPROVED' :
               application ? 'UNDER REVIEW' : 'NOT SUBMITTED'}
            </p>

            <p className="text-sm text-slate-500 mb-8 px-2 leading-relaxed">
              {application?.status === 'APPROVED' ? "Your admission has been processed successfully. Welcome!" :
               application?.status === 'REJECTED' ? "Please contact admissions for more information." :
               application ? "Your application is being reviewed by our team." :
               "Submit your application to begin."}
            </p>

            <button 
              onClick={() => setActivePanel('apply')}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                application?.status === 'APPROVED' ? 'bg-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white' :
                application?.status === 'REJECTED' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' :
                application ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' :
                'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {application?.status === 'APPROVED' ? 'Download Letter' :
               application?.status === 'REJECTED' ? 'View Details' :
               application ? 'Track Status' : 'Apply Now'}
            </button>
          </div>

          {/* Upcoming Workshops */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 sm:p-10 rounded-2xl shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-6 font-headline relative z-10">Upcoming Workshops</h3>
            
            <div className="space-y-3 relative z-10">
              {myWorkshops && myWorkshops.length > 0 ? (
                myWorkshops.slice(0, 2).map((reg, idx) => {
                  const workshop = reg.workshop || reg;
                  const title = workshop.title || workshop.topic || reg.workshopTitle || 'Workshop';
                  const dateObj = (workshop.date || reg.workshopDate) ? new Date(workshop.date || reg.workshopDate) : null;
                  const month = dateObj ? dateObj.toLocaleString('en-US', { month: 'short' }) : 'TBA';
                  const day = dateObj ? dateObj.getDate() : '--';
                  const typeStr = workshop.type || (idx==0 ? 'Virtual Session' : 'Interactive Seminar');

                  return (
                     <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white transition" onClick={() => setActivePanel('workshops')}>
                      <div className={`flex flex-col items-center text-white rounded-lg px-2 py-1 min-w-[50px] ${idx === 0 ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                        <span className="text-[10px] font-bold uppercase">{month}</span>
                        <span className="text-lg font-black leading-none font-headline">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{typeStr}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 rounded-xl text-center py-6">
                  <p className="text-slate-400 text-sm font-medium">📅 No upcoming workshops</p>
                </div>
              )}
            </div>

            <span className="material-symbols-outlined absolute -bottom-6 -right-6 opacity-10 rotate-12 text-black pointer-events-none" style={{ fontSize: '10rem', fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
          </div>

        </div>
      </div>

      {/* ROW 4: BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
        
        {/* Recent Payments */}
        <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-8 font-headline">Recent Payments</h3>
          
          <div className="space-y-6">
            {payments && payments.length > 0 ? (
              payments.slice(0,3).map((pmt, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-slate-500">{idx % 2 === 0 ? 'receipt_long' : 'menu_book'}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{pmt.desc || 'Fee Payment'}</p>
                      <p className="text-xs text-slate-500">{formatDate(pmt.date)}</p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900 whitespace-nowrap">LKR {pmt.amount ? pmt.amount.toLocaleString() : '0'}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                 <p className="text-slate-400 font-medium">No payment history yet</p>
              </div>
            )}
          </div>

          <button onClick={() => setActivePanel('payments')} className="w-full mt-10 text-blue-600 font-bold text-sm py-4 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition">
            View All Billing History
          </button>
        </div>

        {/* Quick Actions & Library */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setActivePanel('apply')} className="aspect-square bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group cursor-pointer border border-transparent hover:border-blue-100 hover:bg-blue-600">
              <span className="material-symbols-outlined text-3xl text-blue-600 group-hover:text-white transition-colors">cloud_upload</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">Apply Now</span>
            </div>
            <div onClick={() => setActivePanel('courses')} className="aspect-square bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group cursor-pointer border border-transparent hover:border-purple-100 hover:bg-purple-600">
              <span className="material-symbols-outlined text-3xl text-purple-600 group-hover:text-white transition-colors">school</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">My Courses</span>
            </div>
            <div onClick={() => setActivePanel('payments')} className="aspect-square bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group cursor-pointer border border-transparent hover:border-orange-100 hover:bg-orange-500">
              <span className="material-symbols-outlined text-3xl text-orange-500 group-hover:text-white transition-colors">payments</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">Pay Fees</span>
            </div>
            <div onClick={() => setActivePanel('support')} className="aspect-square bg-white shadow-sm rounded-2xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all group cursor-pointer border border-transparent hover:border-cyan-100 hover:bg-cyan-500">
              <span className="material-symbols-outlined text-3xl text-cyan-500 group-hover:text-white transition-colors">forum</span>
              <span className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">Support</span>
            </div>
          </div>

          {/* Digital Library */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 sm:p-10 rounded-2xl text-white shadow-xl flex flex-col justify-between hidden md:flex">
            <div>
              <h3 className="text-2xl font-black mb-2 font-headline">Digital Library</h3>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Access 50,000+ e-books and academic journals for free.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex items-center gap-3">
                <span className="material-symbols-outlined">menu_book</span>
                <span className="text-xs font-bold text-white">IEEE Journals 2024</span>
              </div>
              <button className="w-full bg-white text-blue-700 font-black py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                Browse Resources
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );

  const PaymentHistoryContent = () => (
    <div className="p-8">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Payment History</h2>
      <p className="text-slate-500 mb-8">View all your transactions and invoices.</p>
      {payments.length > 0 ? (
        payments.map((p, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 mb-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-slate-900">{p.itemName}</p>
              <p className="text-slate-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900">
                LKR {p.amount?.toLocaleString()}
              </p>
              <span className={`text-xs font-bold ${p.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {p.status?.toUpperCase()}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
          <div className="text-5xl mb-4">💳</div>
          <p className="font-bold text-slate-900">No Payments Yet</p>
          <p className="text-slate-400 text-sm mt-2">Your payment history will appear here.</p>
        </div>
      )}
    </div>
  );

  const SettingsContent = () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Settings</h2>
      <p className="text-slate-500 mb-8">Manage your account preferences.</p>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-600 text-sm font-semibold block mb-2">Full Name</label>
            <input 
              value={user?.name || ''}
              readOnly
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 text-sm"
            />
          </div>
          <div>
            <label className="text-slate-600 text-sm font-semibold block mb-2">Email</label>
            <input 
              value={user?.email || ''}
              readOnly
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 text-sm"
            />
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-8 bg-red-50 text-red-600 border border-red-200 rounded-xl px-6 py-3 font-semibold text-sm hover:bg-red-100 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );

  const SupportContent = () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Support</h2>
      <p className="text-slate-500 mb-8">Get help from our team.</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="font-bold text-slate-900">Email Support</h3>
          <p className="text-slate-500 text-sm mt-2">support@csbm.edu.lk</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="font-bold text-slate-900">Phone Support</h3>
          <p className="text-slate-500 text-sm mt-2">+94 11 234 5678</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen font-sans bg-[#faf8ff]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
        .font-headline { font-family: 'Manrope', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-20px) }
          100% { transform: translateY(0px) }
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite 
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(10px) }
          to { opacity: 1; transform: translateX(0) }
        }
      `}</style>
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white shadow-sm border-r border-slate-100 flex flex-col z-40 hidden lg:flex font-body text-sm">
        <div className="p-8 flex items-center gap-3">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpLsLK2RrVg0HygqAJShfasdM7y8U7lKRFBiLsVSIuh1S3KuMQFlcH4RnnyIAI4R0Q64SJ32WS74canoe8M7gtPQuLExWhbIFfX0_rgzNLdFNN8v-i6Qabn3PlwYDOHL__3imQMmJ3Oh8ZUNUBKcmnBN56yWVRMcIPEVT1Ntu-2mBef1GZyLCAPmy1epjCe_5o_bk3W6twoTn1-RxY4b1mm3S-x4RHRCBiXpVggLpOPopXa9cVlxQegRQyIkT2Lh4eAFMJEN09Dqo" alt="CSBM Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-black text-blue-800 font-headline leading-none">CSBM <br/>Campus</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto w-full">
          <NavItem panel="dashboard" icon="dashboard" label="Dashboard" />
          <NavItem panel="apply" icon="school" label="Apply Now" />
          <NavItem panel="courses" icon="calendar_today" label="Course Catalog" />
          <NavItem panel="workshops" icon="event" label="Events &amp; Workshops" />
          <NavItem panel="payments" icon="payments" label="Payment History" />
          <NavItem panel="settings" icon="settings" label="Settings" />
          <NavItem panel="support" icon="help_outline" label="Support" />
        </nav>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen bg-[#faf8ff] font-body w-full">
        
        {/* TOP NAVBAR */}
        <header className="sticky top-0 h-20 bg-white/80 backdrop-blur-md z-30 w-full flex justify-between items-center px-6 lg:px-12 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 hidden sm:block">
              Good Morning, {user?.name?.split(' ')[0] || 'Student'}
            </h2>
            <span className="text-xs text-slate-400 font-medium ml-2 hidden sm:inline-block">/ {panelTitles[activePanel]}</span>
          </div>
          
          <div className="relative group max-w-md flex-1 mx-4 sm:mx-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-full focus:ring-2 focus:ring-blue-200 text-sm outline-none" 
              placeholder="Search courses, grades, or files..." 
              type="text" 
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-slate-900">{user?.name || 'Student'}</p>
                  <p className="text-xs text-slate-500">{user?.program || 'Program'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                  {getInitials(user?.name)}
                </div>
              </div>

              {/* LOGOUT / PROFILE DROPDOWN */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <button onClick={() => { setShowDropdown(false); setActivePanel('settings'); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition font-medium">My Profile</button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div key={activePanel} style={{ animation: 'fadeSlideIn 0.3s ease forwards' }} className="w-full flex-1">
          {activePanel === 'dashboard' && <DashboardContent />}
          {activePanel === 'apply' && <div className="p-8"><ApplicationForm /></div>}
          {activePanel === 'courses' && <div className="p-0"><CourseCatalog /></div>}
          {activePanel === 'workshops' && <div className="p-0"><WorkshopList /></div>}
          {activePanel === 'payments' && <PaymentHistoryContent />}
          {activePanel === 'settings' && <SettingsContent />}
          {activePanel === 'support' && <SupportContent />}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
