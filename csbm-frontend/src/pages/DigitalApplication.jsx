import { useState, useEffect } from 'react'
import { Form, Input, Select, Upload, Button, Card, Steps, DatePicker, Checkbox, message, Modal } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

const API_COURSES = 'http://localhost:8080/api/courses'
const API_SUBMIT = 'http://localhost:8080/api/applications/submit-digital'
const { TextArea } = Input

const normFile = (e) => {
  if (Array.isArray(e)) return e
  return e?.fileList ?? []
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function DigitalApplication() {
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [success, setSuccess] = useState(false)

  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    axios.get(API_COURSES).then(({ data }) => setCourses(data)).catch(() => setCourses([]))
  }, [])

  const next = () => {
    form.validateFields(steps[current].fields).then(() => setCurrent((c) => c + 1)).catch(() => { })
  }
  const prev = () => setCurrent((c) => c - 1)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handlePreviewCancel = () => setPreviewOpen(false);

  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('phone', values.phone || '')
    formData.append('address', values.address || '')
    formData.append('nicNumber', values.nicNumber || '')
    const dob = values.dateOfBirth
    formData.append('dateOfBirth', dob && typeof dob.format === 'function' ? dob.format('YYYY-MM-DD') : (dob || ''))
    formData.append('course', values.course)
    formData.append('digitalSignature', values.digitalSignature || '')
    const nic = values.nic?.[0]?.originFileObj
    const birthCert = values.birthCert?.[0]?.originFileObj
    const passportPhoto = values.passportPhoto?.[0]?.originFileObj
    if (nic) formData.append('nic', nic)
    if (birthCert) formData.append('birthCert', birthCert)
    if (passportPhoto) formData.append('passportPhoto', passportPhoto)

    setLoading(true)
    setSuccess(false)
    try {
      await axios.post(API_SUBMIT, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      message.success('Application submitted successfully.')
      setSuccess(true)
      form.resetFields()
      setCurrent(0)
    } catch {
      message.error('Failed to submit application.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: 'Personal Details',
      fields: ['fullName', 'email', 'phone', 'address', 'nicNumber', 'dateOfBirth'],
      content: (
        <>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Full Name" size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number">
            <Input placeholder="Phone Number" size="large" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <TextArea rows={2} placeholder="Address" />
          </Form.Item>
          <Form.Item name="nicNumber" label="NIC Number" rules={[{ required: true }]}>
            <Input placeholder="NIC Number" size="large" />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} size="large" format="YYYY-MM-DD" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Course Selection',
      fields: ['course'],
      content: (
        <Form.Item name="course" label="Select Course" rules={[{ required: true }]}>
          <Select
            size="large"
            placeholder="Select a course"
            options={courses.map((c) => ({ value: c.name || c.code, label: c.name || c.code }))}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Document Uploads',
      fields: ['nic', 'birthCert', 'passportPhoto'],
      content: (
        <>
          <Form.Item
            name="nic"
            label="NIC Document"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload NIC' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".pdf,.jpg,.jpeg,.png"
              onPreview={handlePreview}
            >
              <div><UploadOutlined /> <span style={{ marginTop: 8 }}>Upload</span></div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="birthCert"
            label="Birth Certificate"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload Birth Certificate' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".pdf,.jpg,.jpeg,.png"
              onPreview={handlePreview}
            >
              <div><UploadOutlined /> <span style={{ marginTop: 8 }}>Upload</span></div>
            </Upload>
          </Form.Item>
          <Form.Item
            name="passportPhoto"
            label="Passport Photo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept=".jpg,.jpeg,.png"
              onPreview={handlePreview}
            >
              <div><UploadOutlined /> <span style={{ marginTop: 8 }}>Upload</span></div>
            </Upload>
          </Form.Item>

          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handlePreviewCancel}>
            {previewImage.includes('application/pdf') ? (
              <iframe title="Document Preview" src={previewImage} width="100%" height="400px" style={{ border: 'none' }} />
            ) : (
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            )}
          </Modal>
        </>
      ),
    },
    {
      title: 'Digital Signature',
      fields: ['certify', 'digitalSignature'],
      content: (
        <>
          <Form.Item
            name="certify"
            valuePropName="checked"
            rules={[{ required: true, message: 'You must certify' }]}
          >
            <Checkbox>I certify that the information provided is true and complete.</Checkbox>
          </Form.Item>
          <Form.Item
            name="digitalSignature"
            label="Type your full name as signature"
            rules={[{ required: true, message: 'Please type your full name' }]}
          >
            <Input placeholder="Full Name" size="large" />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <Card title="Digital Application" style={{ maxWidth: 640, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 10 }}>
      <Steps current={current} items={steps.map((s) => ({ title: s.title }))} style={{ marginBottom: 24 }} />
      {success ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#52c41a', fontWeight: 600 }}>Application submitted successfully.</p>
          <Button type="primary" onClick={() => { setSuccess(false); setCurrent(0) }}>Submit another</Button>
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ minHeight: 200 }}>{steps[current].content}</div>
          <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
            {current > 0 && <Button onClick={prev}>Previous</Button>}
            <div style={{ flex: 1 }} />
            {current < steps.length - 1 && <Button type="primary" onClick={next}>Next</Button>}
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={loading}>Submit Application</Button>
            )}
          </div>
        </Form>
      )}
    </Card>
  )
}
