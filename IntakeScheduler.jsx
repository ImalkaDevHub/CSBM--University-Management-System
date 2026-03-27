import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Tag,
    Button,
    Modal,
    DatePicker,
    message,
    Space,
    Typography,
    Badge,
    Calendar,
    Divider,
} from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EditOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const API_BASE_URL = 'http://localhost:8080/api/courses';

const IntakeScheduler = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newDeadline, setNewDeadline] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Fetch all courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/all`);
            setCourses(response.data);
        } catch (error) {
            message.error('Failed to fetch courses');
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Calculate days remaining until deadline
    const calculateDaysRemaining = (deadline) => {
        if (!deadline) return null;
        const today = dayjs();
        const deadlineDate = dayjs(deadline);
        return deadlineDate.diff(today, 'day');
    };

    // Get status tag based on days remaining
    const getStatusTag = (deadline) => {
        const daysRemaining = calculateDaysRemaining(deadline);

        if (daysRemaining === null) {
            return <Tag color="default">No Deadline</Tag>;
        }

        if (daysRemaining < 0) {
            return <Tag color="error">Closed</Tag>;
        }

        if (daysRemaining < 7) {
            return <Tag color="warning">Closing Soon</Tag>;
        }

        return <Tag color="success">Open</Tag>;
    };

    // Open extend deadline modal
    const handleExtendDeadline = (course) => {
        setSelectedCourse(course);
        setNewDeadline(course.applicationDeadline ? dayjs(course.applicationDeadline) : null);
        setModalVisible(true);
    };

    // Update deadline
    const handleUpdateDeadline = async () => {
        if (!newDeadline) {
            message.warning('Please select a new deadline date');
            return;
        }

        setUpdating(true);
        try {
            const updatedCourse = {
                ...selectedCourse,
                applicationDeadline: newDeadline.format('YYYY-MM-DD'),
            };

            await axios.put(`${API_BASE_URL}/${selectedCourse.id}`, updatedCourse);
            message.success('Deadline extended successfully');
            setModalVisible(false);
            fetchCourses();
        } catch (error) {
            message.error('Failed to update deadline');
            console.error('Error updating deadline:', error);
        } finally {
            setUpdating(false);
        }
    };

    // Get deadline dates for calendar
    const getDeadlineDates = () => {
        const deadlines = {};
        courses.forEach((course) => {
            if (course.applicationDeadline) {
                const dateKey = course.applicationDeadline;
                if (!deadlines[dateKey]) {
                    deadlines[dateKey] = [];
                }
                deadlines[dateKey].push(course);
            }
        });
        return deadlines;
    };

    // Calendar cell renderer
    const dateCellRender = (value) => {
        const dateKey = value.format('YYYY-MM-DD');
        const deadlines = getDeadlineDates();
        const coursesOnDate = deadlines[dateKey];

        if (!coursesOnDate || coursesOnDate.length === 0) {
            return null;
        }

        const daysRemaining = calculateDaysRemaining(dateKey);
        let color = 'green';
        if (daysRemaining < 0) {
            color = 'gray';
        } else if (daysRemaining < 7) {
            color = 'red';
        }

        return (
            <div style={{ position: 'relative' }}>
                <Badge
                    status="processing"
                    color={color}
                    text={
                        <Text style={{ fontSize: 11 }}>
                            {coursesOnDate.length} deadline{coursesOnDate.length > 1 ? 's' : ''}
                        </Text>
                    }
                />
            </div>
        );
    };

    // Table columns
    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'courseName',
            key: 'courseName',
            width: '30%',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Next Intake Date',
            dataIndex: 'nextIntakeDate',
            key: 'nextIntakeDate',
            width: '15%',
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    {date ? dayjs(date).format('MMM DD, YYYY') : 'TBA'}
                </Space>
            ),
        },
        {
            title: 'Application Deadline',
            dataIndex: 'applicationDeadline',
            key: 'applicationDeadline',
            width: '20%',
            render: (deadline) => {
                if (!deadline) return <Text type="secondary">Not Set</Text>;
                const daysRemaining = calculateDaysRemaining(deadline);
                return (
                    <Space direction="vertical" size={0}>
                        <Text strong>{dayjs(deadline).format('MMM DD, YYYY')}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined />{' '}
                            {daysRemaining >= 0
                                ? `${daysRemaining} days remaining`
                                : `Expired ${Math.abs(daysRemaining)} days ago`}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'applicationDeadline',
            key: 'status',
            width: '15%',
            render: (deadline) => getStatusTag(deadline),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleExtendDeadline(record)}
                    size="middle"
                >
                    Extend Deadline
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Dashboard Card */}
            <Card
                title={
                    <Space>
                        <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        <Title level={3} style={{ margin: 0 }}>
                            Intake & Deadline Management
                        </Title>
                    </Space>
                }
                style={{ marginBottom: 24 }}
            >
                <Table
                    columns={columns}
                    dataSource={courses}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} courses`,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Calendar View */}
            <Card
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        📅 Deadline Calendar Overview
                    </Title>
                }
            >
                <Calendar
                    cellRender={dateCellRender}
                    style={{
                        background: '#fff',
                        borderRadius: 8,
                    }}
                />
            </Card>

            {/* Extend Deadline Modal */}
            <Modal
                title={
                    <Space>
                        <EditOutlined />
                        <span>Extend Application Deadline</span>
                    </Space>
                }
                open={modalVisible}
                onOk={handleUpdateDeadline}
                onCancel={() => setModalVisible(false)}
                confirmLoading={updating}
                okText="Update Deadline"
                cancelText="Cancel"
                width={500}
            >
                {selectedCourse && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Course:
                            </Text>
                            <br />
                            <Text style={{ fontSize: 15 }}>{selectedCourse.courseName}</Text>
                        </div>

                        <div>
                            <Text strong style={{ fontSize: 16 }}>
                                Current Deadline:
                            </Text>
                            <br />
                            <Text style={{ fontSize: 15 }}>
                                {selectedCourse.applicationDeadline
                                    ? dayjs(selectedCourse.applicationDeadline).format('MMMM DD, YYYY')
                                    : 'Not Set'}
                            </Text>
                        </div>

                        <Divider />

                        <div>
                            <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                                Select New Deadline:
                            </Text>
                            <DatePicker
                                value={newDeadline}
                                onChange={(date) => setNewDeadline(date)}
                                style={{ width: '100%' }}
                                size="large"
                                format="YYYY-MM-DD"
                                disabledDate={(current) => {
                                    // Disable dates before today
                                    return current && current < dayjs().startOf('day');
                                }}
                            />
                        </div>
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default IntakeScheduler;
