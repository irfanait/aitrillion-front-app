import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Collapse,
  Card,
  Button,
  Space,
  Divider,
} from 'antd';
import { DownOutlined, UpOutlined, CheckCircleFilled } from '@ant-design/icons';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';

const { Title, Text, Link } = Typography;
const { Panel } = Collapse;

const steps = [
  {
    key: '1',
    title: 'Setup email DKIM settings',
    duration: 'About 5 minutes',
    description:
      'Enhance email trust. DKIM setup validates sender authenticity, boosts deliverability, and prevents phishing, crucial for effective communication.',
    linkText: 'Guide to setup email DKIM settings',
    button: 'Enable DKIM',
    rightContent: (
      <Card title="DKIM settings">
        <Row gutter={16}>
          <Col span={12}>
            <label>From email address *</label>
            <input value="john@demo.com" className="ant-input" />
          </Col>
          <Col span={12}>
            <label>From name *</label>
            <input value="John" className="ant-input" />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <label>Reply to *</label>
            <input value="john@help.com" className="ant-input" />
          </Col>
          <Col span={12}>
            <label>Company address *</label>
            <input value="demo-store.com" className="ant-input" />
          </Col>
        </Row>
        <div style={{ marginTop: 16 }}>
          <input type="checkbox" style={{ marginRight: 8 }} />
          Set as “Reply to” email
        </div>
        <Button type="primary" style={{ marginTop: 16 }}>
          Save DKIM settings
        </Button>
      </Card>
    ),
  },
  {
    key: '2',
    title: 'Create a customer segment to send emails',
    duration: 'About 3 minutes',
    description: 'Segment your customers to target them effectively.',
    rightContent: <Card title="Segment builder">Segment UI goes here...</Card>,
  },
  {
    key: '3',
    title: 'Send mass email campaigns to targeted customers',
    duration: 'About 3 minutes',
    description: 'Send personalized bulk emails to your segments.',
    rightContent: <Card title="Email Campaign Builder">Campaign UI...</Card>,
  },
  {
    key: '4',
    title: 'Setup email automation with personalized messages',
    duration: 'About 3 minutes',
    description: 'Trigger emails based on user activity or time.',
    rightContent: <Card title="Automation Workflow">Workflow builder...</Card>,
  },
];

const EmailMarketingDashboardTemplate = () => {
  const [activeStep, setActiveStep] = useState('1');

  return (
    <div style={{ padding: 4 }}>
      <AitPageHeader
        title="Email marketing dashboard"
        subtitle="See how your email marketing is performing"
        buttonLabel="Create campaign"
        isCreateButtonVisible={true}
      />

      {/* Custom Setup Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col md={12}>
            <Title level={4}>Setup email marketing module</Title>
            <div>
              {steps.map((step, index) => (
                <div
                  key={step.key}
                  style={{
                    padding: '16px 0',
                    borderBottom:
                      index !== steps.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveStep(step.key)}
                >
                  <Space align="start">
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor:
                          activeStep === step.key ? '#1890ff' : '#f0f0f0',
                        color: activeStep === step.key ? '#fff' : '#000',
                        borderRadius: '50%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {activeStep === step.key ? (
                        <UpOutlined />
                      ) : (
                        <DownOutlined />
                      )}
                    </div>
                    <div>
                      <Text strong>{step.title}</Text>
                      <br />
                      <Text type="secondary">{step.duration}</Text>
                      <br />
                      {activeStep === step.key && (
                        <>
                          <div style={{ marginTop: 8 }}>{step.description}</div>
                          {step.linkText && (
                            <Link style={{ display: 'block', marginTop: 8 }}>
                              {step.linkText}
                            </Link>
                          )}
                          {step.button && (
                            <Button type="primary" style={{ marginTop: 8 }}>
                              {step.button}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Space>
                </div>
              ))}
            </div>
          </Col>
          <Col md={12}>
            {steps.find((s) => s.key === activeStep)?.rightContent}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmailMarketingDashboardTemplate;
