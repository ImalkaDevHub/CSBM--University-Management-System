import { Card, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function PlaceholderPage({ title = 'Page', description = 'Content coming soon.' }) {
  return (
    <Card style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 10 }}>
      <Title level={4}>{title}</Title>
      <Paragraph type="secondary">{description}</Paragraph>
    </Card>
  )
}
