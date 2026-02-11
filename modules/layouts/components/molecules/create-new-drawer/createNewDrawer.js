import AitDrawer from '@/components/atoms/ait-drawer/aitDrawer';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  message,
  Image,
  Col,
  Row,
  Typography,
  Flex,
  Card,
  Divider,
  Grid,
} from 'antd';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;
import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  StyleButton,
  StyleCollapseMenu,
  StyleCollapseMenuPanel,
  StyleHorizontalTabs,
  StyleHorizontaltabTop,
  StyleVerticalTabs,
  StyleVerticaltabTop,
  Tabheading,
} from './style';
import {
  CampaignIcon,
  EmailIcon,
  EngageIcon,
  SegmentIcon,
  TemplateIcon,
  WorkflowIcon,
  WebpushIcon,
  SmsIcon,
  SmartPopupIcon,
  AnnbarIcon,
  WhatsAppIcon,
  LiveChatIcon,
  ProductRecommendationIcon,
  LoyaltyIcon,
  ProductReviewIcon,
  AffiliateIcon,
  NewArrivalIcon,
  TrendingIcon,
  RecentIcon,
  RelatedIcon,
  PastRelatedIcon,
  PastPurchaseIcon,
  PastRecentIcon,
  PastCartIcon,
  EarnIcon,
  RedeemIcon,
  CollectReviewsIcon,
  DisplayReviewsIcon,
  CreateAffiliateIcon,
  ManageAffiliateIcon,
  OneTimeIcon,
  ShecduledIcon,
  NewsletterIcon,
  CustomPopupIcon,
  ProductReviewPopupIcon,
  SiteReviewIcon,
  ProductPopupIcon,
  AnnBarIcon,
  TimerIcon,
  SalesBarIcon,
  CookieBarIcon,
  WhatsAppChatIcon,
  LiveChatsettingIcon,
} from '@/modules/layouts/svg-icons';
import { assetPrefix } from '@/utils/helper';
import Link from 'next/link';
import { token } from '@/modules/layouts/utils/constants';
import WorkflowsModal from '../workflows-modal/workflowsModal';
import { useSelector } from 'react-redux';
import { getAccessMap } from '@/modules/layouts/helper';
import { moduleRoute } from '@/modules/layouts/routeControl/route';

const getImagePath = (filename) =>
  `${assetPrefix}assets/module-templates/${filename}`;

const { TabPane } = Tabs;

const icons = [
  <CampaignIcon />,
  <WorkflowIcon />,
  <EngageIcon />,
  <SegmentIcon />,
  <TemplateIcon />,
];

const verticalTabs = [
  {
    key: 'v1',
    title: 'Campaign',
    desc: 'Send message from multiple channels.',
    icon: icons[0],
  },
  {
    key: 'v2',
    title: 'Workflow',
    desc: 'Setup automation in communication from multiple channels.',
    icon: icons[1],
  },
  {
    key: 'v3',
    title: 'Engage',
    desc: 'Engage your customers with personalize experience.',
    icon: icons[2],
  },
  {
    key: 'v4',
    title: 'Segments',
    desc: 'Group users based on activities and properties.',
    icon: icons[3],
  },
  {
    key: 'v5',
    title: 'Templates',
    desc: 'Browse all templates.',
    icon: icons[4],
  },
];

