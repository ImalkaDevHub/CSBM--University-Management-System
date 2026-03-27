import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import Logo from './components/Logo';
import loginBg from './assets/login-bg.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Student');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            });

            if (response.data.status === 'success') {
                // CRITICAL CHECK: If backend didn't return a token, backend might need restart
                if (!response.data.token) {
                    message.error("Security token missing! Please restart your backend Node.js server.");
                    setLoading(false);
                    return;
                }

                const role = response.data.user?.role || response.data.role || '';
                
                // Save user data to localStorage
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', response.data.name);
                localStorage.setItem('token', response.data.token);
                // Store full user object for dashboards
                localStorage.setItem('user', JSON.stringify({
                    _id: response.data.id || response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    role: role,
                }));

                // Show success message
                message.success(`Welcome back, ${response.data.name}!`);

                // Redirect based on role
                if (role.toLowerCase() === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            } else {
                message.error('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fill for demo purposes when switching tabs
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === 'Admin') {
            setEmail('admin@csbm.lk');
            setPassword('');
        } else {
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">

            {/* --- LEFT SIDE: IMAGE BANNER --- */}
            {/* Using our custom generated local image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <img
                    src={loginBg}
                    alt="Students on campus"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Logo top left */}
                <div className="absolute top-10 left-12 z-10">
                    <Logo className="h-10 text-white" />
                </div>

                {/* Text bottom left */}
                <div className="absolute bottom-16 left-12 right-12 z-10">
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
                        Discover the <span className="text-[#FF6B35]">future</span> of <br /> your education
                    </h1>
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#FAFAFA]">
                <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-slate-500 text-sm font-medium">Please enter your details to sign in.</p>
                    </div>

                    {/* Role Toggle Switch */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-8 relative">
                        <div
                            className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${activeTab === 'Admin' ? 'translate-x-full' : 'translate-x-0'}`}
                        ></div>
                        <button
                            onClick={() => handleTabSwitch('Student')}
                            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${activeTab === 'Student' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => handleTabSwitch('Admin')}
                            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${activeTab === 'Admin' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all font-mono"
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-sm font-bold text-[#FF6B35] hover:text-[#e85b28] transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-2 bg-[#FF6B35] hover:bg-[#e85b28] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#FF6B35]/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                `Sign in as ${activeTab}`
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                            <span className="px-4 bg-white text-slate-400">OR</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 384 512" fill="currentColor">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#000000" />
                            </svg>
                            Apple
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
