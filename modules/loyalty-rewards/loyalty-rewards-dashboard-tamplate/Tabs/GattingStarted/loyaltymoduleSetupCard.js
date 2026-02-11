import SetupCard from '@/components/molecules/setup-card/setupCard';
import React, { useState, useMemo } from 'react';
import { setupStepsData } from './data';
import Link from 'next/link';
import { Image, Grid, Row, Col, Divider, Flex, Button } from 'antd';
const { useBreakpoint } = Grid;
import { Typography } from 'antd';
import {
  ReadMoreIcon,
  ResourcesIcon,
  SupportIcon,
} from '@/modules/loyalty-rewards/svg-icons';
import AitCard from '@/components/atoms/ait-card/aitCard';
import CommonVideoModal from '@/components/molecules/common-video-modal/videoModal';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const LoyaltymoduleSetupCard = () => {
  const jwtState = useSelector((state) => state?.jwtState);
  const screens = useBreakpoint();
  const [clickedKey, setClickedKey] = useState(setupStepsData[0].key);
  const [activeKey, setActiveKey] = useState(setupStepsData[0].key);
  const [hideSetupEmailCard, setHideSetupEmailCard] = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [disableCollapse, setDisableCollapse] = useState('disabled');
  const [firstVideoModal, setFirstVideoModal] = useState(false);
  const [secVideoModal, setSecVideoModal] = useState(false);

  const filteredSetupStepsData = useMemo(() => {
    if (jwtState?.login_auth?.shop_type === 'woocommerce') {
      return setupStepsData.map((step) => {
        if (step.id === 'advance-setup' && step.children) {
          return {
            ...step,
            children: step.children.filter((child) => child.key !== 'tierlist'),
          };
        }
        return step;
      });
    }
    return setupStepsData;
  }, [jwtState?.login_auth?.shop_type]);

  const handleButtonClick = (path) => {
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const handlePanelClick = (key) => {
    setClickedKey(key);
    setActiveKey((prev) => (prev === key ? null : key));
  };

  const setupSubTitle = (
    <div style={{marginTop:8}}>
    <Text type="secondary">
      Enable AiTrillion loyalty program and reward your customers loyalty points
      for their engagement and purchases. This not only bolsters your revenue
      but also nurtures lasting customer relationships.
      <Button
        type="link"
        style={{ padding: '0px 5px', height:'auto', lineHeight:1 }}
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
    </div>
  );

  const renderRightContent = () => {
    let step = filteredSetupStepsData.find((s) => s.key === clickedKey);

    if (!step) {
      const advanceStep = filteredSetupStepsData.find((s) => s.id === 'advance-setup');
      if (advanceStep && Array.isArray(advanceStep.children)) {
        step = advanceStep.children.find((child) => child.key === clickedKey);
      }
    }

    if (!step) {
      step = filteredSetupStepsData[0];
    }

    if (step.id === 'enablelytModule') {
      return (
        <>
          <Row gutter={[12, 12]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <CommonVideoModal
                visible={firstVideoModal}
                setVisible={setFirstVideoModal}
                styledCard
                thumbnailSrc={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/what-is-loyalty-program.png`}
                title="What is the AiTrillion loyalty reward program"
                modalSubTitle="You just need to follow the video"
                videoUrl="https://www.youtube.com/embed/R03kdq4bDZU?autoplay=1&rel=0"
                knowledgeBaseUrl="https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#_What_is_AiTrillion_Loyalty_Rewards_Program"
              />
            </Col>

            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <CommonVideoModal
                visible={secVideoModal}
                setVisible={setSecVideoModal}
                styledCard
                thumbnailSrc={`${process.env.NEXT_PUBLIC_APP_URL}/assets/images/how-to-setup-lyt-program.png`}
                title="How to setup a loyalty rewards on Your Store"
                modalSubTitle="You just need to follow the video"
                videoUrl="https://www.youtube.com/embed/bic2XR8Cn4A?autoplay=1&rel=0"
                knowledgeBaseUrl="https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-program-overview#Step_1__Set_Up_Earning_Points"
              />
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col span="24">
              <Divider
                orientation="left"
                plain
                style={{ marginTop: 20, marginBottom: 6 }}
              />
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <AitCard
                bodypadding={{ md: '20px 20px 20px 20px', xs:'12px 15px' }}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleButtonClick(
                    `${process.env.NEXT_PUBLIC_APP_URL}/index/support`
                  )
                }
              >
                <Flex gap={10} align={'center'}>
                  <SupportIcon width="auto" height="30px" />
                  <Text
                    style={{ fontWeight: 500 }}
                    className="text-18"
                    type="primary"
                  >
                    Need help?
                  </Text>
                </Flex>
              </AitCard>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <AitCard
                bodypadding={{ md: '20px 20px 20px 20px', xs:'12px 15px' }}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleButtonClick(
                    'https://docs.aitrillion.com/portal/en/kb/aitrillion'
                  )
                }
              >
                <Flex gap={10} align={'center'}>
                  <ResourcesIcon />
                  <Text style={{ fontWeight: 500 }} className="text-18" strong>
                    Resources
                  </Text>
                </Flex>
              </AitCard>
            </Col>
          </Row>
        </>
      );
    }

    return (
      step?.img && (
        <Link href={step.rightUrl}>
          <Image
            src={step.img}
            alt={step.title}
            style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
            unoptimized
            preview={false}
          />
        </Link>
      )
    );
  };

  return (
    <SetupCard
      showCloseIcon={showCloseIcon}
      hideSetupEmailCard={hideSetupEmailCard}
      setHideSetupEmailCard={setHideSetupEmailCard}
      disableCollapse={disableCollapse}
      setupCardTitle="Setup loyalty reward module"
      setupStepsData={filteredSetupStepsData}
      setupSubTitle={setupSubTitle}
      rightcontent={renderRightContent()}
      setClickedKey={setClickedKey}
      clickedKey={clickedKey}
      activeKey={activeKey}
      setActiveKey={setActiveKey}
      handlePanelClick={handlePanelClick}
      screens={screens}
    />
  );
};

export default LoyaltymoduleSetupCard;
