import { Form, Input, Select, Upload, Button, Card, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/applications/submit'

export default function ApplyPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('course', values.course)
    formData.append('nic', values.nic?.originFileObj ?? values.nic)
    formData.append('birthCert', values.birthCert?.originFileObj ?? values.birthCert)

    setLoading(true)
    setSuccess(false)
    try {
      await axios.post(API_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      message.success('Application submitted successfully!')
      setSuccess(true)
      form.resetFields()
    } catch {
      message.error('Failed to submit application.')
    } finally {
      setLoading(false)
    }
  }

  const normFile = (e) => {
    if (Array.isArray(e)) return e[0]
    return e?.fileList?.[0] ?? e
  }

  return (
    <Card title="Student Application (Module 1)" style={{ maxWidth: 560, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 10 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
          <Input placeholder="Full Name" size="large" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item name="course" label="Course" initialValue="Diploma in IT" rules={[{ required: true }]}>
          <Select
            size="large"
            options={[
              { value: 'Diploma in IT', label: 'Diploma in IT' },
              { value: 'Diploma in Business', label: 'Diploma in Business' },
            ]}
          />
        </Form.Item>
        <Form.Item name="nic" label="Upload NIC" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true }]}>
          <Upload maxCount={1} beforeUpload={() => false} accept=".pdf,.jpg,.jpeg,.png">
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="birthCert" label="Upload Birth Certificate" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true }]}>
          <Upload maxCount={1} beforeUpload={() => false} accept=".pdf,.jpg,.jpeg,.png">
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} block>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
      {success && <div style={{ color: '#52c41a', fontWeight: 600 }}>Application submitted successfully.</div>}
    </Card>
  )
}
