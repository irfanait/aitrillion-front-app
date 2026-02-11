import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Select,
  Collapse,
  Tabs,
  Carousel,
} from 'antd';
import {
  UserOutlined,
  GiftOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Content } = Layout;
const { Panel } = Collapse;

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout style={{ minHeight: '100vh', background: '#f6f6f6' }}>
      {/* Header */}
      <Header
        style={{
          background: '#fff',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Welcome to AiTrillion
        </Title>
      </Header>

      <Content style={{ padding: '24px' }}>
        {/* Dashboard Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 16 }}
        >
          <Tabs.TabPane tab="Dashboard" key="dashboard" />
          <Tabs.TabPane tab="Recent Updates" key="updates" />
        </Tabs>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Section */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Space direction="vertical">
                    <Title level={4}>6/16</Title>
                    <Text>Total modules enabled</Text>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Space direction="vertical">
                    <Title level={4}>262</Title>
                    <Text>Total active customers</Text>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Space direction="vertical">
                    <Title level={4}>3</Title>
                    <Text>Customers engaged by AiTrillion</Text>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Space direction="vertical">
                    <Title level={4}>52</Title>
                    <Text>Customers engagement events</Text>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Collapsible Loyalty Rewards Program */}
            <Collapse style={{ marginTop: 16 }} defaultActiveKey={['1']}>
              <Panel
                header={
                  <Space>
                    <GiftOutlined
                      style={{ fontSize: '18px', color: '#1890ff' }}
                    />
                    <Title level={5} style={{ margin: 0 }}>
                      Loyalty rewards program
                    </Title>
                  </Space>
                }
                key="1"
              >
                <Text>
                  Reward customer engagement and purchases with AiTrillion
                  loyalty points.
                </Text>
              </Panel>
            </Collapse>

            {/* Recommended Apps Slider */}
            <Title level={5} style={{ marginTop: 24 }}>
              Recommended apps
            </Title>
            <Carousel
              dots={false}
              slidesToShow={3}
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 1 } },
              ]}
            >
              <Card>
                <AppstoreOutlined
                  style={{ fontSize: '24px', color: '#1890ff' }}
                />
                <Text strong style={{ marginLeft: 8 }}>
                  BeyondCart Mobile App Builder
                </Text>
              </Card>

              <Card>
                <AppstoreOutlined
                  style={{ fontSize: '24px', color: '#1890ff' }}
                />
                <Text strong style={{ marginLeft: 8 }}>
                  EComposer Landing Page Builder
                </Text>
              </Card>

              <Card>
                <AppstoreOutlined
                  style={{ fontSize: '24px', color: '#1890ff' }}
                />
                <Text strong style={{ marginLeft: 8 }}>
                  SEOAnt - AI SEO Optimizer
                </Text>
              </Card>
            </Carousel>

            {/* Activity Section */}
            <Card style={{ marginTop: 24 }}>
              <Title level={5}>
                Realtime activities & engagement by AiTrillion
              </Title>
              <Select defaultValue="All activities" style={{ width: '100%' }}>
                <Select.Option value="all">All activities</Select.Option>
                <Select.Option value="engagement">Engagement</Select.Option>
                <Select.Option value="customers">Customers</Select.Option>
              </Select>
            </Card>
          </>
        ) : (
          /* Recent Updates Content */
          <Card>
            <Title level={4}>No recent updates available</Title>
            <Text>Stay tuned for new updates coming soon!</Text>
          </Card>
        )}
      </Content>
    </Layout>
  );
}
