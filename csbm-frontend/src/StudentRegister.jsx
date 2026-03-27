import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Logo from './components/Logo';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobile,
        password: formData.password
      });

      // Show success message or redirect logic here
      // For now, redirect to login
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1E293B] rounded-3xl shadow-2xl border border-white/10 p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo layout="vertical" className="h-20" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start your learning journey today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className={iconClasses} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="relative">
            <Mail className={iconClasses} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="relative">
            <Phone className={iconClasses} />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              required
              value={formData.mobile}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="relative">
            <Lock className={iconClasses} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegister;