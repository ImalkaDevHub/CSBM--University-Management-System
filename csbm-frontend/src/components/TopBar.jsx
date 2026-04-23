import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, MessageSquare, ChevronDown, Check, X } from 'lucide-react';
import adminProfileImg from '../assets/admin-profile.png';

// ── Mock notifications (replace with real API data later) ─────────────────────
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'info',
        title: 'Welcome to CSBM Portal!',
        message: 'Your student account has been successfully activated. Explore your dashboard.',
        time: '2 hours ago',
        isRead: false,
        icon: '🎉',
    },
    {
        id: 2,
        type: 'warning',
        title: 'Assignment Due Soon',
        message: 'Admin: "Assignment 1 – Essay" is due in 2 days. Please submit before the deadline.',
        time: '5 hours ago',
        isRead: false,
        icon: '📋',
    },
    {
        id: 3,
        type: 'success',
        title: 'Application Approved',
        message: 'Your application for BSc in Computer Science has been approved by the admissions office.',
        time: '1 day ago',
        isRead: false,
        icon: '✅',
    },
    {
        id: 4,
        type: 'info',
        title: 'New Workshop Available',
        message: 'Admin posted a new workshop: "Industry Trends in AI & ML" – Seats are limited!',
        time: '2 days ago',
        isRead: true,
        icon: '🎪',
    },
    {
        id: 5,
        type: 'info',
        title: 'Fee Payment Reminder',
        message: 'Your course fee installment is due on 30 Apr 2026. Visit the payment section to complete.',
        time: '3 days ago',
        isRead: true,
        icon: '💳',
    },
];

// ── Colour helpers ────────────────────────────────────────────────────────────
const typeRing = {
    info:    'bg-blue-50 border-blue-100',
    warning: 'bg-amber-50 border-amber-100',
    success: 'bg-green-50 border-green-100',
};

// ─────────────────────────────────────────────────────────────────────────────
const TopBar = ({ isDark, toggleTheme }) => {
    const [searchFocused,  setSearchFocused]  = useState(false);
    const [profileOpen,    setProfileOpen]    = useState(false);
    const [isNotifOpen,    setIsNotifOpen]    = useState(false);
    const [notifications,  setNotifications]  = useState(MOCK_NOTIFICATIONS);

    // Refs for click-outside detection
    const notifRef   = useRef(null);
    const profileRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const markOneRead = (id) =>
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );

    const dismissOne = (id, e) => {
        e.stopPropagation();
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">

            {/* Left — Logo / Title */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-black tracking-tight">CS</span>
                </div>
                <div>
                    <span className="text-slate-900 font-bold text-sm tracking-tight">CSBM</span>
                    <span className="text-slate-400 text-xs block leading-none -mt-0.5">Campus Portal</span>
                </div>
            </div>

            {/* Centre — Search */}
            <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-200 w-80 mx-8
                    ${searchFocused
                        ? 'bg-white ring-2 ring-blue-500/20 border border-blue-200 shadow-sm'
                        : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                    }`}
            >
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search courses, students, reports..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Right — Icons + Profile */}
            <div className="flex items-center gap-1 flex-shrink-0">

                {/* Messages */}
                <button className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                    <MessageSquare className="w-5 h-5" />
                </button>

                {/* ── Notification Bell ─────────────────────────────────── */}
                <div className="relative" ref={notifRef}>
                    <button
                        id="notif-bell-btn"
                        onClick={() => setIsNotifOpen((prev) => !prev)}
                        className={`relative p-2.5 rounded-full transition-all duration-200
                            ${isNotifOpen
                                ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        aria-label="Notifications"
                        aria-expanded={isNotifOpen}
                    >
                        <Bell className={`w-5 h-5 transition-transform duration-300 ${isNotifOpen ? 'rotate-12' : ''}`} />
                        {/* Unread badge */}
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-white text-[9px] font-black leading-none px-0.5">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {/* ── Notification Dropdown ──────────────────────────── */}
                    {isNotifOpen && (
                        <div
                            id="notif-dropdown"
                            className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-black rounded-full px-2 py-0.5 leading-none">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notification list */}
                            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        <Bell className="w-8 h-8 mb-3 opacity-30" />
                                        <p className="text-sm font-medium">All caught up!</p>
                                        <p className="text-xs mt-1">No notifications right now.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markOneRead(notif.id)}
                                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors group
                                                ${notif.isRead
                                                    ? 'hover:bg-slate-50'
                                                    : 'bg-blue-50/60 hover:bg-blue-50'
                                                }`}
                                        >
                                            {/* Icon bubble */}
                                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${typeRing[notif.type] || typeRing.info}`}>
                                                {notif.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm leading-snug font-semibold truncate
                                                        ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                                        {notif.title}
                                                    </p>
                                                    {/* Unread dot */}
                                                    {!notif.isRead && (
                                                        <span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                                            </div>

                                            {/* Dismiss (×) */}
                                            <button
                                                onClick={(e) => dismissOne(notif.id, e)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5"
                                                aria-label="Dismiss"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80">
                                <button className="w-full text-center text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors py-1">
                                    View all notifications →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* ──────────────────────────────────────────────────────── */}

                {/* Divider */}
                <div className="h-7 w-px bg-slate-200 mx-2" />

                {/* User Profile */}
                <div
                    className="relative"
                    ref={profileRef}
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                >
                    <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200 group">
                        {/* Avatar — real profile photo */}
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100 shadow-sm flex-shrink-0">
                            <img
                                src={adminProfileImg}
                                alt="Admin profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Name */}
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-semibold text-slate-800 leading-tight">Imalka Madushan</span>
                            <span className="text-xs text-slate-400 leading-tight">Student</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50">
                            <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 flex-shrink-0">
                                    <img src={adminProfileImg} alt="Admin" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800">Imalka Madushan</div>
                                    <div className="text-xs text-slate-400 mt-0.5">Student · CSBM Campus</div>
                                </div>
                            </div>
                            {[
                                { label: 'My Profile', icon: '👤' },
                                { label: 'Settings',   icon: '⚙️' },
                                { label: 'Help & Support', icon: '💬' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                            <div className="border-t border-slate-50 mt-1 pt-1">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                                    <span>🚪</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
