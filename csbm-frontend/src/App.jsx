import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Avatar, theme, Button, App as AntApp } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  DashboardOutlined,
  FormOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserAddOutlined,
  PieChartOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  BarChartOutlined
} from '@ant-design/icons';

// --- IMPORT YOUR COMPONENTS ---
import About from './About';
import StudentLife from './StudentLife';
import ContactUs from './ContactUs';
import Logo from './components/Logo';
import LandingPage from './LandingPage'; // <--- NEW LANDING PAGE
import Login from './Login';
import Programs from './Programs';
import StudentRegister from './StudentRegister';
import StudentApplicationForm from './StudentApplicationForm';
import ApplicationForm from './ApplicationForm';
import StudentDashboard from './StudentDashboard';
import CourseCatalog from './CourseCatalog';
import AdminDashboard from './AdminDashboard';
import IntakeScheduler from './IntakeScheduler';
import ManualEntry from './ManualEntry';
import WorkshopList from './WorkshopList';
import AdminWorkshopManager from './AdminWorkshopManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

// PAYMENT UI ROUTES
import PaymentSummary from './pages/payment/PaymentSummary';
import PaymentProcessing from './pages/payment/PaymentProcessing';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';

const { Header, Content, Sider } = Layout;

// Define menu items outside the component for clarity and reusability
const adminMenuItems = [
  { key: 'admin-dashboard', icon: <DashboardOutlined />, label: <Link to="/admin-dashboard">Admin Dashboard</Link> },
  { key: 'intakes', icon: <ScheduleOutlined />, label: <Link to="/intakes">Intake Scheduler</Link> },
  { key: 'manual-entry', icon: <FormOutlined />, label: <Link to="/manual-entry">Manual Registration</Link> },
  { key: 'admin-workshops', icon: <TeamOutlined />, label: <Link to="/admin-workshops">Manage Workshops</Link> }, // Changed from 'workshops' to 'admin-workshops' to match existing route
  { key: 'analytics', icon: <BarChartOutlined />, label: <Link to="/analytics">Analytics & Reports</Link> },
];

const studentMenuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/student-dashboard">Dashboard</Link> },
  { key: 'apply', icon: <FormOutlined />, label: <Link to="/apply">Apply Now</Link> },
  { key: 'courses', icon: <BookOutlined />, label: <Link to="/courses">Course Catalog</Link> },
  { key: 'workshops', icon: <CalendarOutlined />, label: <Link to="/workshops">Events & Workshops</Link> },
];


