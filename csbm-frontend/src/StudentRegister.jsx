import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Phone, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Logo from './components/Logo';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      // Redirect to login upon successful registration
      navigate('/login');
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

  const inputClasses = "w-full bg-slate-800/80 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all text-white placeholder:text-slate-400 text-sm sm:text-base";
  const iconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none";

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
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Start your learning journey today</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`${inputClasses} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
              color: '#0f172a',
            }}
            className="w-full font-black py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-slate-900 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors ml-1">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegister;