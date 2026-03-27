import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, message } from 'antd';

const WorkshopList = () => {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [registering, setRegistering] = useState(null);
  const [filter, setFilter] = useState('All Events');
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

        try {
          const appRes = await fetch(
              '/api/applications/my-application',
              { headers }
          );
          if (appRes.ok) {
            const appData = await appRes.json();
            setIsApproved(
                appData.status === 'approved' ||
                appData.status === 'APPROVED'
            );
          }
        } catch {
          setIsApproved(false);
        }

        try {
          const wsRes = await fetch(
              '/api/workshops',
              { headers }
          );
          if (wsRes.ok) {
            const wsData = await wsRes.json();
            setWorkshops(
                Array.isArray(wsData)
                    ? wsData
                    : wsData.workshops || []
            );
          }
        } catch {
          setWorkshops([]);
        }

        try {
          const regRes = await fetch(
              '/api/workshops/my-registrations',
              { headers }
          );
          if (regRes.ok) {
            const regData = await regRes.json();
            const ids = regData.map(r =>
                r.workshop?._id ||
                r.workshopId ||
                r._id
            ).filter(Boolean);
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
    // Convert to string to ensure correct format
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
        body: JSON.stringify({
          workshopId: wsId
        })
      });

      const data = await res.json();
      console.log('Register response:', res.status, data);

      if (res.ok) {
        setRegisteredWorkshops(prev =>
            [...prev, wsId]
        );
        setRegisteredData(data);
        setIsModalVisible(true);
        messageApi.success(
            'Successfully registered! 🎉'
        );
        // Trigger dashboard refresh
        window.dispatchEvent(
            new Event('workshopRegistered')
        );
      } else if (res.status === 400) {
        if (data.message && data.message.toLowerCase().includes('already')) {
          messageApi.warning(
              'Already registered for this workshop.'
          );
          setRegisteredWorkshops(prev =>
              [...prev, wsId]
          );
        } else {
          messageApi.error(
              data.message || 'Registration failed.'
          );
        }
      } else if (res.status === 401) {
        window.location.href = '/login';
      } else if (res.status === 403) {
        messageApi.error(
            'Application must be approved first.'
        );
      } else {
        messageApi.error(
            data.message || 'Registration failed.'
        );
      }
    } catch (err) {
      console.error('Register error:', err);
      messageApi.error('Network error.');
    } finally {
      setRegistering(null);
    }
  };

  if (checkingAccess) {
    return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0f1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}/>
          <p style={{ color: '#94a3b8' }}>
            Loading workshops...
          </p>
          <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        </div>
    );
  }

  return (
      <div className="bg-[#f6f6f8] dark:bg-[#101622]
      text-slate-900 dark:text-slate-100
      min-h-screen font-display">
        {contextHolder}
        <div className="relative flex min-h-screen
        w-full flex-col overflow-x-hidden">
          <div className="layout-container flex
          h-full grow flex-col">

            {/* Navbar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-40 py-3 sticky top-0 z-50">
              <div className="flex items-center gap-8">
                <div className="hidden md:flex
                items-center gap-9">
                  <Link
                      className="text-slate-700
                    dark:text-slate-300 text-sm
                    font-medium hover:text-[#135bec]
                    transition-colors"
                      to="#">
                    Events
                  </Link>
                  <Link
                      className="text-slate-700
                    dark:text-slate-300 text-sm
                    font-medium hover:text-[#135bec]
                    transition-colors"
                      to="#">
                    Workshops
                  </Link>
                  <Link
                      className="text-slate-700
                    dark:text-slate-300 text-sm
                    font-medium hover:text-[#135bec]
                    transition-colors"
                      to="#">
                    Seminars
                  </Link>
                  <Link
                      className="text-slate-700
                    dark:text-slate-300 text-sm
                    font-medium hover:text-[#135bec]
                    transition-colors"
                      to="/student-dashboard">
                    My Bookings
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 justify-end gap-4 md:gap-8">
                <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
                    <div className="text-slate-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined text-xl">search</span>
                    </div>
                    <input
                        className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 text-base font-normal px-2"
                        placeholder="Search events..."
                        defaultValue=""
                    />
                  </div>
                </label>
                <button className="flex cursor-pointer items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">
                  notifications
                </span>
                </button>
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200"
                    style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwhX9Xxo8Ati2XVao7GQ-FMNcDBnigO7ZnqIK1zyTutotJc3yUzJJxpHEbw5gBXAUPK9uT_tUGbqASlp8sFgHWeLgWQqEm67ntf5Gj01BQST85CDcAydP6LIhxG_UwKm6slaz13OmZrikf8w-P6OP_TmHPDU6yPMCBlsdsElylUQslAZMV6QxOD_dKh5-7W3_im0cIOwWv4M91x_chcqUJisGT_2D8DnXfBLzjAgkxXz1aAPeRs480BTdo8MpCZYCDu4c1HZ5DYPw")'
                    }}>
                </div>
              </div>
            </header>

            <main className="px-6 lg:px-40
            py-8 flex-1">

              {/* Access Restricted Banner */}
              {!isApproved && (
                  <div className="bg-yellow-50
                border border-yellow-200
                rounded-2xl p-6 mb-8
                flex items-start gap-4">
                <span className="text-3xl shrink-0">
                  🔒
                </span>
                    <div>
                      <p className="font-bold
                    text-slate-900">
                        Access Restricted
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        You need an approved application to register for workshops. Your application is currently under review.
                      </p>
                    </div>
                  </div>
              )}

              {/* Hero Featured Event */}
              <div className="@container mb-12">
                <div className="flex flex-col gap-6
                lg:flex-row bg-white dark:bg-slate-900
                rounded-2xl overflow-hidden shadow-sm
                border border-slate-200
                dark:border-slate-800">
                  <div
                      className="w-full lg:w-3/5 bg-center bg-no-repeat aspect-video bg-cover"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjGE5NIIACRG3hcO-LbVSMaWiUABBVd-94V-PzqMsxUXbEV4sP2HF7_8f4FBbNb2VzYZ2uncPR_9CgA_JO6AuUYK9Q59fNAAeTV-EkEn1FmChY9zsmmKHKdWX4Cc2IdQYVjnICZzKpRZCBACGgDk2LR7ZNHWNO4T4OZ7ywZ1OJV04xf4P7ZCwrRzRAyy6ql8UjUrKHPI-YuxwrMH_rDpPiB2obn2WWhNW4HHVBJdguzSE5U4ZhQ6zMCpHbXJaJqB2QH4lFZjzP4f8")'
                      }}>
                  </div>
                  <div className="flex flex-col gap-6
                  p-8 lg:w-2/5 justify-center">
                    <div className="flex flex-col gap-3">
                    <span className="inline-flex
                      items-center rounded-full
                      bg-[#135bec]/10 px-3 py-1
                      text-xs font-bold
                      text-[#135bec] uppercase
                      tracking-wider w-fit">
                      Featured Seminar
                    </span>
                      <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
                        The Future of AI in Modern Business Leadership
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                        Join industry leaders from Silicon Valley for an intensive seminar on leveraging generative AI for organizational growth.
                      </p>
                      <div className="flex flex-col
                      gap-2 mt-2">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-sm text-[#135bec]">
                          calendar_today
                        </span>
                          <span>
                          October 24, 2026 • 09:00 AM - 04:00 PM
                        </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-sm text-[#135bec]">
                          location_on
                        </span>
                          <span>
                          Main Auditorium, CSBM Campus
                        </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1
                      lg:flex-none flex min-w-[140px]
                      items-center justify-center
                      rounded-lg h-12 bg-[#135bec]
                      text-white text-base font-bold
                      hover:bg-blue-700
                      transition-colors">
                        Register Now
                      </button>
                      <button className="flex
                      items-center justify-center
                      rounded-lg size-12 border
                      border-slate-200
                      dark:border-slate-700
                      text-slate-700
                      dark:text-slate-300
                      hover:bg-slate-50
                      transition-colors">
                      <span className=
                                "material-symbols-outlined">
                        share
                      </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row
              md:items-center justify-between
              gap-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {['All Events', 'Business',
                    'Technology', 'Leadership'
                  ].map(f => (
                      <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`flex h-10 items-center 
                      justify-center gap-x-2 
                      rounded-lg px-5 text-sm 
                      font-semibold transition-colors
                      ${filter === f
                              ? 'bg-[#135bec] text-white'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#135bec]'
                          }`}
                      >
                        {f}
                      </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10
                  bg-slate-100 dark:bg-slate-800
                  rounded-lg p-1">
                    <button className="flex items-center
                    px-4 rounded-md bg-white
                    dark:bg-slate-700 shadow-sm
                    text-[#135bec] text-sm font-bold">
                    <span className=
                              "material-symbols-outlined
                      mr-2 text-lg">
                      grid_view
                    </span>
                      Grid
                    </button>
                    <button className="flex items-center px-4 rounded-md text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <span className="material-symbols-outlined mr-2 text-lg">calendar_month</span>
                      Calendar
                    </button>
                  </div>
                </div>
              </div>

              {/* Workshop Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-64 animate-pulse"
                        />
                    ))
                ) : workshops.length > 0 ? (
                    workshops.map((workshop) => (
                        <div
                            key={workshop._id || workshop.id}
                            className="flex flex-col bg-[#101622] rounded-xl overflow-hidden border border-slate-800 shadow-lg group hover:shadow-xl transition-shadow w-full max-w-sm mx-auto">
                          <div
                              className="relative h-56
                        w-full bg-cover bg-center"
                              style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAg0nc8-1YzIRd98hsK88Cub_dokxtRBOjp45Dj2ic8QMgxOeKMOVLgyF7IgLKkVc9P_VDEBiUzxU2YAM3MQ9xvI2T78FBr5J6-FC2Ly_hbJJ3RwybKzgYFeybaNM79b6x3RtRm2hrzft577-vqGt_7Bmw0Fg_-XoQjTRFx5-d8QWicS6vGbBzXpVCpV-HwNljQoHpGqIHk6w1azPDoiRet-NpCVa-fN2LWaWCoXIVJmhqSdA3qXGXnnTMU3xuH8ZNCrNZglNiNohY")'
                              }}>
                            <div className="absolute top-4
                        right-4 bg-white/95
                        backdrop-blur-sm rounded-xl
                        p-2.5 text-center
                        min-w-[55px] shadow-sm">
                        <span className="block
                          text-[#135bec] font-black
                          text-2xl leading-none">
                          {workshop.date
                              ? new Date(workshop.date)
                                  .getDate()
                              : '--'}
                        </span>
                              <span className="text-slate-600
                          text-xs font-bold uppercase
                          tracking-wider leading-none
                          mt-1">
                          {workshop.date
                              ? new Date(workshop.date)
                                  .toLocaleString('default',
                                      { month: 'short' })
                              : 'TBD'}
                        </span>
                            </div>
                          </div>
                          <div className="p-6 flex
                      flex-col flex-1">
                            <div className="flex items-center
                        gap-2 mb-4">
                        <span className="text-xs
                          font-black text-[#135bec]
                          uppercase bg-[#135bec]/15
                          px-2.5 py-1 rounded">
                          Event
                        </span>
                              <span className="text-slate-400
                          text-sm">
                          • {workshop.time || 'TBA'}
                        </span>
                            </div>
                            <h3 className="text-[#135bec]
                        text-xl font-bold mb-2">
                              {workshop.title ||
                                  workshop.topic}
                            </h3>
                            <p className="text-slate-400
                        text-base mb-6">
                              Led by {workshop.speaker ||
                                'TBA'}
                            </p>
                            <div className="mt-auto pt-6
                        flex items-center
                        justify-between border-t
                        border-slate-700/50">
                              <div className="flex flex-col">
                          <span className="text-slate-500
                            text-[10px] uppercase
                            font-bold tracking-widest
                            mb-1">
                            Location
                          </span>
                                <span className="text-slate-200
                            text-sm font-semibold
                            truncate max-w-[150px]">
                            {workshop.location ||
                                workshop.venue ||
                                'Main Auditorium'}
                          </span>
                              </div>
                              <button
                                  onClick={() => handleRegister(
                                      workshop._id || workshop.id
                                  )}
                                  disabled={
                                      !isApproved ||
                                      registering === (
                                          workshop._id || workshop.id
                                      ) ||
                                      registeredWorkshops.includes(
                                          String(
                                              workshop._id || workshop.id
                                          )
                                      )
                                  }
                                  title={!isApproved
                                      ? 'Application approval required'
                                      : ''}
                                  className={`rounded-lg px-5 
                            py-2.5 text-sm font-bold 
                            shadow-md transition-colors 
                            ${registeredWorkshops.includes(
                                      String(
                                          workshop._id || workshop.id
                                      )
                                  )
                                      ? 'bg-green-500 text-white cursor-default'
                                      : registering === (
                                          workshop._id || workshop.id
                                      )
                                          ? 'bg-blue-400 text-white cursor-wait'
                                          : isApproved
                                              ? 'bg-[#135bec] hover:bg-blue-600 text-white'
                                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  }`}
                              >
                                {registeredWorkshops.includes(
                                    String(
                                        workshop._id || workshop.id
                                    )
                                )
                                    ? '✓ Registered'
                                    : registering === (
                                        workshop._id || workshop.id
                                    )
                                        ? 'Registering...'
                                        : 'Register'}
                              </button>
                            </div>
                          </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full
                  py-20 text-center">
                      <div className="text-5xl mb-4">
                        🎪
                      </div>
                      <h3 className="font-bold
                    text-slate-900 dark:text-white">
                        No Workshops Yet
                      </h3>
                      <p className="text-slate-400
                    text-sm mt-2">
                        Workshops will appear here
                        once created by admin.
                      </p>
                    </div>
                )}
              </div>

              {/* Load More */}
              <div className="flex justify-center
              mt-12 pb-20">
                <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-8 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-[#135bec] hover:text-[#135bec] transition-all">
                  Load More Events
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-12">
              <div className="flex flex-col lg:flex-row
              justify-between gap-12">
                <div className="max-w-md">
                  <p className="text-slate-500
                  dark:text-slate-400 text-sm
                  mb-6 leading-relaxed">
                    Empowering the next generation
                    of global leaders through
                    high-impact professional workshops,
                    research seminars, and
                    community events.
                  </p>
                  <div className="flex gap-4">
                    <Link
                        className="text-slate-400
                      hover:text-[#135bec]"
                        to="#">
                    <span className=
                              "material-symbols-outlined">
                      public
                    </span>
                    </Link>
                    <Link
                        className="text-slate-400
                      hover:text-[#135bec]"
                        to="#">
                    <span className=
                              "material-symbols-outlined">
                      alternate_email
                    </span>
                    </Link>
                    <Link
                        className="text-slate-400
                      hover:text-[#135bec]"
                        to="#">
                    <span className=
                              "material-symbols-outlined">
                      group
                    </span>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2
                sm:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-slate-900
                    dark:text-white font-bold
                    text-sm mb-4">
                      Quick Links
                    </h4>
                    <ul className="space-y-2 text-sm
                    text-slate-500 dark:text-slate-400">
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Upcoming Events
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Past Workshops
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Student Stories
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Campus News
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-slate-900
                    dark:text-white font-bold
                    text-sm mb-4">
                      Support
                    </h4>
                    <ul className="space-y-2 text-sm
                    text-slate-500 dark:text-slate-400">
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Registration Help
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Corporate Training
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          Venue Hire
                        </Link>
                      </li>
                      <li>
                        <Link
                            className="hover:text-[#135bec]"
                            to="#">
                          FAQ
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-span-2
                  sm:col-span-1">
                    <h4 className="text-slate-900
                    dark:text-white font-bold
                    text-sm mb-4">
                      Stay Updated
                    </h4>
                    <p className="text-xs
                    text-slate-500 mb-4">
                      Subscribe to our newsletter
                      for event alerts.
                    </p>
                    <div className="flex">
                      <input
                          className="flex-1
                        bg-slate-100 dark:bg-slate-800
                        border-none rounded-l-lg
                        px-4 text-xs
                        focus:ring-1
                        focus:ring-[#135bec]"
                          placeholder="Email"
                          type="email"
                      />
                      <button className="bg-[#135bec]
                      text-white px-4 py-2
                      rounded-r-lg">
                      <span className=
                                "material-symbols-outlined
                        text-sm">
                        send
                      </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t
              border-slate-100 dark:border-slate-800
              flex flex-col md:flex-row
              justify-between items-center gap-4">
                <p className="text-slate-400 text-xs">
                  © 2026 CSBM Campus.
                  All rights reserved.
                </p>
                <div className="flex gap-6 text-xs
                text-slate-400">
                  <Link
                      className="hover:text-[#135bec]"
                      to="#">
                    Privacy Policy
                  </Link>
                  <Link
                      className="hover:text-[#135bec]"
                      to="#">
                    Terms of Service
                  </Link>
                  <Link
                      className="hover:text-[#135bec]"
                      to="#">
                    Cookie Settings
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Registration Success Modal */}
        <Modal
            title={
              <div className="text-xl font-bold
            text-[#135bec]">
                Registration Confirmed
              </div>
            }
            open={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <button
                  key="close"
                  onClick={() => setIsModalVisible(false)}
                  className="rounded-lg bg-[#135bec]
              hover:bg-blue-600 text-white
              px-6 py-2 text-sm font-bold
              shadow-md transition-colors">
                Close
              </button>
            ]}
            centered
        >
          {registeredData && (
              <div className="flex flex-col
            items-center justify-center
            p-6 text-center">
                <div className="w-16 h-16 bg-green-100
              rounded-full flex items-center
              justify-center mb-4">
              <span className=
                        "material-symbols-outlined
                text-green-500 text-3xl">
                check_circle
              </span>
                </div>
                <h3 className="text-lg font-bold
              text-slate-800 mb-2">
                  You're all set!
                </h3>
                <p className="text-slate-500 mb-6">
                  Please show this QR code or
                  Reference ID at the entrance.
                </p>
                <div className="p-4 bg-white border
              border-slate-200 rounded-xl
              shadow-sm mb-6">
                  <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registeredData.referenceId}`}
                      alt="Registration QR Code"
                      className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="bg-slate-50 rounded-lg
              p-4 w-full border border-slate-100">
              <span className="text-xs text-slate-400
                font-bold uppercase tracking-wider
                block mb-1">
                Reference ID
              </span>
                  <span className="text-2xl font-black
                text-slate-800 tracking-widest">
                {registeredData.referenceId}
              </span>
                </div>
              </div>
          )}
        </Modal>
      </div>
  );
};

export default WorkshopList;