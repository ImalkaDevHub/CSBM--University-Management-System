import { Card, Row, Col, Typography, Button, Tabs, Progress, Calendar, Avatar, Tag } from 'antd'
import { PlayCircleOutlined, BookOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ApplicationStatus from './ApplicationStatus'

const { Title, Text } = Typography

const CARD_STYLE = {
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: 10,
}

// Recently accessed courses (cover from public folder or gradient fallback)
const recentCourses = [
  { id: 1, title: 'Introduction to Programming', progress: 45, cover: '/course-1.jpg', color: '#1677ff' },
  { id: 2, title: 'Business Analytics', progress: 72, cover: '/course-2.jpg', color: '#52c41a' },
  { id: 3, title: 'Digital Marketing', progress: 28, cover: '/course-3.jpg', color: '#722ed1' },
]

// Timeline deadlines with color-coded tags
const timelineItems = [
  { id: 1, title: 'Assignment 1 - Essay', due: 'in 2 days', tag: 'Assignment', color: 'blue', borderColor: '#1890ff' },
  { id: 2, title: 'Quiz: Module 3', due: 'in 5 days', tag: 'Quiz', color: 'green', borderColor: '#52c41a' },
  { id: 3, title: 'Project Proposal', due: 'in 1 week', tag: 'Project', color: 'orange', borderColor: '#fa8c16' },
]

// Online users (dummy)
const onlineUsers = [
  { name: 'Alex', color: '#1890ff' },
  { name: 'Sam', color: '#52c41a' },
  { name: 'Jordan', color: '#722ed1' },
]

// Course lists for tabs
const inProgressCourses = ['Introduction to Programming', 'Business Analytics']
const futureCourses = ['Advanced Databases', 'Cloud Computing']
const pastCourses = ['IT Fundamentals', 'Academic Writing']

function CourseCover({ cover, color }) {
  // Gradient overlay + optional image from public folder (e.g. /course-1.jpg)
  return (
    <div
      style={{
        height: 120,
        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
        backgroundImage: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%), url(${cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px 10px 0 0',
      }}
    />
  )
}

export default function DashboardHome() {
  const navigate = useNavigate()
  const studentName = 'Student' // Could come from auth context

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Hero: Welcome Banner - gradient with optional image overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          marginLeft: -24,
          marginRight: -24,
          marginTop: -24,
          padding: '40px 24px',
          background: 'linear-gradient(135deg, #001529 0%, #1a365d 40%, #553c9a 100%)',
          backgroundImage: 'linear-gradient(135deg, rgba(0,21,41,0.92) 0%, rgba(83,60,154,0.9) 100%), url(/campus-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 8, fontWeight: 700 }}>
            Welcome back, {studentName}!
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, display: 'block', marginBottom: 20 }}>
            You have 2 upcoming assignments.
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => navigate('/courses')}
            style={{
              background: '#fff',
              color: '#1677ff',
              border: 'none',
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Resume Learning
          </Button>
        </div>
      </div>

      {/* Main Grid: 70% Left, 30% Right */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Left Column - My Activity */}
        <Col xs={24} lg={17}>
          {/* Recently Accessed Courses */}
          <Card
            title={<Text strong style={{ fontSize: 16 }}>Recently Accessed Courses</Text>}
            style={{ ...CARD_STYLE, marginBottom: 24 }}
            bodyStyle={{ padding: 20 }}
          >
            <Row gutter={[16, 16]}>
              {recentCourses.map((course) => (
                <Col xs={24} sm={8} key={course.id}>
                  <Card
                    hoverable
                    cover={<CourseCover cover={course.cover} color={course.color} />}
                    style={{ ...CARD_STYLE, borderRadius: 10, overflow: 'hidden' }}
                    bodyStyle={{ padding: 16 }}
                    onClick={() => navigate('/courses')}
                  >
                    <Title level={5} style={{ margin: '0 0 12px', fontWeight: 700 }}>
                      {course.title}
                    </Title>
                    <Progress percent={course.progress} size="small" strokeColor={course.color} />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Course Overview - Tabs */}
          <Card
            title={<Text strong style={{ fontSize: 16 }}>Course Overview</Text>}
            style={CARD_STYLE}
            bodyStyle={{ padding: '12px 20px 20px' }}
          >
            <Tabs
              defaultActiveKey="in-progress"
              items={[
                {
                  key: 'in-progress',
                  label: 'In Progress',
                  children: (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {inProgressCourses.map((name, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <Text>{name}</Text>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  key: 'future',
                  label: 'Future',
                  children: (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {futureCourses.map((name, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <Text>{name}</Text>
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  key: 'past',
                  label: 'Past',
                  children: (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {pastCourses.map((name, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>
                          <Text>{name}</Text>
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Right Column - Widgets */}
        <Col xs={24} lg={7}>
          <div style={{ marginBottom: 24 }}>
            <ApplicationStatus />
          </div>
          {/* Timeline */}
          <Card
            title={<Text strong style={{ fontSize: 15 }}>Timeline</Text>}
            style={{ ...CARD_STYLE, marginBottom: 24 }}
            bodyStyle={{ padding: 16 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {timelineItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 12px',
                    background: '#fafafa',
                    borderRadius: 8,
                    borderLeft: `3px solid ${item.borderColor}`,
                  }}
                >
                  <Tag color={item.color} style={{ marginBottom: 4 }}>
                    {item.tag}
                  </Tag>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.due}</Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Calendar */}
          <Card
            title={<Text strong style={{ fontSize: 15 }}>Calendar</Text>}
            style={{ ...CARD_STYLE, marginBottom: 24 }}
            bodyStyle={{ padding: 12 }}
          >
            <Calendar fullscreen={false} style={{ borderRadius: 8 }} />
          </Card>

          {/* Online Users */}
          <Card
            title={<Text strong style={{ fontSize: 15 }}>Online Users</Text>}
            style={CARD_STYLE}
            bodyStyle={{ padding: 16 }}
          >
            <Avatar.Group maxCount={4} size="default">
              {onlineUsers.map((user, i) => (
                <Avatar key={i} style={{ backgroundColor: user.color }} icon={<UserOutlined />} />
              ))}
            </Avatar.Group>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {onlineUsers.length} people online
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