const CreateNewDrawer = ({
  createNewdrawerVisible,
  setCreateNewdrawerVisible,
  is_V1_V2_object = { is_V1_V2_object },
}) => {
  const screens = useBreakpoint();
  const { encoded_shop_id, is_bkac } = useSelector(
    (state) => state.jwtState?.login_auth
  );
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const encodedShopId = encoded_shop_id || '';
  const is_Bkac = is_bkac ? 1 : 0;
  const isMobile = !screens?.md ? true : false;
  const [activeKey, setActiveKey] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeInnerTabs, setActiveInnerTabs] = useState({});
  const [showSubtabs, setShowSubtabs] = useState(false);
  const { is_enable_loyalty_v2 } = is_V1_V2_object;

  const handleTabClick = (key) => {
    if (key === 'v2') {
      setPopupVisible(true);
      setCreateNewdrawerVisible(false);
    } else if (key === 'v4') {
      message.info('Redirecting...');
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/customers#/list`;
    } else {
      setActiveKey(key);
      setShowSubtabs(true);
    }
  };

  useEffect(() => {
    if (screens?.md) {
      setActiveKey('v1');
    } else {
      setActiveKey(null);
    }
  }, [isMobile]);

  // Build accessMap once
  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  // Tab sets for v1
  const v1Tabs = {
    horizontalTabs1: [
      {
        key: 'v1-h1-1',
        label: 'Email',
        ai_module_feature: 'email_marketing',
        ai_user_feature: 'email_marketing',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`/email-marketing/campaign/create-campaign`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <OneTimeIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        One time
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience now.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`/email-marketing/campaign/create-campaign?type=schedule`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <ShecduledIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Schedule email
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience at scheduled time.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <EmailIcon />,
      },
      {
        key: 'v1-h1-2',
        label: 'SMS',
        ai_module_feature: 'sms',
        ai_user_feature: 'sms',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/sms/#/createcampaign?ai_v2=${token}`}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <OneTimeIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        One time
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience now.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/sms/#/createcampaign?type=schedule&ai_v2=${token}`}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <ShecduledIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Schedule SMS
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience at scheduled time.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <SmsIcon />,
      },
      {
        key: 'v1-h1-3',
        label: 'Web push',
        ai_module_feature: 'webpush',
        ai_user_feature: 'webpush',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/push/index#/manualpush?ai_v2=${token}`}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <OneTimeIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        One time
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience now.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/push/index#/manualpush?type=schedule&ai_v2=${token}`}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <ShecduledIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Schedule web push
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Send message to your target audience at scheduled time.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        con: <WebpushIcon color="#FF5F5F" />,
      },
    ],
    horizontalTabs2: [
      {
        key: 'v1-h2-1',
        label: 'Smart popup',
        ai_module_feature: 'smart_popup',
        ai_user_feature: 'smart_popup',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/signupforms?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <NewsletterIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Newsletter popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show new arrival products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/custompopup?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <CustomPopupIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Custom popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show trending products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/abandonedcart?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <PastCartIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Abandoned cart popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show recently viewed products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/productreview?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <ProductReviewPopupIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Product review popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show related products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/sitereview?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <SiteReviewIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Site review popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show related products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/productpopup?type=custom&ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <ProductPopupIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Product popup
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Show related products on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <SmartPopupIcon />,
      },
      {
        key: 'v1-h2-2',
        label: 'Announcement bar',
        ai_module_feature: 'announcement_bar',
        ai_user_feature: 'announcement_bar',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <AnnBarIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Announcement bar
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Notify your customers about special offers and events.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <TimerIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Countdown timer
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Create urgency for your promotions or offers.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <SalesBarIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Sales motivator
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Motivates your customers to buy more from your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '10px 10px' } }}>
                  <Flex gap={10}>
                    <div>
                      <CookieBarIcon />
                    </div>
                    <Flex
                      vertical
                      wrap
                      justify="start"
                      align="start"
                      style={{ textAlign: 'left' }}
                      gap={6}
                    >
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Cookie bar
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, lineHeight: '14px' }}
                      >
                        Notifies customers about cookies usage & collection.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <AnnbarIcon />,
      },
    ],
    horizontalTabs3: [
      {
        key: 'v1-h3-1',
        label: 'WhatsApp chat',
        ai_module_feature: 'whatsapp',
        ai_user_feature: 'whatsapp',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/whatsapp/whatsappchat?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <WhatsAppChatIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Setup WhatsApp chat widget
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Customize WhatsApp chat widget for your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <WhatsAppIcon />,
      },
      {
        key: 'v1-h3-2',
        label: 'Live chat',
        ai_module_feature: 'chatbot_chatbot',
        ai_user_feature: 'ai_chat',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/index/chatsetting?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <LiveChatsettingIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Setup live chat settings
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Customize live chat widget for your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <LiveChatIcon />,
      },
    ],
  };

  // Tab sets for v3
  const v3Tabs = {
    horizontalTabs1: [
      {
        key: 'v3-h1-1',
        label: 'Product recommendation',
        ai_module_feature: 'product_recommendation',
        ai_user_feature: 'product_recommendation',
        content: (
          <>
            <Row gutter={[10, 10]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/newarrival?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <NewArrivalIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          New arrivals
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show new arrival products on your store.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/trend?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <TrendingIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Trending products
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show trending products on your store.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/recentview?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <RecentIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Recently viewed
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show recently viewed products on your store.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/relatedproduct?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <RelatedIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Related products
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show related products on your store.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
            </Row>
            <Divider />
            <div style={{ textAlign: 'left', marginBottom: 10 }}>
              <Text
                type="primary"
                style={{ lineHeight: '17px', fontWeight: 500 }}
              >
                Ai based personalized recommendation
              </Text>
            </div>

            <Row gutter={[10, 10]}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/relatedproduct?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <PastRelatedIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Related products
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show based on recently checked products.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/relatedproduct?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <PastPurchaseIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Past purchase
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show based on past purchase products.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/relatedproduct?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <PastRecentIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Recently viewed
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Show based on recently viewed products.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/relatedproduct?ai_v2=${token}`}
                  onClick={() => setCreateNewdrawerVisible(false)}
                >
                  <Card styles={{ body: { padding: '10px 10px' } }}>
                    <Flex gap={10}>
                      <div>
                        <PastCartIcon />
                      </div>
                      <Flex
                        vertical
                        wrap
                        justify="start"
                        align="start"
                        style={{ textAlign: 'left' }}
                        gap={6}
                      >
                        <Text
                          type="primary"
                          style={{ lineHeight: '17px', fontWeight: 500 }}
                        >
                          Item added to cart
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, lineHeight: '14px' }}
                        >
                          Send message to your target audience now.
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Link>
              </Col>
            </Row>
          </>
        ),
        icon: <ProductRecommendationIcon />,
      },
      {
        key: 'v3-h1-2',
        label: 'Loyalty program',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={
                  is_enable_loyalty_v2
                    ? moduleRoute?.loyalty_rewards?.earn_points
                    : `${process.env.NEXT_PUBLIC_APP_URL}/loyalty/index/index/q/${encodedShopId}/url/rule-createnew?ai_v2=${token}`
                }
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <EarnIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Ways to earn
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Ways for customers to earn points on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={
                  is_enable_loyalty_v2
                    ? moduleRoute?.loyalty_rewards?.redeem_points
                    : `${process.env.NEXT_PUBLIC_APP_URL}/loyalty/index/index/q/${encodedShopId}/url/reward-createnewreward?ai_v2=${token}`
                }
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <RedeemIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Ways to redeem
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Create rewards as ways to spend earned points.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <LoyaltyIcon />,
      },
    ],
    horizontalTabs2: [
      {
        key: 'v3-h2-1',
        label: 'Product review',
        ai_module_feature: 'product_review',
        ai_user_feature: 'product_review',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/review/index.php?q=${encodedShopId}&is_bkac=${is_bkac}&url=email-setting.php&ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <CollectReviewsIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Setup collect reviews
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Setup review email setting for collect reviews.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/review/index.php?q=${encodedShopId}&is_bkac=${is_bkac}&url=widgets/product_review_form.php&ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <DisplayReviewsIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Setup display review
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Show product review widget on your store.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <ProductReviewIcon />,
      },
      {
        key: 'v3-h2-2',
        label: 'Affilate marketing',
        ai_module_feature: 'affiliates_program',
        ai_user_feature: 'affiliates_program',
        content: (
          <Row gutter={[10, 10]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/affiliate/programs/edit?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <CreateAffiliateIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Create affiliate program
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Setup affiliate program for your store members.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/affiliate/banners?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Card styles={{ body: { padding: '24px 12px' } }}>
                  <Flex gap={10} vertical wrap align="center">
                    <div>
                      <ManageAffiliateIcon />
                    </div>
                    <Flex vertical wrap justify="start" align="center" gap={6}>
                      <Text
                        type="primary"
                        style={{ lineHeight: '17px', fontWeight: 500 }}
                      >
                        Manage affiliate banners
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          lineHeight: '14px',
                          textAlign: 'center',
                        }}
                      >
                        Setup banners for your store members.
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            </Col>
          </Row>
        ),
        icon: <AffiliateIcon />,
      },
    ],
  };

  // Tab sets for v5
  const v5Tabs = {
    horizontalTabs1: [
      {
        key: 'v5-h1-1',
        label: 'Email templates',
        content: (
          <Flex justify="center">
            <Link
              href={`/email-marketing/templates/list`}
              onClick={() => setCreateNewdrawerVisible(false)}
            >
              <Flex vertical wrap gap={15} style={{ textAlign: 'center' }}>
                <Image
                  src={getImagePath('email-template-menu-1.png')}
                  alt="Email template"
                  style={{ width: 210, maxWidth: '100%' }}
                  preview={false}
                />
                <div>
                  <Text type="primary">New arrivals</Text>
                </div>
                <div>
                  <StyleButton type="primary">View all templates</StyleButton>
                </div>
              </Flex>
            </Link>
          </Flex>
        ),
        icon: <EmailIcon />,
      },
      {
        key: 'v5-h1-2',
        label: 'Web push templates',
        content: (
          <>
            <Flex justify="center">
              <Link
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'inline-flex',
                }}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/push/templatelist?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <Flex vertical wrap gap={15} style={{ textAlign: 'center' }}>
                  <Image
                    src={getImagePath('webpush-template.png')}
                    alt="Webpush template"
                    style={{ width: 210, maxWidth: '100%' }}
                    preview={false}
                  />
                  <div>
                    <StyleButton type="primary">View all templates</StyleButton>
                  </div>
                </Flex>
              </Link>
            </Flex>
          </>
        ),
        icon: <WebpushIcon />,
      },
    ],
    horizontalTabs2: [
      {
        key: 'v5-h2-1',
        label: 'SMS templates',
        content: (
          <Flex justify="center">
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/template/smstemplatelist#/all?ai_v2=${token}`}
              onClick={() => setCreateNewdrawerVisible(false)}
            >
              <Flex vertical wrap gap={15} style={{ textAlign: 'center' }}>
                <Image
                  src={getImagePath('sms-template.png')}
                  alt="Email template"
                  style={{ width: 210, maxWidth: '100%' }}
                  preview={false}
                />
                <div>
                  <StyleButton type="primary">View all templates</StyleButton>
                </div>
              </Flex>
            </Link>
          </Flex>
        ),
        icon: <SmsIcon />,
      },
      {
        key: 'v5-h2-2',
        label: 'Popup templates',
        ai_module_feature: 'smart_popup',
        ai_user_feature: 'smart_popup',
        content: (
          <Flex justify="center">
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/index/aiwidgetcreatepopup?ai_v2=${token}`}
              onClick={() => setCreateNewdrawerVisible(false)}
            >
              <Flex vertical wrap gap={15} style={{ textAlign: 'center' }}>
                <Image
                  src={getImagePath('Christmas-popup-thumbnail-4.png')}
                  alt="Email template"
                  style={{ width: 210, maxWidth: '100%' }}
                  preview={false}
                />
                <div>
                  <StyleButton type="primary">View all templates</StyleButton>
                </div>
              </Flex>
            </Link>
          </Flex>
        ),
        icon: <SmartPopupIcon />,
      },
    ],
    horizontalTabs3: [
      {
        key: 'v5-h3-1',
        label: 'Announcement bars',
        ai_module_feature: 'announcement_bar',
        ai_user_feature: 'announcement_bar',
        content: (
          <Flex justify="center" width="100%" wrap gap={15}>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
              onClick={() => setCreateNewdrawerVisible(false)}
              style={{ width: '100%' }}
            >
              <Flex
                vertical
                wrap
                gap={8}
                width="100%"
                style={{ textAlign: 'center' }}
              >
                <Image
                  src={getImagePath('free-shipping-bar.png')}
                  alt="Announcement bars"
                  style={{ maxWidth: '100%' }}
                  preview={false}
                />
                <Image
                  src={getImagePath('clearing-sales.png')}
                  alt="Announcement bars"
                  style={{ maxWidth: '100%' }}
                  preview={false}
                />
                <Image
                  src={getImagePath('hurry-rush.png')}
                  alt="Announcement bars"
                  style={{ maxWidth: '100%' }}
                  preview={false}
                />
                <Image
                  src={getImagePath('use-cookies.png')}
                  alt="Announcement bars"
                  style={{ maxWidth: '100%' }}
                  preview={false}
                />
              </Flex>
            </Link>
            <Flex vertical wrap>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`}
                onClick={() => setCreateNewdrawerVisible(false)}
              >
                <StyleButton type="primary">View all templates</StyleButton>
              </Link>
            </Flex>
          </Flex>
        ),
        icon: <AnnbarIcon />,
      },
      {
        key: 'v5-h3-2',
        label: 'Loyalty page templates',
        ai_module_feature: 'loyalty_reward',
        ai_user_feature: 'loyalty_reward',
        content: (
          <Flex justify="center">
            <Link
              href={`https://demo.aitrillion.com/pages/loyalty-rewards`}
              target="_blank"
              onClick={() => setCreateNewdrawerVisible(false)}
            >
              <Flex vertical wrap gap={15} style={{ textAlign: 'center' }}>
                <Image
                  src={getImagePath('/loyalty-template.png')}
                  alt="loyalty template"
                  style={{ width: 210, maxWidth: '100%' }}
                  preview={false}
                />
                <div>
                  <StyleButton type="primary">View all templates</StyleButton>
                </div>
              </Flex>
            </Link>
          </Flex>
        ),
        icon: <LoyaltyIcon />,
      },
    ],
  };

  const renderLabel = (item) => (
    <div className="vertical-tab">
      <div className="vertical-tab-head">
        <div className="vertical-tab-icon">{item.icon}</div>
        <div className="vertical-tab-text">
          <div className="vertical-tab-title">{item.title}</div>
          <div className="vertical-tab-description">{item.desc}</div>
        </div>
        <RightOutlined />
      </div>
    </div>
  );

  const renderTabGroup = (tabs, groupKey, allGroupKeys, isMobile) => {
    const handleTabChange = (k) => {
      const resetTabs = allGroupKeys.reduce((acc, gKey) => {
        acc[gKey] = gKey === groupKey ? k : null;
        return acc;
      }, {});
      setActiveInnerTabs((prev) => ({ ...prev, ...resetTabs }));
    };

    // Mobile view using Collapse
    if (isMobile) {
      return (
        <StyleCollapseMenu
          accordion
          activeKey={activeInnerTabs[groupKey] || null}
          onChange={(key) => handleTabChange(key)}
          style={{ marginBottom: 24 }}
        >
          {tabs?.map((tab) => (
            <StyleCollapseMenuPanel
              key={tab.key}
              header={
                <span className="horizontal-tab-head">
                  {tab.icon}
                  <span className="horizontal-tab-text">{tab.label}</span>
                </span>
              }
            >
              {tab.content}
            </StyleCollapseMenuPanel>
          ))}
        </StyleCollapseMenu>
      );
    }

    // Desktop view using Tabs
    return (
      <StyleHorizontalTabs
        type="card"
        style={{ marginBottom: 24 }}
        activeKey={activeInnerTabs[groupKey] || null}
        onChange={handleTabChange}
        moreIcon={false}
      >
        {tabs?.map((tab) => (
          <TabPane
            key={tab.key}
            tab={
              <span className="horizontal-tab-head">
                {tab.icon}
                <span className="horizontal-tab-text">{tab.label}</span>
                <DownOutlined style={{ fontSize: 12, marginLeft: 4 }} />
              </span>
            }
          >
            {tab.content}
          </TabPane>
        ))}
      </StyleHorizontalTabs>
    );
  };

  const renderTabContent = (key, isMobile) => {
    if (key === 'v1') {
      const groupKeys = ['v1-tabs1', 'v1-tabs2', 'v1-tabs3'];
      return (
        <>
          <StyleHorizontaltabTop>
            <Title level={4} style={{ fontSize: 18 }}>
              {isMobile && (
                <LeftOutlined onClick={() => setShowSubtabs(false)} />
              )}
              Campaign
            </Title>
            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
          </StyleHorizontaltabTop>
          <Tabheading isMobile={isMobile} type="primary">
            Outbound
          </Tabheading>
          {renderTabGroup(
            v1Tabs.horizontalTabs1,
            'v1-tabs1',
            groupKeys,
            isMobile
          )}
          <Tabheading isMobile={isMobile} type="primary">
            Inbound
          </Tabheading>
          {renderTabGroup(
            v1Tabs.horizontalTabs2,
            'v1-tabs2',
            groupKeys,
            isMobile
          )}
          <Tabheading isMobile={isMobile} type="primary">
            Messaging
          </Tabheading>
          {renderTabGroup(
            v1Tabs.horizontalTabs3,
            'v1-tabs3',
            groupKeys,
            isMobile
          )}
        </>
      );
    }

    if (key === 'v3') {
      const groupKeys = ['v3-tabs1', 'v3-tabs2', 'v3-tabs3'];
      return (
        <>
          <StyleHorizontaltabTop>
            <Title level={4} style={{ fontSize: 18 }}>
              {isMobile && (
                <LeftOutlined onClick={() => setShowSubtabs(false)} />
              )}
              Engage
            </Title>
            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
          </StyleHorizontaltabTop>
          {renderTabGroup(
            v3Tabs.horizontalTabs1,
            'v3-tabs1',
            groupKeys,
            isMobile
          )}
          {renderTabGroup(
            v3Tabs.horizontalTabs2,
            'v3-tabs2',
            groupKeys,
            isMobile
          )}
          {renderTabGroup(
            v3Tabs.horizontalTabs3,
            'v3-tabs3',
            groupKeys,
            isMobile
          )}
        </>
      );
    }

    if (key === 'v5') {
      const groupKeys = ['v5-tabs1', 'v5-tabs2', 'v5-tabs3'];
      return (
        <>
          <StyleHorizontaltabTop>
            <Title level={4} style={{ fontSize: 18 }}>
              {isMobile && (
                <LeftOutlined onClick={() => setShowSubtabs(false)} />
              )}
              Templates
            </Title>
            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
          </StyleHorizontaltabTop>
          {renderTabGroup(
            v5Tabs.horizontalTabs1,
            'v5-tabs1',
            groupKeys,
            isMobile
          )}
          {renderTabGroup(
            v5Tabs.horizontalTabs2,
            'v5-tabs2',
            groupKeys,
            isMobile
          )}
          {renderTabGroup(
            v5Tabs.horizontalTabs3,
            'v5-tabs3',
            groupKeys,
            isMobile
          )}
        </>
      );
    }

    return null;
  };

  return (
    <AitDrawer
      headerVisible={false}
      open={createNewdrawerVisible}
      closable={false}
      setVisible={setCreateNewdrawerVisible}
      width={isMobile ? 351 : 851}
      showBackArrow={true}
      formobileresponsive={true}
      padding={'15px 0px 0px 15px !important'}
      bodyStyle={{ padding: 0 }}
      placement="left"
    >
      <>
        <StyleVerticaltabTop
          isMobile={isMobile}
          className={`${isMobile && showSubtabs ? 'tab-slide-left' : ''}`}
        >
          <Title level={4} style={{ fontSize: 18 }}>
            <LeftOutlined onClick={() => setCreateNewdrawerVisible(false)} />{' '}
            Create new
          </Title>

          <Divider
            style={{
              marginTop: '15px',
              marginBottom: '15px',
              minWidth: 'calc(100% - 15px)',
              width: 'calc(100% - 15px)',
            }}
          />
        </StyleVerticaltabTop>
        <StyleVerticalTabs
          tabPosition="left"
          activeKey={activeKey}
          onTabClick={handleTabClick}
          style={{ height: 500 }}
          className={`${isMobile && showSubtabs ? 'tab-slide-left' : ''}`}
          isMobile={isMobile}
        >
          {verticalTabs?.map((tab) => (
            <TabPane tab={renderLabel(tab)} key={tab.key}>
              {renderTabContent(tab.key, isMobile)}
            </TabPane>
          ))}
        </StyleVerticalTabs>

        <WorkflowsModal
          title="Popup Opened from Tab 2"
          open={popupVisible}
          popupVisible={popupVisible}
          setPopupVisible={setPopupVisible}
          onCancel={() => setPopupVisible(false)}
          onOk={() => setPopupVisible(false)}
        >
          text
        </WorkflowsModal>
      </>
    </AitDrawer>
  );
};

export default CreateNewDrawer;
