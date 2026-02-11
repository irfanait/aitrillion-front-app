/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Card,
  Col,
  Collapse,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import {
  Actions,
  ContentCol,
  Desc,
  EnableCard,
  EnablePanel,
  HelperLink,
  RowWrap,
  StyledCard,
} from '../../style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import VideoCardWithModal from '../../VideoCardWithModal';
import { BookOutlined, TeamOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { collapseData } from './data';
import {
  ProductReviewsIcon,
  ReadMoreIcon,
  RedirectIcon,
} from '@/modules/loyalty-rewards/svg-icons';
import { NewsletterIcon, WorkflowIcon } from '@/modules/layouts/svg-icons';
import AitCard from '@/components/atoms/ait-card/aitCard';

const { Title, Text } = Typography;
function GettingStartedTab() {
  const [selectedSetup, setSelectedSetup] = useState('enablelytModule');
  const [activeKey, setActiveKey] = useState(0);
  const [activeAdvanceKey, setActiveAdvanceKey] = useState(0);

  const assetsObj = {
    createnew: 'setupEarnRedeem.svg',
    createreward: 'reddem-points.svg',
    enableLytbtn: 'enable-loyalty-btn.svg',
    lytSetting2: 'custom-loyalty.svg',
    tierlist: 'vip-program.svg',
    createnew2: 'refer-friend.svg',
    lyttemplates: 'loyalty-automation.svg',
  };
  const redirectionObj = {
    createnew: 'loyalty/rule/createnew',
    createreward: 'loyalty/reward/createnewreward',
    enableLytbtn: 'loyalty/loyalty/setting',
    lytSetting2: 'loyalty/loyalty/setting',
    tierlist: 'loyalty/tier/tierlist',
    createnew2: 'loyalty/rule/createnew',
    lyttemplates: 'workflowv1/templates#/loyalty',
  };

  const handleButtonClick = (path) => {
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const renderSetupHeader = (key, label, id) => {
    return (
      <Space align="center">
        {key !== 4 && (
          <Radio
            checked={parseFloat(activeKey) === key}
            onChange={() => {
              setSelectedSetup(id);
              setActiveKey(key);
            }}
          />
        )}
        <h5>{label}</h5>
      </Space>
    );
  };

  const renderAdvanceSetupHeader = (key, label, id) => {
    return (
      <Space align="center">
        {key !== 4 && (
          <Radio
            checked={parseFloat(activeAdvanceKey) === key}
            onChange={() => {
              setSelectedSetup(id);
              setActiveAdvanceKey(key);
            }}
          />
        )}
        <Text strong>{label}</Text>
      </Space>
    );
  };
  return (
    <>
      <AitCard
        title="Setup loyalty reward module"
        borderless={true}
        margintop={'10px'}
        bodypadding={{ md: '10px 15px 10px 15px' }}
      >
        <Text type="secondary">
          Enable AiTrillion loyalty program and reward your customers loyalty
          points for their engagement and purchases. This not only bolsters your
          revenue but also nurtures lasting customer relationships.
          <Button
            type="link"
            style={{ padding: '0px 5px' }}
            onClick={() =>
              handleButtonClick(
                'https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#_What_is_AiTrillion_Loyalty_Rewards_Program'
              )
            }
          >
            Read more
            <span>
              <ReadMoreIcon />
            </span>
          </Button>
        </Text>

        <Row gutter={[12, 12]} style={{ marginTop: '5px' }}>
          <Col xs={24} md={11}>
            <Collapse
              accordion
              activeKey={activeKey}
              onChange={(k) => {
                const key = Array.isArray(k) ? k[0] : k;
                setActiveKey(key);
                // setSelectedSetup(key);
              }}
              bordered={false}
            >
              {collapseData?.map((item, index) =>
                !item?.childern?.length > 0 ? (
                  <EnablePanel
                    showArrow={false}
                    header={renderSetupHeader(index, item?.title, item?.id)}
                    onClick={() => setSelectedSetup(item?.id)}
                    key={index}
                  >
                    <EnableCard>
                      <RowWrap>
                        <ContentCol>
                          <Desc>{item?.des}</Desc>
                          <HelperLink
                            type="link"
                            size="small"
                            onClick={() => handleButtonClick(item?.hyperLink)}
                          >
                            {item?.subDes}
                            <span>
                              <RedirectIcon />
                            </span>
                          </HelperLink>
                          <Actions>
                            <AitButton
                              onClick={() => handleButtonClick(item?.btnLink)}
                              type="primary"
                              title={item?.btnText}
                            />
                          </Actions>
                        </ContentCol>
                      </RowWrap>
                    </EnableCard>
                  </EnablePanel>
                ) : (
                  <EnablePanel
                    showArrow
                    header={renderSetupHeader(index, item?.title, item?.id)}
                    key={index}
                  >
                    <Collapse
                      accordion
                      activeKey={activeAdvanceKey}
                      onChange={(k) => {
                        const key = Array.isArray(k) ? k[0] : k;
                        setActiveAdvanceKey(key);
                      }}
                      bordered={false}
                    >
                      {item?.childern?.map((elm, ind) => (
                        <EnablePanel
                          showArrow={false}
                          header={renderAdvanceSetupHeader(
                            ind,
                            elm?.title,
                            elm?.id
                          )}
                          onClick={() => setSelectedSetup(elm?.id)}
                          key={ind}
                        >
                          <EnableCard>
                            <RowWrap>
                              <ContentCol>
                                <Desc>{elm?.des}</Desc>
                                <HelperLink
                                  type="link"
                                  size="small"
                                  onClick={() =>
                                    handleButtonClick(elm?.hyperLink)
                                  }
                                >
                                  {elm?.subDes}{' '}
                                  <span>
                                    <RedirectIcon />
                                  </span>
                                </HelperLink>
                                <Actions>
                                  <AitButton
                                    onClick={() =>
                                      handleButtonClick(elm?.btnLink)
                                    }
                                    type="primary"
                                    title={elm?.btnText}
                                  />
                                </Actions>
                              </ContentCol>
                            </RowWrap>
                          </EnableCard>
                        </EnablePanel>
                      ))}
                    </Collapse>
                  </EnablePanel>
                )
              )}
            </Collapse>
          </Col>
          <Col xs={24} md={13}>
            <Row gutter={[12, 12]}>
              {selectedSetup === 'enablelytModule' ? (
                <>
                  <Col span={12}>
                    <VideoCardWithModal
                      thumbnailSrc={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/what-is-loyalty-program.png`}
                      title="What is the AiTrillion loyalty reward program"
                      videoUrl="https://www.youtube.com/embed/R03kdq4bDZU?autoplay=1"
                      knowledgeBaseUrl="https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#_What_is_AiTrillion_Loyalty_Rewards_Program"
                    />
                  </Col>
                  <Col span={12}>
                    <VideoCardWithModal
                      thumbnailSrc={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/how-to-setup-lyt-program.png`}
                      title="How to setup a loyalty rewards on Your Store"
                      videoUrl="https://www.youtube.com/embed/bic2XR8Cn4A?autoplay=1"
                      knowledgeBaseUrl="https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#Step_1__Set_Up_Earning_Points"
                    />
                  </Col>
                </>
              ) : (
                <Col span={24}>
                  <StyledCard
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleButtonClick(
                        `${process.env.NEXT_PUBLIC_APP_URL}/${redirectionObj[selectedSetup]}`
                      )
                    }
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/getting-started/${assetsObj[selectedSetup]}`}
                      alt=""
                    />
                  </StyledCard>
                </Col>
              )}
            </Row>

            <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Card
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    handleButtonClick(
                      `${process.env.NEXT_PUBLIC_APP_URL}/index/support`
                    )
                  }
                >
                  <Space>
                    <span role="img" aria-label="help">
                      {/* 👥 */}
                      <TeamOutlined style={{ fontSize: '35px' }} />
                    </span>
                    <Text strong>Need help?</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    handleButtonClick(
                      'https://docs.aitrillion.com/portal/en/kb/aitrillion'
                    )
                  }
                >
                  <Space>
                    <span role="img" aria-label="res">
                      {/* 📄 */}
                      <BookOutlined style={{ fontSize: '35px' }} />
                    </span>
                    <Text strong>Resources</Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </AitCard>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card style={{ minHeight: '200px' }}>
            <Space align="start">
              <ProductReviewsIcon />
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
          <Card style={{ minHeight: '200px' }}>
            <Space align="start">
              <WorkflowIcon />
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
          <Card style={{ minHeight: '200px' }}>
            <Space align="start">
              <NewsletterIcon />
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
