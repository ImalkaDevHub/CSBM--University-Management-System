import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    BookOpen,
    Calendar,
    Users,
    FilePlus,
    ClipboardList,
    PieChart
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen }) => {
    const links = [
        { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard, section: 'Student' },
        { name: 'Apply Now', path: '/apply', icon: GraduationCap, section: 'Student' },
        { name: 'My Courses', path: '/courses', icon: BookOpen, section: 'Student' },
        { name: 'Workshops', path: '/workshops', icon: Calendar, section: 'Student' },

        { name: 'Approvals', path: '/admin', icon: Users, section: 'Admin' },
        { name: 'Intake Scheduler', path: '/intakes', icon: Calendar, section: 'Admin' },
        { name: 'Manual Entry', path: '/manual-entry', icon: FilePlus, section: 'Admin' },
        { name: 'Manage Workshops', path: '/admin-workshops', icon: ClipboardList, section: 'Admin' },
        { name: 'Analytics', path: '/analytics', icon: PieChart, section: 'Admin' },
    ];

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-md border-r border-white/20 shadow-xl z-50 overflow-y-auto"
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    CS
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    CSBM LMS
                </span>
            </div>

            <div className="px-4 py-2">
                <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Portal</div>
                <nav className="space-y-1 mb-6">
                    {links.filter(l => l.section === 'Student').map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span className="font-medium">{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Tools</div>
                <nav className="space-y-1">
                    {links.filter(l => l.section === 'Admin').map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={clsx("w-5 h-5", isActive ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span className="font-medium">{link.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;
