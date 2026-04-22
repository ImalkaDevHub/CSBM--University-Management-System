import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const WorkshopList = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [registering, setRegistering] = useState(null);
  const [filter, setFilter] = useState('All');
  const [workshops, setWorkshops] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Check if application is approved
        try {
          const appRes = await fetch('/api/applications/my-application', { headers });
          if (appRes.ok) {
            const appData = await appRes.json();
            setIsApproved(appData.status === 'approved' || appData.status === 'APPROVED');
          }
        } catch {
          setIsApproved(false);
        }

        // Fetch workshops
        try {
          const wsRes = await fetch('/api/workshops', { headers });
          if (wsRes.ok) {
            const wsData = await wsRes.json();
            setWorkshops(Array.isArray(wsData) ? wsData : wsData.workshops || []);
          }
        } catch {
          setWorkshops([]);
        }

        // Fetch user registrations
        try {
          const regRes = await fetch('/api/workshops/my-registrations', { headers });
          if (regRes.ok) {
            const regData = await regRes.json();
            const ids = regData.map(r => r.workshop?._id || r.workshopId || r._id).filter(Boolean);
            setRegisteredWorkshops(ids);
          }
        } catch {
          setRegisteredWorkshops([]);
        }

      } finally {
        setCheckingAccess(false);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleRegister = async (workshopId) => {
    const wsId = String(workshopId);

    if (!isApproved || registering) return;
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    setRegistering(wsId);
    try {
      const res = await fetch('/api/workshops/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ workshopId: wsId })
      });

      const data = await res.json();

      if (res.ok) {
        setRegisteredWorkshops(prev => [...prev, wsId]);
        setRegisteredData(data);
        setIsModalVisible(true);
        messageApi.success('Successfully registered! 🎉');
        window.dispatchEvent(new Event('workshopRegistered'));
      } else if (res.status === 400) {
        if (data.message && data.message.toLowerCase().includes('already')) {
          messageApi.warning('Already registered for this workshop.');
          setRegisteredWorkshops(prev => [...prev, wsId]);
        } else {
          messageApi.error(data.message || 'Registration failed.');
        }
      } else if (res.status === 401) {
        window.location.href = '/login';
      } else if (res.status === 403) {
        messageApi.error('Application must be approved first.');
      } else {
        messageApi.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Register error:', err);
      messageApi.error('Network error.');
    } finally {
      setRegistering(null);
    }
  };

  const filteredWorkshops = filter === 'All' 
    ? workshops 
    : workshops.filter(w => {
        const t = (w.type || w.category || w.topic || '').toLowerCase();
        return t.includes(filter.toLowerCase());
      });

  if (checkingAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-10 max-w-[1600px] mx-auto w-full font-body">
      {contextHolder}

      <style>{`
        .font-headline { font-family: 'Manrope', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Access Restricted Banner - Shown if not approved */}
      {!isApproved && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <span className="text-3xl shrink-0">🔒</span>
          <div>
            <p className="font-bold text-slate-900">Access Restricted</p>
            <p className="text-slate-600 text-sm mt-1">
              You need an approved application to register for workshops. Your application is currently under review.
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-12">
        <h2 className="font-headline font-extrabold text-4xl text-slate-900 tracking-tight mb-2">
          Events & Workshops
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Discover and participate in upcoming academic and professional growth opportunities tailored for our elite campus community.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Workshops', 'Seminars', 'Leadership', 'Technology'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20 border border-transparent' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop, idx) => {
            const wsId = String(workshop._id || workshop.id);
            const isRegistered = registeredWorkshops.includes(wsId);
            
            // Generate some varied placeholder data if missing
            const themeColors = ['text-blue-600 text-purple-600', 'text-teal-600'];
            const capacityPercent = 50 + (idx * 15) % 45; // Just for visual purposes
            
            return (
              <div key={wsId} className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08)] group hover:-translate-y-1 transition-all duration-300 ${isRegistered ? 'border border-emerald-100' : 'border border-transparent'}`}>
                
                {/* Banner Image Area */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <div 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-center bg-cover"
                    style={{
                      backgroundImage: `url("${workshop.banner || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAegMJEHSw8GQesA0RKgOHOVNj6_l4rACPf0rzIvAI6WKp64N0ucr7HRXqaT6AlcHwTfLgvAapNyFJ35Ei6ufPbebpVnTvYs6Ub4x_uXKtC6apUrqJU6PX59NyvOk6L6rxYwj646d6iOcAEybd3G-rvTcogo5obFf6bZZOelrmlksZXzaaxqPEfv9XxD-fLSD-G0Iy76lQwkaAriixM9pOCgjwM1jt1Bm2oGp6msycAZnmifIv6u5TTvhZYhW57TVRnemk-QeH9P2w'}")`
                    }}
                  />
                  <div className="absolute top-4 left-4 border border-white/20 rounded-full">
                    <span className="bg-white/90 backdrop-blur-md text-[#2563eb] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      {workshop.type || workshop.category || 'Workshop'}
                    </span>
                  </div>
                  {isRegistered && (
                    <div className="absolute top-4 right-4 border border-white/20 rounded-full">
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> JOINED
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <h3 className="font-headline font-bold text-xl text-slate-900 mb-4 line-clamp-2 min-h-[3.5rem]">
                    {workshop.title || workshop.topic}
                  </h3>
                  
                  <div className="space-y-3 mb-6 text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                      <span className="text-sm font-medium">{formatDate(workshop.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">schedule</span>
                      <span className="text-sm font-medium">{workshop.time || '10:00 AM - 02:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                      <span className="text-sm font-medium truncate">{workshop.location || workshop.venue || 'Virtual / Main Campus'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-500 text-lg">person</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {workshop.speaker || 'TBA'}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500">Capacity</span>
                      <span className={capacityPercent > 90 ? 'text-red-500' : 'text-[#2563eb]'}>
                        {Math.floor((capacityPercent/100)*100)}/100 Seats {capacityPercent > 90 ? '(Almost Full)' : ''}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${capacityPercent > 90 ? 'bg-red-500' : 'bg-[#2563eb]'}`}
                        style={{ width: `${capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isRegistered ? (
                    <button className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 py-3 rounded-full font-bold flex items-center justify-center gap-2 cursor-default transition-all">
                      <span className="material-symbols-outlined text-[18px]">check</span> Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(wsId)}
                      disabled={!isApproved || registering === wsId}
                      className={`w-full py-3 rounded-full font-bold transition-all ${
                        !isApproved 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : registering === wsId 
                            ? 'bg-blue-400 text-white cursor-wait' 
                            : 'bg-[#2563eb] text-white hover:shadow-lg hover:shadow-blue-600/20'
                      }`}
                    >
                      {registering === wsId ? 'Registering...' : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">event_busy</span>
            <h3 className="font-bold text-xl text-slate-900">No Workshops Found</h3>
            <p className="text-slate-500 text-sm mt-2">
              There are currently no events matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Promotion / Feature Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-[#2563eb] rounded-3xl p-10 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
          <div className="relative z-10">
            <h2 className="text-white font-headline font-extrabold text-3xl md:text-4xl mb-4 leading-tight">Master the Art of <br/>Modern Leadership</h2>
            <p className="text-blue-100 text-base md:text-lg mb-8 max-w-md">Join our exclusive 4-week certification program for aspiring professionals.</p>
            <button className="bg-white text-[#2563eb] px-8 py-3.5 rounded-xl font-extrabold flex items-center gap-2 hover:bg-blue-50 transition-colors w-fit">
              Apply for Fellowship
              <span className="material-symbols-outlined">trending_flat</span>
            </button>
          </div>
          <div className="absolute right-[-5%] top-[-10%] opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
        </div>
        <div className="bg-[#6b38d4] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
          <h3 className="text-white font-headline font-bold text-2xl mb-2">Campus Perks</h3>
          <p className="text-purple-200 text-sm mb-6 max-w-[200px]">Earn credits for every workshop you attend this semester.</p>
          <a className="text-white underline font-bold decoration-white/30 underline-offset-4 hover:decoration-white transition-colors" href="#">View Credit History</a>
        </div>
      </div>

      {/* Registration Success Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-[#2563eb] font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span> Registration Confirmed
          </div>
        }
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <button
            key="close"
            onClick={() => setIsModalVisible(false)}
            className="rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-2.5 text-sm font-bold shadow-md transition-colors"
          >
            Done
          </button>
        ]}
        centered
        className="rounded-2xl overflow-hidden"
      >
        {registeredData && (
          <div className="py-6">
            <p className="text-slate-600 mb-4">
              You have successfully secured your spot. A confirmation email has been sent to your registered address.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-4">
               <span className="text-3xl text-yellow-500 mt-1">🎟️</span>
               <div>
                 <p className="font-bold text-slate-900 text-lg">{registeredData.workshopName || 'Upcoming Event'}</p>
                 <p className="text-sm text-slate-500 mt-1">Make sure to add this to your calendar and arrive 15 minutes early.</p>
               </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default WorkshopList;