// --- MAIN LAYOUT COMPONENT (Sidebar & Header) ---
const MainLayout = () => {
  const { token: { borderRadiusLG } } = theme.useToken();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole')?.toLowerCase(); // 'admin' | 'student' | 'lecturer'
  const isAdmin = userRole === 'admin';
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  const sidebarItems = isAdmin ? adminMenuItems : studentMenuItems;

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    document.body.classList.remove('admin-dashboard');
    navigate('/login');
  };

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-dashboard');
    } else {
      document.body.classList.remove('admin-dashboard');
    }
  }, [isAdmin]);

  return (
    <Layout style={{ minHeight: '100vh', background: isAdmin ? '#f8fafc' : '#0F172A' }}>
      {/* Top Header */}
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: '#1E293B',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo className="h-10" />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{localStorage.getItem('userName') || 'User'}</span>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: '#ff4d4f' }}
          />
        </div>
      </Header>

      <Layout style={{ background: isAdmin ? '#f8fafc' : '#0F172A' }}>
        {/* Sidebar Navigation */}
        <Sider width={250} style={{ background: '#1E293B', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            defaultOpenKeys={isAdmin ? ['sub1', 'sub2'] : ['sub1']}
            style={{ height: '100%', borderRight: 0, background: 'transparent' }}
            items={[
              {
                key: 'sub1',
                icon: <UserOutlined />,
                label: 'Student Portal',
                children: [
                  { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/student-dashboard">Dashboard</Link> },
                  { key: 'apply', icon: <FormOutlined />, label: <Link to="/apply">Apply Now</Link> },
                  { key: 'courses', icon: <BookOutlined />, label: <Link to="/courses">Course Catalog</Link> },
                  { key: 'workshops', icon: <CalendarOutlined />, label: <Link to="/workshops">Events & Workshops</Link> },
                ]
              },
              ...(isAdmin ? [{
                key: 'sub2',
                icon: <LaptopOutlined />,
                label: 'Admin Tools',
                children: [
                  { key: 'admin', icon: <TeamOutlined />, label: <Link to="/admin">Student Approvals</Link> },
                  { key: 'intakes', icon: <CalendarOutlined />, label: <Link to="/intakes">Intake Scheduler</Link> },
                  { key: 'manual', icon: <UserAddOutlined />, label: <Link to="/manual-entry">Manual Registration</Link> },
                  { key: 'admin-workshops', icon: <CalendarOutlined />, label: <Link to="/admin-workshops">Manage Workshops</Link> },
                  { key: 'analytics', icon: <PieChartOutlined />, label: <Link to="/analytics">Analytics & Reports</Link> },
                ]
              }] : [])
            ]}
          />
        </Sider>


        {/* Main Content Area */}
        <Layout style={{ padding: '24px', background: isAdmin ? '#f8fafc' : '#0F172A' }}>
          <Content style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
            background: 'transparent',
            borderRadius: borderRadiusLG,
            border: 'none'
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};



// Simple Icon Component for Header
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px">
    <path d="M0 0h24v24H0z" fill="none" /><path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19zM5.64 12.5l-3.83-2.67 8.02-4.14C9.25 7.19 8.68 8.78 8.04 10.45l-2.4 2.05zM18 4.28C17.65 4.14 17.29 4.04 16.91 4c.03.35.03.7.02 1.05.74-.24 1.48-.48 2.22-.71l-1.15-.06zM12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.5 14.75l-4.22-1.76c-1.3-.54-2.5-1.2-3.58-1.95L5.5 14.5l3.5-6.06c.65-1.13 1.46-2.15 2.4-3.04l5.04 2.91c.9.89 1.66 1.93 2.25 3.08l-2.19 5.36z" />
  </svg>
);

// --- ROUTER CONFIGURATION ---
function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <AntApp>
        <BrowserRouter>
        <Routes>

          {/* --- 1. PUBLIC ROUTES --- */}
          {/* Default Route: LANDING PAGE */}
          <Route index element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Login & Register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<StudentRegister />} />

          {/* --- 2. PROTECTED ROUTES (Ant Design Sidebar Layout) --- */}
          <Route path="/" element={<MainLayout />}>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'LECTURER']} />}>
              <Route path="apply" element={<ApplicationForm />} />
            </Route>

            {/* Legacy Admin Routes inside old sidebar */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="admin" element={<Navigate to="/admin-dashboard" replace />} />
              <Route path="intakes" element={<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}><IntakeScheduler /></ConfigProvider>} />
              <Route path="manual-entry" element={<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}><ManualEntry /></ConfigProvider>} />
              <Route path="admin-workshops" element={<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}><AdminWorkshopManager /></ConfigProvider>} />
              <Route path="analytics" element={<ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}><AnalyticsDashboard /></ConfigProvider>} />
            </Route>

          </Route>

          {/* --- 3. STANDALONE STUDENT & ADMIN DASHBOARDS (own layout, no Ant sidebar) --- */}
          {/* Student Dashboard - Own Layout */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'LECTURER']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
                  <AdminDashboard />
                </ConfigProvider>
              </ProtectedRoute>
            }
          />

          {/* PAYMENT FUNNEL ROUTES */}
          <Route path="/payment/summary" element={<PaymentSummary />} />
          <Route path="/payment/processing" element={<PaymentProcessing />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />

          {/* /admissions alias */}
          <Route path="/admissions" element={<ApplicationForm />} />

        </Routes>
      </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;