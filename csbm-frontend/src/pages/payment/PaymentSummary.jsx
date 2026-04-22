import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/Logo';

// Dummy implementation of a sidebar navigation wrapper matching StudentDashboard logic
import { DashboardOutlined, FormOutlined, BookOutlined, CalendarOutlined, TeamOutlined, CopyOutlined } from '@ant-design/icons';

const PaymentSummary = () => {
  const location = useLocation();
  const { course } = location.state || {};
  const navigate = useNavigate();

  // Redirect instantly if accessed without state
  if (!course) {
    navigate('/student-dashboard');
  }

  const [paymentMethod, setPaymentMethod] = useState('payhere');
  const [processing, setProcessing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile fetch failed', err);
      }
    };
    fetchProfile();
  }, []);

  const total = (course?.fee || course?.courseFee || 150000) + 5000 + 2500;

  const handleProceedToPayment = async () => {
    if (paymentMethod !== 'payhere') {
      alert('Please select PayHere for online payment.');
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      // For sandbox testing we override amount, realistically we'd post `total`.
      const sandboxTotal = 100;

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentType: 'course',
          referenceId: course?._id || course?.id,
          itemName: course?.name,
          amount: sandboxTotal, // sandbox test amount
          firstName: profile?.name?.split(' ')[0] || 'Student',
          lastName: profile?.name?.split(' ')[1] || '',
          email: profile?.email || '',
          phone: profile?.phone || '0771234567'
        })
      });

      const data = await res.json();

      if (res.ok && data.paymentData) {
        navigate('/payment/processing', {
          state: {
            paymentData: data.paymentData,
            course: course
          }
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-body">
      <style>{`
        .primary-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .hero-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
        }
        .tonal-depth {
          background-color: #f2f3ff;
        }
      `}</style>
      
      {/* Sidebar fixed left */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white shadow-sm border-r border-outline-variant flex flex-col z-40 hidden lg:flex">
        <div className="p-8 flex justify-center">
          <Logo className="h-12" theme="light" />
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto w-full">
          {/* Active styling mock */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary-container text-white rounded-xl text-sm font-semibold cursor-pointer">
            <span className="material-symbols-outlined">school</span>
            <span>My Courses / Checkout</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl text-sm font-semibold cursor-pointer transition">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </div>
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 h-20 bg-white/80 backdrop-blur-md z-30 w-full flex justify-between items-center px-6 lg:px-12 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-2 shrink-0"></div>
          
          <div className="relative group max-w-md flex-1 mx-4 sm:mx-8">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-sm outline-none" 
              placeholder="Search courses, grades..." 
              type="text" 
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button className="relative p-2 text-outline hover:text-primary transition">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-on-surface">{profile?.name || 'Student Name'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container text-white font-bold text-sm flex items-center justify-center">
                US
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="px-12 py-8">
            <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">Payment Summary</h1>
            <p className="text-on-surface-variant mt-2 font-medium">Please review your order details before proceeding to checkout.</p>
          </div>

          <div className="px-12 pb-20 grid grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN */}
            <div className="col-span-8 space-y-10">
              
              {/* Course Summary Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm relative overflow-hidden group border border-outline-variant/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-12 -mt-12 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
                      ORD-{Date.now().toString(36).toUpperCase()}
                    </span>
                    <h2 className="text-2xl font-bold font-headline text-on-surface">{course?.name || 'Course Name'}</h2>
                  </div>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-md text-xs font-bold">
                    {course?.type || 'Diploma'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-6 relative z-10">
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Course Code</p>
                    <p className="font-bold font-headline mt-1">{course?.code || course?.courseCode || 'CSBM-UNKNOWN'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Duration</p>
                    <p className="font-bold font-headline mt-1">{course?.duration || '1 Year'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Campus</p>
                    <p className="font-bold font-headline mt-1">Main Campus, Colombo</p>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-bold font-headline mb-6 text-on-surface">Fee Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-on-surface-variant font-medium">Course Tuition Fee</span>
                    <span className="font-bold font-headline">LKR {(course?.fee || course?.courseFee || 150000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-on-surface-variant font-medium">Registration Fee</span>
                    <span className="font-bold font-headline">LKR 5,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-on-surface-variant font-medium">Technology & Library Fee</span>
                    <span className="font-bold font-headline">LKR 2,500</span>
                  </div>
                </div>
                <div className="border-t-2 border-dashed border-outline-variant/50 my-4 pt-6 flex justify-between items-center">
                  <span className="text-xl font-black font-headline text-on-surface">Total Amount</span>
                  <span className="text-2xl font-black text-primary">LKR {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm">
                  <h4 className="flex items-center gap-2 text-md font-bold font-headline mb-4 text-on-surface">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-on-surface-variant">Full Name</span>
                      <span className="text-xs font-bold text-on-surface">{profile?.name || 'Student Name'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-on-surface-variant">Email</span>
                      <span className="text-xs font-bold text-on-surface">{profile?.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-on-surface-variant">Phone</span>
                      <span className="text-xs font-bold text-on-surface">{profile?.phone || '+94 77 123 4567'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm">
                  <h4 className="flex items-center gap-2 text-md font-bold font-headline mb-4 text-on-surface">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Billing Address
                  </h4>
                  <p className="text-sm font-medium text-on-surface leading-relaxed">
                    CSBM Campus,<br />
                    Colombo 03,<br />
                    Sri Lanka
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-4">
                <h3 className="text-lg font-bold font-headline mb-6 text-on-surface">Payment Method</h3>
                <div className="grid grid-cols-3 gap-4">
                  
                  {/* PayHere Card */}
                  <div 
                    onClick={() => setPaymentMethod('payhere')}
                    className={`rounded-2xl p-6 cursor-pointer relative transition-all ${
                      paymentMethod === 'payhere' 
                        ? 'bg-white border-2 border-primary shadow-md' 
                        : 'bg-surface-container-lowest border-2 border-transparent hover:border-outline-variant shadow-sm'
                    }`}
                  >
                    {paymentMethod === 'payhere' && (
                      <span className="material-symbols-outlined absolute top-4 right-4 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-primary">credit_card</span>
                    </div>
                    <h4 className="font-bold text-on-surface">PayHere</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 tracking-widest">Cards / Mobile Wallets</p>
                  </div>

                  {/* Bank Transfer */}
                  <div 
                    onClick={() => setPaymentMethod('bank')}
                    className={`rounded-2xl p-6 cursor-pointer relative transition-all ${
                      paymentMethod === 'bank' 
                        ? 'bg-white border-2 border-primary shadow-md' 
                        : 'bg-surface-container-lowest border-2 border-transparent hover:border-outline-variant shadow-sm'
                    }`}
                  >
                    {paymentMethod === 'bank' && (
                      <span className="material-symbols-outlined absolute top-4 right-4 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-on-surface-variant">
                      <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <h4 className="font-bold text-on-surface">Bank Transfer</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 tracking-widest">Manual Upload</p>
                  </div>

                  {/* Pay on Campus */}
                  <div 
                    onClick={() => setPaymentMethod('campus')}
                    className={`rounded-2xl p-6 cursor-pointer relative transition-all ${
                      paymentMethod === 'campus' 
                        ? 'bg-white border-2 border-primary shadow-md' 
                        : 'bg-surface-container-lowest border-2 border-transparent hover:border-outline-variant shadow-sm'
                    }`}
                  >
                    {paymentMethod === 'campus' && (
                      <span className="material-symbols-outlined absolute top-4 right-4 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-on-surface-variant">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <h4 className="font-bold text-on-surface">Pay on Campus</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 tracking-widest">Cash / Cheque</p>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-4 sticky top-32">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-50">
                <h3 className="text-xl font-black font-headline mb-8 text-on-surface">Order Summary</h3>
                
                <div className="space-y-6 mb-8 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Subtotal Fees</span>
                    <span className="font-bold text-on-surface">LKR {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Service Charge</span>
                    <span className="font-bold text-green-600">LKR 0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-medium">Tax (VAT 0%)</span>
                    <span className="font-bold text-on-surface">LKR 0.00</span>
                  </div>
                </div>

                <div className="p-6 bg-surface-container rounded-xl mb-8 border border-primary/20">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">Total Payable Now</p>
                  <p className="text-3xl font-black font-headline text-primary tracking-tight">LKR {total.toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleProceedToPayment}
                    disabled={processing}
                    className="w-full primary-gradient text-white py-4 rounded-xl font-bold font-headline shadow-lg shadow-primary/30 hover:scale-[0.98] transition-transform disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {processing ? 'Connecting Gateway...' : 'Proceed to Payment →'}
                  </button>
                  <button className="w-full bg-surface-container-low text-on-surface-variant py-4 rounded-xl font-bold font-headline hover:bg-surface-container transition-colors">
                    Save for Later
                  </button>
                </div>

                {/* Security Badges */}
                <div className="mt-8 pt-8 border-t border-outline-variant/30 flex flex-wrap items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-on-surface">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-on-surface">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    SSL Encrypted
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-on-surface">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    PCI Compliant
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="mt-6 bg-secondary-container rounded-2xl p-6 text-white relative overflow-hidden group shadow-md">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:rotate-0 duration-500 text-8xl transition-all">support_agent</span>
                <h4 className="text-sm font-bold font-headline mb-2 relative z-10">Need Assistance?</h4>
                <p className="text-xs text-white/80 leading-relaxed font-medium max-w-[80%] relative z-10">Our finance team is available 24/7 to help you with your transactions.</p>
                <button className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold hover:bg-white/30 transition-colors relative z-10">
                  Contact Support
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentSummary;
