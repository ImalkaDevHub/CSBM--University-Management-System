import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Steps,
    Timeline,
    Row,
    Col,
    Statistic,
    Tag,
    Button,
    Space,
    Divider,
    Avatar,
    Spin,
} from 'antd';
import {
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Step } = Steps;

const API_BASE_URL = 'http://localhost:8080/api/applications';

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch student data from localStorage
        const userData = localStorage.getItem('studentUser');
        if (userData) {
            setStudentData(JSON.parse(userData));
        }

        // Fetch application status from backend
        fetchApplicationStatus();
    }, []);

    const fetchApplicationStatus = async () => {
        setLoading(true);
        try {
            // Mock API call - replace with actual endpoint
            const response = await axios.get(`${API_BASE_URL}/status/1`);
            setApplicationStatus(response.data);
        } catch (error) {
            console.error('Error fetching application status:', error);
            // Mock data for demonstration
            setApplicationStatus({
                status: 'PENDING', // Can be: PENDING, UNDER_REVIEW, APPROVED, REJECTED
                submittedDate: '2026-02-10',
                courseName: 'Diploma in Information Technology',
                applicationId: 'APP-2026-001',
            });
        } finally {
            setLoading(false);
        }
    };

    // Get current step based on status
    const getCurrentStep = (status) => {
        switch (status) {
            case 'PENDING':
                return 0;
            case 'UNDER_REVIEW':
                return 1;
            case 'APPROVED':
                return 2;
            case 'REJECTED':
                return -1;
            default:
                return 0;
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'UNDER_REVIEW':
                return 'blue';
            case 'APPROVED':
                return 'green';
            case 'REJECTED':
                return 'red';
            default:
                return 'default';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Submitted';
            case 'UNDER_REVIEW':
                return 'Under Review';
            case 'APPROVED':
                return 'Approved';
            case 'REJECTED':
                return 'Rejected';
            default:
                return 'Unknown';
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Welcome Header */}
            <Card
                style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
                bodyStyle={{ padding: '32px' }}
            >
                <Row align="middle" gutter={16}>
                    <Col>
                        <Avatar size={64} icon={<UserOutlined />} style={{ background: '#fff', color: '#667eea' }} />
                    </Col>
                    <Col flex="auto">
                        <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>
                            Welcome, {studentData?.fullName || 'Student'}! 👋
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                            Track your application status and manage your profile
                        </Text>
                    </Col>
                </Row>
            </Card>

            <Row gutter={24}>
                {/* Application Status Card */}
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                                <span style={{ fontSize: 18, fontWeight: 600 }}>Application Progress</span>
                            </Space>
                        }
                        style={{ marginBottom: 24, borderRadius: 12 }}
                        bodyStyle={{ padding: '32px' }}
                    >
                        {applicationStatus ? (
                            <>
                                <div style={{ marginBottom: 32 }}>
                                    <Space size="large">
                                        <div>
                                            <Text type="secondary">Application ID</Text>
                                            <br />
                                            <Text strong style={{ fontSize: 16 }}>
                                                {applicationStatus.applicationId}
                                            </Text>
                                        </div>
                                        <Divider type="vertical" style={{ height: 40 }} />
                                        <div>
                                            <Text type="secondary">Course</Text>
                                            <br />
                                            <Text strong style={{ fontSize: 16 }}>
                                                {applicationStatus.courseName}
                                            </Text>
                                        </div>
                                        <Divider type="vertical" style={{ height: 40 }} />
                                        <div>
                                            <Text type="secondary">Status</Text>
                                            <br />
                                            <Tag color={getStatusColor(applicationStatus.status)} style={{ fontSize: 14 }}>
                                                {getStatusText(applicationStatus.status)}
                                            </Tag>
                                        </div>
                                    </Space>
                                </div>

                                <Divider />

                                {/* Progress Steps */}
                                <Steps
                                    current={getCurrentStep(applicationStatus.status)}
                                    status={applicationStatus.status === 'REJECTED' ? 'error' : 'process'}
                                    style={{ marginTop: 32 }}
                                >
                                    <Step
                                        title="Submitted"
                                        description="Application received"
                                        icon={<CheckCircleOutlined />}
                                    />
                                    <Step
                                        title="Under Review"
                                        description="Being evaluated"
                                        icon={<ClockCircleOutlined />}
                                    />
                                    <Step
                                        title="Approved"
                                        description="Decision made"
                                        icon={<SafetyOutlined />}
                                    />
                                </Steps>

                                {/* Timeline */}
                                <div style={{ marginTop: 48 }}>
                                    <Title level={5} style={{ marginBottom: 24 }}>
                                        Activity Timeline
                                    </Title>
                                    <Timeline>
                                        <Timeline.Item color="green">
                                            <Text strong>Application Submitted</Text>
                                            <br />
                                            <Text type="secondary">
                                                {new Date(applicationStatus.submittedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </Text>
                                        </Timeline.Item>

                                        {applicationStatus.status === 'UNDER_REVIEW' && (
                                            <Timeline.Item color="blue">
                                                <Text strong>Under Review</Text>
                                                <br />
                                                <Text type="secondary">Your application is being evaluated</Text>
                                            </Timeline.Item>
                                        )}

                                        {applicationStatus.status === 'APPROVED' && (
                                            <Timeline.Item color="green">
                                                <Text strong>Application Approved</Text>
                                                <br />
                                                <Text type="secondary">Congratulations! You have been accepted.</Text>
                                            </Timeline.Item>
                                        )}

                                        {applicationStatus.status === 'REJECTED' && (
                                            <Timeline.Item color="red">
                                                <Text strong>Application Rejected</Text>
                                                <br />
                                                <Text type="secondary">
                                                    Unfortunately, your application was not successful.
                                                </Text>
                                            </Timeline.Item>
                                        )}

                                        {applicationStatus.status === 'PENDING' && (
                                            <Timeline.Item color="gray">
                                                <Text type="secondary">Awaiting review...</Text>
                                            </Timeline.Item>
                                        )}
                                    </Timeline>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '48px 0' }}>
                                <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                                <Title level={4} type="secondary">
                                    No Application Found
                                </Title>
                                <Text type="secondary">You haven't submitted any applications yet.</Text>
                                <br />
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ marginTop: 24 }}
                                    onClick={() => navigate('/student-application')}
                                >
                                    Submit New Application
                                </Button>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Quick Stats Sidebar */}
                <Col xs={24} lg={8}>
                    <Card
                        title="Quick Stats"
                        style={{ marginBottom: 24, borderRadius: 12 }}
                        bodyStyle={{ padding: '24px' }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Statistic
                                title="Total Applications"
                                value={1}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                            <Divider style={{ margin: 0 }} />
                            <Statistic
                                title="Days Since Submission"
                                value={
                                    applicationStatus
                                        ? Math.floor(
                                            (new Date() - new Date(applicationStatus.submittedDate)) /
                                            (1000 * 60 * 60 * 24)
                                        )
                                        : 0
                                }
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Space>
                    </Card>

                    <Card title="Quick Actions" style={{ borderRadius: 12 }} bodyStyle={{ padding: '24px' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Button type="primary" block size="large" onClick={() => navigate('/student-application')}>
                                New Application
                            </Button>
                            <Button block size="large">
                                View Profile
                            </Button>
                            <Button block size="large">
                                Contact Support
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StudentDashboard;
