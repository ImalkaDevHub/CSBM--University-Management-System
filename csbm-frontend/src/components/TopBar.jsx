import React from 'react';
import { Bell, Search, Sun, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = ({ isDark, toggleTheme }) => {
    return (
        <header className="h-16 glass sticky top-0 z-40 px-6 flex items-center justify-between mb-6 rounded-2xl mx-4 mt-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-slate-100/50 px-4 py-2 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all w-96">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for courses, students, or reports..."
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-semibold text-slate-700">Imalka Madushan</div>
                        <div className="text-xs text-slate-400">Student</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
