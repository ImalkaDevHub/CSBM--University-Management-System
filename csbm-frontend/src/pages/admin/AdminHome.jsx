import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import student1Img   from '../../assets/student-1.png';
import faculty1Img   from '../../assets/faculty-1.png';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, value, label, trend, trendColor }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
    <div className="flex items-start gap-4">
      <div className={`${iconBg} rounded-xl p-3 text-2xl shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-3xl font-black text-slate-900 leading-none">
          {value ?? <span className="text-slate-300 text-xl">—</span>}
        </p>
        <p className="text-slate-500 text-sm mt-1">{label}</p>
        <p className={`${trendColor} text-xs mt-1 font-medium`}>{trend}</p>
      </div>
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const statusStyle = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'approved') return 'bg-green-100 text-green-700';
  if (s === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── Mock people data for visual lists ────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 'ST-2024-001', name: 'Amara Perera',       dept: 'BSc in Computer Science',     date: '18 Apr 2026', img: student1Img },
  { id: 'ST-2024-002', name: 'Ruwini Jayasinghe',  dept: 'Diploma in IT',                date: '17 Apr 2026', img: student1Img },
  { id: 'ST-2024-003', name: 'Kavindu Bandara',    dept: 'HND in Engineering',           date: '15 Apr 2026', img: student1Img },
];

const MOCK_FACULTY = [
  { id: 'FAC-001', name: 'Dr. Senali Fernando',  dept: 'Department of Computing',     role: 'Senior Lecturer',  img: faculty1Img },
  { id: 'FAC-002', name: 'Prof. Dilini Rodrigo', dept: 'School of Business',          role: 'Associate Professor', img: faculty1Img },
  { id: 'FAC-003', name: 'Dr. Nimal Wickrama',   dept: 'Faculty of Engineering',      role: 'Head of Department', img: faculty1Img },
];

const QUICK_ACTIONS = [
  { icon: '👥', label: 'Review Applications', path: '/admin-dashboard/approvals' },
  { icon: '➕', label: 'Add New Course',       path: '/admin-dashboard/courses' },
  { icon: '📅', label: 'Schedule Intake',      path: '/admin-dashboard/intake' },
  { icon: '🎪', label: 'Create Workshop',       path: '/admin-dashboard/workshops' },
  { icon: '📊', label: 'View Analytics',        path: '/admin-dashboard/analytics' },
  { icon: '👤', label: 'Manage Users',          path: '/admin-dashboard/users' },
];

const AdminHome = () => {
  const navigate = useNavigate();

  // Profile
  const [adminName, setAdminName] = useState('Admin');
  // Stats
  const [stats, setStats] = useState({ students: null, applications: null, courses: null, workshops: null });
  // Data
  const [recentApps, setRecentApps] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentWorkshopRegs, setRecentWorkshopRegs] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchSafe = async (url, fallback) => {
    try {
      const res = await fetch(url, { headers: authHeaders() });
      if (res.status === 401) { navigate('/login'); return fallback; }
      if (!res.ok) return fallback;
      return await res.json();
    } catch { return fallback; }
  };

  const fetchAll = async () => {
    const [profile, students, applications, courses, workshops, apps, chart, workshopRegs] = await Promise.all([
      fetchSafe('/api/users/profile', null),
      fetchSafe('/api/admin/stats/students', null),
      fetchSafe('/api/admin/stats/applications', null),
      fetchSafe('/api/admin/stats/courses', null),
      fetchSafe('/api/admin/stats/workshops', null),
      fetchSafe('/api/applications/admin?limit=5&sort=latest', []),
      fetchSafe('/api/admin/stats/applications-chart', []),
      fetchSafe('/api/admin/workshops/recent-registrations', []),
    ]);

    if (profile) setAdminName(profile.name || 'Admin');
    setStats({
      students: students?.total ?? '—',
      applications: applications?.pending ?? '—',
      courses: courses?.total ?? '—',
      workshops: workshops?.total ?? '—',
    });
    setRecentApps(Array.isArray(apps) ? apps.slice(0, 5) : []);
    setChartData(Array.isArray(chart) ? chart : []);
    setRecentWorkshopRegs(Array.isArray(workshopRegs) ? workshopRegs : []);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mt-2 mb-8">
        <h1 className="text-2xl font-black text-slate-900">Welcome back, {adminName} 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening at CSBM today.</p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon="👥" iconBg="bg-blue-50"
          value={stats.students} label="Total Students"
          trend="+12 this month" trendColor="text-green-600"
        />
        <StatCard
          icon="📋" iconBg="bg-yellow-50"
          value={stats.applications} label="Pending Applications"
          trend="Needs review" trendColor="text-yellow-600"
        />
        <StatCard
          icon="📚" iconBg="bg-green-50"
          value={stats.courses} label="Active Courses"
          trend="Across all programs" trendColor="text-slate-400"
        />
        <StatCard
          icon="🎪" iconBg="bg-purple-50"
          value={stats.workshops} label="Upcoming Workshops"
          trend="Next 30 days" trendColor="text-slate-400"
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Applications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Recent Applications</h2>
            <Link to="/admin-dashboard/approvals" className="text-blue-600 text-sm font-semibold hover:underline">
              View All →
            </Link>
          </div>
          {recentApps.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentApps.map((app, i) => (
                <div key={app.id || app._id || i} className="flex items-center gap-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(app.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-sm">{app.fullName}</p>
                    <p className="text-slate-400 text-xs truncate">{app.email}</p>
                    <p className="text-slate-500 text-xs truncate">{app.courseName || app.programName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`${statusStyle(app.status)} rounded-full px-2.5 py-1 text-xs font-bold block mb-1`}>
                      {(app.status || 'PENDING').toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-[10px]">{formatDate(app.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No applications yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer block"
              >
                <span className="text-2xl">{action.icon}</span>
                <p className="font-semibold text-slate-700 text-sm mt-2 leading-tight">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Applications Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Applications Overview</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                />
                <Bar dataKey="applications" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-300">
              <p className="text-sm">No data available yet.</p>
            </div>
          )}
        </div>

        {/* Recent Workshop Registrations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Workshop Registrations</h2>
          {recentWorkshopRegs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentWorkshopRegs.map((reg, i) => (
                <div key={reg._id || i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{reg.workshopName || reg.topic || reg.title || 'Workshop'}</p>
                    <p className="text-slate-400 text-xs">{formatDate(reg.date || reg.workshopDate)}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold">
                    {reg.count ?? reg.registrations ?? 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No registrations yet.</p>
          )}
        </div>
      </div>
      {/* ── People Highlights Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Recent Enrollments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent Enrollments</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">+3 this week</span>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_STUDENTS.map((s) => (
              <div key={s.id} className="flex items-center gap-4 py-3">
                {/* Circular real photo */}
                <img
                  src={s.img}
                  alt={s.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{s.name}</p>
                  <p className="text-slate-400 text-xs truncate">{s.dept}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Enrolled</p>
                  <p className="text-slate-600 text-xs font-semibold">{s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Highlights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Faculty Highlights</h2>
            <Link to="/admin-dashboard/users" className="text-blue-600 text-sm font-semibold hover:underline">View All →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_FACULTY.map((f) => (
              <div key={f.id} className="flex items-center gap-4 py-3">
                {/* Circular real photo */}
                <img
                  src={f.img}
                  alt={f.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{f.name}</p>
                  <p className="text-slate-400 text-xs truncate">{f.dept}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
                  {f.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;
