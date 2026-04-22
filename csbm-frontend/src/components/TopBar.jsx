import React, { useState } from 'react';
import { Bell, Search, MessageSquare, ChevronDown, User } from 'lucide-react';

const TopBar = ({ isDark, toggleTheme }) => {
    const [searchFocused, setSearchFocused] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

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

                {/* Notifications */}
                <button className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* Divider */}
                <div className="h-7 w-px bg-slate-200 mx-2" />

                {/* User Profile */}
                <div
                    className="relative"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                >
                    <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200 group">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        {/* Name */}
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-semibold text-slate-800 leading-tight">Imalka Madushan</span>
                            <span className="text-xs text-slate-400 leading-tight">Student</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-100 rounded-2xl shadow-lg py-2 z-50">
                            <div className="px-4 py-3 border-b border-slate-50">
                                <div className="text-sm font-semibold text-slate-800">Imalka Madushan</div>
                                <div className="text-xs text-slate-400 mt-0.5">Student · CSBM Campus</div>
                            </div>
                            {[
                                { label: 'My Profile', icon: '👤' },
                                { label: 'Settings', icon: '⚙️' },
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
