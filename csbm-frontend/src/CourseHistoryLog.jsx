import React, { useState } from 'react';
import { Drawer, Timeline, Button, Tag, Typography } from 'antd';
import { HistoryOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CourseHistoryLog = ({ courseName }) => {
  const [visible, setVisible] = useState(false);

  // MOCK DATA: In a real app, you would fetch this from an API endpoint like /api/audit-logs
  const history = [
    { date: '2026-02-14', action: 'Deadline Extended', user: 'Admin', details: 'Changed from Jan 30 to Feb 20' },
    { date: '2026-01-10', action: 'Fee Updated', user: 'Finance', details: 'Increased fee to 150,000 LKR' },
    { date: '2025-12-05', action: 'Course Created', user: 'SuperAdmin', details: 'Initial Setup' },
  ];

  return (
    <>
      <Button type="dashed" icon={<HistoryOutlined />} onClick={() => setVisible(true)}>
        View History
      </Button>

      <Drawer
        title={`Audit Log: ${courseName || 'Course'}`}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={400}
      >
        <Timeline mode="left">
          {history.map((item, index) => (
            <Timeline.Item 
              key={index} 
              label={item.date}
              dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
            >
              <Text strong>{item.action}</Text>
              <br />
              <Tag color="blue">{item.user}</Tag>
              <p style={{ color: 'gray', marginTop: 5 }}>{item.details}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </>
  );
};

export default CourseHistoryLog;