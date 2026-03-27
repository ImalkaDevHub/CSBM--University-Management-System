import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, DatePicker, Modal, message, Card, Statistic, Row, Col, Calendar, Badge } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
// 1. IMPORT THE HISTORY COMPONENT
import CourseHistoryLog from './CourseHistoryLog'; 

const IntakeScheduler = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newDeadline, setNewDeadline] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/courses/all');
      // Add a "key" for the table
      const data = res.data.map(c => ({ ...c, key: c.id }));
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // --- HANDLE DEADLINE UPDATE ---
  const handleEditClick = (record) => {
    setSelectedCourse(record);
    setIsModalOpen(true);
  };

  const saveDeadline = async () => {
    if (!newDeadline) return message.error("Pick a date!");
    
    try {
      const updatedCourse = { 
        ...selectedCourse, 
        applicationDeadline: newDeadline.format('YYYY-MM-DD'),
        intakeStatus: 'OPEN' 
      };

      await axios.put(`http://localhost:8080/api/courses/${selectedCourse.id}`, updatedCourse);
      
      message.success("Deadline Extended Successfully!");
      setIsModalOpen(false);
      fetchCourses(); // Refresh table
    } catch (err) {
      message.error("Failed to update.");
    }
  };

  // --- SMART STATUS LOGIC ---
  const getStatusTag = (deadlineStr) => {
    if (!deadlineStr) return <Tag>Not Set</Tag>;
    
    const deadline = dayjs(deadlineStr);
    const today = dayjs();
    const daysLeft = deadline.diff(today, 'day');

    if (daysLeft < 0) return <Tag color="red">CLOSED</Tag>;
    if (daysLeft < 7) return <Tag color="orange">CLOSING SOON ({daysLeft} days)</Tag>;
    return <Tag color="green">OPEN</Tag>;
  };

  const columns = [
    { title: 'Course Name', dataIndex: 'courseName', key: 'name', width: '30%' },
    { title: 'Intake Date', dataIndex: 'intakeDate', key: 'intake' },
    { 
      title: 'Deadline', 
      dataIndex: 'applicationDeadline', 
      key: 'deadline',
      render: (text) => text || <span style={{color:'gray'}}>Not Scheduled</span>
    },
    { 
      title: 'Status', 
      key: 'status',
      render: (_, record) => getStatusTag(record.applicationDeadline)
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
            Extend
          </Button>
          
          {/* 2. ADD THE HISTORY BUTTON HERE */}
          <CourseHistoryLog courseName={record.courseName} />
        </div>
      )
    }
  ];

  // Calendar Data (Dots)
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const hasDeadline = courses.find(c => c.applicationDeadline === dateStr);
    return hasDeadline ? <Badge status="error" text="Deadline" /> : null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2><CalendarOutlined /> Intake & Deadline Scheduler</h2>
      <p style={{ color: 'gray' }}>Manage upcoming intakes and extend deadlines.</p>

      {/* STATS ROW */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Active Intakes" value={courses.length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Closing This Week" 
              value={courses.filter(c => getStatusTag(c.applicationDeadline).props.color === 'orange').length} 
              valueStyle={{ color: '#faad14' }} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card title="Course Deadlines" style={{ marginBottom: 20 }}>
        <Table dataSource={courses} columns={columns} loading={loading} pagination={{ pageSize: 5 }} />
      </Card>

      {/* CALENDAR VIEW */}
      <Card title="Intake Calendar" style={{ marginTop: 20 }}>
        <Calendar fullscreen={false} cellRender={dateCellRender} />
      </Card>

      {/* MODAL FOR EDITING */}
      <Modal 
        title={`Extend Deadline: ${selectedCourse?.courseName}`} 
        open={isModalOpen} 
        onOk={saveDeadline} 
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Select new deadline date:</p>
        <DatePicker onChange={setNewDeadline} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
};

export default IntakeScheduler;