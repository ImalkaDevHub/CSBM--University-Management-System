import { Form, Input, Button, Card, Typography, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_USERS = 'http://localhost:8080/api/users/all'
const { Title, Text } = Typography

export default function Login() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const { data } = await axios.get(API_USERS)
      const user = data.find((u) => u.email === values.email && u.password === values.password)
      if (user) {
        message.success('Login successful!')
        navigate('/')
      } else {
        message.error('Invalid email or password.')
      }
    } catch {
      message.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 10 }}>
        <Title level={3} style={{ marginBottom: 8 }}>Log in</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          CSBM Campus
        </Text>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate('/register')}>
              Don&apos;t have an account? Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
