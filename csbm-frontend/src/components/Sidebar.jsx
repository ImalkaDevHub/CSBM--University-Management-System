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
import { usePermission } from '../hooks/usePermission';

const Sidebar = ({ isOpen }) => {
    const { hasPermission } = usePermission();

    const links = [
        { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard, section: 'Student', permission: 'student_dashboard' },
        { name: 'Apply Now', path: '/apply', icon: GraduationCap, section: 'Student', permission: 'student_dashboard' },
        { name: 'My Courses', path: '/courses', icon: BookOpen, section: 'Student', permission: 'student_dashboard' },
        { name: 'Workshops', path: '/workshops', icon: Calendar, section: 'Student', permission: 'student_dashboard' },

        { name: 'Approvals', path: '/admin', icon: Users, section: 'Admin', permission: 'student_approvals' },
        { name: 'Intake Scheduler', path: '/intakes', icon: Calendar, section: 'Admin', permission: 'course_management' },
        { name: 'Manual Entry', path: '/manual-entry', icon: FilePlus, section: 'Admin', permission: 'manual_registration' },
        { name: 'Manage Workshops', path: '/admin-workshops', icon: ClipboardList, section: 'Admin', permission: 'manage_workshops' },
        { name: 'Analytics', path: '/analytics', icon: PieChart, section: 'Admin', permission: 'analytics_reports' },
        { name: 'User Management', path: '/users', icon: Users, section: 'Admin', permission: 'user_management' },
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

            <div className="py-2">
                <div className="mb-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Portal</div>
                <nav className="space-y-1 mb-8">
                    {links.filter(l => l.section === 'Student' && hasPermission(l.permission)).map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 py-3 w-full transition-all duration-300 group",
                                isActive
                                    ? "border-l-4 border-blue-600 pl-5 pr-4 text-blue-600 bg-transparent"
                                    : "border-l-4 border-transparent pl-5 pr-4 text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700")} />
                                    <span className="font-medium">{link.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mb-3 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Tools</div>
                <nav className="space-y-1">
                    {links.filter(l => l.section === 'Admin' && hasPermission(l.permission)).map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 py-3 w-full transition-all duration-300 group",
                                isActive
                                    ? "border-l-4 border-blue-600 pl-5 pr-4 text-blue-600 bg-transparent"
                                    : "border-l-4 border-transparent pl-5 pr-4 text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700")} />
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
