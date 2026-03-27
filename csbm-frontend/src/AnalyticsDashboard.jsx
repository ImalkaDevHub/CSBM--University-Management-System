import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Progress, message, Divider } from 'antd';
import { DownloadOutlined, MailOutlined, PieChartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/analytics/stats');
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const handleExport = () => {
    // Trigger file download directly
    window.open('http://localhost:8080/api/analytics/export', '_blank');
    message.success("Downloading Student Data...");
  };

  const handleSendReminders = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/analytics/notify', {
        type: "INCOMPLETE_PROFILE"
      });
      message.success(res.data.message || "Reminder Emails Sent Successfully!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error(`Failed: ${error.response.data.error}`);
      } else {
        message.error("Failed to send emails");
      }
    }
  };

  // Mock data for the chart since we don't have historical intake data in the DB yet
  const chartData = [
    { name: 'Spring Intake', Total: Math.floor(stats.total * 0.3), Approved: Math.floor(stats.approved * 0.3) },
    { name: 'Summer Intake', Total: Math.floor(stats.total * 0.5), Approved: Math.floor(stats.approved * 0.5) },
    { name: 'Fall Intake', Total: stats.total, Approved: stats.approved },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Campus Analytics & Reporting</h2>

      {/* 1. KEY STATISTICS CARDS */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Applications" value={stats.total} prefix={<PieChartOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#3f8600' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending Review" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          {/* 2. EXPORT BUTTON */}
          <Card>
            <Button type="primary" icon={<DownloadOutlined />} block onClick={handleExport} style={{ height: '60px' }}>
              Export Data (CSV)
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 3. VISUAL PROGRESS BARS */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Approval Rates">
            <div>Approved Students</div>
            <Progress percent={stats.total ? Math.round((stats.approved / stats.total) * 100) : 0} status="success" />

            <div style={{ marginTop: 10 }}>Pending Applications</div>
            <Progress percent={stats.total ? Math.round((stats.pending / stats.total) * 100) : 0} status="active" />

            <div style={{ marginTop: 10 }}>Rejected</div>
            <Progress percent={stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0} status="exception" />
          </Card>
        </Col>
      </Row>

      {/* 4. RECHARTS & AUTOMATED ACTIONS */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card title="Registration Trends by Intake">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total" fill="#8884d8" name="Total Applications" />
                  <Bar dataKey="Approved" fill="#82ca9d" name="Approved Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Automated Communications" style={{ height: '100%' }}>
            <p className="text-sm text-slate-500 mb-4">Send automated reminders to all students marked as "PENDING" (Incomplete Profiles).</p>
            <Button type="primary" danger icon={<MailOutlined />} onClick={handleSendReminders} block size="large">
              Send Incomplete Reminders
            </Button>
            <Divider />
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
              <CheckCircleOutlined className="mr-2" />
              System automatically sends Welcome and Approval emails using NodeMailer.
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;