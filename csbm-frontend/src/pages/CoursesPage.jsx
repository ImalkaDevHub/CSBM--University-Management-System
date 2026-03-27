import { useEffect, useState, useMemo } from 'react'
import { Card, Row, Col, Typography, Spin, Empty, Input, Select, Tag, Button } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/courses'
const { Title, Text } = Typography

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'IT', label: 'IT' },
  { value: 'Business', label: 'Business' },
  { value: 'Engineering', label: 'Engineering' },
]

// Map category to cover image (place in public folder: course-it.jpg, course-business.jpg, course-engineering.jpg)
const COVER_BY_CATEGORY = {
  IT: '/course-it.jpg',
  Business: '/course-business.jpg',
  Engineering: '/course-engineering.jpg',
}
const DEFAULT_COVER = '/course-it.jpg'

function getCategory(name = '') {
  const n = name.toLowerCase()
  if (n.includes('it') || n.includes('programming') || n.includes('digital') && !n.includes('marketing')) return 'IT'
  if (n.includes('business') || n.includes('marketing')) return 'Business'
  if (n.includes('engineering') || n.includes('data')) return 'Engineering'
  return 'IT'
}

function CourseCover({ category, code }) {
  const src = COVER_BY_CATEGORY[category] || DEFAULT_COVER
  return (
    <div
      className="course-card-cover"
      style={{
        height: 160,
        position: 'relative',
        background: `linear-gradient(135deg, #001529 0%, #16385c 100%)`,
        backgroundImage: `linear-gradient(135deg, rgba(0,21,41,0.85) 0%, rgba(22,56,92,0.8) 100%), url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px 10px 0 0',
      }}
    >
      {code && (
        <span style={{ position: 'absolute', top: 12, left: 12, color: 'rgba(255,255,255,0.95)', fontWeight: 600, fontSize: 12 }}>
          {code}
        </span>
      )}
    </div>
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API_BASE)
      setCourses(data)
      setError(null)
    } catch {
      setError('Failed to load courses.')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = useMemo(() => {
    let list = courses.map((c) => ({ ...c, _category: getCategory(c.name) }))
    if (filter !== 'all') list = list.filter((c) => c._category === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((c) => (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q))
    }
    return list
  }, [courses, filter, search])

  const formatIntakeTag = (dateStr) => {
    if (!dateStr) return 'Intake: —'
    const d = new Date(dateStr)
    return `Intake: ${d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
  }

  const formatFee = (fee) => {
    if (fee == null) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(fee))
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 8 }}>Course Catalog</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Browse available courses</Text>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <Input
          placeholder="Search courses by name or code..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 360, borderRadius: 8 }}
        />
        <span style={{ color: '#666', fontWeight: 500 }}>Filter by:</span>
        <Select
          value={filter}
          onChange={setFilter}
          options={FILTER_OPTIONS}
          style={{ width: 160 }}
          placeholder="All"
        />
      </div>

      {error && <Text type="danger">{error}</Text>}

      {!error && filteredCourses.length === 0 && (
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 10 }}>
          <Empty description={courses.length === 0 ? 'No courses yet' : 'No courses match your search'} />
        </Card>
      )}

      {!error && filteredCourses.length > 0 && (
        <Row gutter={[16, 24]}>
          {filteredCourses.map((course) => (
            <Col xs={24} sm={24} md={12} lg={6} key={course.id}>
              <div
                className="course-gallery-card-wrapper"
                onMouseEnter={() => setHoveredId(course.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Card
                  hoverable={false}
                  cover={<CourseCover category={course._category} code={course.code} />}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Title level={5} style={{ margin: '0 0 12px', fontWeight: 700 }}>
                    {course.name || 'Unnamed Course'}
                  </Title>
                  <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <Tag color="blue">{formatIntakeTag(course.intakeDate)}</Tag>
                    <Tag color="gold">Level: Diploma</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 13 }}>Fee: {formatFee(course.fee)}</Text>
                  <div
                    className="course-card-action"
                    style={{
                      marginTop: 12,
                      opacity: hoveredId === course.id ? 1 : 0,
                      transform: hoveredId === course.id ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                    }}
                  >
                    <Button type="primary" block icon={<EyeOutlined />}>
                      View Details
                    </Button>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
