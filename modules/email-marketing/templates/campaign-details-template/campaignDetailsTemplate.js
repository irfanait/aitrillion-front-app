import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Typography } from 'antd';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { detailsTabItems } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCampaignDetailsFilters,
  setCampaignDetailsReportsFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { useRouter } from 'next/router';
import {
  getCampaignDetailsApi,
  getCampaignDetailsReport,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import CampaignDetailsOverView from '../../molecules/campaign-details-overview/campaignDetailsOverView';
import CampaignRecipientActivity from '../../molecules/campaign-recipient-activity/campaignRecipientActivity';
import CampaignMessageTab from '../../molecules/campaign-message-tab/campaignMessageTab';
import CampaignAudienceTab from '../../molecules/campaign-audience-tab/campaignAudienceTab';
import CampaignOrderTab from '../../molecules/campaign-order-tab/campaignOrderTab';
import CampaignLinkActivityTab from '../../molecules/campaign-link-activity-tab/campaignLinkActivityTab';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import { LayoutContainer } from '../../organisms/create-campaign-left-section/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitCard from '@/components/atoms/ait-card/aitCard';
import CampaignAbTestTab from '../../molecules/campaign-ab-test-tab/campaignAbTestTab';
import { getComputedStatus } from '../../utils/helper';
import { SpinWrapperDiv } from './style';

const { Text } = Typography;

const CampaignDetailsTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAbTestCampaign = router?.query?.isAbTest === 'true';

  const filteredDetailsTabItems = detailsTabItems?.filter(
    (tab) => isAbTestCampaign || tab.key !== 'ab-test'
  );

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );
  const loggedInUserDetailsState = useSelector(
    (state) => state.loggedInUserDetailsState
  );

  const {
    campaignDetailsData,
    campaignDetailsLoading,
    chooseAsWinnerApiState,
  } = campaignState;
  const { userDetails } = loggedInUserDetailsState;

  const { login_auth } = useSelector((state) => state.jwtState);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVersionAB, setSelectedVersionAB] = useState('ALL');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const variantIds = campaignDetailsData?.abTestingData?.variantCampIdArr || {};

  const variantOptions = [
    { label: 'All', key: 'ALL', value: router.query?.id }, // map to Winner ID
    { label: 'Version A', key: 'A', value: variantIds.A },
    { label: 'Version B', key: 'B', value: variantIds.B },
    { label: 'Winner', key: 'WINNER', value: variantIds.WINNER },
  ].filter((opt) => !!opt.value);

  useEffect(() => {
    if (router.query?.variant) {
      setSelectedVersionAB(router.query.variant);
    } else {
      setSelectedVersionAB('ALL');
    }
  }, [router.query?.id, router.query?.variant]);

  // helper: resolve which campaignId to call APIs with
  const resolveMessageId = () => {
    let messageId = router.query.id;
    if (router.query.variant && router.query.variant !== 'ALL') {
      const selectedVariant = variantOptions.find(
        (opt) => opt.key === router.query.variant
      );
      if (selectedVariant?.value) {
        messageId = selectedVariant.value;
      }
    }
    return messageId;
  };

  // fetch campaign details
  useEffect(() => {
    if (router?.query?.id) {
      const messageId = resolveMessageId();

      const payload = {
        act: 'message_detail',
        currentPage: 1,
        sentpage: 1,
        clickpage: 1,
        currentPage: 1,
        messageType: 'email',
        message_type: 'email',
        opencurrentPage: 1,
        openpage: 1,
        sentpage: 1,
        shop_domain: login_auth?.domain || '',
        message_id: messageId,
        module_id: messageId,
      };
      // Normalize variant value
      let variant = Array.isArray(router?.query?.variant)
        ? router.query.variant[0]
        : router.query.variant;

      variant = variant ? variant.trim().toUpperCase() : null;

      // ✅ Only add ctype if explicitly A, B, or WINNER
      if (['A', 'B', 'WINNER'].includes(variant)) {
        payload.ctype = 'ab';
      }

      dispatch(setCampaignDetailsFilters(payload));
      dispatch(getCampaignDetailsApi());
    }
  }, [router?.query?.id, router?.query?.variant, activeTab]);

  // useEffect(() => {
  //   if (router?.query?.id) {
  //     dispatch(
  //       setCampaignDetailsFilters({
  //         act: 'message_detail',
  //         currentPage: '1',
  //         sentpage: 1,
  //         message_id: router?.query?.id,
  //         module_id: router?.query?.id,
  //       })
  //     );
  //     dispatch(getCampaignDetailsApi());
  //   }
  // }, [router?.query?.id, selectedVersionAB]);

  // useEffect(() => {
  //   if (userDetails?.shop_id && router?.query?.id) {
  //     // 🔑 Default to parent campaign ID
  //     let messageId = router.query.id;

  //     // 🔑 If variant query exists, resolve correct campaign id
  //     if (router.query.variant) {
  //       const selectedVariant = variantOptions.find(
  //         (opt) => opt.key === router.query.variant
  //       );
  //       if (selectedVariant?.value) {
  //         messageId = selectedVariant.value;
  //       }
  //     }

  //     const payload = {
  //       act: 'get_email_report',
  //       messageId,
  //       shop_id: userDetails.shop_id,
  //     };

  //     // 👉 Add ctype only if actual A or B is selected
  //     if (router.query.variant === 'A' || router.query.variant === 'B') {
  //       payload.ctype = 'ab';
  //     }

  //     dispatch(setCampaignDetailsReportsFilters(payload));
  //     dispatch(getCampaignDetailsReport());
  //   }
  // }, [userDetails?.shop_id, router?.query?.id, router?.query?.variant]);

  // ✅ Fetch campaign reports (resolves variant id if needed)

  useEffect(() => {
    if (login_auth?.shop_id && router?.query?.id) {
      const messageId = resolveMessageId();

      const payload = {
        act: 'get_email_report',
        message_id: messageId,
        shop_id: login_auth.shop_id,
      };

      // Normalize variant value
      const variant = Array.isArray(router.query.variant)
        ? router.query.variant[0]
        : router.query.variant;

      // ✅ only set ctype for actual A/B/WINNER, skip for ALL
      if (
        variant &&
        ['A', 'B', 'WINNER'].includes(variant.trim().toUpperCase())
      ) {
        payload.ctype = 'ab';
      }

      dispatch(setCampaignDetailsReportsFilters(payload));
      dispatch(getCampaignDetailsReport());
    }
  }, [login_auth?.shop_id, router?.query?.id, router?.query?.variant]);

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader
          titlewrappermargin="0px auto 10px 0px"
          titlemargin="auto 0px auto 0px"
          title={
            campaignDetailsLoading ? (
              <Spin />
            ) : (
              campaignDetailsData?.messagedetail?.campaign_name
            )
          }
          subtitle=""
          subtitleLink=""
          hideButton={true}
          isReportTag={router?.query?.isAbTest === 'true'}
          isBackButtonShow={true}
          isAbTest={router?.query?.isAbTest}
          isShowSendTime={
            (isAbTestCampaign &&
              campaignDetailsData?.abTestingData?.status === '2') ||
            (!isAbTestCampaign &&
              campaignDetailsData?.abTestingData?.status === '2')
              ? true
              : false
          }
          isAbDropdown={true}
          campaignSendtime={campaignDetailsData?.messagedetail?.send_time}
          handleBack={() => {
            router.push('/email-marketing/campaign/list');
          }}
          isAbTestCampaign={isAbTestCampaign}
          variantOptions={variantOptions}
          setSelectedVersionAB={setSelectedVersionAB}
          selectedVersionAB={selectedVersionAB}
        />

        <Row gutter={[{ xs: 32, sm: 32, md: 32, lg: 70 }]}>
          <AitCard
            hascustomheader={true}
            headerpadding={{ md: '0px 35px 0px 35px' }}
            custombodypadding={{ md: '20px 35px 24px 35px' }}
            style={{ width: '100%', background: 'transparent', border: 'none' }}
            customheaderleft={
              <AitTabs
                width={'100%'}
                activeKey={activeTab}
                onChange={handleTabChange}
                items={filteredDetailsTabItems}
              />
            }
          >
            <Row gutter={[48, 16]}>
              <Col xs={24}>
                <Row gutter={[0, 16]}>
                  <Col xs={24}>
                    {activeTab === 'overview' && (
                      <>
                        {campaignDetailsLoading ? (
                          <SpinWrapperDiv>
                            <Spin
                              size="large"
                              tip="Loading campaign details..."
                            />
                          </SpinWrapperDiv>
                        ) : getComputedStatus(
                            campaignDetailsData?.abTestingData
                          ) === 'pending' ? (
                          <AitCard bodypadding={{ md: '20px 35px 24px 35px' }}>
                            <Text type="secondary">
                              Your campaign is still in pending state. Report
                              data will be available once the campaign is sent.
                            </Text>
                          </AitCard>
                        ) : (
                          <CampaignDetailsOverView />
                        )}
                      </>
                    )}

                    {activeTab === 'ab-test' && isAbTestCampaign && (
                      <CampaignAbTestTab
                        selectedVersionAB={selectedVersionAB}
                        setSelectedVersionAB={setSelectedVersionAB}
                        setActiveTab={setActiveTab}
                        variantIds={variantIds}
                      />
                    )}
                    {activeTab === 'recipient-activity' && (
                      <CampaignRecipientActivity
                        activeTab={activeTab}
                        resolveMessageId={resolveMessageId}
                      />
                    )}
                    {activeTab === 'message' && <CampaignMessageTab />}
                    {activeTab === 'audience' && <CampaignAudienceTab />}
                    {activeTab === 'orders' && <CampaignOrderTab />}
                    {activeTab === 'link-activity' && (
                      <CampaignLinkActivityTab />
                    )}
                  </Col>
                </Row>

                {/* </Card> */}
              </Col>
            </Row>
          </AitCard>
        </Row>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default CampaignDetailsTemplate;
