import AitDrawer from '@/components/atoms/ait-drawer/aitDrawer';
import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleAllModulesWrapper,
  StyleWrapper,
  StyleDrawerheading,
  StyleRecommendedSectionWrapper,
} from './style';
import { Col, ConfigProvider, theme, Row, Typography, Card, App } from 'antd';
const { Text, Title } = Typography;
import Link from 'next/link';
import {
  AnnouncementIcon,
  BoostSalesIcon,
  DocumentIcon,
  MailIcon,
  NotificationIcon,
  PageflyIcon,
  SettingsGearIcon,
  VerifiedProfileIcon,
  AffiliateModuleIcon,
  AiboxModuleIcon,
  AnnouncementBarModuleIcon,
  CheckoutXModuleIcon,
  CustomerAccountModuleIcon,
  EmailModuleIcon,
  FormBuilderModuleIcon,
  LiveChatModuleIcon,
  LoyaltyModuleIcon,
  MembershipModuleIcon,
  ProductRecommendationModuleIcon,
  ProductReviewModuleIcon,
  SmartPopupModuleIcon,
  SMSModuleIcon,
  WebPushModuleIcon,
  WhatsAppModuleIcon,
  WorkflowModuleIcon,
} from '@/modules/layouts/svg-icons';
import { token } from '@/modules/layouts/utils/constants';
import ModuleStatsCard from '@/modules/email-marketing/molecules/module-cards/moduleStatsCard';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { useDispatch, useSelector } from 'react-redux';
import { copyWelcomeWorkflowApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { getAccessMap } from '@/modules/layouts/helper';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import { setAccessModuleWithMappingState } from '@/redux/logged-in-user-details-slice/jwtSlice';
import { loyaltyDashboardData } from '@/modules/loyalty-rewards/redux/dashboard/dashboardSlice';

const ModulesDrawer = ({
  moduleDrawerVisible,
  setModuleDrawerVisible,
  is_V1_V2_object,
}) => {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const { accessModuleWithMappingState } = useSelector(
    (state) => state.jwtState
  );
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const { encoded_shop_id, is_bkac, accessModuleWithMapping, shop_type } =
    useSelector((state) => state.jwtState?.login_auth);
  const encodedShopId = encoded_shop_id || '';
  const is_Bkac = is_bkac ? 1 : 0;
  const shopType = shop_type?.toLowerCase() || 'shopify';
  const { copyWelcomeWorkflowLoading, copyWelcomeWorkflow } = useSelector(
    (state) => state.emailMarketingDashboardState
  );
  const dashboardData = useSelector(loyaltyDashboardData);
  const [copyAbandonedWorkflowModalOpen, setCopyAbandonedWorkflowModalOpen] =
    useState(false);
  const { is_enable_loyalty_v2 } = is_V1_V2_object;

  const aitmodulestats = [
    {
      id: 8,
      label: (
        <>
          Email
          <br />
          marketing
        </>
      ),
      icon: <EmailModuleIcon style={{ fontSize: 24 }} />,
      link: '/email-marketing/dashboard',
      status: 0,
      ai_module_feature: 'email_marketing',
      ai_user_feature: 'email_marketing',
    },
    {
      id: 16,
      label: (
        <>
          SMS
          <br />
          marketing
        </>
      ),
      icon: <SMSModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/sms/dashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'email_marketing_sms',
      ai_user_feature: 'sms',
    },
    {
      id: 17,
      label: <>WhatsApp</>,
      icon: <WhatsAppModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/whatsapp/whatsappchat?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'whatsapp',
      ai_user_feature: 'whatsapp',
    },
    {
      id: 2,
      label: (
        <>
          Loyalty
          <br />
          rewards
        </>
      ),
      icon: <LoyaltyModuleIcon style={{ fontSize: 24 }} />,
      //link: `${moduleRoute?.loyalty_rewards?.dashboard}`,
      link: `${is_enable_loyalty_v2 ? moduleRoute?.loyalty_rewards?.dashboard : `${process.env.NEXT_PUBLIC_APP_URL}/loyalty/index/index/q/${encodedShopId}/url/loyalty-home?ai_v2=${token}`}`,
      status: 0,
      ai_module_feature: 'loyalty_reward',
      ai_user_feature: 'loyalty_reward',
    },
    {
      id: 1,
      label: (
        <>
          Product
          <br />
          reviews
        </>
      ),
      icon: <ProductReviewModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/review/index.php?q=${encodedShopId}&is_bkac=${is_Bkac}&url=home.php&ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'product_review',
      ai_user_feature: 'product_review',
    },
    {
      id: 14,
      label: (
        <>
          Smart
          <br />
          popups
        </>
      ),
      icon: <SmartPopupModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/index/aiwidgetdashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'smart_popup',
      ai_user_feature: 'smart_popup',
    },
    {
      id: 15,
      label: (
        <>
          Web push
          <br />
          notifications
        </>
      ),
      icon: <WebPushModuleIcon style={{ fontSize: 24 }} />,
      link: <>/push/index#/custompush</>,
      status: 0,
      ai_module_feature: 'webpush',
      ai_user_feature: 'webpush',
    },
    {
      id: 11,
      label: (
        <>
          Workflow
          <br />
          automation
        </>
      ),
      icon: <WorkflowModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/workflowdashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'email_marketing',
      ai_user_feature: 'email_marketing',
    },
    {
      id: 9,
      label: (
        <>
          Announcement
          <br />
          bar
        </>
      ),
      icon: <AnnouncementBarModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'announcement_bar',
      ai_user_feature: 'announcement_bar',
    },
    {
      id: 10,
      label: (
        <>
          Affiliate
          <br />
          marketing
        </>
      ),
      icon: <AffiliateModuleIcon style={{ fontSize: 24 }} />,
      link: <>/affiliate/configuration</>,
      status: 0,
      ai_module_feature: 'affiliate_affiliate',
      ai_user_feature: 'affiliates_program',
    },
    {
      id: 12,
      label: (
        <>
          Recurring
          <br />
          membership
        </>
      ),
      icon: <MembershipModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/membership/index#/membership-dashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'membership',
      ai_user_feature: 'membership',
    },
    {
      id: 13,
      label: (
        <>
          Form
          <br />
          builder
        </>
      ),
      icon: <FormBuilderModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/gettingstarted/formbuilder?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'formbuilder',
      ai_user_feature: 'formbuilder',
    },
    {
      id: 5,
      label: (
        <>
          Product
          <br />
          recommendations
        </>
      ),
      icon: <ProductRecommendationModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/salesbooster/index/index#/recommended?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'product_recommendation',
      ai_user_feature: 'product_recommendation',
    },
    {
      id: 7,
      label: (
        <>
          Live
          <br />
          chat
        </>
      ),
      icon: <LiveChatModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/inbox?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'chatbot_chatbot',
      ai_user_feature: 'ai_chat',
    },
    {
      id: 3,
      label: (
        <>
          Ai
          <br />
          Box
        </>
      ),
      icon: <AiboxModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/index/aisetting?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'ai_box',
      ai_user_feature: 'ai_box',
    },
    {
      id: 18,
      label: (
        <>
          Customer
          <br />
          account
        </>
      ),
      icon: <CustomerAccountModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/myaccount/index#/myaccount-dashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'my-account',
      ai_user_feature: 'my-account', //in existing code general_settings
    },
    {
      id: 19,
      label: <>CheckoutX</>,
      icon: <CheckoutXModuleIcon style={{ fontSize: 24 }} />,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/thankyoucheckoutwidgets/index/dashboard?ai_v2=${token}`,
      status: 0,
      ai_module_feature: 'thankyou_checkout_widgets',
      ai_user_feature: 'thankyou_checkout_widgets_user_feature',
    },
  ];
  //const accessMap = {};
  //const rule = accessMap[item.ai_module_feature];
  // const isHidden = rule?.action === 'hide' && rule.access === 'No';

  //console.log('accessModuleWithMappingState', accessModuleWithMappingState);

  const updatedModuleStats = accessModuleWithMappingState
    ? aitmodulestats
        .filter((module) => {
          // Filter for WooCommerce: exclude membership (12), formbuilder (13), customer-account (18), CheckoutX (19)
          if (shopType === 'woocommerce') {
            if (
              module.id === 12 || // membership
              module.id === 13 || // formbuilder
              module.id === 18 || // customer-account
              module.id === 19 // CheckoutX
            ) {
              return false;
            }
          }

          // Filter for non-Shopify shops: exclude customer-account (18) and CheckoutX (19)
          if (
            shopType !== 'shopify' &&
            (module.id === 18 || module.id === 19)
          ) {
            return false;
          }

          return true;
        })
        .map((module) => ({
          ...module,
          status: accessModuleWithMappingState[module.id] ?? 0,
        }))
    : [];

  const handleCopyAbandonendCartWorkflow = () => {
    const params = {
      act: 'copy_workflow',
      workflow_id: process.env.NEXT_PUBLIC_ABANDONED_SERIES_WF_ID,
    };
    dispatch(copyWelcomeWorkflowApi(params));
  };

  // const aitHeaderPannels = [
  //   {
  //     key: '1',
  //     title: 'Increase sales',
  //     children: (
  //       <>
  //         <Row gutter={[16, 16]}>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <Link
  //                   href={{
  //                     pathname: `${process.env.NEXT_PUBLIC_APP_URL}/index/aiwidgetdashboard?ai_v2=${token}`,
  //                   }}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <BoostSalesIcon
  //                         iconWidth={'38px'}
  //                         iconHeight={'38px'}
  //                       />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Create boost sales popup
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Create popup
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </Link>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <Link
  //                   href={{
  //                     pathname: `${process.env.NEXT_PUBLIC_APP_URL}/index/formbuilder/dashboard?ai_v2=${token}`,
  //                   }}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <DocumentIcon iconWidth={'38px'} iconHeight={'38px'} />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Add a form on your webpage
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Enable widget
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </Link>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <Link
  //                   href={{
  //                     pathname: `${process.env.NEXT_PUBLIC_APP_URL}/announcement/dashboard?ai_v2=${token}`,
  //                   }}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <AnnouncementIcon
  //                         iconWidth={'38px'}
  //                         iconHeight={'38px'}
  //                       />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Add an announcement bar
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Create a bar
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </Link>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //   },
  //   {
  //     key: '2',
  //     title: 'Recover abandoned cart',
  //     children: (
  //       <>
  //         <Row gutter={[16, 16]}>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <a
  //                   onClick={() => {
  //                     setCopyAbandonedWorkflowModalOpen(true);
  //                   }}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <VerifiedProfileIcon
  //                         iconWidth={'38px'}
  //                         iconHeight={'38px'}
  //                       />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Enable pre-built abandoned cart series
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Enable series
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </a>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <Link
  //                   href={{
  //                     pathname: `${process.env.NEXT_PUBLIC_APP_URL}/abandonedcart?ai_v2=${token}`,
  //                   }}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <MailIcon iconWidth={'38px'} iconHeight={'38px'} />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Set up abandoned cart popup
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Create a popup
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </Link>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //           <Col span={8}>
  //             <ConfigProvider
  //               theme={{
  //                 algorithm: theme.defaultAlgorithm,
  //                 token: {
  //                   borderRadiusLG: 0,
  //                   boxShadow: 'rgba(132, 145, 176, 0.16) 0px 3px 4px',
  //                   bodyPadding: '20px 14px',
  //                   fontSize: '14px',
  //                   lineHeight: '20px',
  //                 },
  //               }}
  //             >
  //               <Card variant="borderless">
  //                 <Link
  //                   href={`${process.env.NEXT_PUBLIC_APP_URL}/push/index#/abandonedcart?ai_v2=${token}`}
  //                 >
  //                   <Row wrap={false} gutter={[10, 0]}>
  //                     <Col>
  //                       <NotificationIcon
  //                         iconWidth={'38px'}
  //                         iconHeight={'38px'}
  //                       />
  //                     </Col>
  //                     <Col>
  //                       <div style={{ marginBottom: '6px' }}>
  //                         <Text
  //                           type="secondary"
  //                           style={{
  //                             fontSize: '14px',
  //                             lineHeight: '20px',
  //                             letterSpacing: '-0.01em',
  //                           }}
  //                         >
  //                           Automate abandoned cart push notifications
  //                         </Text>
  //                       </div>
  //                       <span
  //                         style={{
  //                           fontWeight: 500,
  //                           fontSize: '12px',
  //                           lineHeight: '14px',
  //                         }}
  //                       >
  //                         Setup notification
  //                       </span>
  //                     </Col>
  //                   </Row>
  //                 </Link>
  //               </Card>
  //             </ConfigProvider>
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //   },
  // ];

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

  // Build accessMap once
  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  useEffect(() => {
    if (
      accessModuleWithMapping ||
      dashboardData?.module_status_data?.module_status
    ) {
      dispatch(
        setAccessModuleWithMappingState({
          mapping: accessModuleWithMapping,
          loyaltyModuleStatus: dashboardData?.module_status_data?.module_status,
        })
      );
    }
  }, [
    accessModuleWithMapping,
    dashboardData?.module_status_data?.module_status,
  ]);

  return (
    <AitDrawer
      onMouseEnter={() => setModuleDrawerVisible(true)}
      onMouseLeave={() => setModuleDrawerVisible(false)}
      mask={false}
      headerVisible={false}
      open={moduleDrawerVisible}
      closable={false}
      setVisible={setModuleDrawerVisible}
      width={740}
      showBackArrow={true}
      formobileresponsive={true}
      padding={'60px 0px 0px 0px !important'}
      bodyStyle={{
        padding: 0,
      }}
      zIndex={998}
    >
      <StyleWrapper>
        <StyleAllModulesWrapper>
          <div>
            <StyleDrawerheading justify={'space-between'} spacingbottom="25px">
              <Col>
                <Title level={5} style={{ marginTop: 'auto' }}>
                  All modules
                </Title>
              </Col>
              <Col>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/modulesetting?ai_v2=${token}`}
                >
                  <SettingsGearIcon />
                </Link>
              </Col>
            </StyleDrawerheading>

            {accessModuleWithMappingState && (
              <ModuleStatsCard
                data={updatedModuleStats}
                accessMap={accessMap}
              />
            )}
          </div>
        </StyleAllModulesWrapper>
      </StyleWrapper>
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
    </AitDrawer>
  );
};

export default ModulesDrawer;
