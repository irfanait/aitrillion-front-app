import React, { useEffect, useState } from 'react';
import { Row, Col, Collapse, Typography, Grid, App, Divider } from 'antd';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitFeatureCard from '../../atoms/ait-feature-card/aitFeatureCard';
import EmailSetupCard from '../../molecules/setup-email-card/setupEmailCrad';
import DashboardStatCards from '../../molecules/dashboard-stat-cards/dashboardStatCards';
import { useRouter } from 'next/router';
import {
  copyWelcomeWorkflowApi,
  getEmailDashboardCampaignListApi,
  getEmailDashboardStatsApi,
  updateModuleVersionApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useDispatch, useSelector } from 'react-redux';
import {
  AbandonedCartIcon,
  ClickedIcon,
  DollarBagIcon,
  DollarIcon,
  EmailCardIcon,
  SignUpFormIcon,
  SMSIcon,
  WelcomeUserIcon,
} from '../../svg-icons';
import CampaignListTable from '../../molecules/recent-campaign-list-table/campaignListTable';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { CollapseWrapper } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import { LayoutContainer } from '../../organisms/create-campaign-left-section/style';
import VideoModal from '../../molecules/video-modal/videoModal';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { getToken } from '@/utils/authHelpers';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const token = getToken();
const { useBreakpoint } = Grid;

const { Title } = Typography;
const { Panel } = Collapse;

