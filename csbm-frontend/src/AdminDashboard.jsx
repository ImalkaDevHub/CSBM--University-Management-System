import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate, Link } from 'react-router-dom';
import Logo from './components/Logo';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Table, Tag, Button, DatePicker, Modal, message, App,
  Card, Statistic, Row, Col, Calendar, Badge,
  Form, Input, TimePicker, Progress, Divider, Tabs, Select,
  Drawer, Pagination, Popconfirm, Tooltip
} from 'antd';
import {
  ClockCircleOutlined, CalendarOutlined, EditOutlined,
  PlusOutlined, DeleteOutlined, DownloadOutlined,
  MailOutlined, PieChartOutlined, CheckCircleOutlined,
  DashboardOutlined, TeamOutlined, BookOutlined,
  ScheduleOutlined, BarChartOutlined, FormOutlined,
  SearchOutlined, EyeOutlined, HistoryOutlined,
  BellOutlined, FileTextOutlined, FileExcelOutlined,
  EnvironmentOutlined, FilterOutlined,
  TableOutlined, CloseCircleOutlined, CreditCardOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import PaymentManagement from './admin/PaymentManagement';
import { useAuth } from './context/AuthContext';




// ─── Shared Helpers ──────────────────────────────────────────────────────────
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

const getStatusColor = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'upcoming' || s === 'open') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'completed' || s === 'published' || s === 'active') return 'bg-green-50 text-green-700 border-green-200';
  if (s === 'draft') return 'bg-slate-50 text-slate-600 border-slate-200';
  if (s === 'closing soon') return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

// ─── Reusable Components ─────────────────────────────────────────────────────

const PageWrapper = ({ title, subtitle, children }) => (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
);

const ComingSoon = ({ title, subtitle }) => (
    <PageWrapper title={title} subtitle={subtitle}>
      <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-slate-900">Under Development</h2>
        <p className="text-slate-400 text-sm mt-2">This section is coming soon.</p>
      </div>
    </PageWrapper>
);

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

// ─── Sub-Page Components ─────────────────────────────────────────────────────

const DashboardHome = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [stats, setStats] = useState({ students: null, applications: null, courses: null, workshops: null });
  const [recentApps, setRecentApps] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentWorkshopRegs, setRecentWorkshopRegs] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profile, students, applications, courses, workshops, apps, chart, workshopRegs] = await Promise.all([
          axios.get('/api/users/profile', { headers: authHeaders() }).catch(() => null),
          axios.get('/api/admin/stats/students', { headers: authHeaders() }).catch(() => null),
          axios.get('/api/admin/stats/applications', { headers: authHeaders() }).catch(() => null),
          axios.get('/api/admin/stats/courses', { headers: authHeaders() }).catch(() => null),
          axios.get('/api/admin/stats/workshops', { headers: authHeaders() }).catch(() => null),
          axios.get('/api/applications/admin?limit=5&sort=latest', { headers: authHeaders() }).catch(() => ({ data: [] })),
          axios.get('/api/admin/stats/applications-chart', { headers: authHeaders() }).catch(() => ({ data: [] })),
          axios.get('/api/admin/workshops/recent-registrations', { headers: authHeaders() }).catch(() => ({ data: [] })),
        ]);

        if (profile) setAdminName(profile.data.name || 'Admin');
        setStats({
          students: students?.data.total ?? '—',
          applications: applications?.data.pending ?? '—',
          courses: courses?.data.total ?? '—',
          workshops: workshops?.data.total ?? '—',
        });
        setRecentApps(Array.isArray(apps.data) ? apps.data.slice(0, 5) : []);
        setChartData(Array.isArray(chart.data) ? chart.data : []);
        setRecentWorkshopRegs(Array.isArray(workshopRegs.data) ? workshopRegs.data : []);
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, []);

  return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">Welcome back, {adminName} 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening at CSBM today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard icon="👥" iconBg="bg-blue-50" value={stats.students} label="Total Students" trend="+12 this month" trendColor="text-green-600" />
          <StatCard icon="📋" iconBg="bg-yellow-50" value={stats.applications} label="Pending Applications" trend="Needs review" trendColor="text-yellow-600" />
          <StatCard icon="📚" iconBg="bg-green-50" value={stats.courses} label="Active Courses" trend="Across all programs" trendColor="text-slate-400" />
          <StatCard icon="🎪" iconBg="bg-purple-50" value={stats.workshops} label="Upcoming Workshops" trend="Next 30 days" trendColor="text-slate-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Recent Applications</h2>
              <Link to="/admin-dashboard/approvals" className="text-blue-600 text-sm font-semibold hover:underline">View All →</Link>
            </div>
            {recentApps.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentApps.map((app, i) => (
                      <div key={app._id || i} className="flex items-center gap-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">{getInitials(app.fullName)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate text-sm">{app.fullName}</p>
                          <p className="text-slate-400 text-xs truncate">{app.email}</p>
                          <p className="text-slate-500 text-xs truncate">{app.courseName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`${statusStyle(app.status)} rounded-full px-2.5 py-1 text-xs font-bold block mb-1`}>{(app.status || 'PENDING').toUpperCase()}</span>
                          <span className="text-slate-400 text-[10px]">{formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                  ))}
                </div>
            ) : <p className="text-slate-400 text-sm text-center py-8">No applications yet.</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '👥', label: 'Review Applications', path: '/admin-dashboard/approvals' },
                { icon: '➕', label: 'Add New Course', path: '/admin-dashboard/courses' },
                { icon: '📅', label: 'Schedule Intake', path: '/admin-dashboard/intake' },
                { icon: '🎪', label: 'Create Workshop', path: '/admin-dashboard/workshops' },
              ].map(action => (
                  <Link key={action.path} to={action.path} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left hover:bg-blue-50 hover:border-blue-200 transition">
                    <span className="text-2xl">{action.icon}</span>
                    <p className="font-semibold text-slate-700 text-sm mt-2">{action.label}</p>
                  </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Applications Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="applications" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Workshop Registrations</h2>
            {recentWorkshopRegs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentWorkshopRegs.map((reg, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div><p className="font-semibold text-slate-900 text-sm">{reg.workshopName}</p><p className="text-slate-400 text-xs">{formatDate(reg.date)}</p></div>
                        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-bold">{reg.count}</span>
                      </div>
                  ))}
                </div>
            ) : <p className="text-slate-400 text-sm text-center py-8">No registrations yet.</p>}
          </div>
        </div>
      </div>
  );
};

const StudentApprovalsPage = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message: messageApi } = App.useApp();

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/applications/admin?status=${filter === 'All' ? '' : filter}&search=${search}`, { headers: authHeaders() });
      setApps(res.data);
      setLoading(false);
    } catch (err) {
      messageApi.error("Failed to fetch applications");
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApps();
    }, 300);
    return () => clearTimeout(timer);
  }, [filter, search]);

  const handleApprove = async (id) => {
    const appId = id || (typeof id === 'string' ? id : null);
    if (!appId) {
      console.error("Cannot approve: Application ID is undefined");
      messageApi.error("Error: Application ID missing");
      return;
    }

    try {
      await axios.put(`/api/applications/${appId}/approve`, {}, { headers: authHeaders() });
      messageApi.success("Application approved successfully!");
      setApps(prev => prev.map(a => (a._id === appId || a.id === appId) ? { ...a, status: 'APPROVED' } : a));
      if (selectedApp && (selectedApp._id === appId || selectedApp.id === appId)) {
        setSelectedApp(prev => ({ ...prev, status: 'APPROVED' }));
      }
    } catch (err) {
      messageApi.error("Action failed. Please try again.");
    }
  };

  const handleReject = async (id) => {
    const appId = id || (typeof id === 'string' ? id : null);
    if (!appId) {
      console.error("Cannot reject: Application ID is undefined");
      messageApi.error("Error: Application ID missing");
      return;
    }

    try {
      await axios.put(`/api/applications/${appId}/reject`, {}, { headers: authHeaders() });
      messageApi.error("Application rejected.");
      setApps(prev => prev.map(a => (a._id === appId || a.id === appId) ? { ...a, status: 'REJECTED' } : a));
      if (selectedApp && (selectedApp._id === appId || selectedApp.id === appId)) {
        setSelectedApp(prev => ({ ...prev, status: 'REJECTED' }));
      }
    } catch (err) {
      messageApi.error("Action failed. Please try again.");
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  return (
      <div className="-m-6">

        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Student Application Management</h1>
            <p className="text-slate-500 text-sm mt-1">Review, approve, and manage incoming applications.</p>
          </div>
          <div className="flex gap-3">
            <input
                type="text"
                placeholder="Search student or course..."
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm w-64 focus:border-blue-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                onClick={() => navigate('/admin-dashboard/analytics')}
                className="bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-100"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Filter Tabs Row */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div className="flex gap-2">
            {['All', 'Pending', 'Approved', 'Rejected'].map(t => (
                <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                        filter === t ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {t}
                </button>
            ))}
          </div>
          <button className="bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50">
            ⊿ More Filters
          </button>
        </div>

        {/* Table Container */}
        <div className="mx-8 mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-200 grid grid-cols-5 px-6 py-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Info</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Program / Intake</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Docs Status</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="px-6 py-5 flex items-center gap-4">
                        <div className="bg-slate-50 rounded-xl h-16 w-full animate-pulse" />
                      </div>
                  ))
              ) : apps.length > 0 ? (
                  apps.map(app => (
                      // Robust key handling using _id or id
                      <div key={app._id || app.id} className="grid grid-cols-5 px-6 py-5 hover:bg-slate-50 transition items-center">
                        {/* Student Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {getInitials(app.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{app.fullName}</p>
                            <p className="text-slate-400 text-xs truncate">{app.email}</p>
                            {app.nicFileName ? (
                                <p className="text-slate-400 text-xs mt-0.5">NIC: Verified</p>
                            ) : (
                                <span className="bg-yellow-50 text-yellow-600 text-[10px] rounded px-2 py-0.5 font-bold inline-block mt-0.5">NIC: PENDING</span>
                            )}
                          </div>
                        </div>

                        {/* Program / Intake */}
                        <div className="pr-4">
                          <p className={`font-semibold text-sm truncate ${app.courseName ? 'text-blue-600 hover:underline cursor-pointer' : 'text-slate-400 italic'}`}>
                            {app.courseName || 'Not Specified'}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="bg-slate-100 text-slate-600 text-[10px] rounded-full px-2 py-0.5 font-bold">Intake 2026</span>
                            <span className="text-slate-400 text-[10px] self-center">{formatDate(app.createdAt)}</span>
                          </div>
                        </div>

                        {/* Docs Status */}
                        <div>
                          {app.nicFileName && app.birthCertFileName && app.passportPhotoFileName ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 w-fit">
                        ✓ Submitted
                      </span>
                          ) : (
                              <span className="bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-[10px] font-bold flex items-center gap-1 w-fit">
                        ✗ Missing Docs
                      </span>
                          )}
                        </div>

                        {/* Status */}
                        <div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black border uppercase tracking-wider ${
                        app.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                            app.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {app.status || 'PENDING'}
                    </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                              // Use app._id with fallback to app.id
                              onClick={() => handleApprove(app._id || app.id)}
                              title="Approve"
                              disabled={app.status === 'APPROVED'}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${
                                  app.status === 'APPROVED' ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50 border-slate-200' :
                                      'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                              }`}
                          >
                            ✓
                          </button>
                          <button
                              // Use app._id with fallback to app.id
                              onClick={() => handleReject(app._id || app.id)}
                              title="Reject"
                              disabled={app.status === 'REJECTED'}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${
                                  app.status === 'REJECTED' ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-50 border-slate-200' :
                                      'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              }`}
                          >
                            ✗
                          </button>
                          <button
                              onClick={() => openDetails(app)}
                              className="bg-blue-600 text-white rounded-full px-4 py-1.5 text-[10px] font-bold hover:bg-blue-700 transition flex items-center gap-1 shadow-md shadow-blue-50"
                          >
                            👁 Details
                          </button>
                        </div>
                      </div>
                  ))
              ) : (
                  /* Empty State */
                  <div className="p-16 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-xl font-bold text-slate-900">No Applications Found</h2>
                    <p className="text-slate-400 text-sm mt-2">No applications match your current filter.</p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {isModalOpen && selectedApp && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>

                <div className="mb-8 pr-12">
                  <h2 className="font-black text-slate-900 text-xl uppercase tracking-tight">Application Details</h2>
                  <p className="text-slate-400 text-sm mt-1">Detailed view for student ID: {selectedApp._id || selectedApp.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Col */}
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Student Information</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Full Name', value: selectedApp.fullName },
                        { label: 'Email Address', value: selectedApp.email },
                        { label: 'Phone Number', value: selectedApp.mobileNumber || '—' },
                        { label: 'Address', value: selectedApp.address || '—' },
                      ].map(f => (
                          <div key={f.label}>
                            <p className="text-[10px] text-slate-400 mb-0.5 uppercase font-bold">{f.label}</p>
                            <p className="text-sm font-semibold text-slate-900">{f.value}</p>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Col */}
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Program Details</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Program Applied', value: selectedApp.courseName || '—', color: 'text-blue-600' },
                        { label: 'Admission Intake', value: 'Intake 2026' },
                        { label: 'Submission Date', value: formatDate(selectedApp.createdAt) },
                      ].map(f => (
                          <div key={f.label}>
                            <p className="text-[10px] text-slate-400 mb-0.5 uppercase font-bold">{f.label}</p>
                            <p className={`text-sm font-semibold ${f.color || 'text-slate-900'}`}>{f.value}</p>
                          </div>
                      ))}
                      <div>
                        <p className="text-[10px] text-slate-400 mb-0.5 uppercase font-bold">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                            selectedApp.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                selectedApp.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                      {selectedApp.status || 'PENDING'}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Bottom Actions */}
                <div className="flex gap-3 mt-10 border-t border-slate-100 pt-6">
                  {selectedApp.status !== 'APPROVED' && (
                      <button
                          // Use _id with fallback to id
                          onClick={() => handleApprove(selectedApp._id || selectedApp.id)}
                          className="bg-green-600 text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-green-700 transition"
                      >
                        ✓ Approve Application
                      </button>
                  )}
                  {selectedApp.status !== 'REJECTED' && (
                      <button
                          // Use _id with fallback to id
                          onClick={() => handleReject(selectedApp._id || selectedApp.id)}
                          className="bg-red-600 text-white rounded-full px-6 py-3 font-bold text-sm hover:bg-red-700 transition"
                      >
                        ✗ Reject Application
                      </button>
                  )}
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-slate-100 text-slate-600 rounded-full px-6 py-3 font-bold text-sm hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

