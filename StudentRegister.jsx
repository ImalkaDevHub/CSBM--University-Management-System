import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const StudentRegister = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values) => {
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            // Save user data to localStorage
            const userData = {
                fullName: values.fullName,
                email: values.email,
                mobile: values.mobile,
                registeredAt: new Date().toISOString(),
            };

            localStorage.setItem('studentUser', JSON.stringify(userData));
            message.success('Registration successful! Redirecting to dashboard...');

            setTimeout(() => {
                navigate('/student-dashboard');
            }, 1000);

            setLoading(false);
        }, 1000);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
            }}
        >
            <Card
                style={{
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                bodyStyle={{ padding: '48px 40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2} style={{ marginBottom: 8, color: '#1890ff' }}>
                        🎓 Student Registration
                    </Title>
                    <Text type="secondary" style={{ fontSize: 15 }}>
                        Create your account to apply for courses
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRegister}
                    requiredMark="optional"
                    size="large"
                >
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[
                            { required: true, message: 'Please enter your full name' },
                            { min: 3, message: 'Name must be at least 3 characters' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="John Doe"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="john.doe@example.com"
                        />
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        label="Mobile Number"
                        rules={[
                            { required: true, message: 'Please enter your mobile number' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="0771234567"
                            maxLength={10}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text type="secondary">
                        Already have an account?{' '}
                        <a href="/student-login" style={{ fontWeight: 600 }}>
                            Login here
                        </a>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default StudentRegister;
