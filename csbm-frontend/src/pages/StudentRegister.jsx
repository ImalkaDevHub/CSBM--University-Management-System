import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_REGISTER = 'http://localhost:8080/api/users/register'
const { Title, Text } = Typography

const passwordRules = [
  { required: true, message: 'Please enter a password' },
  { min: 8, message: 'Password must be at least 8 characters' },
  { pattern: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
  { pattern: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
  { pattern: /[0-9]/, message: 'Password must contain at least one number' },
]

export default function StudentRegister() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await axios.post(API_REGISTER, {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        role: 'STUDENT',
      })
      message.success('Registration successful! Please log in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed.'
      message.error(typeof msg === 'string' ? msg : 'Email may already be taken.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 10 }}>
        <Title level={3} style={{ marginBottom: 8 }}>Student Registration</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Create your CSBM Campus account
        </Text>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={passwordRules}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Register
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="link" block onClick={() => navigate('/login')}>
              Already have an account? Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
