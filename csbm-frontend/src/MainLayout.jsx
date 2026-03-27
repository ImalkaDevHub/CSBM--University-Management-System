import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd'
import {
  HomeOutlined,
  FormOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const HEADER_HEIGHT = 56
const SIDER_WIDTH = 220

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
  { key: '/apply', icon: <FormOutlined />, label: 'Student Entry' },
  { key: '/my-status', icon: <FileSearchOutlined />, label: 'Application Status' },
  { key: '/courses', icon: <BookOutlined />, label: 'Course Catalog' },
  { key: '/workshops', icon: <TeamOutlined />, label: 'Workshops' },
  { key: '/admin', icon: <SettingOutlined />, label: 'Admin' },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = menuItems.some((item) => item.key === location.pathname)
    ? location.pathname
    : menuItems[0].key

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {},
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Admin',
      onClick: () => navigate('/admin'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {},
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Header
        style={{
          height: HEADER_HEIGHT,
          padding: '0 24px',
          background: '#001529',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
<Text strong style={{ color: '#fff', fontSize: 18 }}>
            CSBM Campus
        </Text>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/register" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Register</Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Login</Link>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Avatar
            size="default"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#faad14', cursor: 'pointer' }}
          />
        </Dropdown>
        </span>
      </Header>

      <Layout style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={SIDER_WIDTH}
          collapsedWidth={80}
          style={{
            background: '#001529',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            overflow: 'auto',
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
          className="main-layout-sidebar"
        >
          <div
            style={{
              padding: collapsed ? '16px 8px' : '20px 16px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <Text strong style={{ color: '#fff', fontSize: collapsed ? 12 : 16, whiteSpace: 'nowrap', overflow: 'hidden', display: 'block' }}>
              {collapsed ? 'CSBM' : 'CSBM Campus'}
            </Text>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="main-layout-sidebar-menu"
            style={{ height: 'calc(100% - 60px)', borderRight: 0, paddingTop: 12, background: 'transparent' }}
          />
        </Sider>

        <Content
          style={{
            margin: 0,
            padding: 24,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            background: '#f0f2f5',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