const IntakeSchedulerPage = ({ intakes, setIntakes, courses }) => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [newDeadline, setNewDeadline] = useState(null);
  const [addForm] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const fetchIntakes = async () => {
    setLoading(true);
    // Simulation
    setTimeout(() => setLoading(false), 500);
  };

  useEffect(() => { fetchIntakes(); }, []);

  const handleExtend = (record) => { 
    setSelectedIntake(record); 
    setNewDeadline(dayjs(record.applicationDeadline));
    setIsModalVisible(true); 
  };

  const handleClose = (id) => {
    Modal.confirm({
      title: 'Close Intake?',
      content: 'Are you sure you want to close this intake? This will stop all new applications.',
      okText: 'Yes, Close',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const updated = intakes.map(i => i.id === id ? { ...i, status: 'Closed' } : i);
        setIntakes(updated);
        messageApi.success("Intake closed successfully");
      }
    });
  };

  const saveDeadline = async () => {
    if (!newDeadline) return messageApi.error("Pick a date!");
    const updatedIntakes = intakes.map(i => 
      i.id === selectedIntake.id ? { ...i, applicationDeadline: newDeadline.format('YYYY-MM-DD'), status: i.status === 'Closed' ? 'Open' : i.status } : i
    );
    setIntakes(updatedIntakes);
    messageApi.success("Deadline Extended!");
    setIsModalVisible(false);
  };

  const handleAddIntake = (values) => {
    const newIntake = {
      id: `i${intakes.length + 1}`,
      courseName: values.course,
      intakeName: values.intakeName,
      intakeDate: values.intakeDate.format('YYYY-MM-DD'),
      applicationDeadline: values.deadline.format('YYYY-MM-DD'),
      capacity: values.capacity,
      filled: values.registrations || 0,
      status: values.status || 'Upcoming',
      venue: values.venue,
      notes: values.notes
    };
    setIntakes([...intakes, newIntake]);
    messageApi.success("New intake added successfully!");
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const filteredIntakes = intakes.filter(i => {
    const matchesSearch = (i.courseName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (i.intakeName || '').toLowerCase().includes(search.toLowerCase()) ||
                        (i.venue || '').toLowerCase().includes(search.toLowerCase());
    const statusText = i.status === 'Open' && dayjs(i.applicationDeadline).diff(dayjs(), 'day') <= 7 ? 'Closing Soon' : i.status;
    const matchesFilter = filter === 'All' || statusText === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusDisplay = (deadline, status, capacity, filled) => {
    const today = dayjs();
    const dead = dayjs(deadline);
    const diff = dead.diff(today, 'day');

    if (status === 'Draft') return { label: 'Draft', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (filled >= capacity || diff < 0 || status === 'Closed') return { label: 'Closed', color: 'text-red-600 bg-red-50 border-red-100' };
    if (diff <= 7 && diff >= 0) return { label: 'Closing Soon', color: 'text-orange-600 bg-orange-50 border-orange-100' };
    return { label: 'Open', color: 'text-green-600 bg-green-50 border-green-100' };
  };

  const stats = {
    active: intakes.filter(i => (i.status === 'Open' || i.status === 'Closing Soon') && dayjs(i.applicationDeadline).isAfter(dayjs())).length,
    closing: intakes.filter(i => {
      const diff = dayjs(i.applicationDeadline).diff(dayjs(), 'day');
      return diff <= 7 && diff >= 0 && i.status !== 'Closed';
    }).length,
    upcoming: intakes.filter(i => i.status === 'Upcoming' || i.status === 'Draft').length,
    capacity: intakes.reduce((acc, i) => acc + i.capacity, 0)
  };

  return (
    <div className="-m-6 bg-slate-50 min-h-screen pb-12 font-sans text-slate-900">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Intake Scheduler</h1>
          <p className="text-slate-500 text-sm mt-1">Schedule and manage student intake periods and deadlines.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by course, intake, or venue..."
              className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-3 text-sm w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            type="primary" 
            shape="round" 
            size="large" 
            icon={<PlusOutlined />} 
            className="bg-blue-600 shadow-xl shadow-blue-100 font-bold px-8 h-12 border-none hover:scale-105 transition-transform"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add Intake
          </Button>
          <Button shape="circle" size="large" icon={<DownloadOutlined />} className="border-slate-200 text-slate-500 hover:text-blue-600 shadow-sm" />
        </div>
      </div>

      {/* 2. Filter & View Toggle Row */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-[89px] z-10">
        <div className="flex gap-3">
          {['All', 'Open', 'Closing Soon', 'Upcoming', 'Closed', 'Draft'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                filter === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-6 py-2 text-xs font-black rounded-xl transition-all duration-300 flex items-center gap-2 ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <TableOutlined /> TABLE VIEW
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-2 text-xs font-black rounded-xl transition-all duration-300 flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <CalendarOutlined /> CALENDAR VIEW
            </button>
          </div>
          <Button shape="round" icon={<FilterOutlined />} className="border-slate-200 text-slate-600 font-bold px-6">
            More Filters
          </Button>
        </div>
      </div>

      <div className="px-8 mt-8 space-y-8 max-w-[1600px] mx-auto">
        {/* 3. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Active Intakes', value: stats.active, icon: <CheckCircleOutlined />, color: 'bg-green-50 text-green-600', sub: 'Accepting apps' },
            { label: 'Closing Soon', value: stats.closing, icon: <ClockCircleOutlined />, color: 'bg-orange-50 text-orange-600', sub: 'Urgent attention' },
            { label: 'Upcoming', value: stats.upcoming, icon: <CalendarOutlined />, color: 'bg-blue-50 text-blue-600', sub: 'In pipeline' },
            { label: 'Total Capacity', value: stats.capacity, icon: <TeamOutlined />, color: 'bg-slate-50 text-slate-600', sub: 'Across all active' }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform shadow-sm`}>{card.icon}</div>
                <div className="flex flex-col items-end">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-widest">{card.sub}</span>
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{card.value}</h3>
              <p className="text-slate-500 font-bold text-sm mt-3">{card.label}</p>
            </div>
          ))}
        </div>

        {/* 4. Main List/Calendar Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-0 shadow-sm overflow-hidden">
          {viewMode === 'table' ? (
            <>
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-black text-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Active Intake Catalog</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage registration timelines, capacity levels, and enrollment status.</p>
                </div>
                <Pagination simple defaultCurrent={1} total={filteredIntakes.length} pageSize={10} />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-y border-slate-100">
                      <th className="pl-8 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program / Intake</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enrollment</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intake Schedule</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="pl-4 pr-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredIntakes.map(item => {
                      const status = getStatusDisplay(item.applicationDeadline, item.status, item.capacity, item.filled);
                      const isUrgent = dayjs(item.applicationDeadline).diff(dayjs(), 'day') <= 7 && status.label !== 'Closed';
                      
                      return (
                        <tr key={item.id} className="hover:bg-blue-50/10 transition-colors group">
                          <td className="pl-8 pr-4 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                {(item.courseName || 'I').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{item.intakeName}</p>
                                <p className="text-slate-400 text-[11px] mt-1 font-bold">{item.courseName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                             <div className="w-40">
                                <div className="flex justify-between text-[10px] font-black mb-1.5">
                                  <span className="text-slate-700">{item.filled} / {item.capacity} Seats</span>
                                  <span className={item.filled >= item.capacity ? 'text-red-500' : 'text-blue-600'}>
                                    {Math.round((item.filled / item.capacity) * 100)}%
                                  </span>
                                </div>
                                <Progress 
                                  percent={(item.filled / item.capacity) * 100} 
                                  showInfo={false} 
                                  strokeColor={item.filled >= item.capacity ? '#ef4444' : '#2563eb'} 
                                  trailColor="#f1f5f9"
                                  size="small"
                                />
                             </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-sm">{dayjs(item.intakeDate).format('DD MMM YYYY')}</span>
                              <span className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-widest">{item.venue || 'Main Campus'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex flex-col">
                              <span className={`font-black text-sm ${isUrgent ? 'text-orange-600' : 'text-slate-700'}`}>
                                {dayjs(item.applicationDeadline).format('DD MMM YYYY')}
                              </span>
                              {isUrgent && (
                                <span className="text-[10px] font-black text-orange-500 uppercase mt-1">
                                  {dayjs(item.applicationDeadline).diff(dayjs(), 'day') < 0 ? 'Lapsed' : `Closes in ${dayjs(item.applicationDeadline).diff(dayjs(), 'day')} days`}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="pl-4 pr-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Tooltip title="View Details"><Button size="small" shape="circle" icon={<EyeOutlined />} /></Tooltip>
                               <Tooltip title="Extend Deadline"><Button size="small" shape="circle" icon={<HistoryOutlined />} className="text-blue-600" onClick={() => handleExtend(item)} /></Tooltip>
                               <Tooltip title="Edit Intake"><Button size="small" shape="circle" icon={<EditOutlined />} onClick={() => { setSelectedIntake(item); addForm.setFieldsValue({ ...item, course: item.courseName, intakeDate: dayjs(item.intakeDate), deadline: dayjs(item.applicationDeadline) }); setIsAddModalVisible(true); }} /></Tooltip>
                               <Tooltip title="Close Intake"><Button size="small" shape="circle" danger icon={<CloseCircleOutlined />} onClick={() => handleClose(item.id)} /></Tooltip>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredIntakes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-24 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">📅</div>
                            <h3 className="text-xl font-black text-slate-900">No intakes found</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Try adjusting your filters or search term to see more results.</p>
                            <Button className="mt-8 px-8 font-bold" shape="round" onClick={() => { setFilter('All'); setSearch(''); }}>Clear All</Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-12 min-h-[600px] bg-white">
              <div className="max-w-4xl mx-auto space-y-12">
                {[5, 6, 7, 8, 9, 10].map(m => {
                  const monthIntakes = filteredIntakes.filter(i => dayjs(i.intakeDate).month() === m);
                  if (monthIntakes.length === 0 && filter !== 'All') return null;
                  
                  return (
                    <div key={m} className="flex gap-12 group/month">
                      <div className="w-32 pt-2 border-r border-slate-100">
                        <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">{dayjs().month(m).format('MMMM')}</p>
                        <p className="text-4xl font-black text-slate-200 group-hover/month:text-slate-900 transition-colors">2026</p>
                      </div>
                      <div className="flex-1 space-y-4 pb-8">
                        {monthIntakes.length > 0 ? (
                          monthIntakes.map(item => (
                            <div key={item.id} className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all group/card relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                              <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center shadow-sm border border-slate-100 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all">
                                    <span className="text-[10px] font-black uppercase">{dayjs(item.intakeDate).format('MMM')}</span>
                                    <span className="text-2xl font-black leading-none">{dayjs(item.intakeDate).date()}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-black text-slate-900">{item.intakeName}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                      <span className="text-xs font-bold text-slate-400">{item.courseName}</span>
                                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{item.venue}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-8">
                                   <div className="text-right">
                                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Seats Filled</p>
                                      <p className="font-black text-slate-800">{item.filled} / {item.capacity}</p>
                                   </div>
                                   <Tag color={dayjs(item.applicationDeadline).diff(dayjs(), 'day') <= 7 ? 'orange' : 'blue'} className="px-4 py-1 rounded-full font-black border-none shadow-sm capitalize">
                                      {item.status}
                                   </Tag>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-[2px] bg-slate-50 w-full mt-8 rounded-full opacity-20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Extend Deadline Modal */}
      <Modal 
        title={
          <div className="pr-8">
            <h2 className="font-headline text-xl font-bold text-slate-900">Extend Application Deadline</h2>
            <p className="font-body text-xs text-slate-500 mt-0.5 font-normal">Adjust the closing date for this intake period.</p>
          </div>
        }
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)} className="px-6 h-10 text-sm font-semibold text-on-surface hover:bg-slate-50 rounded-full transition-colors border-none">
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={saveDeadline} className="px-8 h-10 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
            Confirm Extension
          </Button>
        ]}
        className="premium-modal"
        width={480}
        centered
      >
        <div className="py-2 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Closing Date</p>
              <p className="font-headline font-bold text-on-surface text-lg">{selectedIntake ? dayjs(selectedIntake.applicationDeadline).format('DD MMMM YYYY') : '—'}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-50">
              <CalendarOutlined style={{ fontSize: '20px' }} />
            </div>
          </div>
          <div className="space-y-1.5 px-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Extension Date</p>
            <DatePicker 
              value={newDeadline}
              onChange={setNewDeadline} 
              className="w-full h-12 rounded-xl" 
              placeholder="Select new closing date"
            />
          </div>
          <p className="text-xs text-slate-400 italic px-1">* Extension will notify all pending applicants for this program automatically.</p>
        </div>
      </Modal>

      {/* Add Intake Modal */}
      <Modal 
        title={
          <div className="pr-8">
            <h2 className="font-bold text-slate-900">Schedule New Intake</h2>
            <p className="font-body text-sm text-slate-500 mt-1 font-normal">Define the registration timeline and capacity for the upcoming academic period.</p>
          </div>
        }
        open={isAddModalVisible} 
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={700}
        className="premium-modal"
        destroyOnHidden
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddIntake} className="mt-6">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="course" label="Target Program" rules={[{ required: true }]}>
                <Select options={courses.map(c => ({ value: c.name, label: c.name }))} placeholder="Select program" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="intakeName" label="Intake Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. June 2026" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="intakeDate" label="Commencement Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deadline" label="Application Deadline" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
                <Input type="number" placeholder="50" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Initial Status" initialValue="Upcoming">
                <Select options={[{value:'Open', label:'Open'}, {value:'Upcoming', label:'Upcoming'}, {value:'Draft', label:'Draft'}]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="venue" label="Primary Venue">
                <Input placeholder="Main Campus" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Scheduler Notes">
            <Input.TextArea rows={3} placeholder="Additional details or special instructions..." />
          </Form.Item>

          <div className="flex items-center justify-end gap-4 pt-6 mt-4 border-t border-slate-100">
            <Button onClick={() => setIsAddModalVisible(false)} className="px-6 h-11 text-sm font-semibold text-on-surface hover:bg-slate-50 rounded-full transition-colors">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="px-8 h-11 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              Schedule Intake
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

const ManageWorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/workshops', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkshops(Array.isArray(data) ? data : data.workshops || []);
      }
    } catch (err) {
      console.error('Fetch workshops error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkshops(); }, []);

  const handleAdd = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const url = isEditMode ? `/api/workshops/${selectedWorkshop._id || selectedWorkshop.id}` : '/api/workshops';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          title: values.topic,
          date: values.date.format('YYYY-MM-DD'),
          time: values.time.format('HH:mm'),
          location: values.venue,
          maxCapacity: values.capacity
        })
      });

      if (res.ok) {
        messageApi.success(`Workshop ${isEditMode ? 'Updated' : 'Created'}!`);
        setIsModalVisible(false);
        form.resetFields();
        await fetchWorkshops();
      }
    } catch (err) {
      messageApi.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/workshops/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        messageApi.success('Deleted!');
        await fetchWorkshops();
      }
    } catch (err) { messageApi.error('Delete failed'); }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'completed': return 'text-slate-500 bg-slate-50 border-slate-100';
      case 'full': return 'text-red-600 bg-red-50 border-red-100';
      case 'draft': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const filteredWorkshops = workshops.filter(w => {
    const matchesSearch = (w.topic || w.title || '').toLowerCase().includes(search.toLowerCase()) ||
                        (w.speaker || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: workshops.length,
    upcoming: workshops.filter(w => w.status === 'Upcoming').length,
    full: workshops.filter(w => w.status === 'Full').length,
    registrations: workshops.reduce((acc, w) => acc + (w.registrations || 0), 0)
  };

  return (
    <div className="-m-6 bg-slate-50 min-h-screen pb-12 font-sans text-slate-900">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Workshops</h1>
          <p className="text-slate-500 text-sm mt-1">Create, schedule, and manage campus workshops.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search workshops..."
              className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-3 text-sm w-80 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            type="primary" 
            shape="round" 
            size="large" 
            icon={<PlusOutlined />} 
            className="bg-blue-600 shadow-xl shadow-blue-100 font-bold px-8 h-12 border-none hover:scale-105 transition-transform"
            onClick={() => { setIsEditMode(false); form.resetFields(); setIsModalVisible(true); }}
          >
            Add Workshop
          </Button>
          <Button shape="circle" size="large" icon={<DownloadOutlined />} className="border-slate-200 text-slate-500 hover:text-blue-600 shadow-sm" />
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-[89px] z-10">
        <div className="flex gap-3">
          {['All', 'Upcoming', 'Completed', 'Full', 'Draft'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                filter === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button shape="round" icon={<FilterOutlined />} className="border-slate-200 text-slate-600 font-bold px-6">
          More Filters
        </Button>
      </div>

      <div className="px-8 mt-8 space-y-8 max-w-[1600px] mx-auto">
        {/* 3. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Workshops', value: stats.total, icon: <CalendarOutlined />, color: 'bg-blue-50 text-blue-600', trend: 'Monthly active' },
            { label: 'Upcoming', value: stats.upcoming, icon: <ClockCircleOutlined />, color: 'bg-amber-50 text-amber-600', trend: 'Next 30 days' },
            { label: 'Full Capacity', value: stats.full, icon: <TeamOutlined />, color: 'bg-red-50 text-red-600', trend: 'Immediate attention' },
            { label: 'Total Registrations', value: stats.registrations, icon: <CheckCircleOutlined />, color: 'bg-green-50 text-green-600', trend: 'All time' }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform shadow-sm`}>{card.icon}</div>
                <Badge count={card.trend} className="font-bold border-none" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{card.value}</h3>
              <p className="text-slate-500 font-bold text-sm mt-3">{card.label}</p>
            </div>
          ))}
        </div>

        {/* 4. Workshops Table/List */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-0 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-black text-slate-900">Workshop Catalog</h2>
              <p className="text-slate-400 text-sm mt-1">Manage schedules, speakers, and student enrollment.</p>
            </div>
            <Pagination simple defaultCurrent={1} total={50} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-100">
                  <th className="pl-8 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workshop Info</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Speaker</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Venue</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capacity</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="pl-4 pr-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredWorkshops.map(item => (
                  <tr key={item.id || item._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="pl-8 pr-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-blue-50">
                          {(item.topic || item.title || 'W').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-tight">{item.topic || item.title}</p>
                          <p className="text-slate-400 text-[11px] mt-1 font-medium">{item.category || 'General Workshop'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{item.speaker}</span>
                        <span className="text-slate-400 text-xs mt-0.5">{item.speakerTitle || 'Guest Speaker'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{dayjs(item.date).format('DD MMM YYYY')}</span>
                        <span className="text-slate-400 text-xs mt-0.5">{item.time || '10:00 AM'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <EnvironmentOutlined className="text-blue-500" />
                        <span className="text-sm font-semibold">{item.location || item.venue || 'Main Auditorium'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-black mb-1.5">
                          <span className="text-blue-600">{item.registrations || 0} / {item.maxCapacity || 50}</span>
                          <span className="text-slate-400">{Math.round(((item.registrations || 0) / (item.maxCapacity || 50)) * 100)}%</span>
                        </div>
                        <Progress 
                          percent={((item.registrations || 0) / (item.maxCapacity || 50)) * 100} 
                          showInfo={false} 
                          strokeColor="#2563eb" 
                          styles={{ trail: { stroke: '#f1f5f9' }}}
                          size="small"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                        {item.status || 'Upcoming'}
                      </span>
                    </td>
                    <td className="pl-4 pr-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Tooltip title="View Details"><Button size="small" shape="circle" icon={<EyeOutlined />} onClick={() => { setSelectedWorkshop(item); setIsViewOpen(true); }} /></Tooltip>
                         <Tooltip title="Edit Workshop"><Button size="small" shape="circle" icon={<EditOutlined />} className="text-blue-600" onClick={() => { setSelectedWorkshop(item); setIsEditMode(true); form.setFieldsValue({ ...item, date: dayjs(item.date), time: dayjs(item.time, 'HH:mm'), capacity: item.maxCapacity, venue: item.location }); setIsModalVisible(true); }} /></Tooltip>
                         <Popconfirm title="Delete workshop?" onConfirm={() => handleDelete(item.id || item._id)} okText="Yes" cancelText="No">
                           <Button size="small" shape="circle" danger icon={<DeleteOutlined />} />
                         </Popconfirm>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredWorkshops.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🎪</div>
                        <h3 className="text-xl font-black text-slate-900">No workshops found</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Try adjusting your search query or filters to find what you're looking for.</p>
                        <Button className="mt-8 px-8 font-bold" shape="round" onClick={() => { setFilter('All'); setSearch(''); }}>Clear All Filters</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        title={
          <div className="pr-8">
            <h2 className="font-bold text-slate-900">{isEditMode ? 'Edit Workshop' : 'Create New Workshop'}</h2>
            <p className="font-body text-sm text-slate-500 mt-1 font-normal">Define the agenda, speaker details, and registration limits for this event.</p>
          </div>
        }
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        footer={null}
        width={720}
        className="premium-modal"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} className="mt-6">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="topic" label="Workshop Topic" rules={[{ required: true }]}><Input placeholder="e.g. AI in Modern Education" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" initialValue="Technical"><Select options={[{value:'Technical', label:'Technical'}, {value:'Business', label:'Business'}, {value:'Creative', label:'Creative'}, {value:'Other', label:'Other'}]} /></Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="speaker" label="Main Speaker" rules={[{ required: true }]}><Input placeholder="Dr. Jane Smith" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="speakerTitle" label="Speaker Designation"><Input placeholder="Senior AI Researcher" /></Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="date" label="Event Date" rules={[{ required: true }]}><DatePicker className="w-full" disabledDate={(current) => current && current < dayjs().startOf('day')} /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time" label="Start Time" rules={[{ required: true }]}><TimePicker className="w-full" format="HH:mm" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status" initialValue="Open"><Select options={[{value:'Open', label:'Open'}, {value:'Closed', label:'Closed'}, {value:'Upcoming', label:'Upcoming'}]} /></Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="venue" label="Venue" rules={[{ required: true }]}><Input placeholder="Seminar Hall A" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="capacity" 
                label="Max Capacity" 
                rules={[
                  { required: true, message: 'Required' },
                  { 
                    validator: (_, value) => {
                      if (value !== undefined && value !== null && value <= 0) {
                        return Promise.reject(new Error('Must be > 0'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="50" min={1} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Starting Price (LKR)" initialValue={0}>
                <Input type="number" placeholder="0.00" prefix="Rs." min={0} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Detailed Agenda & Description">
            <Input.TextArea rows={3} placeholder="Provide a full breakdown of the workshop sessions and learning outcomes..." />
          </Form.Item>

          <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-slate-100">
            <Button onClick={() => setIsModalVisible(false)} className="px-6 h-11 text-sm font-semibold text-on-surface hover:bg-slate-50 rounded-full transition-colors">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="px-8 h-11 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              {isEditMode ? 'Update Event' : 'Create Workshop'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Detail Drawer */}
      <Drawer
        title={<div className="font-black text-slate-900 text-lg">Workshop Details</div>}
        placement="right"
        onClose={() => setIsViewOpen(false)}
        open={isViewOpen}
        style={{ width: 500 }}
        extra={<Button type="primary" shape="round" onClick={() => { setIsViewOpen(false); setIsEditMode(true); form.setFieldsValue({ ...selectedWorkshop, date: dayjs(selectedWorkshop.date), time: dayjs(selectedWorkshop.time, 'HH:mm'), capacity: selectedWorkshop.maxCapacity, venue: selectedWorkshop.location }); setIsModalVisible(true); }}>Edit Info</Button>}
      >
        {selectedWorkshop && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-100">
                {(selectedWorkshop.topic || selectedWorkshop.title || 'W').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedWorkshop.topic || selectedWorkshop.title}</h3>
                <Tag className="mt-2 font-bold px-3" color="blue">{selectedWorkshop.category || 'General'}</Tag>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Speaker</p>
                <p className="font-bold text-slate-900">{selectedWorkshop.speaker}</p>
                <p className="text-xs text-slate-500">{selectedWorkshop.speakerTitle}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(selectedWorkshop.status)}`}>{selectedWorkshop.status}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                <p className="font-bold text-slate-900">{dayjs(selectedWorkshop.date).format('DD MMM YYYY')}</p>
                <p className="text-xs text-slate-500">{selectedWorkshop.time}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                <p className="font-bold text-slate-900">{selectedWorkshop.location || selectedWorkshop.venue}</p>
              </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-slate-900">Registration Attendance</h4>
                <span className="text-blue-600 font-black">{selectedWorkshop.registrations || 0} / {selectedWorkshop.maxCapacity || 50}</span>
              </div>
              <Progress 
                percent={((selectedWorkshop.registrations || 0) / (selectedWorkshop.maxCapacity || 50)) * 100} 
                strokeColor="#2563eb" 
                styles={{ trail: { stroke: '#fff' }}}
                strokeWidth={12}
                className="mb-2"
              />
              <p className="text-[11px] text-slate-400 font-medium">Approximately {Math.round(((selectedWorkshop.registrations || 0) / (selectedWorkshop.maxCapacity || 50)) * 100)}% of spots are reserved for this event.</p>
            </div>

            <div>
              <h4 className="font-black text-slate-900 mb-3">About this Workshop</h4>
              <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                "{selectedWorkshop.description || 'No description provided for this workshop.'}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <Button block shape="round" icon={<TeamOutlined />} className="h-11 font-bold">View Participants</Button>
              <Button block shape="round" icon={<MailOutlined />} className="h-11 font-bold">Message Students</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

const UserManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users/staff', { headers: authHeaders() });
      setStaff(res.data);
    } catch (err) {
      messageApi.error("Failed to load staff users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (values) => {
    try {
      await axios.post('/api/users/staff', values, { headers: authHeaders() });
      messageApi.success("Staff user created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchStaff();
    } catch (err) {
      messageApi.error(err.response?.data?.error || "Failed to create staff");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/staff/${id}`, { headers: authHeaders() });
      messageApi.success("Staff user deleted");
      fetchStaff();
    } catch (err) {
      messageApi.error("Failed to delete staff");
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <span className="font-bold">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'super_admin' ? 'purple' : 'blue'}>
          {role.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm title="Delete this staff user?" onConfirm={() => handleDelete(record._id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <PageWrapper title="User Management" subtitle="Manage campus staff and assign roles.">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Campus Staff</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600"
          >
            Add Staff
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={staff} 
          loading={loading} 
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Add New Staff Member"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="john@csbm.lk" />
          </Form.Item>
          <Form.Item name="password" label="Initial Password" rules={[{ required: true }]}>
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item name="role" label="System Role" rules={[{ required: true }]}>
            <Select placeholder="Select a role">
              <Select.Option value="super_admin">Super Admin</Select.Option>
              <Select.Option value="registration_staff">Registration Staff</Select.Option>
              <Select.Option value="marketing_coordinator">Marketing Coordinator</Select.Option>
              <Select.Option value="finance_staff">Finance Staff</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageWrapper>
  );
};

const AnalyticsPage = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0, incomplete: 12 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [notificationForm] = Form.useForm();
  const { message: messageApi } = App.useApp();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/analytics/stats', { headers: authHeaders() });
        setStats({ ...res.data, incomplete: 12 }); // Mocking incomplete count
      } catch (err) { }
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Spring 2026', Total: Math.floor(stats.total * 0.3), Approved: Math.floor(stats.approved * 0.3), target: 200 },
    { name: 'Summer 2026', Total: Math.floor(stats.total * 0.5), Approved: Math.floor(stats.approved * 0.5), target: 200 },
    { name: 'Fall 2026', Total: stats.total, Approved: stats.approved, target: 250 },
  ];

  const incompleteProfiles = [
    { id: 1, name: 'Imalka Madushan', email: 'imalka@example.com', program: 'BSc Computing', intake: 'June 2026', missing: ['NIC Copy Missing', 'A/L Certificate'], status: 'Action Needed', date: '2026-03-20' },
    { id: 2, name: 'Tharindu M', email: 'tharindu@example.com', program: 'Diploma in IT', intake: 'May 2026', missing: ['Passport Photo Missing'], status: 'Waiting', date: '2026-03-22' },
    { id: 3, name: 'Shehani Ekanayake', email: 'shehani@example.com', program: 'BSc in SE', intake: 'June 2026', missing: ['Application Form Incomplete'], status: 'Reviewing', date: '2026-03-24' },
  ];

  const visibleProfiles = incompleteProfiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.email.toLowerCase().includes(search.toLowerCase()) ||
                          p.program.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || 
                          (filter === 'Incomplete' && (p.status === 'Action Needed' || p.status === 'Waiting')) ||
                          (filter === 'Pending' && p.status === 'Reviewing'); 
    return matchesSearch && matchesFilter;
  });

  const openNotificationModal = (type, recipientGroup, subject = '', message = '', emails = []) => {
    notificationForm.setFieldsValue({ type, recipientGroup, subject, message, emails });
    setIsNotificationModalOpen(true);
  };

  const handleSendNotification = async (values) => {
    setIsSending(true);
    try {
      let finalEmails = values.emails || [];
      
      // Inject logic to programmatically extract emails for filtered lists
      if (values.recipientGroup === 'Filtered Students') {
        finalEmails = visibleProfiles.map(p => p.email).filter(Boolean);
      } else if (values.recipientGroup === 'All Users' || values.recipientGroup === 'All Admins' || values.recipientGroup === 'All Students') {
        // Backend handles these natively via 'scope', just ensure array isn't technically missing if backend strictly requires it
        finalEmails = [];
      }

      await axios.post('/api/analytics/notify', {
        type: values.type,
        recipientGroup: values.recipientGroup,
        subject: values.subject,
        message: values.message,
        recipientEmails: finalEmails
      }, { headers: authHeaders() });
      messageApi.success('Notifications queued successfully.');
      setIsNotificationModalOpen(false);
      notificationForm.resetFields();
    } catch (err) {
      console.error(err);
      messageApi.error('Failed to send notifications.');
    } finally {
      setIsSending(false);
    }
  };

  const handleExportCSV = (data, filename) => {
    if (!data || data.length === 0) {
      return messageApi.warning("No records available to export.");
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(',')).join('\\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    messageApi.success("Report exported successfully.");
  };

  const handleExportData = (type) => {
    setExportLoading(true);
    setTimeout(() => { // simulate loading
      if (type === 'Standard') {
        const exportData = visibleProfiles.map(p => ({ Name: p.name, Email: p.email, Program: p.program, Intake: p.intake, Status: p.status, MissingItems: p.missing.join('; ') }));
        handleExportCSV(exportData, 'analytics-report.csv');
      } else if (type === 'Premium') {
        const exportData = visibleProfiles.map(p => ({ Name: p.name, Email: p.email, Program: p.program, Intake: p.intake, Status: p.status, MissingItems: p.missing.join('; ') }));
        handleExportCSV(exportData, 'analytics-report.csv'); // Fallback
        console.log('// TODO: replace CSV fallback with XLSX export using xlsx package');
      } else if (type === 'Executive') {
        handleExportCSV([
          { Intake: 'Spring 2026', Total: Math.floor(stats.total * 0.3), Approved: Math.floor(stats.approved * 0.3), Pending: 12, Rejected: 2, Incomplete: 4 },
          { Intake: 'Summer 2026', Total: Math.floor(stats.total * 0.5), Approved: Math.floor(stats.approved * 0.5), Pending: 20, Rejected: 5, Incomplete: 8 },
          { Intake: 'Fall 2026', Total: stats.total, Approved: stats.approved, Pending: stats.pending, Rejected: stats.rejected, Incomplete: stats.incomplete }
        ], 'intake-summary.csv');
      } else if (type === 'Admin') {
        const gapData = visibleProfiles.map(p => ({
          Name: p.name,
          Email: p.email,
          Program: p.program,
          Intake: p.intake,
          Missing_NIC: p.missing.includes('NIC Copy Missing') ? 'Yes' : 'No',
          Missing_AL: p.missing.includes('A/L Certificate') ? 'Yes' : 'No',
          Missing_Photo: p.missing.includes('Passport Photo Missing') ? 'Yes' : 'No',
          Missing_Form: p.missing.includes('Application Form Incomplete') ? 'Yes' : 'No',
          Status: p.status
        }));
        handleExportCSV(gapData, 'profile-gap-analysis.csv');
      }
      setExportLoading(false);
    }, 500);
  };

  return (
    <div className="-m-6 bg-slate-50 min-h-screen pb-12">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Track communications, monitor incomplete profiles, and generate reports.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, intake..."
              className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm w-72 focus:border-blue-500 outline-none transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => openNotificationModal('', 'Filtered Students')} type="primary" shape="round" icon={<MailOutlined />} size="large" className="bg-blue-600 shadow-md shadow-blue-100 font-bold px-6">
            Send Notifications
          </Button>
          <Button onClick={() => handleExportData('Standard')} loading={exportLoading} shape="round" icon={<DownloadOutlined />} size="large" className="font-bold border-slate-200">
            Export Data
          </Button>
        </div>
      </div>

      {/* 2. Filter Pills Row */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex gap-2">
          {['All', 'Approved', 'Pending', 'Incomplete', 'Rejected'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-200 ${
                filter === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button shape="round" icon={<SearchOutlined />} className="border-slate-200 text-slate-500 font-medium">
          More Filters
        </Button>
      </div>

      <div className="px-8 mt-8 space-y-8">
        {/* 3. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform"><PieChartOutlined /></div>
              <span className="text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full">+12% vs last month</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.total}</h3>
              <p className="text-slate-500 font-bold text-sm mt-2">Total Applications</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform"><CheckCircleOutlined /></div>
              <span className="text-slate-400 text-xs font-medium">Auto-synced</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.approved}</h3>
              <p className="text-slate-500 font-bold text-sm mt-2">Approved Profiles</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="bg-amber-50 text-amber-600 p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform"><ClockCircleOutlined /></div>
              <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full">Requires review</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.pending}</h3>
              <p className="text-slate-500 font-bold text-sm mt-2">Pending Applications</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform"><HistoryOutlined /></div>
              <span className="text-red-600 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-full">3 urgent reminders</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.incomplete}</h3>
              <p className="text-slate-500 font-bold text-sm mt-2">Incomplete Profiles</p>
            </div>
          </div>
        </div>

        {/* 4. Registration Trends */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Registration Trends</h2>
              <p className="text-slate-400 text-sm">Application volume and conversion metrics by intake.</p>
            </div>
            <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 border border-slate-200">
              {['Weekly', 'Monthly', 'Intake-wise'].map(v => (
                <button key={v} className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${v === 'Monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Total" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} name="Applications" />
                <Bar dataKey="Approved" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} name="Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Incomplete Profiles Table */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Incomplete Profiles</h2>
              <p className="text-slate-400 text-sm">Monitor applicants with missing documents or unfinished submissions.</p>
            </div>
            <Button shape="round" size="large" className="font-bold border-slate-200">View All Tracked</Button>
          </div>
          <div className="overflow-x-auto -mx-8">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Program / Intake</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Missing Items</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visibleProfiles.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-8 text-center text-slate-400 font-medium">No completely incomplete profiles matching your filters.</td></tr>
                ) : visibleProfiles.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-slate-400 text-xs">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <p className="text-sm font-bold text-slate-700">{item.program}</p>
                      <p className="text-xs text-slate-400">{item.intake}</p>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {item.missing.map((m, i) => (
                          <span key={i} className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-100">{m}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'Action Needed' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                       <Button size="small" shape="round" icon={<EyeOutlined />} className="border-slate-200" />
                       <Button type="primary" size="small" shape="round" icon={<MailOutlined />} className="bg-blue-600 font-bold px-4" onClick={() => openNotificationModal(
                          'Incomplete Application Reminder',
                          'Selected Student',
                          'Complete your missing application documents - CSBM',
                          `Dear {studentName}, your application is currently incomplete. Please upload the following missing items: ${item.missing.join(', ')}. Log in to the student portal to complete your application.`,
                          [item.email]
                       )}>
                         Remind
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Automated Communication Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">Automated Communication</h2>
            <p className="text-slate-400 text-sm">Send reminders and milestone notifications to applicants.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Send Reminders', desc: 'Send reminder emails to students with incomplete applications or missing docs.', icon: <ClockCircleOutlined />, color: 'bg-amber-50 text-amber-600', btn: 'Send Now', count: '12 pending' },
              { title: 'Approval Emails', desc: 'Notify approved applicants with next steps and enrollment instructions.', icon: <CheckCircleOutlined />, color: 'bg-green-50 text-green-600', btn: 'Notify All', count: '4 waiting' },
              { title: 'Update Blast', desc: 'Send campus news, deadline alerts or follow-up status updates to all.', icon: <BellOutlined />, color: 'bg-blue-50 text-blue-600', btn: 'Send Update', count: 'Standard' }
            ].map((card, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>{card.icon}</div>
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-black text-slate-900 text-lg">{card.title}</h3>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.count}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{card.desc}</p>
                <Button 
                   block type="primary" shape="round" size="large" 
                   className="bg-blue-600 font-black h-12"
                   onClick={() => {
                     if (card.btn === 'Send Now') {
                       openNotificationModal('Incomplete Application Reminder', 'All Incomplete Students', 'Complete your application - CSBM', `Dear Student, your application is incomplete. Please upload the missing documents and complete all required sections.`);
                     } else if (card.btn === 'Notify All') {
                       openNotificationModal('Approval Notification', 'All Approved Students', 'Your application has been approved - CSBM', `Congratulations. Your application has been approved. Please review your next steps and enrollment instructions in the portal.`);
                     } else {
                       openNotificationModal('Campus Update / General Notice', 'All Students', 'Important update from CSBM', `Please check the latest announcement, deadline reminder, or follow-up update in your portal and email.`);
                     }
                   }}
                >
                   {card.btn}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Export & Reporting */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
           <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-xl font-black text-slate-900">Export & Reporting</h2>
              <p className="text-slate-400 text-sm">Generate downloadable management reports for offline processing.</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Export CSV', icon: <FileTextOutlined />, type: 'Standard' },
                { label: 'Export Excel', icon: <FileExcelOutlined />, type: 'Premium' },
                { label: 'Intake Summary', icon: <BarChartOutlined />, type: 'Executive' },
                { label: 'Profile Gap Analysis', icon: <TeamOutlined />, type: 'Admin' }
              ].map((exp, i) => (
                <div key={i} onClick={() => handleExportData(exp.type)} className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-3 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">{exp.icon}</div>
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{exp.label}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{exp.type}</p>
                    </div>
                  </div>
                  <DownloadOutlined className="text-slate-300 group-hover:text-blue-600" />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* --- NOTIFICATION MODAL --- */}
      <Modal
        title={
          <div className="pr-8">
            <h2 className="font-bold text-slate-900">Send Notifications</h2>
            <p className="font-body text-sm text-slate-500 mt-1 font-normal">Compose and broadcast updates to students.</p>
          </div>
        }
        open={isNotificationModalOpen}
        onCancel={() => { setIsNotificationModalOpen(false); notificationForm.resetFields(); }}
        footer={null}
        destroyOnHidden
        className="premium-modal"
        width={720}
      >
        <Form form={notificationForm} layout="vertical" onFinish={handleSendNotification} className="mt-4">
          <Form.Item name="emails" hidden><Input /></Form.Item>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="type" label="Notification Type" rules={[{ required: true }]}>
                <Select 
                  options={[
                    { value: 'Incomplete Application Reminder', label: 'Incomplete Application Reminder' },
                    { value: 'Approval Notification', label: 'Approval Notification' },
                    { value: 'Campus Update / General Notice', label: 'Campus Update / General Notice' },
                    { value: 'Custom Message', label: 'Custom Message' }
                  ]} 
                  onChange={(val) => {
                     // Auto-fill templates if empty
                     const currentMessage = notificationForm.getFieldValue('message');
                     if (!currentMessage || currentMessage.length < 5) {
                        if (val === 'Incomplete Application Reminder') {
                           notificationForm.setFieldsValue({ subject: 'Complete your application - CSBM', message: 'Dear Student, your application is incomplete. Please upload the missing documents and complete all required sections.' });
                        } else if (val === 'Approval Notification') {
                           notificationForm.setFieldsValue({ subject: 'Your application has been approved - CSBM', message: 'Congratulations. Your application has been approved. Please review your next steps and enrollment instructions in the portal.' });
                        } else if (val === 'Campus Update / General Notice') {
                           notificationForm.setFieldsValue({ subject: 'Important update from CSBM', message: 'Please check the latest announcement, deadline reminder, or follow-up update in your portal and email.' });
                        }
                     }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recipientGroup" label="Recipient Scope" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Selected Student', label: 'Selected Student' },
                  { value: 'All Incomplete Students', label: 'All Incomplete Students' },
                  { value: 'All Approved Students', label: 'All Approved Students' },
                  { value: 'All Students', label: 'All Students' },
                  { value: 'Filtered Students', label: 'Filtered Students' }
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input placeholder="Message Subject" />
          </Form.Item>

          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="Type your message here... Use {studentName} to personalize." />
          </Form.Item>

          <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-slate-100">
            <Button onClick={() => { setIsNotificationModalOpen(false); notificationForm.resetFields(); }} className="px-6 h-11 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-full transition-colors border-0">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isSending} className="bg-blue-600 shadow-md shadow-blue-100 px-8 h-11 text-sm font-bold rounded-full transition-transform active:scale-95">
              Send
            </Button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

const ManualRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    nic: '',
    dob: '',
    course: '',
    intake: 'Intake 2026',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]); // Legacy state
  const [programs, setPrograms] = useState([]); // New Firestore state
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState(null);
  const { message: messageApi } = App.useApp();

  const initialFormData = {
    fullName: '', email: '', mobile: '',
    address: '', nic: '', dob: '',
    course: '', intake: 'Intake 2026',
    password: '', confirmPassword: ''
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingPrograms(true);
      try {
        const res = await fetch('/api/courses/all');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Map to programs format: { id, name }
          const mapped = data.map(c => ({
            id: c._id || c.code,
            name: c.courseName || c.title || c.name,
            status: 'active' // Assuming all from API are active for now
          }));
          setPrograms(mapped);
          console.log("Programs fetched from API:", mapped);
        }
      } catch (err) { 
        console.error('Failed to fetch courses', err); 
        messageApi.error('Failed to load courses');
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchCourses();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) newErrors.fullName = 'Full name is required (min 2 chars)';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be exactly 10 digits';
    if (!formData.nic || !/^(\d{9}[vVxX]|\d{12})$/.test(formData.nic)) newErrors.nic = 'Invalid NIC format (e.g. 123456789V or 200012345678)';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.course) newErrors.course = 'Please select a program';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.mobile,
          address: formData.address,
          nic: formData.nic,
          dateOfBirth: formData.dob,
          courseId: formData.course,
          courseName: programs.find(p => p.id === formData.course)?.name || 'Not Specified',
          intake: formData.intake,
          password: formData.password,
          role: 'STUDENT',
          status: 'APPROVED'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setRegisteredStudent(data.student);
        setFormData(initialFormData);
        setErrors({});
        messageApi.success('Student Registered Successfully!');
      } else {
        setError(data.message || 'Registration failed');
        messageApi.error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      messageApi.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  if (success) {
    return (
        <div className="flex flex-col items-center py-10">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center max-w-2xl w-full shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-black text-slate-900 text-2xl mt-4">Student Registered Successfully!</h2>
            <p className="text-slate-500 mt-3">The student has been registered and automatically approved.</p>

            <div className="bg-white border border-green-200 rounded-xl p-6 mt-6 text-left shadow-inner">
              <div className="space-y-2">
                <p className="text-sm"><span className="text-slate-400 font-medium">Name:</span> <span className="font-semibold text-slate-900">{registeredStudent?.name}</span></p>
                <p className="text-sm"><span className="text-slate-400 font-medium">Email:</span> <span className="text-slate-600">{registeredStudent?.email}</span></p>
                <p className="text-sm"><span className="text-slate-400 font-medium">Course:</span> <span className="text-slate-600">{programs.find(p => p.id === formData.course)?.name || programs.find(p => p.id === formData.course)?.title || 'Selected Course'}</span></p>
                <p className="text-sm flex items-center gap-2 pt-2">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">✅ Approved</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8 justify-center">
              <button
                  onClick={() => setSuccess(false)}
                  className="bg-blue-600 text-white rounded-full px-8 py-3 font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >
                Register Another Student
              </button>
              <button
                  onClick={() => navigate('/admin-dashboard/approvals')}
                  className="bg-slate-100 text-slate-700 rounded-full px-8 py-3 font-bold text-sm hover:bg-slate-200 transition"
              >
                View All Students
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">Manual Registration</h1>
          <p className="text-slate-500 mt-1 text-sm">Register walk-in students directly into the system.</p>
        </div>

        <div className="flex justify-center pb-20">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 max-w-2xl w-full">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm font-medium flex justify-between items-center animate-in slide-in-from-top duration-200">
                  <div className="flex items-center gap-2"><span>⚠️</span> {error}</div>
                  <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 text-lg">×</button>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-start gap-4 shadow-sm shadow-blue-50">
              <div className="text-xl mt-0.5">ℹ️</div>
              <div>
                <p className="font-bold text-blue-900 text-sm">Admin Mode</p>
                <p className="text-blue-700 text-xs mt-0.5">Students registered here are automatically marked as <span className="font-bold">APPROVED</span> and ready for enrollment.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Personal Details</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'Full Name *', name: 'fullName', placeholder: 'e.g. Kasun Perera' },
                    { label: 'Email Address *', name: 'email', placeholder: 'student@example.com', type: 'email' },
                    { label: 'Mobile Number *', name: 'mobile', placeholder: '07XXXXXXXX', type: 'tel' },
                    { label: 'Address', name: 'address', placeholder: 'Permanent Residence', variant: 'textarea' },
                    { label: 'NIC Number *', name: 'nic', placeholder: 'XXXXXXXXXV or XXXXXXXXXXXX' },
                    { label: 'Date of Birth *', name: 'dob', type: 'date' },
                  ].map(field => (
                      <div key={field.name}>
                        <label className="block text-slate-700 text-xs font-black uppercase tracking-wider mb-2 ml-1">{field.label}</label>
                        {field.variant === 'textarea' ? (
                            <textarea
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                rows={3}
                                className={`w-full border rounded-2xl px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all resize-none ${errors[field.name] ? 'border-red-500' : 'border-slate-200'}`}
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                maxLength={field.name === 'mobile' ? 10 : (field.name === 'nic' ? 12 : undefined)}
                                className={`w-full border rounded-2xl px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all ${errors[field.name] ? 'border-red-500' : 'border-slate-200'}`}
                            />
                        )}
                        {errors[field.name] && <p className="text-red-500 text-[10px] mt-1.5 font-bold ml-1">↳ {errors[field.name]}</p>}
                      </div>
                  ))}
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Course Enrollment</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-slate-700 text-xs font-black uppercase tracking-wider mb-2 ml-1">Select Course *</label>
                    <Select
                      placeholder={loadingPrograms ? "Loading programs..." : "Choose a program..."}
                      value={formData.course || null}
                      onChange={(value) => {
                        console.log("Selected Program Value:", value);
                        setFormData(prev => ({ ...prev, course: value }));
                        if (errors.course) setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.course;
                          return updated;
                        });
                      }}
                      options={programs.map(p => ({
                        value: p.id,
                        label: p.name || p.title
                      }))}
                      className="w-full h-12"
                      disabled={loadingPrograms}
                      loading={loadingPrograms}
                      notFoundContent={programs.length === 0 ? "No programs available" : null}
                    />
                    {errors.course && <p className="text-red-500 text-[10px] mt-1.5 font-bold ml-1">↳ {errors.course}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs font-black uppercase tracking-wider mb-2 ml-1">Intake</label>
                    <select
                        name="intake"
                        value={formData.intake}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="Intake 2025">Intake 2025</option>
                      <option value="Intake 2026">Intake 2026</option>
                      <option value="Intake 2027">Intake 2027</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Account Setup</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Temporary Password *', name: 'password', placeholder: 'Set temporary password', type: 'password' },
                    { label: 'Confirm Password *', name: 'confirmPassword', placeholder: 'Confirm password', type: 'password' },
                  ].map(field => (
                      <div key={field.name}>
                        <label className="block text-slate-700 text-xs font-black uppercase tracking-wider mb-2 ml-1">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`w-full border rounded-2xl px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all ${errors[field.name] ? 'border-red-500' : 'border-slate-200'}`}
                        />
                        {errors[field.name] && <p className="text-red-500 text-[10px] mt-1.5 font-bold ml-1">↳ {errors[field.name]}</p>}
                      </div>
                  ))}
                </div>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-10 rounded-2xl py-5 font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                      loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
                  }`}
              >
                {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                      Registering...
                    </>
                ) : (
                    <>
                      <span className="text-xl">📋</span>
                      Register & Approve Student
                    </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};
const CourseManagementPage = ({ diplomas, setDiplomas, courses, setCourses, modules, setModules, versions, setVersions }) => {
  const [activeTab, setActiveTab] = useState('diplomas');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewVisible, setIsViewVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // --- FILTERED DATA ---
  const getFilteredData = () => {
    let baseData = [];
    if (activeTab === 'diplomas') baseData = diplomas;
    else if (activeTab === 'courses') baseData = courses;
    else if (activeTab === 'modules') baseData = modules;

    return baseData.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesFilter = filterType === 'All' || item.status === filterType;
      return matchesSearch && matchesFilter;
    });
  };

  // --- ACTIONS ---
  const handleAddNew = () => {
    setCurrentItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleView = (record) => {
    setCurrentItem(record);
    setIsViewVisible(true);
  };

  const handleDeleteClick = (record) => {
    setCurrentItem(record);
    setIsDeleteVisible(true);
  };

  const handleDelete = () => {
    // TODO: connect deletion to backend
    if (activeTab === 'diplomas') setDiplomas(diplomas.filter(d => d.id !== currentItem.id));
    else if (activeTab === 'courses') setCourses(courses.filter(c => c.id !== currentItem.id));
    else if (activeTab === 'modules') setModules(modules.filter(m => m.id !== currentItem.id));
    
    setIsDeleteVisible(false);
    messageApi.success('Item deleted successfully');
  };

  const onFinish = (values) => {
    if (currentItem) {
      // Edit mode
      // TODO: connect update to backend
      const updated = { ...currentItem, ...values };
      if (activeTab === 'diplomas') setDiplomas(diplomas.map(d => d.id === currentItem.id ? updated : d));
      else if (activeTab === 'courses') setCourses(courses.map(c => c.id === currentItem.id ? updated : c));
      else if (activeTab === 'modules') setModules(modules.map(m => m.id === currentItem.id ? updated : m));
      
      // Version control snapshot
      setVersions([{
        id: Date.now().toString(),
        itemName: updated.name,
        type: activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1),
        version: `1.0.${Math.floor(Math.random() * 10)}`,
        updatedBy: 'Admin',
        date: dayjs().format('YYYY-MM-DD'),
        summary: 'Attributes updated via admin panel',
        status: 'Draft'
      }, ...versions]);
      
      messageApi.success('Updated successfully and version snapshot created');
    } else {
      // Add mode
      // TODO: connect creation to backend
      const newItem = { id: Date.now().toString(), ...values };
      if (activeTab === 'diplomas') setDiplomas([...diplomas, newItem]);
      else if (activeTab === 'courses') setCourses([...courses, newItem]);
      else if (activeTab === 'modules') setModules([...modules, newItem]);
      messageApi.success('Added successfully');
    }
    setIsModalVisible(false);
  };

  // --- COLUMNS ---
  const getColumns = () => {
    const commonActions = (_, record) => (
      <div className="flex gap-2">
        <Button size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>View</Button>
        <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)}>Delete</Button>
      </div>
    );

    const statusBadge = (s) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
        s === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
        s === 'Draft' ? 'bg-amber-50 text-amber-600 border-amber-200' :
        'bg-slate-50 text-slate-400 border-slate-200'
      }`}>
        {s}
      </span>
    );

    if (activeTab === 'diplomas') return [
      { title: 'Code', dataIndex: 'code', key: 'code', className: 'font-bold text-slate-700' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Duration', dataIndex: 'duration', key: 'duration' },
      { title: 'Fee (LKR)', dataIndex: 'fee', key: 'fee', render: f => f?.toLocaleString() },
      { title: 'Status', dataIndex: 'status', key: 'status', render: statusBadge },
      { title: 'Actions', key: 'actions', render: commonActions }
    ];

    if (activeTab === 'courses') return [
      { title: 'Code', dataIndex: 'code', key: 'code', className: 'font-bold text-slate-700' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Diploma', dataIndex: 'diploma', key: 'diploma', className: 'text-blue-600 text-xs' },
      { title: 'Intake', dataIndex: 'intake', key: 'intake' },
      { title: 'Fee (LKR)', dataIndex: 'fee', key: 'fee', render: f => f?.toLocaleString() },
      { title: 'Status', dataIndex: 'status', key: 'status', render: statusBadge },
      { title: 'Actions', key: 'actions', render: commonActions }
    ];

    return [
      { title: 'Actions', key: 'actions', render: commonActions }
    ];
  };

  const stats = {
    total: getFilteredData().length,
    active: getFilteredData().filter(i => i.status === 'Active').length,
    draft: getFilteredData().filter(i => i.status === 'Draft').length,
    archived: getFilteredData().filter(i => i.status === 'Inactive' || i.status === 'Archived').length
  };

  return (
    <div className="admin-dashboard -m-6 bg-slate-50 min-h-screen pb-12 font-sans text-slate-900">
      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage diplomas, courses and modules in one place.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search records..."
              className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-3 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={filterType}
            className="premium-select min-w-[140px]"
            onChange={setFilterType}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active Only' },
              { value: 'Draft', label: 'Draft Only' },
              { value: 'Inactive', label: 'Archived' }
            ]}
          />
          <Button 
            type="primary" 
            shape="round" 
            size="large" 
            icon={<PlusOutlined />} 
            className="bg-blue-600 shadow-xl shadow-blue-100 font-bold px-8 h-12 border-none hover:scale-105 transition-transform"
            onClick={handleAddNew}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="px-8 mt-8 space-y-8 max-w-[1600px] mx-auto">
        {/* 2. Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Records', value: stats.total, icon: <BookOutlined />, color: 'bg-blue-50 text-blue-600', sub: 'Catalog size' },
            { label: 'Active Entities', value: stats.active, icon: <CheckCircleOutlined />, color: 'bg-green-50 text-green-600', sub: 'Live on site' },
            { label: 'Draft Items', value: stats.draft, icon: <FormOutlined />, color: 'bg-amber-50 text-amber-600', sub: 'In progress' },
            { label: 'Archived', value: stats.archived, icon: <HistoryOutlined />, color: 'bg-slate-100 text-slate-500', sub: 'Past versions' }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform shadow-sm`}>{card.icon}</div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{card.sub}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{card.value}</h3>
              <p className="text-slate-500 font-bold text-sm mt-3">{card.label}</p>
            </div>
          ))}
        </div>

        {/* 3. Main Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
            <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl w-fit">
              {['diplomas', 'courses', 'modules'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${
                    activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-md scale-105' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                Showing {getFilteredData().length} {activeTab}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-100">
                  <th className="pl-8 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab.slice(0,-1)} Info</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {activeTab === 'diplomas' ? 'Duration' : activeTab === 'courses' ? 'Diploma' : 'Course'}
                  </th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {activeTab === 'modules' ? 'Semester / Credits' : 'Fee (LKR)'}
                  </th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="pl-4 pr-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {getFilteredData().map(record => (
                  <tr key={record.id} className="hover:bg-blue-50/10 transition-colors group">
                    <td className="pl-8 pr-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          {getInitials(record.name)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">{record.name}</p>
                          <p className="text-slate-400 text-[11px] mt-1 font-bold uppercase tracking-tighter">{record.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="font-bold text-slate-700 text-sm">
                        {activeTab === 'diplomas' ? record.duration : activeTab === 'courses' ? record.diploma : record.course}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <span className="font-bold text-slate-700 text-sm">
                        {activeTab === 'modules' ? `${record.semester} / ${record.credits}` : record.fee?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        record.status === 'Active' ? 'text-green-600 bg-green-50 border-green-100' :
                        record.status === 'Draft' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                        'text-slate-400 bg-slate-50 border-slate-100'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="pl-4 pr-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Tooltip title="View Details">
                            <Button shape="circle" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                         </Tooltip>
                         <Tooltip title="Edit Record">
                            <Button shape="circle" size="small" icon={<EditOutlined />} className="text-blue-600" onClick={() => handleEdit(record)} />
                         </Tooltip>
                         <Popconfirm title="Delete?" onConfirm={() => { setCurrentItem(record); handleDelete(); }}>
                            <Button shape="circle" size="small" danger icon={<DeleteOutlined />} />
                         </Popconfirm>
                       </div>
                    </td>
                  </tr>
                ))}
                {getFilteredData().length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🔎</div>
                        <h3 className="text-xl font-black text-slate-900">No results matching your query</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Try adjusting your filters or search term to see more results.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-12">
             <div className="text-slate-400 text-xs font-bold uppercase">Page 1 of 1</div>
             <Pagination simple defaultCurrent={1} total={getFilteredData().length} pageSize={10} className="premium-pagination" />
          </div>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal 
        title={
          <div className="pr-8">
            <h2 className="font-bold text-slate-900">{currentItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}</h2>
            <p className="font-body text-sm text-slate-500 mt-1 font-normal">Enter the official details to {currentItem ? 'update' : 'create'} an academic certification.</p>
          </div>
        }
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnHidden
        className="premium-modal"
        width={640}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="code" label={`${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)} Code`} rules={[{ required: true }]}>
                <Input placeholder="e.g. DIP-SWE-2024" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="Active">
                <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Draft', label: 'Draft' }, { value: 'Inactive', label: 'Inactive' }]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Official Title" />
          </Form.Item>

          {activeTab === 'diplomas' && (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
                    <Input placeholder="e.g. 12" suffix="Months" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="fee" label="Base Fee (LKR)" rules={[{ required: true }]}>
                    <Input type="number" placeholder="0.00" prefix="Rs." />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="requirements" label="Minimum Requirements">
                <Input.TextArea rows={2} placeholder="Academic prerequisites and entry qualifications..." />
              </Form.Item>
            </>
          )}

          {activeTab === 'courses' && (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="diploma" label="Related Diploma" rules={[{ required: true }]}>
                    <Select options={diplomas.map(d => ({ key: d.id, value: d.name, label: d.name }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="intake" label="Intake" rules={[{ required: true }]}>
                    <Input placeholder="e.g. June 2026" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="fee" label="Course Fee (LKR)" rules={[{ required: true }]}>
                    <Input type="number" placeholder="0.00" prefix="Rs." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="minPasses" label="Min A/L Passes">
                    <Input type="number" placeholder="3" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="requirements" label="Additional Requirements">
                <Input.TextArea rows={2} placeholder="Prerequisites and course-specific requirements..." />
              </Form.Item>
            </>
          )}

          {activeTab === 'modules' && (
            <>
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item name="course" label="Related Course" rules={[{ required: true }]}>
                    <Select options={courses.map(c => ({ key: c.id, value: c.name, label: c.name }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
                    <Select options={[{value:1, label:'Sem 1'}, {value:2, label:'Sem 2'}, {value:3, label:'Sem 3'}]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="credits" label="Credits" rules={[{ required: true }]}>
                    <Input type="number" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="fee" label="Module Fee (LKR)" rules={[{ required: true }]}>
                    <Input type="number" placeholder="0.00" prefix="Rs." />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Provide details..." />
          </Form.Item>


          <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-slate-100">
            <Button onClick={() => setIsModalVisible(false)} className="px-6 h-11 text-sm font-semibold text-on-surface hover:bg-slate-50 rounded-full transition-colors">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="px-8 h-11 text-sm font-semibold bg-blue-600 text-white rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              {currentItem ? 'Save Changes' : `Create ${activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* --- VIEW MODAL --- */}
      <Modal
        title={<span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Entity Details</span>}
        open={isViewVisible}
        onCancel={() => setIsViewVisible(false)}
        footer={<Button onClick={() => setIsViewVisible(false)} type="primary" className="bg-blue-600 rounded-lg">Close</Button>}
        centered
        className="premium-modal"
      >
        {currentItem && (
          <div className="py-2">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-slate-800 leading-tight">{currentItem.name}</h3>
                <p className="text-blue-600 font-bold mt-1 uppercase tracking-widest text-xs">{currentItem.code}</p>
              </div>
              <Tag color={currentItem.status === 'Active' ? 'green' : 'orange'}>{currentItem.status}</Tag>
            </div>
            
            <div className="grid grid-cols-2 gap-6 px-2">
              {Object.entries(currentItem).map(([key, val]) => (
                !['id', 'name', 'code', 'status'].includes(key) && (
                  <div key={key} className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 italic">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1.5">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-slate-700 font-bold break-words">
                      {key === 'fee' ? `LKR ${val?.toLocaleString()}` : String(val)}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* --- DELETE CONFIRMATION --- */}
      <Modal
        title={<span className="text-slate-800 font-black uppercase tracking-widest text-xs">Delete Confirmation</span>}
        open={isDeleteVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true, className: 'h-10 px-6 font-bold rounded-lg' }}
        cancelButtonProps={{ className: 'h-10 px-6 font-bold rounded-lg' }}
        className="premium-modal"
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to delete <span className="font-bold text-slate-900">{currentItem?.name}</span>?</p>
          <p className="text-red-500 text-xs mt-2 font-semibold">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

// ─── Main AdminDashboard Component ───────────────────────────────────────────

const EligibilityCheckerPage = ({ courses }) => {
  const [form] = Form.useForm();
  const [result, setResult] = useState(null);
  const { message: messageApi } = App.useApp();

  const checkEligibility = (values) => {
    const { program, stream, passes, mathPass, englishPass } = values;
    let eligible = false;
    let reason = "";
    let fee = "N/A";

    if (program === 'Diploma in IT') {
      fee = "LKR 150,000";
      if (passes >= 2) {
        eligible = true;
        reason = "You meet the minimum requirement of 2 A/L passes.";
      } else {
        reason = "Minimum 2 A/L passes required.";
      }
    } else if (program === 'Diploma in Business') {
      fee = "LKR 120,000";
      if (passes >= 2 && ['Arts', 'Commerce', 'Tech'].includes(stream)) {
        eligible = true;
        reason = "Matches stream and pass requirements.";
      } else {
        reason = "Requires 2 passes in Arts, Commerce, or Tech streams.";
      }
    } else if (program === 'Engineering Foundation') {
      fee = "LKR 180,000";
      if (passes >= 2 && (stream === 'Science' || stream === 'Tech') && mathPass) {
        eligible = true;
        reason = "Science/Tech stream with Math pass confirmed.";
      } else {
        reason = "Requires 2 passes in Science/Tech and a Credit in Mathematics.";
      }
    } else if (program === 'BSc Computing') {
      fee = "LKR 450,000 (Year 1)";
      if (passes >= 3) {
        eligible = true;
        reason = "Direct entry approved with 3 A/L passes.";
      } else {
        reason = "Conditional entry: 3 A/L passes or relevant Level 4 Diploma required.";
      }
    }

    setResult({ eligible, reason, fee, program });
  };

  return (
    <PageWrapper title="Eligibility Checker" subtitle="Automated entry requirement validation engine.">
      <Row gutter={24}>
        <Col span={10}>
          <Card 
            title={<div className="flex items-center gap-2 font-bold text-slate-800">Candidate Details</div>} 
            className="rounded-3xl shadow-sm border-slate-200 bg-white"
          >
            <Form form={form} layout="vertical" onFinish={checkEligibility} initialValues={{ passes: 0, stream: 'Any' }}>
              <Form.Item name="program" label="Target Program" rules={[{ required: true }]}>
                <Select placeholder="Select a program" options={[
                  { value: 'Diploma in IT', label: 'Diploma in IT' },
                  { value: 'Diploma in Business', label: 'Diploma in Business' },
                  { value: 'Engineering Foundation', label: 'Engineering Foundation' },
                  { value: 'BSc Computing', label: 'BSc Computing' },
                ]} />
              </Form.Item>
              <Form.Item name="stream" label="A/L Stream">
                <Select options={[
                  { value: 'Any', label: 'Any / Other' },
                  { value: 'Science', label: 'Biological/Physical Science' },
                  { value: 'Commerce', label: 'Commerce' },
                  { value: 'Arts', label: 'Arts' },
                  { value: 'Tech', label: 'Technology' },
                ]} />
              </Form.Item>
              <Form.Item name="passes" label="A/L Pass Count">
                <Select options={[0, 1, 2, 3].map(v => ({ value: v, label: `${v} Passes` }))} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="mathPass" label="Math Credit?" initialValue={false}>
                    <Select options={[{value:true, label:'Yes'},{value:false, label:'No'}]} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="englishPass" label="English Credit?" initialValue={true}>
                    <Select options={[{value:true, label:'Yes'},{value:false, label:'No'}]} />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit" block size="large" className="rounded-xl h-12 font-bold bg-blue-600 mt-4 shadow-lg shadow-blue-100">Check Eligibility</Button>
              <Button type="text" block onClick={() => { form.resetFields(); setResult(null); }} className="mt-2 text-slate-400 font-semibold">Clear Form</Button>
            </Form>
          </Card>
        </Col>
        
        <Col span={14}>
          {result ? (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <Card className={`rounded-3xl border-2 shadow-xl ${result.eligible ? 'border-green-200 !bg-green-50' : 'border-red-200 !bg-red-50'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${result.eligible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {result.eligible ? '✓' : '⚠'}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
                      {result.eligible ? 'Eligible for Admission' : 'Not Currently Eligible'}
                    </h2>
                    <p className="text-slate-600 font-medium mt-1">{result.program}</p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Evaluation Result</p>
                    <p className="text-slate-800 font-bold">{result.reason}</p>
                  </div>
                  
                  <div className="bg-white/60 p-4 rounded-2xl backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Course Fee</p>
                    <p className="text-blue-600 text-xl font-black">{result.fee}</p>
                  </div>
                </div>

                {result.eligible ? (
                  <Button type="primary" size="large" className="w-full mt-6 h-14 rounded-2xl bg-green-600 hover:bg-green-700 font-bold border-none shadow-lg shadow-green-200">
                    Proceed to Registration
                  </Button>
                ) : (
                  <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 italic text-amber-700 text-sm">
                    <strong>Note:</strong> Students who do not meet these requirements may be eligible for a bridge program. Contact admissions for more details.
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-slate-50/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4 text-slate-300">🔍</div>
              <h3 className="text-slate-400 font-bold">Waiting for details...</h3>
              <p className="text-slate-400 text-sm max-w-xs mt-2">Enter student qualifications on the left to check eligibility for academic programs.</p>
            </div>
          )}
        </Col>
      </Row>
    </PageWrapper>
  );
};

const VersionControlPage = ({ versions, setVersions }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const { message: messageApi } = App.useApp();

  const handleOpenCompare = (item) => {
    setSelectedVersion(item);
    setIsCompareOpen(true);
  };

  const handleOpenRestore = (item) => {
    setSelectedVersion(item);
    setIsRestoreModalOpen(true);
  };

  const handleRestoreConfirm = () => {
    messageApi.success(`Version ${selectedVersion?.version} restored successfully`);
    setIsRestoreModalOpen(false);
    setSelectedVersion(null);
  };

  const filteredVersions = versions.filter(v => {
    const matchesSearch = v.itemName.toLowerCase().includes(search.toLowerCase()) || 
                         v.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: versions.length,
    published: versions.filter(v => v.status === 'Published').length,
    draft: versions.filter(v => v.status === 'Draft').length,
    archived: versions.filter(v => v.status === 'Archived').length
  };

  return (
    <div className="-m-6">
      {/* 1. Header Area */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Curriculum Version History</h1>
          <p className="text-slate-500 text-sm mt-1">Track curriculum evolution and rollback changes.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:border-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            defaultValue="All" 
            className="w-36 premium-select"
            onChange={(val) => setFilter(val)}
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Diploma', label: 'Diplomas' },
              { value: 'Course', label: 'Courses' },
              { value: 'Module', label: 'Modules' }
            ]}
          />
          <button className="bg-white border border-slate-200 rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center gap-2">
            <DownloadOutlined /> Export Log
          </button>
        </div>
      </div>

      {/* 2. Filter Pills Row */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex gap-2">
          {['All', 'Published', 'Draft', 'Archived'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === t ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="bg-white border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50">
          <FilterOutlined /> More Filters
        </button>
      </div>

      <div className="px-8 mt-8 space-y-8">
        {/* 3. Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-xl group-hover:scale-110 transition-transform">
                <HistoryOutlined />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.total}</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Total Snapshots</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-xl group-hover:scale-110 transition-transform">
                <CheckCircleOutlined />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.published}</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Published</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-xl text-xl group-hover:scale-110 transition-transform">
                <EditOutlined />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pending</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.draft}</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Draft Versions</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-slate-50 text-slate-600 p-3 rounded-xl text-xl group-hover:scale-110 transition-transform">
                <CloseCircleOutlined />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Past</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.archived}</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Archived</p>
          </div>
        </div>

        {/* 4. Main List/Table Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-12">
          {filteredVersions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {/* Header Row */}
              <div className="bg-slate-50 grid grid-cols-7 px-8 py-4 border-b border-slate-200 items-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Info</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Version</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updated</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest col-span-1">Summary</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</div>
              </div>

              {/* Data Rows */}
              {filteredVersions.map(item => (
                <div key={item.id} className="grid grid-cols-7 px-8 py-5 hover:bg-slate-50 transition items-center group">
                  {/* Item Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                      {getInitials(item.itemName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.itemName}</p>
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Academic Catalog</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex justify-center">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black rounded-full px-3 py-1 uppercase tracking-wider border border-slate-200">
                      {item.type}
                    </span>
                  </div>

                  {/* Version */}
                  <div className="flex justify-center">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg px-2 py-1 border border-blue-100 flex items-center gap-1">
                      <ClockCircleOutlined className="text-[8px]" /> {item.version || 'v1.0'}
                    </span>
                  </div>

                  {/* Updated */}
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-none">{dayjs(item.date).format('DD MMM YYYY')}</p>
                    <p className="text-slate-400 text-[10px] mt-1 italic font-medium">by {item.updatedBy || 'Admin'}</p>
                  </div>

                  {/* Summary */}
                  <div className="col-span-1">
                    <p className="text-slate-500 text-xs italic line-clamp-2 pr-4 leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'Published' ? 'bg-green-100 text-green-700 border-green-200' :
                      item.status === 'Draft' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenCompare(item)}
                      className="bg-white border border-slate-200 text-slate-700 rounded-full px-3 py-1.5 text-[10px] font-bold hover:bg-slate-50 transition shadow-sm"
                    >
                      Compare
                    </button>
                    <button 
                      onClick={() => handleOpenRestore(item)}
                      className="bg-blue-50 border border-blue-200 text-blue-600 rounded-full px-3 py-1.5 text-[10px] font-bold hover:bg-blue-100 transition shadow-sm"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="text-6xl mb-6 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">🗃️</div>
              <h2 className="text-xl font-bold text-slate-900">No version history found.</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">Try adjusting your filters or search keywords to find specific snapshots.</p>
              <button onClick={() => { setSearch(''); setFilter('All'); }} className="mt-6 text-blue-600 font-bold text-sm hover:underline">Clear all filters</button>
            </div>
          )}
          
          {/* Pagination */}
          {filteredVersions.length > 0 && (
            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">Showing <span className="text-slate-900 font-bold">{filteredVersions.length}</span> of <span className="text-slate-900 font-bold">{versions.length}</span> results</span>
              <Pagination size="small" total={filteredVersions.length} pageSize={10} className="rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal Redesign */}
      <Modal 
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-blue-600" />
            <span className="font-bold text-slate-900">Premium Version Comparison</span>
          </div>
        } 
        open={isCompareOpen} 
        onCancel={() => setIsCompareOpen(false)} 
        footer={null} 
        width={900} 
        centered 
        className="premium-modal"
      >
        <div className="py-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Previous Version */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 relative">
              <div className="absolute -top-3 left-6 bg-slate-200 text-slate-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-300">Current Version (v1.0.1)</div>
              <div className="mt-4 space-y-4">
                {[
                  { label: 'Base Fee', value: 'LKR 140,000' },
                  { label: 'Duration', value: '12 Months' },
                  { label: 'Requirement', value: '2 A/L passes' },
                  { label: 'Status', value: 'Published', active: true }
                ].map(f => (
                  <div key={f.label} className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</span>
                    <span className={`text-sm font-bold ${f.active ? 'text-green-600' : 'text-slate-900'}`}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Version */}
            <div className="bg-blue-50/50 rounded-3xl border border-blue-200 p-6 relative overflow-hidden">
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">Comparison Version ({selectedVersion?.version || 'v1.0.2'})</div>
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Changes Detected</span>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center border-b border-blue-100 pb-3 group">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Base Fee</span>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 line-through">LKR 140,000</p>
                    <p className="text-sm font-black text-blue-600 flex items-center gap-1 justify-end mt-1">LKR 150,000 <span className="text-[10px] text-blue-400">↑</span></p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                  <span className="text-sm font-bold text-slate-900">12 Months</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-3 group">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Requirement</span>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 line-through">2 A/L passes</p>
                    <p className="text-sm font-black text-blue-600 mt-1 uppercase tracking-tight">2 A/L passes + Math</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-widest italic">{selectedVersion?.status || 'Draft'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-blue-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Ready to restore?</p>
              <h4 className="text-lg font-bold">This will replace the current live version.</h4>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsCompareOpen(false)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full px-8 py-3 font-black text-sm transition transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={() => { setIsCompareOpen(false); handleOpenRestore(selectedVersion); }}
                className="bg-white text-blue-600 hover:scale-105 rounded-full px-8 py-3 font-black text-sm transition-all shadow-lg"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        title={<div className="font-bold text-slate-900">Confirm Version Restore</div>}
        open={isRestoreModalOpen}
        onCancel={() => setIsRestoreModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsRestoreModalOpen(false)} className="rounded-full">Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleRestoreConfirm} className="rounded-full bg-blue-600">Confim & Restore</Button>
        ]}
        centered
        className="premium-modal"
      >
        <div className="py-4">
          <p className="text-slate-600">Are you sure you want to restore <strong>{selectedVersion?.itemName}</strong> to version <strong>{selectedVersion?.version}</strong>?</p>
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-700 text-xs flex gap-3">
            <HistoryOutlined className="text-lg" />
            <p>This action will overwrite the current active version in the academic catalog. You can always revert this by restoring a previous version from this log.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [{ icon: <DashboardOutlined />, label: 'Dashboard', path: '/admin-dashboard' }],
  },
  {
    label: 'STUDENTS',
    items: [
      { icon: <CheckCircleOutlined />, label: 'Student Approvals', path: '/admin-dashboard/approvals' },
      { icon: <FormOutlined />, label: 'Manual Registration', path: '/admin-dashboard/registration' },
      { icon: <TeamOutlined />, label: 'User Management', path: '/admin-dashboard/users' },
    ],
  },
  {
    label: 'ACADEMICS',
    items: [
      { icon: <BookOutlined />, label: 'Course Management', path: '/admin-dashboard/courses' },
      { icon: <ScheduleOutlined />, label: 'Intake Scheduler', path: '/admin-dashboard/intake' },
      { icon: <CheckCircleOutlined />, label: 'Eligibility Checker', path: '/admin-dashboard/catalog' },
      { icon: <HistoryOutlined />, label: 'Curriculum History', path: '/admin-dashboard/version-control' },
    ],
  },
  {
    label: 'EVENTS',
    items: [{ icon: <CalendarOutlined />, label: 'Manage Workshops', path: '/admin-dashboard/workshops' }],
  },
  {
    label: 'FINANCE',
    items: [{ icon: <CreditCardOutlined />, label: 'Payment Management', path: '/admin-dashboard/payments' }],
  },
  {
    label: 'REPORTS',
    items: [{ icon: <BarChartOutlined />, label: 'Analytics & Reports', path: '/admin-dashboard/analytics' }],
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [adminName, setAdminName] = useState(user?.name || 'Admin');

  // --- ACADEMIC MODULE SHARED STATE ---
  const [diplomas, setDiplomas] = useState([
    { id: 'd1', code: 'DIP-IT-01', name: 'Diploma in Information Technology', duration: '1 Year', status: 'Active', fee: 150000, requirements: '2 A/L Passes', description: 'Comprehensive IT diploma covering programming, web dev, and databases.' },
    { id: 'd2', code: 'DIP-BUS-01', name: 'Diploma in Business Management', duration: '1 Year', status: 'Draft', fee: 120000, requirements: '2 A/L Passes', description: 'Focuses on marketing, accounting, and organizational leadership.' },
    { id: 'd3', code: 'DIP-ENG-01', name: 'Diploma in Engineering Foundation', duration: '1 Year', status: 'Active', fee: 180000, requirements: '2 A/L Passes (Science/Math)', description: 'Foundational concepts for civil and mechanical engineering.' }
  ]);

  const [courses, setCourses] = useState([
    { id: 'c1', code: 'CIT-101', name: 'Introduction to Computing', diploma: 'Diploma in Information Technology', intake: 'June 2026', fee: 450000, status: 'Active', requirements: '3 A/L Passes', stream: 'Any', minPasses: 3, description: 'Fundamentals of computer science and hardware.' },
    { id: 'c2', code: 'BUS-201', name: 'Principles of Management', diploma: 'Diploma in Business Management', intake: 'September 2026', fee: 380000, status: 'Draft', requirements: '3 A/L Passes', stream: 'Any', minPasses: 3, description: 'Core roles and responsibilities of managers in organizations.' },
    { id: 'c3', code: 'ENG-110', name: 'Engineering Mathematics', diploma: 'Diploma in Engineering Foundation', intake: 'July 2026', fee: 520000, status: 'Active', requirements: '3 A/L Passes', stream: 'Math', minPasses: 3, description: 'Advanced calculus and linear algebra for engineers.' }
  ]);

  const [modules, setModules] = useState([
    { id: 'm1', code: 'MOD-001', name: 'Computer Fundamentals', course: 'Introduction to Computing', credits: 4, semester: 1, status: 'Active', description: 'Learning about CPU, memory, and binary systems.' },
    { id: 'm2', code: 'MOD-002', name: 'Office Productivity Tools', course: 'Introduction to Computing', credits: 2, semester: 1, status: 'Active', description: 'Mastering Excel, Word, and specialized tools.' },
    { id: 'm3', code: 'MOD-003', name: 'Business Communication', course: 'Principles of Management', credits: 3, semester: 2, status: 'Draft', description: 'Effective professional writing and verbal communication.' }
  ]);

  const [intakes, setIntakes] = useState([
    { id: 'i1', courseName: 'BSc Computing', intakeName: 'June 2026', intakeDate: '2026-06-01', applicationDeadline: '2026-05-15', capacity: 60, filled: 45, status: 'Open' },
    { id: 'i2', courseName: 'Diploma in IT', intakeName: 'May 2026', intakeDate: '2026-05-01', applicationDeadline: '2026-04-20', capacity: 40, filled: 38, status: 'Closing Soon' },
    { id: 'i3', courseName: 'Diploma in Business', intakeName: 'September 2026', intakeDate: '2026-09-01', applicationDeadline: '2026-08-15', capacity: 50, filled: 10, status: 'Draft' },
    { id: 'i4', courseName: 'Engineering Foundation', intakeName: 'July 2026', intakeDate: '2026-07-01', applicationDeadline: '2026-03-01', capacity: 30, filled: 30, status: 'Closed' },
  ]);

  const [versions, setVersions] = useState([
    { id: 'v1', itemName: 'Diploma in IT', type: 'Diploma', version: 'v1.0.2', updatedBy: 'Admin', date: '2026-03-20', summary: 'Updated base fee and requirements', status: 'Published' },
    { id: 'v2', itemName: 'BSc Computing', type: 'Course', version: 'v2.1.0', updatedBy: 'Admin', date: '2026-03-24', summary: 'Added new module: AI Ethics', status: 'Draft' },
    { id: 'v3', itemName: 'Diploma in Business', type: 'Diploma', version: 'v1.0.0', updatedBy: 'Librarian', date: '2026-02-15', summary: 'Initial curriculum release', status: 'Archived' },
  ]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) setAdminName(user.name);
    
    // Add class to body for global CSS scoping
    document.body.classList.add('admin-dashboard');
    return () => document.body.classList.remove('admin-dashboard');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <App>
      <div className="admin-dashboard min-h-screen bg-slate-50">
  {/* Top Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Logo className="h-10" theme="light" />
            <span className="bg-blue-100 text-blue-700 text-xs font-bold rounded-full px-3 py-1 ml-1">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-semibold text-sm">{adminName}</span>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-red-100 transition">
              Logout
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 overflow-y-auto">
          <nav className="pt-4 pb-8">
            {NAV_SECTIONS.map(section => (
                <div key={section.label} className="mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2 mt-6">{section.label}</p>
                  {section.items.map(item => (
                      <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === '/admin-dashboard'}
                          className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200
                     ${isActive ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`
                          }
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                  ))}
                </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 pt-16 min-h-screen bg-slate-50 p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="approvals" element={<StudentApprovalsPage />} />
            <Route path="registration" element={<ManualRegistrationPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="courses" element={
              <CourseManagementPage 
                diplomas={diplomas} setDiplomas={setDiplomas} 
                courses={courses} setCourses={setCourses} 
                modules={modules} setModules={setModules}
                versions={versions} setVersions={setVersions}
              />
            } />
            <Route path="intake" element={<IntakeSchedulerPage intakes={intakes} setIntakes={setIntakes} courses={courses} />} />
            <Route path="catalog" element={<EligibilityCheckerPage courses={courses} />} />
            <Route path="version-control" element={<VersionControlPage versions={versions} setVersions={setVersions} />} />
            <Route path="workshops" element={<ManageWorkshopsPage />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </App>
  );
};

export default AdminDashboard;