const EmailMarketingDashboardTemplate = () => {
  const router = useRouter();
  const screens = useBreakpoint();
  const { notification } = App.useApp();
  const [hideSetupEmailCard, setHideSetupEmailCard] = useState(false);
  const dispatch = useDispatch();
  const { shop_id } = useSelector((state) => state.jwtState.login_auth);
  const { accessModuleWithMappingState } = useSelector(
    (state) => state.jwtState
  );

  const {
    updateModuleVersionApiState,
    updateModuleVersionMessage,
    updateModuleVersionLoading,
  } = useSelector((state) => state.emailMarketingSettingsState);

  const {
    getDashboardStats,
    getDashboardStatsLoading,
    copyWelcomeWorkflowLoading,
    copyWelcomeWorkflow,
  } = useSelector((state) => state.emailMarketingDashboardState);
  const [copyWelcomeWorkflowModalOpen, setCopyWelcomeWorkflowModalOpen] =
    useState(false);
  const [copyAbandonedWorkflowModalOpen, setCopyAbandonedWorkflowModalOpen] =
    useState(false);
  const [visible, setVisible] = useState(false);
  const [mountVideoModal, setMountVideoModal] = useState(false);

  const handleCopyWelcomeWorkflow = () => {
    const params = {
      act: 'copy_workflow',
      workflow_id: process.env.NEXT_PUBLIC_WELCOME_SERIES_WF_ID,
    };
    dispatch(copyWelcomeWorkflowApi(params));
  };

  const handleCopyAbandonendCartWorkflow = () => {
    const params = {
      act: 'copy_workflow',
      workflow_id: process.env.NEXT_PUBLIC_ABANDONED_SERIES_WF_ID,
    };
    dispatch(copyWelcomeWorkflowApi(params));
  };

  const showhowToSetupModal = () => {
    setMountVideoModal(true);
    setVisible(true);
  };

  useEffect(() => {
    if (!visible) {
      setMountVideoModal(false);
    }
  }, [visible]);

  const emailDashboardStats = [
    {
      label: 'Sent',
      icon: <EmailCardIcon style={{ fontSize: 24 }} />,
      value: getDashboardStats?.EmailStat?.total_sent_emails || 0,
      link: '/email-marketing/campaign/list',
    },
    {
      label: 'Opened',
      icon: <SMSIcon style={{ fontSize: 54 }} />,
      value: getDashboardStats?.EmailStat?.total_open_emails || 0,
      link: '/email-marketing/campaign/list',
    },
    {
      label: 'Clicked',
      icon: <ClickedIcon style={{ fontSize: 24 }} />,
      value: getDashboardStats?.EmailStat?.total_click_emails || 0,
      link: '/email-marketing/campaign/list',
    }, // replace icon if needed
    {
      label: 'Revenue',
      icon: <DollarBagIcon style={{ fontSize: 24 }} />,
      value: getDashboardStats?.EmailStat?.total_campaign_revenues || '$0',
      link: '/email-marketing/campaign/list',
    },
  ];

  useEffect(() => {
    if (shop_id) {
      const statsParams = {
        act: 'get_email_dashboard_statstics',
        shop_id: shop_id,
      };
      const campaignListParams = {
        act: 'get_dashboard_campaign_list',
        shop_id: shop_id,
      };
      dispatch(getEmailDashboardStatsApi(statsParams));
      dispatch(getEmailDashboardCampaignListApi(campaignListParams));
    }
  }, [shop_id, dispatch]);

  useEffect(() => {
    if (copyWelcomeWorkflow?.status === 'success') {
      notification.success({ message: 'Workflow copied successfully.' });
      setTimeout(() => {
        window.location.replace(
          `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/createworkflow/edit/${copyWelcomeWorkflow?.insertId}?ai_v2=${token}`
        );
      }, 1000);
    }

    if (copyWelcomeWorkflow?.status === 'error') {
      notification.error({
        message: 'Something went wrong, Please try again after sometime.',
      });
    }
  }, [copyWelcomeWorkflow?.status]);

  useEffect(() => {
    if (updateModuleVersionApiState === 'success') {
      notification.success({ message: updateModuleVersionMessage });
      window.location.replace(
        `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/emaildashboard?ai_v2=${token}`
      );
    }
    if (updateModuleVersionApiState === 'error') {
      notification.error({ message: updateModuleVersionMessage });
    }
  }, [updateModuleVersionApiState]);

  const handleUpdateModuleVersion = () => {
    const payload = {
      act: 'update_enable_email_marketing_v2',
      // **is_enable_email_marketing_v2** key should be set dynamically from the getProfilePicture API
      is_enable_email_marketing_v2: 0,
    };
    dispatch(updateModuleVersionApi(payload));
  };

  return (
    <LayoutContainer>
      {/* commenting for v2 new users */}
      {/* <AitAlert
        type="warning"
        hascustomicon={true}
        icon={
          <ExclamationCircleOutlined
            style={{ fontSize: 16, color: '#664D03' }}
          />
        }
        bgcolor="#FFF4CC"
        color="#664D03"
        message="We have scheduled maintenance on February 1, 2026. Email template creation, editing, and saving may be temporarily unavailable during this time due to security updates."
      /> */}

      <AitAlert
        type="warning"
        hascustomicon={false}
        bgcolor="#2f80ed"
        color="#ffffff"
        message="Welcome to AiTrillion Email Marketing v2 – Faster, Smarter & More Optimized! Having issue?"
        hascustomclass="alert_meg_div_responsive"
        buttonText={
          updateModuleVersionLoading
            ? 'Switching...'
            : 'Switch back to Email Marketing v1'
        }
        onClick={() => {
          handleUpdateModuleVersion();
        }}
      />

      <MainWrapper>
        {/* Page Header */}
        <AitPageHeader
          title="Email marketing dashboard"
          subtitle="See how your email marketing is performing"
          subtitleLink={
            accessModuleWithMappingState &&
            accessModuleWithMappingState['8'] != 1
              ? 'Start setup guide'
              : ''
          }
          buttonLabel="Create campaign"
          hideSetupEmailCard={hideSetupEmailCard}
          setHideSetupEmailCard={setHideSetupEmailCard}
          onButtonClick={() => {
            router.push('/email-marketing/campaign/create-campaign');
          }}
          showhowToSetup={true}
          showhowToSetupModal={showhowToSetupModal}
          showhowHelpDoc={true}
          helpdoclink="https://docs.aitrillion.com/portal/en/kb/articles/create-send-email-marketing-campaigns"
        />
        {mountVideoModal && (
          <VideoModal visible={visible} setVisible={setVisible} />
        )}
        {/* Setup Drawer (as Collapse) */}

        {!hideSetupEmailCard &&
          accessModuleWithMappingState &&
          accessModuleWithMappingState[8] != 1 && (
            <CollapseWrapper
              defaultActiveKey={['1']}
              style={{ marginBottom: 16 }}
              bordered={false}
            >
              <Panel
                key="1"
                header={
                  <Row
                    align={{ xs: 'top', sm: 'middle' }}
                    justify={'space-between'}
                  >
                    <Col span={20}>
                      <Title
                        className="outer-collapse-title"
                        level={4}
                        type="primary"
                        style={{
                          fontWeight: 500,
                          marginBottom: '0px',
                          marginTop: '0px',
                        }}
                      >
                        Setup email marketing module
                      </Title>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                      <AitButton
                        padding={'0px'}
                        type="link"
                        className="close-panel-btn"
                        icon={<CloseCircleOutlined />}
                        onClick={() => {
                          setHideSetupEmailCard(true);
                        }}
                      />
                    </Col>
                  </Row>
                }
              >
                {/* <Text type="secondary">Setup content goes here...</Text> */}
                <EmailSetupCard />
              </Panel>
            </CollapseWrapper>
          )}

        {/* Stat Cards */}
        <DashboardStatCards
          data={emailDashboardStats}
          loading={getDashboardStatsLoading}
        />

        {/* Latest Campaigns Table Molecule */}
        {/* <CampaignTable data={campaigns} /> */}

        <CampaignListTable heading="Latest campaigns sent" />

        <AitCard
          title="Recommended features to improve your performance"
          margintop={'24px'}
          borderless={true}
          bodypadding={{
            xs: '0px 0px 20px 0px !important',
            sm: '0px 0px 24px 0px !important',
            md: '0px 0px 24px 0px !important',
          }}
        >
          {[
            {
              icon: <DollarIcon />,
              bgColor: '#ffe8f0',
              title: 'Launch successful campaigns',
              description:
                'Use our creative pre built templates to send your campaigns.',
              buttonLabel: 'Create campaign now',
              onClick: () => {
                router.push(`/email-marketing/campaign/create-campaign`);
              },
            },
            {
              icon: <WelcomeUserIcon />,
              bgColor: '#e8fbff',
              title: 'Automate welcome emails',
              description:
                'Make a solid first impression with new subscribers and engage them.',
              buttonLabel: 'Enable welcome series',
              onClick: () => {
                setCopyWelcomeWorkflowModalOpen(true);
              },
            },
            {
              icon: <AbandonedCartIcon />,
              bgColor: '#f3e8ff',
              title: 'Recover abandoned carts',
              description:
                'Remind customers about products they left in their carts with automated messages.',
              buttonLabel: 'Enable abandoned cart series',
              onClick: () => {
                setCopyAbandonedWorkflowModalOpen(true);
              },
            },
            {
              icon: <SignUpFormIcon />,
              bgColor: '#e8f4ff',
              title: 'Grow your email list',
              description: 'Convert visitors into customers with signup forms.',
              buttonLabel: 'Create signup form',
              onClick: () => {
                window.location.replace(
                  `${process.env.NEXT_PUBLIC_APP_URL}/index/aiwidgetcreatepopup?ai_v2=${token}`
                );
              },
            },
          ].map((item, index) => {
            return (
              <AitFeatureCard
                key={index}
                icon={item.icon}
                bgColor={item.bgColor}
                title={item.title}
                description={item.description}
                buttonLabel={item.buttonLabel}
                buttonminwidth={'235px'}
                onButtonClick={item.onClick}
              />
            );
          })}
        </AitCard>

        <AitConfirmationModal
          visible={copyWelcomeWorkflowModalOpen}
          setVisible={setCopyWelcomeWorkflowModalOpen}
          confirmText="Yes, use it!"
          description="This workflow will be copied to your account"
          onConfirm={() => {
            handleCopyWelcomeWorkflow();
          }}
          confirmButtonLoading={copyWelcomeWorkflowLoading}
        />

        <AitConfirmationModal
          visible={copyAbandonedWorkflowModalOpen}
          setVisible={setCopyAbandonedWorkflowModalOpen}
          confirmText="Yes, use it!"
          description="This workflow will be copied to your account"
          onConfirm={() => {
            handleCopyAbandonendCartWorkflow();
          }}
          confirmButtonLoading={copyWelcomeWorkflowLoading}
        />
      </MainWrapper>
    </LayoutContainer>
  );
};

export default EmailMarketingDashboardTemplate;
