import { useState } from 'react'
import { Card, Steps, Timeline, Input, Button, Typography, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import axios from 'axios'

const API_STATUS = 'http://localhost:8080/api/applications/my-status'
const { Text } = Typography

const STATUS_CONFIG = {
  SUBMITTED: { color: 'blue', label: 'Submitted' },
  PENDING: { color: 'blue', label: 'Submitted' },
  UNDER_REVIEW: { color: 'orange', label: 'Under Review' },
  APPROVED: { color: 'green', label: 'Approved' },
  REJECTED: { color: 'red', label: 'Rejected' },
}

function getStatusInfo(status) {
  return STATUS_CONFIG[status?.toUpperCase()] || { color: 'default', label: status || '—' }
}

export default function ApplicationStatus() {
  const [email, setEmail] = useState(() => localStorage.getItem('studentEmail') || '')
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetchStatus = async () => {
    if (!email?.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await axios.get(API_STATUS, { params: { email: email.trim() } })
      setApp(data)
    } catch {
      setApp(null)
    } finally {
      setLoading(false)
    }
  }


  const statusInfo = app ? getStatusInfo(app.status) : null
  const steps = [
    { title: 'Submitted', status: app ? (['SUBMITTED', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(app.status) ? 'finish' : 'wait') : 'wait' },
    { title: 'Under Review', status: app ? (['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(app.status) ? 'finish' : 'wait') : 'wait' },
    { title: 'Approved / Rejected', status: app ? (['APPROVED', 'REJECTED'].includes(app.status) ? 'finish' : 'wait') : 'wait' },
  ]
  const currentStep = app ? (['APPROVED', 'REJECTED'].includes(app.status) ? 2 : ['UNDER_REVIEW'].includes(app.status) ? 1 : 0) : 0

  return (
    <Card
      title="Application Status"
      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 10 }}
      extra={
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchStatus} loading={loading}>
          Refresh
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Enter your application email to view status</Text>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <Input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onPressEnter={fetchStatus}
            style={{ maxWidth: 320 }}
          />
          <Button type="primary" onClick={fetchStatus} loading={loading}>
            Check Status
          </Button>
        </div>
      </div>

      {loading && <Spin />}
      {!loading && searched && !app && <Text type="secondary">No application found for this email.</Text>}
      {!loading && app && (
        <>
          <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
          <Timeline
            items={[
              { color: 'blue', children: <>Submitted – Application received</> },
              { color: app && ['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(app.status) ? 'orange' : 'gray', children: <>Under Review – Being processed</> },
              { color: app && ['APPROVED', 'REJECTED'].includes(app.status) ? statusInfo.color : 'gray', children: <>{statusInfo?.label || 'Outcome'}</> },
            ]}
          />
          <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
            <Text strong>Current status: </Text>
            <Text style={{ color: statusInfo?.color === 'green' ? '#52c41a' : statusInfo?.color === 'red' ? '#ff4d4f' : '#fa8c16' }}>
              {statusInfo?.label}
            </Text>
            {app?.courseName && (
              <>
                <br />
                <Text type="secondary">Course: {app.courseName}</Text>
              </>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
