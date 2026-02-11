import React, { useEffect, useMemo, useState } from 'react';
import { StickySubHeader } from '../create-campaign-template/style';
import BackButton from '@/components/atoms/back-arrow/backButton';
import { App, Breadcrumb, Col, message, Row, Spin, Typography } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import CreateABVersionAForm from '../../organisms/create-ab-version-A-form/createABVersionAForm';
import CreateABVersionBForm from '../../organisms/create-ab-version-B-form/createABVersionBForm';
import CreateAbTargetAudienceForm from '../../organisms/create-ab-target-audience-form/createAbTargetAudienceForm';
import CreateAbContentSettingForm from '../../organisms/create-ab-content-setting-form/createAbContentSettingForm';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Form, Formik } from 'formik';
import {
  sendEmailCreateAbReset,
  setAudienceFilters,
  setCreateAbDecodedDataFilters,
  setSegmentFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import {
  createAbGetDecodedDataApi,
  fetchAudienceCount,
  fetchAudienceList,
  fetchSegmentList,
  sendEmailCampaignApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { getToken } from '@/utils/authHelpers';
import { getLoggedInUserDetailsApi } from '@/redux/apis/logged-in-user-apis/loggedInUserApis';
import { AudienceIcon, TrophyIcon } from '../../svg-icons';
import { useRouter } from 'next/router';
import moment from 'moment';
import CreateAbTestReviewModal from '../../molecules/create-ab-testing-review-modal/createAbTestReviewModal';
import { setAudienceCountFilter } from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import TemplatePreviewModal from '../../molecules/template-preview-modal/templatePreviewModal';
import SendTestModal from '../../molecules/send-test-modal/sendTestModal';
import VersionCardSkeleton from '../../loading-skeletons/ceaateAb-version-card-skeleton/createAbVersionCardSkeleton';
import { StyleAitButton } from './style';
import { LayoutContainer } from '../../organisms/create-campaign-left-section/style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import TemplateListModal from '../../organisms/template-list-modal/templateListModal';
import { clearCopyTemplateFilter } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import CopyTemplateModal from '../../molecules/copy-template-modal/copyTemplateModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const CreateAbTemplate = (props) => {
  const { campaignId } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification } = App.useApp();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { email_data, timeZone } = campaignState?.createAbDecodedData;

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '', email_decoded = '' } = userDetails || {};

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );

  const [distriutionCounts, setDistriutionCounts] = useState({});
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [templatePreviewModalVisible, setTemplatePreviewModalVisible] =
    useState(false);
  const [templateHtmlString, setTemplateHtmlString] = useState('');
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [variantType, setVariantType] = useState('');
  const [templateListModalVisible, setTemplateListModalVisible] =
    useState(false);
  const [copyTemplateMoadalVisible, setCopyTemplateModalVisible] =
    useState(false);
  const [useTemplateId, setUseTemplateId] = useState('');
  const [variant, setVariant] = useState('');

  const parseIdString = (value) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.split(',').map((id) => id.trim())
      : [];

  const formInitialState = useMemo(
    () => ({
      EmailNotificationfromSubject: email_data?.variantA?.email_subject || '',
      abtesting_win_percentage: email_data?.abtesting_win_percentage || '25',
      abtesting_win_percent_by:
        email_data?.abtesting_win_percent_by || 'open_rate',
      abtesting_time_in_number: email_data?.abtesting_time_in_number || '8',
      abtesting_time_in_dayhours:
        email_data?.abtesting_time_in_dayhours || 'hour',

      minimum_audiance: process.env.NEXT_PUBLIC_CREATE_AB_MINIMUM_CUSTOMER || 0,
      is_ab_testing: 0,
      encodedData: campaignState?.createAbDecodedData?.decoded_data,
      messageId: router?.query?.id,
      act_type: 'content_setting',
      act: 'update_abtesting_message',
      process_list_status: email_data?.process_list_status || null,
      winning_camp_id: email_data?.winning_camp_id || null,
      ab_testing_hold_result_status:
        email_data?.ab_testing_hold_result_status || null,
      is_manual_winner_set: email_data?.is_manual_winner_set || null,
      campaign_name:
        email_data?.campaign_name ||
        `Email Campaign - ${moment().format('LLL')}`,
      when_to_send: email_data?.when_to_send || '',
      whenToSend: email_data?.whenToSend || '',
      sentDate: email_data?.send_time || null || '',

      send_time: email_data?.send_time || '',

      email_subject: email_data?.email_subject || 'this is to test template',
      from_name: email_data?.from_name || '',
      reply_to: email_data?.reply_to || '',
      fromEmailBefore: email_data?.fromEmailBefore || '',
      domain_name: email_data?.domain_name || '',
      selectedTimezone: email_data?.selected_timezone || '',
      timeZone: timeZone || [],
      include_lists: email_data?.include_lists || [],
      include_segments: email_data?.include_segments || [],
      exclude_lists: email_data?.exclude_lists || [],
      exclude_segments: email_data?.exclude_segments || [],

      dkim_status: email_data?.dkim_status || '0',
      dkim_module_status: email_data?.dkim_module_status || '0',
      masterMessageId: email_data?.masterMessageId || '',
      is_html_code: email_data?.is_html_code || null,
      is_new_template: email_data?.is_new_template || '0',

      total_count:
        getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers || '',
      customUtm: email_data?.customUtm || '0',
      utm_source: email_data?.utm_source || null,
      utm_medium: email_data?.utm_medium || null,
      utm_term: email_data?.utm_term || null,
      utm_content: email_data?.utm_content || null,
      utm_campaign: email_data?.utm_campaign || null,
      list_segment_report: email_data?.list_segment_report || '',
      couponWarningByferget: email_data?.couponWarningByferget || 0,

      EmailNotificationfromEmail:
        email_data?.fromEmailBefore + email_data?.domain_name,
      EmailNotificationfromName: email_data?.from_name,
      EmailNotificationfromReplyTo: email_data?.reply_to,
      EmailNotificationfromSubject: email_data?.email_subject,
      EmailfromEmailAfter: email_data?.domain_name,
      EmailfromEmailBefore: email_data?.fromEmailBefore,

      variantA: {
        ...email_data?.variantA,
        EmailNotificationfromSubject: email_data?.variantA?.email_subject || '',
        emailNotificationfromEmail: email_data?.variantA?.from_email || '',
        emailNotificationfromName: email_data?.variantA?.from_name || '',
        emailNotificationfromReplyTo:
          email_data?.variantA?.reply_to_email || '',
        email_content: email_data?.variantA?.email_content || '',
        campaign_name:
          email_data?.variantA?.campaign_name ||
          `Email Campaign - ${moment().format('LLL')}`,
        when_to_send: email_data?.variantA?.when_to_send || '',
        send_time: email_data?.variantA?.send_time || null,
        // sendDate: email_data?.variantA?.send_time
        //   ? dayjs
        //       .utc(email_data?.variantA?.send_time, 'YYYY-MM-DD hh:mm A')
        //       .local()
        //   : null || '',
        sentDate: formData.sentDate
          ? dayjs.utc(formData.sentDate, 'YYYY-MM-DD hh:mm A').local()
          : null,

        // this is comes from login_auth
        timezone: email_data?.variantA?.timezone || '',
        include_lists: parseIdString(email_data?.variantA?.include_lists),
        include_segments: parseIdString(email_data?.variantA?.include_segments),
        exclude_lists: parseIdString(email_data?.variantA?.exclude_lists),
        exclude_segments: parseIdString(email_data?.variantA?.exclude_segments),
      },

      variantB: {
        ...email_data?.variantB,
        EmailNotificationfromSubject: email_data?.variantB?.email_subject || '',
        emailNotificationfromEmail: email_data?.variantB?.from_email || '',
        emailNotificationfromName: email_data?.variantB?.from_name || '',
        emailNotificationfromReplyTo:
          email_data?.variantB?.reply_to_email || '',
        email_content: email_data?.variantB?.email_content || '',
        email_content: email_data?.variantB?.email_content || '',
        campaign_name:
          email_data?.variantB?.campaign_name ||
          `Email Campaign - ${moment().format('LLL')}`,
        when_to_send: email_data?.variantB?.when_to_send || '',
        send_time: email_data?.variantB?.send_time || null,
        // sendDate: email_data?.variantB?.send_time
        //   ? dayjs
        //       .utc(email_data?.variantB?.send_time, 'YYYY-MM-DD hh:mm A')
        //       .local()
        //   : null || '',

        sendDate: email_data?.variantB?.send_time,

        // this is comes from login_auth
        timezone: email_data?.variantB?.timezone || '',
        include_lists: parseIdString(email_data?.variantB?.include_lists),
        include_segments: parseIdString(email_data?.variantB?.include_segments),
        exclude_lists: parseIdString(email_data?.variantB?.exclude_lists),
        exclude_segments: parseIdString(email_data?.variantB?.exclude_segments),
      },
    }),
    [email_data, timeZone]
  );

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(getLoggedInUserDetailsApi({ act: 'get_profile_picture' }));
    }
  }, []);

  // Once shop_id is available, set audience filters and fetch campaign list
  useEffect(() => {
    if (!shop_id) return;
    dispatch(setAudienceFilters({ shop_id: shop_id }));
    dispatch(setSegmentFilters({ shop_id: shop_id }));
    dispatch(fetchAudienceList());
    dispatch(fetchSegmentList());
  }, [shop_id, dispatch]);

  const includeLists =
    typeof email_data?.include_lists === 'string'
      ? JSON.parse(email_data.include_lists)
      : email_data?.include_lists || [];

  const includeSegments =
    typeof email_data?.include_segments === 'string'
      ? JSON.parse(email_data.include_segments)
      : email_data?.include_segments || [];

  const excludeLists =
    typeof email_data?.exclude_lists === 'string'
      ? JSON.parse(email_data.exclude_lists)
      : email_data?.exclude_lists || [];

  const excludeSegments =
    typeof email_data?.exclude_segments === 'string'
      ? JSON.parse(email_data.exclude_segments)
      : email_data?.exclude_segments || [];

  useEffect(() => {
    if (
      includeLists.length > 0 ||
      includeSegments?.length > 0 ||
      excludeLists.length > 0 ||
      excludeSegments?.length > 0
    ) {
      const payload = {};
      [
        'include_lists',
        'include_segments',
        'exclude_lists',
        'exclude_segments',
      ].forEach((key) => {
        if (Array.isArray(email_data[key]) && email_data[key].length > 0) {
          payload[key] = email_data[key];
        }
      });

      // Dispatch only changed keys; others remain from default
      dispatch(setAudienceCountFilter(payload));
      dispatch(fetchAudienceCount());
    }
  }, [includeLists, includeSegments, excludeLists, excludeSegments]);

  useEffect(() => {
    if (campaignId && email_decoded) {
      dispatch(
        setCreateAbDecodedDataFilters({
          encodedData: email_decoded,
          messageId: campaignId,
        })
      );
      dispatch(createAbGetDecodedDataApi());
    }
  }, [campaignId, email_decoded]);

  useEffect(() => {
    if (campaignState?.sendEmailApiState === 'success') {
      if (campaignState?.sendEmailData?.encoded_key_id) {
        // setReviewModalVisible(false);
        // dispatch(sendTestEmailReset());
        // notification.success({
        //   message: campaignState?.sendEmailApiState,
        //   description: campaignState?.sendEmailData?.msg,
        // });
        // router.push('/email-marketing/campaign/list');
        return;
      } else if (
        campaignState?.sendEmailData?.msg ===
        'Test email has been sent successfully.'
      ) {
        notification.success({
          message: campaignState?.sendEmailApiState,
          description: campaignState?.sendEmailData?.msg,
        });
        setTestModalVisible(false);
        setVariantType('');
        dispatch(sendEmailCreateAbReset());
      } else {
        setReviewModalVisible(true);
        dispatch(sendEmailCreateAbReset());
      }
    }
    if (campaignState?.sendEmailApiState === 'error') {
      notification.error({
        message: campaignState?.sendEmailApiState || 'error',
        description: campaignState?.sendEmailData?.msg || 'error',
      });
      dispatch(sendEmailCreateAbReset());
    }
  }, [campaignState?.sendEmailApiState]);

  //after use template when AB create
  useEffect(() => {
    if (templateState?.copyTemplateApiState === 'success') {
      setCopyTemplateModalVisible(false);
      setTemplateListModalVisible(false);
      setUseTemplateId('');
      dispatch(clearCopyTemplateFilter());
      handleUseTemplateOpenEditorFromCreateAB();
    }

    if (templateState?.copyTemplateApiState === 'error') {
      notification.error({
        message: templateState.copyTemplateMessage,
      });
      dispatch(clearCopyTemplateFilter());
    }
  }, [templateState?.copyTemplateApiState]);

  const handleClickSaveAndContinue = (values) => {
    // setFormData(values);
    if (
      values?.total_count === '' ||
      getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers <= 10
    ) {
      notification.error({
        message: 'Less Audience count',
        description: 'Audience can not be less than 10.',
      });
      return;
    }

    const saveAndContinuePayload = {
      ...values,
      // check this defect for this reset state in the formik form
      include_lists: values?.include_lists,
      exclude_lists: values?.exclude_lists,
      include_segments: values?.include_segments,
      exclude_segments: values?.exclude_segments,

      abtesting_win_percentage_total_recepient:
        distriutionCounts?.winnerGroupCount,
      abtesting_win_percentage_a_total_recepient:
        distriutionCounts?.versionACount,
      abtesting_win_percentage_b_total_recepient:
        distriutionCounts?.versionBCount,
      abtesting_win_percentage_ab: distriutionCounts?.versionAPercent,
      totalEmailSubscribers:
        getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers,

      sentDate: values.sentDate
        ? dayjs(values.sentDate).format('YYYY-MM-DD hh:mm A')
        : null,
      send_time: values.sentDate
        ? dayjs(values.sentDate).format('YYYY-MM-DD hh:mm A')
        : null,

      variantA: {
        ...values?.variantA,
        include_lists: values?.include_lists,
        exclude_lists: values?.exclude_lists,
        include_segments: values?.include_segments,
        exclude_segments: values?.exclude_segments,
        email_subject: values?.variantA?.EmailNotificationfromSubject,
        from_name: values?.variantA?.emailNotificationfromName,
        from_email: values?.variantA?.emailNotificationfromEmail,
        reply_to_email: values?.variantA?.emailNotificationfromReplyTo,
        abtesting_win_percentage: values?.abtesting_win_percentage,
        abtesting_time_in_dayhours: values?.abtesting_time_in_dayhours,
        abtesting_time_in_number: values?.abtesting_time_in_number,
        abtesting_time_in_dayhours: values?.abtesting_time_in_dayhours,
      },
      variantB: {
        ...values?.variantB,
        include_lists: values?.include_lists,
        exclude_lists: values?.exclude_lists,
        include_segments: values?.include_segments,
        exclude_segments: values?.exclude_segments,
        email_subject: values?.variantB?.EmailNotificationfromSubject,
        from_name: values?.variantB?.emailNotificationfromName,
        from_email: values?.variantB?.emailNotificationfromEmail,
        reply_to_email: values?.variantB?.emailNotificationfromReplyTo,
        abtesting_win_percentage: values?.abtesting_win_percentage,
        abtesting_time_in_dayhours: values?.abtesting_time_in_dayhours,
        abtesting_time_in_number: values?.abtesting_time_in_number,
        abtesting_time_in_dayhours: values?.abtesting_time_in_dayhours,
      },
    };
    setFormData(saveAndContinuePayload);
    dispatch(sendEmailCampaignApi(saveAndContinuePayload));
  };

  const handleSendTestEmail = () => {
    const htmlCode =
      variantType === 'variantA'
        ? email_data?.variantA?.email_content
        : email_data?.variantB?.email_content;

    const titleSlug = 'Untitled email template Preview';
    const dateTime = moment().format('D/M/YYYY HH:mm');
    const fullTitle = `${dateTime} ${titleSlug}`;

    const formData = new FormData();
    formData.append('sendRecepientEmail', testEmail);
    formData.append('content', htmlCode);
    formData.append('act', 'send_test_mail_notification_by_id');
    formData.append('template_type', 'new');
    formData.append(
      'template_id',
      variantType === 'variantA'
        ? email_data?.variantA?.messageId
        : email_data?.variantB?.messageId
    );
    formData.append('subject', fullTitle);

    dispatch(sendEmailCampaignApi(formData));
  };

  const handleUseTemplateOpenEditorFromCreateAB = (messageId) => {
    router.push(
      `/email-marketing/templates/editorv2?type=campaign&type2=createAB&etid=${templateState?.copyTemplateData?.template_id ?? ''}&camp_id=${email_data?.[variant]?.messageId ?? ''}&pcid=${router?.query?.id ?? ''}`
    );
    setVariant('');
    dispatch(clearCopyTemplateFilter());
  };

  const handleUseNowTemplateClick = (templateId) => {
    router.push(
      `/email-marketing/templates/editorv2?type=campaign&type2=createAB&etid=${templateId ?? ''}&camp_id=${email_data?.[variant]?.messageId ?? ''}&pcid=${router?.query?.id ?? ''}`
    );
    setVariant('');
    dispatch(clearCopyTemplateFilter());
  };

  // const handleCreateTemplateFromScratch = (type, type2, campaignId) => {
  //   const campaignInfo = campaignDetailsData?.campaignInfo || {};

  //   const campaignName = isEditMode
  //     ? campaignInfo?.campaign_name || ''
  //     : formikRef?.current?.values?.campaignName;
  //   // editorWindowRef.current = window.open(
  //   //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2/?type=${type}&type2=${type2}&cid=${campaignId}&ai_v2=${token}`,
  //   //   '_self'
  //   // );
  //   router.push(
  //     `/email-marketing/templates/editorv2?type=${type}&type2=${type2}&camp_id=${isEditMode ? router?.query?.id : campaignId}&c_name=${encodeURIComponent(campaignName)}`
  //   );
  // };

  return (
    <LayoutContainer>
      <StickySubHeader style={{ flexDirection: 'row', flexWrap: 'no-wrap' }}>
        <BackButton
          handleBack={() => {
            router.push('/email-marketing/campaign/list');
          }}
        />
        {email_data?.campaign_name && (
          <div className="left">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link href="/email-marketing/campaign/list">
                  <Typography.Text type="primary" strong>
                    Campaigns
                  </Typography.Text>
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link href="#">
                  <Typography.Text type="primary" strong>
                    {email_data?.campaign_name}
                  </Typography.Text>
                </Link>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        )}
      </StickySubHeader>
      <MainWrapper>
        <Formik
          enableReinitialize
          // innerRef={formikRef}
          initialValues={formInitialState}
          // validationSchema={sendNowValidationSchema}
          onSubmit={(values) => {
            handleClickSaveAndContinue(values);
          }}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            setFieldError,
            validateForm,
          }) => {
            return (
              <Form>
                <AitPageHeader
                  title="A/B test email settings"
                  hideButton
                  bottomspacing="15px"
                />
                <AitCollapse
                  firstItemTopspacing="0px"
                  defaultActiveKey={['1']}
                  itemSpacing="0px"
                  headerLeftRightTopSpacing="0px"
                  borderTop="0px"
                  borderBottom="0px"
                  collapseIconTopSpacing="auto"
                  collapseIconBotSpacing="auto"
                  itemHeaderPadding="15px 24px"
                  itemBodyPadding="24px 24px 24px 24px"
                  titlefontsize="18px"
                  panels={[
                    {
                      key: '1',
                      title: 'Version',
                      icon: (
                        <AitButton
                          title="A"
                          type="primary"
                          padding={'0px'}
                          width={'36px'}
                          height={'36px'}
                        />
                      ),
                      children: (
                        <>
                          {campaignState?.createAbDecodedDataLoading ? (
                            <VersionCardSkeleton />
                          ) : (
                            <CreateABVersionAForm
                              values={values}
                              errors={errors}
                              touched={touched}
                              setFieldValue={setFieldValue}
                              handleClickTemplatePreview={(
                                value,
                                templateHtmlString,
                                variantType
                              ) => {
                                setTemplatePreviewModalVisible(value);
                                setTemplateHtmlString(templateHtmlString);
                                setVariantType(variantType);
                              }}
                              handleTenplateListModalClick={(value) => {
                                setVariant('variantA');
                                setTemplateListModalVisible(value);
                              }}
                              // handleClickUseTemplateFromCreateAb={(
                              //   messageId,
                              //   variant
                              // ) => {
                              //   setVariant(variant);
                              //   handleUseTemplateOpenEditorFromCreateAB(
                              //     messageId,
                              //     variant
                              //   );
                              // }}
                            />
                          )}
                        </>
                      ),
                    },
                  ]}
                />
                <AitCollapse
                  defaultActiveKey={['1']}
                  itemSpacing="0px"
                  headerLeftRightTopSpacing="0px"
                  borderTop="0px"
                  borderBottom="0px"
                  collapseIconTopSpacing="auto"
                  collapseIconBotSpacing="auto"
                  itemHeaderPadding="15px 24px"
                  itemBodyPadding="24px 24px 24px 24px"
                  titlefontsize="18px"
                  panels={[
                    {
                      key: '1',
                      title: 'Version',
                      icon: (
                        <AitButton
                          title="B"
                          type="primary"
                          padding={'0px'}
                          width={'36px'}
                          height={'36px'}
                        />
                      ),
                      children: (
                        <>
                          {campaignState?.createAbDecodedDataLoading ? (
                            <VersionCardSkeleton />
                          ) : (
                            <CreateABVersionBForm
                              values={values}
                              errors={errors}
                              touched={touched}
                              setFieldValue={setFieldValue}
                              handleClickTemplatePreview={(
                                value,
                                templateHtmlString,
                                variantType
                              ) => {
                                setTemplatePreviewModalVisible(value);
                                setTemplateHtmlString(templateHtmlString);
                                setVariantType(variantType);
                              }}
                              handleTenplateListModalClick={(value) => {
                                setVariant('variantB');
                                setTemplateListModalVisible(value);
                              }}

                              // handleClickUseTemplateFromCreateAb={(
                              //   messageId,
                              //   variant
                              // ) => {
                              //   setVariant(variant);
                              //   handleUseTemplateOpenEditorFromCreateAB(
                              //     messageId,
                              //     variant
                              //   );
                              // }}
                            />
                          )}
                        </>
                      ),
                    },
                  ]}
                />
                <AitCollapse
                  defaultActiveKey={['1']}
                  itemSpacing="0px"
                  headerLeftRightTopSpacing="0px"
                  borderTop="0px"
                  borderBottom="0px"
                  collapseIconTopSpacing="auto"
                  collapseIconBotSpacing="auto"
                  itemHeaderPadding="15px 24px"
                  itemBodyPadding="24px 24px 24px 24px"
                  titlefontsize="18px"
                  minimumCustomerCount={
                    getAudienceCountState?.fetchAudienceCounts
                      ?.totalEmailSubscribers <
                    Number(
                      process.env.NEXT_PUBLIC_CREATE_AB_MINIMUM_CUSTOMER || 0
                    )
                  }
                  panels={[
                    {
                      key: '1',
                      title: 'Target Audience',
                      icon: (
                        <StyleAitButton
                          icon={<AudienceIcon />}
                          color="default"
                          variant="filled"
                          padding={'0px'}
                          width={'36px'}
                          height={'36px'}
                        />
                      ),
                      extra: (
                        <>
                          {getAudienceCountState?.fetchAudienceLoading ? (
                            <Spin />
                          ) : getAudienceCountState?.fetchAudienceCountApiState ===
                            'success' ? (
                            `${getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers} customers`
                          ) : (
                            <span style={{ color: '#DA2F58', fontWeight: 500 }}>
                              0 customers
                            </span>
                          )}
                        </>
                      ),

                      children: (
                        <>
                          <CreateAbTargetAudienceForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setFieldError={setFieldError}
                            validateForm={validateForm}
                            setDistriutionCounts={(result) => {
                              setDistriutionCounts(result);
                            }}
                          />
                        </>
                      ),
                    },
                  ]}
                />
                <AitCollapse
                  defaultActiveKey={['1']}
                  itemSpacing="0px"
                  headerLeftRightTopSpacing="0px"
                  borderTop="0px"
                  borderBottom="0px"
                  collapseIconTopSpacing="auto"
                  collapseIconBotSpacing="auto"
                  itemHeaderPadding="15px 24px"
                  itemBodyPadding="24px 24px 24px 24px"
                  titlefontsize="18px"
                  panels={[
                    {
                      key: '1',
                      title: 'Content test settings',
                      icon: (
                        <StyleAitButton
                          icon={<TrophyIcon />}
                          color="default"
                          variant="filled"
                          padding={'0px'}
                          width={'36px'}
                          height={'36px'}
                        />
                      ),
                      children: (
                        <>
                          <CreateAbContentSettingForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            setFieldValue={setFieldValue}
                            setDistriutionCounts={(result) => {
                              setDistriutionCounts(result);
                            }}
                            distriutionCounts={distriutionCounts}
                          />
                        </>
                      ),
                    },
                  ]}
                />
                <Row gutter={[16, 16]} justify="start">
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <AitButton
                      title="Save and continue"
                      htmlType="submit"
                      type="primary"
                      loading={campaignState?.sendEmailLoading}
                      block
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <AitButton
                      htmlType="button"
                      color="default"
                      variant="filled"
                      title="Cancel"
                      block
                      onClick={() => {
                        router.push('/email-marketing/campaign/list');
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
        <CreateAbTestReviewModal
          visible={reviewModalVisible}
          setVisible={(value) => {
            setReviewModalVisible(value);
          }}
          formData={formData}
          distriutionCounts={distriutionCounts}
        />
        <TemplatePreviewModal
          visible={templatePreviewModalVisible}
          setVisible={(value) => {
            setTemplatePreviewModalVisible(value);
          }}
          handleTestModalVisible={(value) => {
            setTestModalVisible(value);
          }}
          htmlString={templateHtmlString}
          isActionButtonShow={true}
        />
        {/* comment for a reason */}

        {/* <SendTestModal
          visible={testModalVisible}
          setVisible={setTestModalVisible}
          handleSendTestEmail={handleSendTestEmail}
          setEmailValue={(value) => {
            setTestEmail(value);
          }}
        /> */}

        <TemplateListModal
          handleOpenEditorClick={(type, type2, campaignId) => {
            handleCreateTemplateFromScratch(type, type2, campaignId);
          }}
          visible={templateListModalVisible}
          setVisible={setTemplateListModalVisible}
          handleUseTemplateClick={(templateId) => {
            setCopyTemplateModalVisible(true);
            setUseTemplateId(templateId);
          }}
          handleUseNowTemplateClick={(templateId) => {
            handleUseNowTemplateClick(templateId);
          }}
          hideCreateButton={true}
        />
        <CopyTemplateModal
          visible={copyTemplateMoadalVisible}
          setVisible={setCopyTemplateModalVisible}
          useTemplateId={useTemplateId}
          campaignId={email_data?.[variant]?.messageId}
        />
      </MainWrapper>
    </LayoutContainer>
  );
};

export default CreateAbTemplate;
