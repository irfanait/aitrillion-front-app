import React, { useState } from 'react';
import {
  Card,
  Collapse,
  Typography,
  Button,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Grid,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { assetPrefix } from '@/utils/helper';
import Image from 'next/image';
import { InnerCollapseWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { getToken } from '@/utils/authHelpers';
import { useRouter } from 'next/router';
const { useBreakpoint } = Grid;
const token = getToken();

const { Panel } = Collapse;
const { Title, Text, Link } = Typography;

const EmailSetupCard = () => {
  const screens = useBreakpoint();
  const [clickedKey, setClickedKey] = useState(null); // for image
  const [activeKey, setActiveKey] = useState('1'); // for Collapse open/close
  const router = useRouter();
  const handlePanelClick = (key) => {
    setClickedKey(key); // update image
    setActiveKey((prev) => (prev === key ? null : key)); // toggle panel
  };

  const getImagePath = (filename) => `/assets/email-marketing-img/${filename}`;

  const renderRightContent = () => {
    switch (clickedKey) {
      case '1':
        return (
          <Link href={`settings/dkimsetting`}>
            <Image
              src={getImagePath('enable-dkim.svg')}
              alt="DKIM"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Link>
        );
      case '2':
        return (
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`}
          >
            <Image
              src={getImagePath('customer-segment (1).svg')}
              alt="Customer Segment"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Link>
        );
      case '3':
        return (
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}/message/#/email?ai_v2=${token}`}
          >
            <Image
              src={getImagePath('e-mass-campaign.svg')}
              alt="Mass Email"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Link>
        );
      case '4':
        return (
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/templates#/all?ai_v2=${token}`}
          >
            <Image
              src={getImagePath('email-automation.svg')}
              alt="Automation"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Link>
        );
      default:
        return (
          <Link href={`settings/dkimsetting`}>
            <Image
              src={getImagePath('enable-dkim.svg')}
              alt="DKIM"
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
          </Link>
        );
    }
  };

  return (
    <div>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <InnerCollapseWrapper
            accordion
            activeKey={activeKey}
            expandIconPosition="left"
            bordered={false}
          >
            <Panel
              header={
                <div onClick={() => handlePanelClick('1')}>
                  <Title level={5}>Setup email DKIM settings</Title>
                  <Text type="secondary">About 5 minutes</Text>
                </div>
              }
              key="1"
            >
              <Row gutter={[0, 10]}>
                {!screens?.xl && (
                  <Col span={24} style={{ paddingTop: '10px' }}>
                    <Link href={`settings/dkimsetting`}>
                      <Image
                        src={getImagePath('enable-dkim.svg')}
                        alt="DKIM"
                        width={600}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                        unoptimized
                      />
                    </Link>
                  </Col>
                )}

                <Col
                  span={24}
                  style={{ paddingTop: !screens?.xl ? '5px' : '10px' }}
                >
                  <Text type="secondary">
                    Enhance email trust. DKIM setup validates sender
                    authenticity, boosts deliverability, and prevents phishing.
                  </Text>
                </Col>
                <Col span={24}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 500 }}
                    href={`https://docs.aitrillion.com/portal/en/kb/articles/send-email-from-business-email-using-dkim`}
                  >
                    Guide to setup email DKIM settings
                  </Link>
                </Col>
                <Col span={24}>
                  <AitButton
                    title={'Enable DKIM'}
                    type="primary"
                    onClick={() => {
                      router.push(`/email-marketing/settings/dkimsetting`);
                    }}
                  />
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div onClick={() => handlePanelClick('2')}>
                  <Title level={5}>
                    Create a customer segment to send emails
                  </Title>
                  <Text type="secondary">About 3 minutes</Text>
                </div>
              }
              key="2"
            >
              <Row gutter={[0, 10]}>
                {!screens?.xl && (
                  <Col span={24} style={{ paddingTop: '10px' }}>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`}
                    >
                      <Image
                        src={getImagePath('customer-segment (1).svg')}
                        alt="Customer Segment"
                        width={600}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                        unoptimized
                      />
                    </Link>
                  </Col>
                )}
                <Col
                  span={24}
                  style={{ paddingTop: !screens?.xl ? '5px' : '10px' }}
                >
                  <Text type="secondary">
                    Increase the relevancy of your marketing campaign by sending
                    email messages based on the dynamic customer segments.{' '}
                  </Text>
                </Col>
                <Col span={24}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 500 }}
                    href={`https://docs.aitrillion.com/portal/en/kb/articles/create-a-customer-segment-for-email-campaign`}
                  >
                    Guide to create customer segment
                  </Link>
                </Col>
                <Col span={24}>
                  <AitButton
                    title={'Create segment'}
                    type="primary"
                    variant="link"
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/customers#/list?ai_v2=${token}`}
                  />
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div onClick={() => handlePanelClick('3')}>
                  <Title level={5}>
                    Send mass email campaigns to targeted customers
                  </Title>
                  <Text type="secondary">About 3 minutes</Text>
                </div>
              }
              key="3"
            >
              <Row gutter={[0, 10]}>
                {!screens?.xl && (
                  <Col span={24} style={{ paddingTop: '10px' }}>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/message/#/email?ai_v2=${token}`}
                    >
                      <Image
                        src={getImagePath('e-mass-campaign.svg')}
                        alt="Mass Email"
                        width={600}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                        unoptimized
                      />
                    </Link>
                  </Col>
                )}
                <Col
                  span={24}
                  style={{ paddingTop: !screens?.xl ? '5px' : '10px' }}
                >
                  <Text type="secondary">
                    Send emails to your customers in bulk if you want to make
                    any announcements. This is a step-by-step guide to sending
                    bulk emails to a group of customers.
                  </Text>
                </Col>
                <Col span={24}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 500 }}
                    href={`https://docs.aitrillion.com/portal/en/kb/articles/how-to-send-bulk-emails-to-a-group-of-customers-16-2-2025`}
                  >
                    Guide to send mass email campaigns
                  </Link>
                </Col>
                <Col span={24}>
                  <AitButton
                    title={'Start sending campaign'}
                    type="primary"
                    onClick={() => {
                      router.push(`/email-marketing/campaign/create-campaign`);
                    }}
                  />
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div onClick={() => handlePanelClick('4')}>
                  <Title level={5}>
                    Setup email automation with personalized messages
                  </Title>
                  <Text type="secondary">About 3 minutes</Text>
                </div>
              }
              key="4"
            >
              <Row gutter={[0, 10]}>
                {!screens?.xl && (
                  <Col span={24} style={{ paddingTop: '10px' }}>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/templates#/all?ai_v2=${token}`}
                    >
                      <Image
                        src={getImagePath('email-automation.svg')}
                        alt="Automation"
                        width={600}
                        height={400}
                        style={{ width: '100%', height: 'auto' }}
                        unoptimized
                      />
                    </Link>
                  </Col>
                )}
                <Col
                  span={24}
                  style={{ paddingTop: !screens?.xl ? '5px' : '10px' }}
                >
                  <Text type="secondary">
                    Create easy flows of emails based on different automated
                    triggers with personalized messages.
                  </Text>
                </Col>
                <Col span={24}>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 500 }}
                    href={`https://docs.aitrillion.com/portal/en/kb/articles/setup-email-automation-based-on-segmented-audience`}
                  >
                    Guide to setup email automation
                  </Link>
                </Col>
                <Col span={24}>
                  <AitButton
                    title={'Setup automation'}
                    type="primary"
                    variant="link"
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/templates#/all?ai_v2=${token}`}
                  />
                </Col>
              </Row>
            </Panel>
          </InnerCollapseWrapper>
        </Col>

        {screens?.xl && (
          <Col xs={24} md={12}>
            {renderRightContent()}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default EmailSetupCard;
