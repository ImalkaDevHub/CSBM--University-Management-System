import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './components/Logo';

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

// ─── Application Status Card (FIX 1) ────────────────────────────────────────
const ApplicationStatusCard = ({ application, navigate }) => {
  if (!application) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
        <span className="text-2xl">📋</span>
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium">No application submitted yet.</p>
        </div>
        <button
          onClick={() => navigate('/admissions')}
          className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
        >
          Apply Now →
        </button>
      </div>
    );
  }

  const status = application.status; // PENDING | APPROVED | REJECTED

  const config = {
    PENDING: {
      icon: '🕐',
      iconBg: 'bg-yellow-50',
      badge: 'PENDING REVIEW',
      badgeCls: 'bg-yellow-100 text-yellow-700',
      title: 'Application Under Review',
      desc: 'Your application is being reviewed by our admissions team.',
    },
    APPROVED: {
      icon: '✅',
      iconBg: 'bg-green-50',
      badge: 'APPROVED',
      badgeCls: 'bg-green-100 text-green-700',
      title: 'Application Approved! 🎉',
      desc: `Congratulations! Your application for ${application.courseName || application.programName || 'your course'} has been approved.`,
    },
    REJECTED: {
      icon: '❌',
      iconBg: 'bg-red-50',
      badge: 'NOT APPROVED',
      badgeCls: 'bg-red-100 text-red-700',
      title: 'Application Not Approved',
      desc: 'Please contact admissions for more information.',
    },
  };

  const c = config[status] || config['PENDING'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-start gap-4">
        <div className={`${c.iconBg} rounded-full p-3 text-2xl shrink-0`}>{c.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className={`${c.badgeCls} text-xs font-bold rounded-full px-3 py-1`}>{c.badge}</span>
          </div>
          <p className="font-bold text-slate-900">{c.title}</p>
          <p className="text-slate-500 text-sm mt-1">{c.desc}</p>
          {application.applicationDate && (
            <p className="text-slate-400 text-xs mt-1">
              Submitted on {formatDate(application.applicationDate || application.createdAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── My Course Application Card (FIX 4) ─────────────────────────────────────
const MyCourseApplicationCard = ({ application, navigate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return application?.courseName ? (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex justify-between items-start">
        <div>
          {/* Course type badge */}
          <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold">
            {application.courseCode || application.programType || 'COURSE'}
          </span>
          {/* Course name */}
          <p className="font-bold text-slate-900 text-lg mt-2">
            {application.courseName || application.programName}
          </p>
          {/* Applied date */}
          <p className="text-slate-400 text-xs mt-1">
            Applied on {formatDate(application.courseAppliedAt || application.submittedAt || application.createdAt)}
          </p>
          {/* Course fee */}
          {application.courseFee && (
            <p className="text-slate-500 text-sm mt-1">
              Fee: LKR {Number(application.courseFee).toLocaleString()}
            </p>
          )}
        </div>
        {/* Status badge */}
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${application.status === 'APPROVED' ? 'bg-green-100 text-green-700' : application.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {application.status?.toUpperCase() || 'PENDING'}
        </span>
      </div>
      {/* Enrolled banner if approved */}
      {application.status === 'APPROVED' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-4">
          <p className="text-green-700 text-sm font-semibold text-center">
            ✅ You are enrolled in this program. Welcome to CSBM!
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6 text-center">
      <p className="text-slate-400 text-sm">
        📚 No course applied yet.
      </p>
      <button onClick={() => navigate('/courses')} className="text-blue-600 font-semibold text-sm mt-2 inline-block">
        Browse Courses →
      </button>
    </div>
  );
};

// ─── My Registered Workshops Section (FIX 3) ────────────────────────────────
const MyWorkshopsSection = ({ workshops, navigate }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
      <h3 className="font-bold text-slate-900 text-lg mb-4">
        My Registered Workshops
      </h3>
      
      {workshops.length > 0 ? (
        <div className="flex flex-col gap-3">
          {workshops.map((reg, index) => {
            // Handle both populated and unpopulated
            const workshop = reg.workshop || reg;
            const title = 
              workshop.title || 
              workshop.topic || 
              reg.workshopTitle ||
              'Workshop';
            const date = 
              workshop.date || 
              reg.workshopDate
                ? new Date(
                    workshop.date || reg.workshopDate
                  ) 
                : null;
            const time = 
              workshop.time || 
              reg.workshopTime || '';
            const location = 
              workshop.location || 
              workshop.venue ||
              reg.workshopVenue ||
              'Main Auditorium';
            const status = 
              reg.status || 'confirmed';

            return (
              <div key={reg._id || index}
                className="flex items-center gap-4 
                  p-4 bg-slate-50 rounded-xl 
                  border border-slate-100 mb-3">
                
                {/* Date block */}
                <div className="bg-blue-600 text-white 
                  rounded-xl p-3 text-center 
                  min-w-[56px] flex-shrink-0">
                  <div className="text-xs font-semibold 
                    uppercase">
                    {date 
                      ? date.toLocaleString('default', 
                          { month: 'short' }) 
                      : 'TBD'}
                  </div>
                  <div className="text-xl font-black">
                    {date ? date.getDate() : '--'}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold 
                    text-slate-900 text-sm truncate">
                    {title}
                  </p>
                  <p className="text-slate-400 
                    text-xs mt-1">
                    {time && `${time} • `}{location}
                  </p>
                </div>

                {/* Status */}
                <span className={`flex-shrink-0 
                  rounded-full px-3 py-1 
                  text-xs font-bold uppercase
                  ${status === 'confirmed' || 
                    status === 'approved' ||
                    status === 'Registered'
                    ? 'bg-green-100 text-green-700'
                    : status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-slate-400 text-sm">
            No workshops registered yet.
          </p>
          <button
            onClick={() => navigate('/workshops')}
            className="text-blue-600 font-semibold 
              text-sm mt-2 inline-block 
              hover:underline">
            Browse Workshops →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // FIX 1 & 4 — Application
  const [application, setApplication] = useState(null);
  const [appChecked, setAppChecked] = useState(false);
  const [appRefresh, setAppRefresh] = useState(0);

  // FIX 3 — Registered Workshops
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [workshopRefresh, setWorkshopRefresh] = useState(0);

  // INBOX / NOTIFICATIONS
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // Listen for workshop registration event
    const handleWorkshopRegistered = () => {
      console.log('Workshop registered! Refreshing...');
      setWorkshopRefresh(prev => prev + 1);
    };
    
    window.addEventListener('workshopRegistered', handleWorkshopRegistered);
    // Also refresh when page gets focus
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
        
        console.log('Fetching my workshops...');
        const res = await fetch('/api/workshops/my-registrations', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Workshops Status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('My workshops response:', data);
          if (Array.isArray(data) && data.length > 0) {
            setMyWorkshops(data);
          } else {
            console.log('API returned empty workshops array');
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
        // 404 → application stays null (friendly empty state)
      } catch {
        // silent fail
      } finally {
        setAppChecked(true);
      }
    };

    const fetchMyWorkshops = async () => {
      try {
        const res = await fetch('/api/workshops/my-registrations', { headers });
        if (res.ok) {
          const data = await res.json();
          setMyWorkshops(data);
        }
      } catch {
        setMyWorkshops([]);
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
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#135bec]/20 border-t-[#135bec] rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="relative flex h-auto min-h-screen w-full font-display">
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[#f6f6f8]">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center lg:hidden gap-3">
            <span className="material-symbols-outlined cursor-pointer">menu</span>
            <Logo className="h-8" />
          </div>
          <div className="hidden md:flex flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-[#135bec]/50 transition-all text-sm"
                placeholder="Search courses, resources..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
               onClick={() => setActiveTab(activeTab === 'notifications' ? 'dashboard' : 'notifications')} 
               className={`p-2 rounded-lg relative transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                 <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:block text-slate-900">
                {user?.name ? user.name : 'Student'}
              </span>
              <span className="material-symbols-outlined text-slate-400">expand_more</span>
            </div>
          </div>
        </header>

        {activeTab === 'notifications' ? (
          <div className="p-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
                  <p className="text-slate-500 mt-1 font-medium">Stay updated with your latest campus alerts.</p>
               </div>
               <button onClick={() => setActiveTab('dashboard')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full">
                  ← Back to Dashboard
               </button>
            </div>

            <div className="bg-white border flex-col flex border-slate-200 rounded-3xl overflow-hidden shadow-sm min-h-[400px]">
               {notifications.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
                     <span className="material-symbols-outlined text-5xl mb-4 opacity-50">inbox</span>
                     <p className="font-semibold text-slate-600">No notifications yet</p>
                     <p className="text-sm mt-1 text-center">We'll let you know when there's an update.</p>
                  </div>
               ) : (
                  <div className="divide-y divide-slate-100">
                     {notifications.map(n => (
                        <div 
                           key={n._id} 
                           className={`p-6 transition-colors hover:bg-slate-50 ${!n.isRead ? 'bg-[#135bec]/5' : 'bg-white'}`}
                           onClick={async () => {
                              if (!n.isRead) {
                                 // Mark as read
                                 try {
                                    await fetch(`/api/notifications/${n._id}/read`, { 
                                       method: 'PUT', 
                                       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
                                    });
                                    setNotifications(prev => prev.map(notif => notif._id === n._id ? { ...notif, isRead: true } : notif));
                                 } catch (err) {}
                              }
                           }}
                        >
                           <div className="flex items-start gap-4">
                              <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                                 n.type === 'approval' ? 'bg-green-100 text-green-600' :
                                 n.type.includes('reminder') ? 'bg-amber-100 text-amber-600' : 
                                 'bg-blue-100 text-blue-600'
                              }`}>
                                 <span className="material-symbols-outlined text-[20px]">
                                    {n.type === 'approval' ? 'check_circle' : n.type.includes('reminder') ? 'error' : 'campaign'}
                                 </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start gap-2 mb-1">
                                    <h4 className={`text-base truncate ${!n.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                       {n.subject}
                                    </h4>
                                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap pt-1">
                                       {formatDate(n.createdAt)}
                                    </span>
                                 </div>
                                 <p className={`text-sm ${!n.isRead ? 'text-slate-600 font-medium' : 'text-slate-500'} break-words whitespace-pre-wrap`} dangerouslySetInnerHTML={{ __html: n.message }}></p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        ) : (
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {user?.name ? `Welcome back, ${user.name}` : 'Welcome back!'}
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                {user?.program || 'Your Program'} — {user?.semester || 'Current Semester'}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm min-w-[200px]">
                <div className="size-12 rounded-lg bg-[#135bec]/10 flex items-center justify-center text-[#135bec]">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current GPA</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {user?.gpa > 0 ? user.gpa.toFixed(2) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">

              {/* FIX 1 — Application Status Card */}
              {appChecked && (
                <ApplicationStatusCard application={application} navigate={navigate} />
              )}

              {/* FIX 4 — My Course Application */}
              {application && (
                <MyCourseApplicationCard application={application} navigate={navigate} />
              )}

              {/* Course Progress */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900">Course Progress</h3>
                  <button className="text-[#135bec] text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="p-6 space-y-6">
                  {courses && courses.length > 0 ? (
                    courses.map((course, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700">{course.name}</span>
                          <span className="font-bold text-slate-900">{course.progress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full">
                          <div
                            className="h-full bg-[#135bec] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                      <p className="font-medium text-slate-500">📚 No courses enrolled yet.</p>
                      <p className="text-xs mt-1 text-center">
                        Your course progress will appear here once<br />you are enrolled.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Upcoming Assignments */}
              <section className="space-y-4">
                <h3 className="font-bold text-lg px-2 text-slate-900">Upcoming Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments && assignments.length > 0 ? (
                    assignments.map((assignment, idx) => {
                      const daysUntil = calculateDaysUntil(assignment.dueDate);
                      const isUrgent = daysUntil <= 3;
                      const bgClass = isUrgent ? 'bg-orange-100' : 'bg-blue-100';
                      const textClass = isUrgent ? 'text-orange-600' : 'text-blue-600';
                      const icon = isUrgent ? 'assignment_late' : 'description';

                      return (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                          <div className={`size-10 rounded-lg ${bgClass} ${textClass} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined">{icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold ${textClass} uppercase mb-1`}>
                              Due in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                            </p>
                            <h4 className="font-bold text-slate-900 truncate">{assignment.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{assignment.course}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-8 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <p className="font-medium text-slate-500">📝 No upcoming assignments.</p>
                      <p className="text-xs mt-1">Your assignments will appear here when added.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* FIX 3 — My Registered Workshops */}
              <MyWorkshopsSection workshops={myWorkshops} navigate={navigate} />

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Weekly Schedule */}
              <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900">Weekly Schedule</h3>
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    {weekDays.map((day, idx) => (
                      <div
                        key={idx}
                        className={`text-center px-2 py-1 ${day.isToday ? 'bg-[#135bec] text-white rounded-lg' : 'text-slate-900'}`}
                      >
                        <p className={`text-xs font-bold uppercase ${day.isToday ? 'opacity-80' : 'text-slate-400'}`}>{day.name}</p>
                        <p className="text-sm font-bold mt-1">{day.date}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {schedule && schedule.length > 0 ? (
                      schedule.map((item, idx) => (
                        <div key={idx} className="relative pl-4 border-l-4 border-[#135bec] bg-[#135bec]/5 p-3 rounded-r-lg">
                          <p className="text-xs font-bold text-[#135bec]">{item.time}</p>
                          <p className="text-sm font-bold mt-1 text-slate-900">{item.subject}</p>
                          <p className="text-xs text-slate-500">{item.room}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                        <p className="font-medium text-slate-500">📅 No classes scheduled for this week.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Library Resources */}
              <section className="bg-[#135bec] p-6 rounded-xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-4">Library Resources</h3>
                <p className="text-sm opacity-90 mb-6">
                  Access digital journals, e-books, and research databases instantly.
                </p>
                <button className="w-full py-3 bg-white text-[#135bec] font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">
                  Access Digital Library
                </button>
              </section>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
