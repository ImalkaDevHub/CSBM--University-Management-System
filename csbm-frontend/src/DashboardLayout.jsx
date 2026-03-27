import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout, Menu, Avatar, Space, Typography } from 'antd'
import {
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  FolderOutlined,
  FormOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const TOP_NAV_HEIGHT = 56
const SIDER_WIDTH = 220
const RIGHT_SIDER_WIDTH = 280

export default function DashboardLayout() {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const leftMenuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/site-home', icon: <HomeOutlined />, label: 'Site Home' },
    { key: '/calendar', icon: <CalendarOutlined />, label: 'Calendar' },
    { key: '/private-files', icon: <FolderOutlined />, label: 'Private Files' },
    { key: '/courses', icon: <BookOutlined />, label: 'My Courses' },
    { key: '/apply', icon: <FormOutlined />, label: 'Apply' },
  ]

  const selectedKey = leftMenuItems.some((i) => i.key === location.pathname)
    ? location.pathname
    : leftMenuItems[0].key

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Top Navigation Bar - Blue */}
      <Header
        style={{
          height: TOP_NAV_HEIGHT,
          padding: '0 24px',
          background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 50%, #69b1ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 12px rgba(22, 119, 255, 0.25)',
        }}
      >
        <Space size="middle">
          <Typography.Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>
            CSBM
          </Typography.Title>
          <Link to="/courses" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, textDecoration: 'none' }}>
            My Courses
          </Link>
        </Space>
        <Space size="middle">
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none' }}>
            Admin
          </Link>
          <Avatar size="default" icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </Space>
      </Header>

      <Layout>
        {/* Left Sidebar - Collapsible */}
        <Sider
          collapsible
          collapsed={leftCollapsed}
          onCollapse={setLeftCollapsed}
          width={SIDER_WIDTH}
          collapsedWidth={80}
          style={{
            background: '#fff',
            boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
            overflow: 'auto',
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
          }}
          className="dashboard-sidebar"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={leftMenuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
            className="dashboard-sidebar-menu"
          />
        </Sider>

        {/* Main Content */}
        <Content
          style={{
            margin: 0,
            padding: 24,
            minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            background: '#e8eaef',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>

        {/* Right Sidebar - Timeline, Private Files, Online Users */}
        <Sider
          width={RIGHT_SIDER_WIDTH}
          style={{
            background: '#fff',
            boxShadow: '-2px 0 12px rgba(0,0,0,0.08)',
            padding: 16,
            height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            overflow: 'auto',
          }}
        >
          <div style={{ marginBottom: 24, padding: 12, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Space style={{ marginBottom: 8 }}>
              <ClockCircleOutlined />
              <Text strong>Timeline</Text>
            </Space>
            <div style={{ fontSize: 13, color: '#666' }}>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Welcome to CSBM</div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>New courses available</div>
              <div style={{ padding: '8px 0' }}>Application deadline reminder</div>
            </div>
          </div>
          <div style={{ marginBottom: 24, padding: 12, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Space style={{ marginBottom: 8 }}>
              <FolderOutlined />
              <Text strong>Private Files</Text>
            </Space>
            <div style={{ fontSize: 13, color: '#666' }}>
              <div style={{ padding: '6px 0' }}>No files yet</div>
            </div>
          </div>
          <div style={{ padding: 12, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Space style={{ marginBottom: 8 }}>
              <TeamOutlined />
              <Text strong>Online Users</Text>
            </Space>
            <div style={{ fontSize: 13, color: '#666' }}>
              <div style={{ padding: '6px 0' }}>You are online</div>
            </div>
          </div>
        </Sider>
      </Layout>
    </Layout>
  )
}
