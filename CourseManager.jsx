import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = 'http://localhost:8080/api/courses';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

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

  // Open drawer for adding new course
  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  // Open drawer for editing existing course
  const handleEdit = (record) => {
    setEditingCourse(record);
    form.setFieldsValue({
      ...record,
      applicationDeadline: record.applicationDeadline
        ? dayjs(record.applicationDeadline)
        : null,
    });
    setDrawerVisible(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Format the data
      const courseData = {
        ...values,
        applicationDeadline: values.applicationDeadline
          ? values.applicationDeadline.format('YYYY-MM-DD')
          : null,
        modules: values.modules || [],
      };

      if (editingCourse) {
        // Update existing course
        await axios.put(`${API_BASE_URL}/${editingCourse.id}`, courseData);
        message.success('Course updated successfully');
      } else {
        // Create new course
        await axios.post(API_BASE_URL, courseData);
        message.success('Course created successfully');
      }

      setDrawerVisible(false);
      form.resetFields();
      fetchCourses();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to save course');
        console.error('Error saving course:', error);
      }
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      message.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      message.error('Failed to delete course');
      console.error('Error deleting course:', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      width: '20%',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      width: '12%',
      render: (fee) => `$${fee?.toLocaleString() || 0}`,
    },
    {
      title: 'Requirements',
      dataIndex: 'requirements',
      key: 'requirements',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Course Leader',
      dataIndex: 'courseLeader',
      key: 'courseLeader',
      width: '15%',
    },
    {
      title: 'Application Deadline',
      dataIndex: 'applicationDeadline',
      key: 'applicationDeadline',
      width: '13%',
      render: (date) => (date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'),
    },
    {
      title: 'Modules',
      dataIndex: 'modules',
      key: 'modules',
      width: '10%',
      render: (modules) => (
        <Tag color="blue">{modules?.length || 0} modules</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 600 }}>
            Course Management
          </span>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            Add Course
          </Button>
        }
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Course Drawer */}
      <Drawer
        title={
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </span>
        }
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => setDrawerVisible(false)}
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                icon={<SaveOutlined />}
              >
                {editingCourse ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[
              { required: true, message: 'Please enter the course name' },
            ]}
          >
            <Input placeholder="e.g., Computer Science BSc" size="large" />
          </Form.Item>

          <Form.Item
            name="fee"
            label="Fee"
            rules={[{ required: true, message: 'Please enter the course fee' }]}
          >
            <InputNumber
              placeholder="0.00"
              style={{ width: '100%' }}
              size="large"
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="Requirements"
            rules={[
              { required: true, message: 'Please enter the requirements' },
            ]}
          >
            <Input.TextArea
              placeholder="e.g., A/L Stream: Physical Science, Minimum Passes: 3"
              rows={3}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="courseLeader"
            label="Course Leader"
            rules={[
              { required: true, message: 'Please enter the course leader' },
            ]}
          >
            <Input placeholder="e.g., Dr. John Smith" size="large" />
          </Form.Item>

          <Form.Item
            name="applicationDeadline"
            label="Application Deadline"
            rules={[
              { required: true, message: 'Please select the deadline' },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              size="large"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Divider>Modules</Divider>

          <Form.List name="modules">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[
                        { required: true, message: 'Please enter module name' },
                      ]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Input placeholder="Module name" size="large" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                  >
                    Add Module
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </div>
  );
};

export default CourseManager;
