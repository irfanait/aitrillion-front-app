import { Button, Card, Col, Radio, Row, Space, Typography } from 'antd';
import { useState } from 'react';
import {
  NewsletterIcon,
  ProductReviewsIcon,
  ReadMoreIcon,
  WorkflowIcon,
} from '@/modules/loyalty-rewards/svg-icons';
import LoyaltymoduleSetupCard from './loyaltymoduleSetupCard';
import { LytDashboardIconWrap } from '../../style';
const { Title, Text } = Typography;

function GettingStartedTab() {
  const [activeKey, setActiveKey] = useState(0);
  const [activeAdvanceKey, setActiveAdvanceKey] = useState(0);

  const handleButtonClick = (path) => {
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <LoyaltymoduleSetupCard />
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Space align="start">
              <LytDashboardIconWrap>
                <ProductReviewsIcon />
              </LytDashboardIconWrap>

              <Space direction="vertical" size={4}>
                <Title level={5} style={{ margin: 0 }}>
                  Product reviews
                </Title>
                <Text type="secondary">
                  Encourage customers to share reviews by offering loyalty
                  points as reward.
                </Text>
                <Button
                  type="link"
                  style={{ padding: '0px' }}
                  onClick={() =>
                    handleButtonClick(
                      'https://docs.aitrillion.com/portal/en/kb/articles/give-loyalty-points-to-customers-on-product-review#Introduction'
                    )
                  }
                >
                  Read more
                  <span>
                    <ReadMoreIcon />
                  </span>
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space align="start">
              <LytDashboardIconWrap>
                <WorkflowIcon />
              </LytDashboardIconWrap>

              <Space direction="vertical" size={4}>
                <Title level={5} style={{ margin: 0 }}>
                  Workflow automation
                </Title>
                <Text type="secondary">
                  Notify customers when they earn points and engage them via
                  automation.
                </Text>
                <Button
                  type="link"
                  style={{ padding: '0px' }}
                  onClick={() =>
                    handleButtonClick(
                      'https://docs.aitrillion.com/portal/en/kb/articles/setup-a-loyalty-point-reminder-in-workflow-automation'
                    )
                  }
                >
                  Read more
                  <span>
                    <ReadMoreIcon />
                  </span>
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space align="start">
              <LytDashboardIconWrap>
                <NewsletterIcon />
              </LytDashboardIconWrap>

              <Space direction="vertical" size={4}>
                <Title level={5} style={{ margin: 0 }}>
                  Newsletter
                </Title>
                <Text type="secondary">
                  Encourage newsletter signup by offering loyalty points as a
                  reward.
                </Text>
                <Button
                  type="link"
                  style={{ padding: '0px' }}
                  onClick={() =>
                    handleButtonClick(
                      'https://docs.aitrillion.com/portal/en/kb/articles/collect-more-emails-push-subscribers-via-the-loyalty-rewards-program-19-2-2025#The_Game-Changer_Enhanced_Loyalty_Programs'
                    )
                  }
                >
                  Read more
                  <span>
                    <ReadMoreIcon />
                  </span>
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default GettingStartedTab;
