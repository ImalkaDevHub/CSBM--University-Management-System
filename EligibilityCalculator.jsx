import React, { useState, useEffect } from 'react';
import {
    Card,
    Select,
    Radio,
    Button,
    Alert,
    Space,
    Typography,
    Spin,
    Divider,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    RocketOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title, Text } = Typography;

const API_BASE_URL = 'http://localhost:8080/api/courses';

const EligibilityCalculator = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStream, setSelectedStream] = useState(null);
    const [selectedPasses, setSelectedPasses] = useState(null);
    const [eligibilityResult, setEligibilityResult] = useState(null);
    const navigate = useNavigate();

    // A/L Stream options
    const streamOptions = [
        { value: 'Maths', label: 'Mathematics' },
        { value: 'Bio', label: 'Biological Science' },
        { value: 'Commerce', label: 'Commerce' },
        { value: 'Arts', label: 'Arts' },
        { value: 'Tech', label: 'Technology' },
    ];

    // Fetch all courses
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/all`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Check eligibility
    const handleCheckEligibility = () => {
        if (!selectedCourse || !selectedStream || selectedPasses === null) {
            setEligibilityResult({
                eligible: false,
                message: 'Please fill in all fields to check your eligibility',
            });
            return;
        }

        setChecking(true);

        // Simulate checking delay for better UX
        setTimeout(() => {
            const course = courses.find((c) => c.id === selectedCourse);

            if (!course) {
                setEligibilityResult({
                    eligible: false,
                    message: 'Course not found',
                });
                setChecking(false);
                return;
            }

            // Extract course requirements
            // Assuming course has: minALPasses (number) and streamReq (string: 'Any', 'Maths', 'Bio', etc.)
            const minALPasses = course.minALPasses || 2; // Default to 2 if not set
            const streamReq = course.streamReq || 'Any'; // Default to 'Any' if not set

            // Check eligibility logic
            const passesRequirement = selectedPasses >= minALPasses;
            const streamRequirement = streamReq === 'Any' || streamReq === selectedStream;

            const isEligible = passesRequirement && streamRequirement;

            // Build detailed message
            let message = '';
            if (isEligible) {
                message = `Congratulations! You are eligible for ${course.courseName}. Click 'Apply Now' to submit your application.`;
            } else {
                const reasons = [];
                if (!passesRequirement) {
                    reasons.push(`Minimum ${minALPasses} A/L passes required (You have: ${selectedPasses})`);
                }
                if (!streamRequirement) {
                    reasons.push(`Required stream: ${streamReq} (You selected: ${selectedStream})`);
                }
                message = `Sorry, you do not meet the requirements for ${course.courseName}. ${reasons.join('. ')}.`;
            }

            setEligibilityResult({
                eligible: isEligible,
                message: message,
                courseName: course.courseName,
            });

            setChecking(false);
        }, 800);
    };

    // Reset form
    const handleReset = () => {
        setSelectedCourse(null);
        setSelectedStream(null);
        setSelectedPasses(null);
        setEligibilityResult(null);
    };

    // Navigate to application form
    const handleApplyNow = () => {
        navigate('/student-application');
    };

    return (
        <div
            style={{
                padding: '24px',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card
                style={{
                    maxWidth: 650,
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
                bodyStyle={{ padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8, color: '#1890ff' }}>
                        🎓 Check Your Eligibility
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                        Find out if you qualify for your desired course
                    </Text>
                </div>

                <Divider />

                <Spin spinning={loading}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Course Selection */}
                        <div>
                            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                                Select Course
                            </Text>
                            <Select
                                size="large"
                                placeholder="Choose a course"
                                style={{ width: '100%' }}
                                value={selectedCourse}
                                onChange={(value) => {
                                    setSelectedCourse(value);
                                    setEligibilityResult(null);
                                }}
                                showSearch
                                optionFilterProp="children"
                            >
                                {courses.map((course) => (
                                    <Option key={course.id} value={course.id}>
                                        {course.courseName}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* A/L Stream Selection */}
                        <div>
                            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                                A/L Stream
                            </Text>
                            <Select
                                size="large"
                                placeholder="Select your A/L stream"
                                style={{ width: '100%' }}
                                value={selectedStream}
                                onChange={(value) => {
                                    setSelectedStream(value);
                                    setEligibilityResult(null);
                                }}
                            >
                                {streamOptions.map((stream) => (
                                    <Option key={stream.value} value={stream.value}>
                                        {stream.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* A/L Results (Radio Buttons) */}
                        <div>
                            <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
                                A/L Results
                            </Text>
                            <Radio.Group
                                size="large"
                                value={selectedPasses}
                                onChange={(e) => {
                                    setSelectedPasses(e.target.value);
                                    setEligibilityResult(null);
                                }}
                                style={{ width: '100%' }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Radio value={3} style={{ fontSize: 15 }}>
                                        3 Passes
                                    </Radio>
                                    <Radio value={2} style={{ fontSize: 15 }}>
                                        2 Passes
                                    </Radio>
                                    <Radio value={1} style={{ fontSize: 15 }}>
                                        1 Pass
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<SearchOutlined />}
                                onClick={handleCheckEligibility}
                                loading={checking}
                                disabled={!selectedCourse || !selectedStream || selectedPasses === null}
                                style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                            >
                                Check Status
                            </Button>
                            <Button
                                size="large"
                                onClick={handleReset}
                                style={{ height: 48, fontSize: 16, width: 120 }}
                            >
                                Reset
                            </Button>
                        </div>

                        {/* Eligibility Result */}
                        {eligibilityResult && (
                            <div style={{ marginTop: 16 }}>
                                <Alert
                                    message={
                                        <span style={{ fontSize: 16, fontWeight: 600 }}>
                                            {eligibilityResult.eligible ? '✅ You are Eligible!' : '❌ Not Eligible'}
                                        </span>
                                    }
                                    description={
                                        <div>
                                            <span style={{ fontSize: 14 }}>{eligibilityResult.message}</span>
                                            {eligibilityResult.eligible && (
                                                <div style={{ marginTop: 16 }}>
                                                    <Button
                                                        type="primary"
                                                        size="large"
                                                        icon={<RocketOutlined />}
                                                        onClick={handleApplyNow}
                                                        style={{ fontWeight: 600 }}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    }
                                    type={eligibilityResult.eligible ? 'success' : 'error'}
                                    showIcon
                                    icon={
                                        eligibilityResult.eligible ? (
                                            <CheckCircleOutlined style={{ fontSize: 24 }} />
                                        ) : (
                                            <CloseCircleOutlined style={{ fontSize: 24 }} />
                                        )
                                    }
                                    style={{
                                        borderRadius: 8,
                                        padding: '16px 20px',
                                    }}
                                />
                            </div>
                        )}

                        {/* Course Requirements Display */}
                        {selectedCourse && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: 16,
                                    background: '#f5f5f5',
                                    borderRadius: 8,
                                }}
                            >
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                    📋 Course Requirements:
                                </Text>
                                <Text type="secondary">
                                    {(() => {
                                        const course = courses.find((c) => c.id === selectedCourse);
                                        const minPasses = course?.minALPasses || 2;
                                        const stream = course?.streamReq || 'Any';
                                        return `Minimum ${minPasses} A/L passes required. Stream: ${stream}`;
                                    })()}
                                </Text>
                            </div>
                        )}
                    </Space>
                </Spin>
            </Card>
        </div>
    );
};

export default EligibilityCalculator;
