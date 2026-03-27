import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const AdminWorkshopManager = () => {
  const [workshops, setWorkshops] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();


  const [loading, setLoading] = useState(false);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      console.log('Fetching workshops...');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const res = await fetch('/api/workshops', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', res.status);
      
      if (res.status === 401) {
        console.log('Unauthorized - redirecting');
        window.location.href = '/login';
        return;
      }
      
      const data = await res.json();
      console.log('Workshops data:', data);
      
      // Handle both array and object response
      if (Array.isArray(data)) {
        setWorkshops(data);
      } else if (data.workshops) {
        setWorkshops(data.workshops);
      } else {
        setWorkshops([]);
      }
    } catch (err) {
      console.error('Fetch workshops failed:', err);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. ADD WORKSHOP ---
  const handleAdd = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const newWorkshop = {
        topic: values.topic,
        title: values.topic, // Dual field support
        speaker: values.speaker,
        location: values.location,
        venue: values.location, // Dual field support
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        description: values.description,
        maxCapacity: values.maxCapacity || 50
      };

      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newWorkshop)
      });

      if (res.ok) {
        messageApi.success('Workshop Created Successfully!');
        setIsModalVisible(false);
        form.resetFields();
        await fetchWorkshops(); // Refresh list
      } else {
        const data = await res.json();
        messageApi.error(data.message || 'Failed to create workshop');
      }
    } catch (error) {
      console.error('Create error:', error);
      messageApi.error('Failed to create workshop');
    }
  };

  // --- 3. DELETE WORKSHOP ---
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/workshops/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        messageApi.success('Workshop Deleted Successfully!');
        await fetchWorkshops(); // Refresh list
      } else {
        messageApi.error('Failed to delete workshop');
      }
    } catch (error) {
      messageApi.error('Failed to delete workshop');
    }
  };

  // --- TABLE COLUMNS ---
  const columns = [
    { 
      title: 'Topic', 
      dataIndex: 'topic', 
      key: 'topic',
      render: (text, record) => record.topic || record.title || 'N/A'
    },
    { title: 'Speaker', dataIndex: 'speaker', key: 'speaker' },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    { 
      title: 'Venue', 
      dataIndex: 'location', 
      key: 'location',
      render: (text, record) => record.location || record.venue || 'Main Auditorium'
    },
    {
      title: 'Capacity',
      dataIndex: 'maxCapacity',
      key: 'maxCapacity',
      render: (text, record) => record.maxCapacity || record.capacity || 50
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDelete(record.id || record._id)}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <Card title="🎓 Workshop Management Portal" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Workshop</Button>}>

        <Table 
          dataSource={workshops} 
          columns={columns} 
          rowKey={(record) => record.id || record._id} 
          loading={loading}
          locale={{
            emptyText: (
              <div className="py-8 text-center">
                <div className="text-4xl mb-2">🎪</div>
                <p className="text-slate-400">
                  No workshops yet. Click "+ Add Workshop" to create one.
                </p>
              </div>
            )
          }}
        />
      </Card>


      {/* --- ADD WORKSHOP MODAL --- */}
      <Modal title="Create New Workshop" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="topic" label="Workshop Topic" rules={[{ required: true }]}>
            <Input placeholder="e.g. Intro to Data Science" />
          </Form.Item>

          <Form.Item name="speaker" label="Guest Speaker" rules={[{ required: true }]}>
            <Input placeholder="e.g. Dr. Perera" />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="e.g. Main Auditorium / Zoom" />
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>

          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>Create Workshop</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminWorkshopManager;