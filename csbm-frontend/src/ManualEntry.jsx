import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, message, Divider, Alert } from 'antd';
import { UserAddOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ManualEntry = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare the data
      const studentData = {
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobile,
        courseName: values.course,
        address: values.address,
        // Since it's a walk-in, we auto-approve or set special status
        status: "APPROVED", 
        adminComments: "Walk-in Registration (Manual Entry)",
        digitalSignature: "Admin Verified"
      };

      // Send to Backend (Using the endpoint we created in Step 1)
      await axios.post('http://localhost:8080/api/applications/manual-register', studentData);

      message.success('Student Manually Registered & Approved!');
      form.resetFields();
      
      // Ask if they want to stay or go to dashboard
      navigate('/admin'); 
    } catch (error) {
      console.error(error);
      message.error('Registration failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Card 
        title={<span><UserAddOutlined /> Walk-in Student Registration</span>}
        bordered={false} 
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Alert 
          message="Admin Mode" 
          description="Students registered here are automatically marked as APPROVED."
          type="info" 
          showIcon 
          style={{ marginBottom: 20 }}
        />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          {/* PERSONAL DETAILS */}
          <Divider orientation="left">Personal Details</Divider>
          
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Kasun Perera" />
          </Form.Item>

          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="student@example.com" />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile Number" rules={[{ required: true }]}>
            <Input placeholder="07XXXXXXXX" />
          </Form.Item>
          
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Permanent Residence" />
          </Form.Item>

          {/* ACADEMIC DETAILS */}
          <Divider orientation="left">Course Enrollment</Divider>

          <Form.Item name="course" label="Select Course" rules={[{ required: true }]}>
            <Select placeholder="Choose a program">
               <Option value="Diploma in IT">Diploma in IT</Option>
               <Option value="BSc in Business Management">BSc in Business Management</Option>
               <Option value="HND in Engineering">HND in Engineering</Option>
               <Option value="Certificate in English">Certificate in English</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} block size="large">
              Register & Approve Student
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
};

export default ManualEntry;