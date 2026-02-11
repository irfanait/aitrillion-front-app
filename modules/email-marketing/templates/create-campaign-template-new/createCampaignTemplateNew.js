import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutContainer,
  ScrollableLeftPanel,
  StickyAlertWrapper,
  StickySubHeader,
  StyleLeftRightPannelWrapper,
} from './style';
import { App, Breadcrumb, Col, Tooltip, Typography } from 'antd';
import Link from 'next/link';
import BackButton from '@/components/atoms/back-arrow/backButton';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitDropdownButton from '@/components/atoms/ait-dropdown-button/aitDropdownButton';
import CreateCampaignLeftSkeleton from '../../loading-skeletons/cerate-campaign-skeleton/createCampaignSkeleton';
import { Form, Formik } from 'formik';
import CreateCampaignLeftSectionNew from '../../organisms/create-campaign-left-section-new/createCampaignLeftSectionNew';
import CreateCampaignRightSectionNew from '../../organisms/create-campaign-right-section-new/createCampaignRightSectionNew';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearEmailMarketingCampaigns,
  currentEmailActReset,
  endTrialReset,
  sendEmailDataReset,
  sendTestEmailReset,
  setAiShopSettingFilters,
  setAudienceFilters,
  setCheckActiveUserLimitSubscriptionFilters,
  setCheckEmailSendLimitFilters,
  setCurrentEmailAct,
  setEmailCampaignFilters,
  setSegmentFilters,
  templateDetailsByIdReset,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import {
  checkActiveUserLimitSubscription,
  checkEmailSendLimit,
  endTrialApi,
  fetchAudienceList,
  fetchInitCustomerData,
  fetchSegmentList,
  fetchTemplateList,
  getAiShopSetting,
  getEmailCampaginApi,
  sendEmailCampaignApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useRouter } from 'next/router';
import ChooseTemplateModal from '../../molecules/choose-template-modal/chooseTemplateModal';
import HtmlPreviewer from '../../molecules/html-previewer/htmlPreviewer';
import TemplateListModal from '../../organisms/template-list-modal/templateListModal';
import TemplateNameModal from '../../molecules/template-name-modal/templateNameModal';
import SendTestModal from '../../molecules/send-test-modal/sendTestModal';
import CampaignDraftModal from '../../molecules/campaign-draft-modal/campaignDraftModal';
import CampaignSummaryModal from '../../molecules/campaign-summary-modal/campaignSummaryModal';
import { clearCopyTemplateFilter } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import ChangeTemplateModalOnEdit from '../../molecules/change-template-modal-on-edit/changeTemplateModalOnEdit';
import CreateCampaignPreviewSkeleton from '../../loading-skeletons/create-campaign-preview-skeleton/createCampaignPreviewSkeleton';
import { sendNowValidationSchema } from '../../utils/validation';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';

import { TemplatePreviewIcon } from '../../svg-icons';
import TemplatePreviewModal from '../../molecules/template-preview-modal/templatePreviewModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment';
import DkimAlertBar from '../../molecules/dkim-alert-bar/dkimAlertBar';
import SuspiciousEmailAlertBar from '../../molecules/suspicious-email-alert-bar/suspiciousEmailAlertBar';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Paragraph, Text } = Typography;

const CreateCampaignTemplateNew = forwardRef((props, ref) => {
  const { isEditMode = false, handleRouteChangeStart } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification, modal } = App.useApp();
  const formikRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get dirty() {
      return formikRef?.current?.dirty;
    },
  }));

  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );

  const { shop_id = '', email_decoded = '' } = userDetails || {};
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { login_auth } = useSelector((state) => state.jwtState);

  const {
    emailCampaignData,
    campaignDetailsData,
    campaignDetailsLoading,
    templateDetailsById,
    endTrialLoading,
    endTrialApiState,
    endTrialMessage,
  } = campaignState;

  useEffect(() => {
    if (!templateDetailsById || !formikRef.current) return;

    const tplSubject = templateDetailsById?.EmailNotificationfromSubject ?? '';
    const tplHtml = templateDetailsById?.email_html_code ?? '';

    const currentSubject =
      formikRef.current.values?.EmailNotificationfromSubject ?? '';

    // If subject was previously auto-filled OR empty, sync it to the template
    if (wasSubjectAutoFilled || currentSubject.trim() === '') {
      formikRef.current.setFieldValue(
        'EmailNotificationfromSubject',
        tplSubject
      );
      setWasSubjectAutoFilled(true);
    }

    // User explicitly chose a new template -> replace the message HTML
    formikRef.current.setFieldValue('EmailNotificationfromMsg', tplHtml);
  }, [templateDetailsById]);

  const formInitialState = useMemo(() => {
    const campaignInfo = campaignDetailsData?.campaignInfo || {};
    const emailData = emailCampaignData?.email_data || {};

    const splitCsv = (val) => (val || '').split(',').filter(Boolean);

    return {
      campaignName: isEditMode
        ? campaignInfo?.campaign_name || ''
        : `Email Campaign - ${moment().format('LLL')}`,

      EmailNotificationfromSubject: isEditMode
        ? campaignInfo?.email_subject || ''
        : '',

      EmailNotificationfromMsg: isEditMode
        ? campaignInfo?.email_content || ''
        : '',

      shortcode: '',

      sendOption: isEditMode
        ? campaignInfo?.when_to_send === 'draft'
          ? 'draft'
          : 'now'
        : 'now',

      whenToSend: isEditMode ? campaignInfo?.when_to_send || 'now' : 'now',

      include_lists: isEditMode ? splitCsv(campaignInfo?.include_lists) : [],
      include_segments: isEditMode
        ? splitCsv(campaignInfo?.include_segments)
        : [],
      exclude_lists: isEditMode ? splitCsv(campaignInfo?.exclude_lists) : [],
      exclude_segments: isEditMode
        ? splitCsv(campaignInfo?.exclude_segments)
        : [],

      emailNotificationfromName: isEditMode
        ? campaignInfo?.from_name || emailData?.from_name || ''
        : emailData?.from_name || '',

      emailNotificationfromReplyTo: isEditMode
        ? campaignInfo?.reply_to_email || emailData?.reply_to || ''
        : emailData?.reply_to || '',

      //  Keep same input field, prefill combined email
      emailNotificationfromEmail: isEditMode
        ? campaignInfo?.from_email?.split('@')[0] ||
          emailData?.fromEmailBefore ||
          ''
        : emailData?.fromEmailBefore || '',

      // 👇 Store split parts internally (hidden)
      EmailfromEmailBefore: emailData?.fromEmailBefore || '',
      EmailfromEmailAfter: emailData?.domain_name || '',

      sentDate: isEditMode
        ? campaignInfo?.send_time || emailData?.send_time
          ? dayjs
              .utc(
                campaignInfo.send_time || emailData?.send_time,
                'YYYY-MM-DD HH:mm:ss'
              ) // parse as UTC
              .tz(
                campaignInfo?.timezone || emailData?.selected_timezone || 'UTC'
              ) // convert to tz
          : null
        : null,

      utm_source: isEditMode
        ? campaignInfo?.utm_source || 'AiTrillion.com'
        : 'AiTrillion.com',
      utm_medium: isEditMode
        ? campaignInfo?.utm_medium || 'Marketing_Email'
        : 'Marketing_Email',
      utm_content: isEditMode ? campaignInfo?.utm_content || '' : '',
      utm_term: isEditMode ? campaignInfo?.utm_term || '' : '',
      utm_campaign: isEditMode
        ? campaignInfo?.utm_campaign ||
          `Email Campaign - ${moment().format('LLL')}`
        : `Email Campaign - ${moment().format('LLL')}`,

      customUtm: isEditMode ? campaignInfo?.customUtm === '1' : false,
      selectedTimezone: isEditMode
        ? campaignInfo?.timezone ||
          emailData?.selected_timezone ||
          dayjs.tz.guess()
        : emailData?.selected_timezone || dayjs.tz.guess(),
    };
  }, [isEditMode, campaignDetailsData, emailCampaignData]);

  const [isFormikReady, setIsFormikReady] = useState(false);
  const [campaignInitialData, setCampaignInitialData] = useState({});
  const [chooseTemplateModalVisible, setChooseTemplateModalVisible] =
    useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [templateListModalVisible, setTemplateListModalVisible] =
    useState(false);
  const [templateNameModalVisible, setTemplateNameModalVisible] =
    useState(false);
  const [useTemplateId, setUseTemplateId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [actionType, setActionType] = useState('');
  const [draftModalVisible, setDraftModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [shouldChoosePreMadeCall, setshouldChoosePreMadeCall] = useState(false);
  const [changeTemplateOnEditModal, setChangeTemplateOnEditModal] =
    useState(false);
  const [dkimPopupVisible, setDkimPopupVisible] = useState(false);
  const [
    subscriptionPlanTypePopupVisible,
    setSubscriptionPlanTypePopupVisible,
  ] = useState(false);

  const [endTrialPopupVisible, setEndTrialPopupVisible] = useState(false);
  const [emailLimitPopupVisible, setEmailLimitPopupVisible] = useState(false);
  const [dailyEmailLimitPopup, setDailyEmailLimitPopup] = useState(false);
  const [suspiciousEmailPopupVisible, setSuspiciousEmailPopupVisible] =
    useState(false);

  const [previewModalVisible, setPreviewModalVisible] = useState(false);

  const [wasSubjectAutoFilled, setWasSubjectAutoFilled] = useState(false);
  const [fromChooseTemplateModal, setFromChooseTemplateModal] = useState(false);

  const [freePlanModalVisible, setFreePlanModalVisible] = useState(false);

  // Once shop_id is available, set audience filters and fetch campaign list
  useEffect(() => {
    if (!shop_id) return;
    dispatch(setAudienceFilters({ shop_id: shop_id }));
    dispatch(setSegmentFilters({ shop_id: shop_id }));
    dispatch(fetchInitCustomerData());
    dispatch(fetchAudienceList());
    dispatch(fetchSegmentList());
    dispatch(fetchTemplateList());
    dispatch(setEmailCampaignFilters({ encodedData: email_decoded }));
    dispatch(getEmailCampaginApi());
    dispatch(sendEmailDataReset());
  }, [shop_id, dispatch]);

  useEffect(() => {
    if (formInitialState?.campaignName) {
      setCampaignInitialData(formInitialState);
    }
  }, [formInitialState?.campaignName]);

  useEffect(() => {
    if (formikRef.current?.values) {
      setIsFormikReady(true);
    }
  }, [formikRef.current?.values]); // This gets triggered only after Formik initializes

  // when template preload on edit
  useEffect(() => {
    if (
      isEditMode &&
      campaignDetailsData?.templateData?.email_content &&
      !showTemplatePreview
    ) {
      setShowTemplatePreview(true);
    }
  }, [isEditMode, campaignDetailsData?.templateData?.email_content]);

  useEffect(() => {
    if (campaignState?.sendEmailApiState !== 'success') return;

    const act = campaignState?.currentEmailAct;

    switch (act) {
      case 'send_test_mail_notification':
        notification.success({ message: campaignState.sendEmailMessage });
        setModalVisible(false);
        break;

      case 'insert_email_message_log':
        setSummaryModalVisible(false);
        dispatch(sendTestEmailReset());
        dispatch(currentEmailActReset());
        dispatch(clearEmailMarketingCampaigns());
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.push('/email-marketing/campaign/list');
        break;

      case 'insert_email_log_with_draft':
        if (actionType === 'pre-made-template') {
          router.events.off('routeChangeStart', handleRouteChangeStart);
          setTemplateListModalVisible(true);
          dispatch(currentEmailActReset());
          // dispatch(sendTestEmailReset());
          setActionType('');
          setshouldChoosePreMadeCall(false);
        } else {
          setDraftModalVisible(false);
          dispatch(clearEmailMarketingCampaigns());
          // dispatch(sendTestEmailReset());
          dispatch(currentEmailActReset());
          router.events.off('routeChangeStart', handleRouteChangeStart);
          router.push('/email-marketing/campaign/list');
        }

        break;

      case 'campaign_ab_test':
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.push(
          `/email-marketing/campaign/${campaignState?.sendEmailData?.encoded_key_id}/createAB`
        );
        // notification.success({ message: campaignState.sendEmailMessage });
        dispatch(currentEmailActReset());
        break;

      case 'save_draft_for_dkim':
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.push(
          `/email-marketing/settings/dkimsetting?campaignId=${campaignState?.sendEmailData?.encoded_key_id}`
        );
        notification.success({
          message:
            'campaign has been saved in the draft and redirecting to the DKIM settings page',
        });
        break;

      case 'save_draft_from_email_limit':
        notification.success({
          message:
            'Campaign has been saved as a draft. Redirecting you shortly to complete your purchase.',
        });
        setEmailLimitPopupVisible(false);

        setTimeout(() => {
          router.events.off('routeChangeStart', handleRouteChangeStart);
          router.push('/email-marketing/campaign/list');
          window.open(
            `${process.env.NEXT_PUBLIC_APP_URL}/billing#/activePlan`,
            '_blank',
            'noopener,noreferrer'
          );
        }, 2000);
        break;

      case 'save_draft_from_suspecious_email':
        notification.success({
          message:
            'Campaign has been saved as a draft. Redirecting you shortly to contact us.',
        });
        setSuspiciousEmailPopupVisible(true);

        setTimeout(() => {
          router.events.off('routeChangeStart', handleRouteChangeStart);
          router.push('/email-marketing/campaign/list'); // immediate navigation
          window.open(
            `${process.env.NEXT_PUBLIC_APP_URL}/index/support`,
            '_blank',
            'noopener,noreferrer'
          );
        }, 2000);
        break;

      case 'insert_email_log_with_draft_message_campaign_case':
        break;

      case 'save_draft_from_free_plan':
        notification.success({
          message:
            'Campaign has been saved as a draft. Redirecting you shortly to complete your purchase.',
        });

        setTimeout(() => {
          router.events.off('routeChangeStart', handleRouteChangeStart);
          setFreePlanModalVisible(false);
          router.push(`/popup?act=upgrade`);
        }, 2000);
        break;

      default:
        notification.success({ message: campaignState.sendEmailMessage });
        router.push('/email-marketing/campaign/list');
        break;
    }
    dispatch(sendTestEmailReset());
  }, [campaignState?.sendEmailApiState]);

  // Handle error separately
  useEffect(() => {
    if (campaignState?.sendEmailApiState === 'couponError') {
      notification.error({
        message: campaignState?.sendEmailMessage,
      });
      dispatch(sendTestEmailReset());
    }
    if (campaignState?.sendEmailApiState === 'error') {
      notification.error({
        message: campaignState?.sendEmailMessage,
      });
      dispatch(sendTestEmailReset());
    }
  }, [campaignState?.sendEmailApiState]);

  // get Ai setting
  useEffect(() => {
    if (campaignState?.aiShopSettingApiState === 'success') {
      const { aiShopSettingData } = campaignState;

      if (campaignState?.currentEmailAct === 'save_draft') {
        setDraftModalVisible(true);
      } else if (
        aiShopSettingData?.dkim_status !== '1' &&
        formikRef?.current?.values?.whenToSend !== 'draft'
      ) {
        setDkimPopupVisible(true);
      } else {
        setSummaryModalVisible(true);
      }

      // if (
      //   aiShopSettingData?.is_dedicated_email_ip === '0' ||
      //   aiShopSettingData?.free_plan === '1' ||
      //   aiShopSettingData?.dkim_status !== '1'
      // ) {
      //   if (aiShopSettingData?.is_dedicated_email_ip !== '1') {
      //     setDkimStatusSteps({
      //       message: 'Contact Support',
      //       desctiption:
      //         'We encourage you to buy a dedicated IP to improve your email delivery',
      //       onClick: () => {
      //         router.push('/support');
      //       },
      //     });

      //     setDkimPopupVisible(true);
      //   }

      //   if (
      //     !aiShopSettingData?.free_plan &&
      //     aiShopSettingData?.dkim_status !== '1'
      //   ) {
      //     setDkimStatusSteps({
      //       message: '',
      //       desctiption: '',
      //       onClick: () => {},
      //     });
      //     setDkimPopupVisible(true);
      //   }

      //   if (
      //     !aiShopSettingData?.free_plan &&
      //     aiShopSettingData?.dkim_status === 1
      //   ) {
      //     setDkimStatusSteps({
      //       message: '',
      //       desctiption: '',
      //       onClick: () => {},
      //     });
      //     setDkimPopupVisible(true);

      //     //step3
      //   }

      //   if (aiShopSettingData?.dkim_status !== '1') {
      //     setDkimPopupVisible(true);
      //     setDkimStatusSteps({
      //       message: '',
      //       desctiption: '',
      //       onClick: () => {},
      //     });
      //   }
      // } else {
      //   setSummaryModalVisible(true);
      // }
    }

    if (campaignState?.aiShopSettingApiState === 'error') {
      notification.error({
        message: campaignState?.aiShopSettingError,
      });
    }
  }, [campaignState?.aiShopSettingApiState]);

  useEffect(() => {
    if (campaignState?.checkEmailSendLimitApiState !== 'success') return;

    const {
      is_enterprise_free_plan_notify,
      is_cross_monthly_email_limit,
      is_notify_email_limit,
      is_trial,
      limitArr,
    } = campaignState?.checkEmailSendLimitData;

    const { is_available_upgrad_plan, subscription_plan_type } =
      login_auth || {};

    if (is_enterprise_free_plan_notify === 1) {
      router.push(`/popup?act=email_marketing_free`);
      return;
    }

    // Helper function to show trial upgrade options
    const handleTrialUpgrade = () => {
      if (subscription_plan_type !== 'usage') {
        setSubscriptionPlanTypePopupVisible(true);
      } else {
        setSubscriptionPlanTypePopupVisible(true);
        setEndTrialPopupVisible(true);
      }
    };

    if (is_cross_monthly_email_limit === 1) {
      if (is_available_upgrad_plan) {
        router.push(`/popup?act=upgrade`);
      } else if (is_trial) {
        handleTrialUpgrade();
      } else if (limitArr?.is_free_plan === 1) {
        setFreePlanModalVisible(true);
      } else if (
        limitArr?.is_free_plan === 0 &&
        login_auth?.is_trial_end_trial === 1
      ) {
        setFreePlanModalVisible(true);
      } else {
        setEmailLimitPopupVisible(true);
      }
      return;
    }

    if (is_notify_email_limit === 1) {
      if (is_trial) {
        handleTrialUpgrade();
      } else {
        setDailyEmailLimitPopup(true);
      }
      return;
    }

    // Default fallback if none of the above triggered
    handleCheckSubscription();
  }, [campaignState?.checkEmailSendLimitApiState]);

  // checkActiveUserData angular function
  useEffect(() => {
    if (campaignState?.checkActiveUserLimitSubscriptionApiState === 'success') {
      const { is_card_declined, is_notify_customer } =
        campaignState?.checkActiveUserLimitSubscriptionData;
      if (is_card_declined) {
        notification.warning({
          message:
            'Payment failed: Your card was declined. Please update your payment details to avoid service disruption.',
        });
        router.push(`/popup?act=upgrade`);
      } else if (is_notify_customer) {
        return;
      } else {
        handleFinalSubmit();
      }
    }

    if (campaignState?.checkActiveUserLimitSubscriptionApiState === 'error') {
      setSummaryModalVisible(false);
      setSuspiciousEmailPopupVisible(true);
    }
  }, [campaignState?.checkActiveUserLimitSubscriptionApiState]);

  useEffect(() => {
    if (actionType === 'pre-made-template' && shouldChoosePreMadeCall) {
      const currentCampaignId =
        router?.query?.id || campaignState?.sendEmailData?.encoded_key_id;

      if (!currentCampaignId && !isEditMode) {
        // create new campaign draft only if no existing campaign
        handleSendTestEmail();
      } else {
        // open modal if editing or already have campaign
        setTemplateListModalVisible(true);
      }

      setshouldChoosePreMadeCall(false);
    }

    //**commented for html editor

    // if (actionType === 'html_editor' && shouldChoosePreMadeCall) {
    //   handleSendTestEmail();
    //   setshouldChoosePreMadeCall(false);
    // }
    // if (actionType === 'html_editor' && shouldChoosePreMadeCall) {
    //   handleSendTestEmail();
    //   setshouldChoosePreMadeCall(false);
    // }
    // if (actionType === 'html_editor_from_edit' && shouldChoosePreMadeCall) {
    //   router.push(
    //     `/email-marketing/templates/editorv2?type=campaign&type2=${isEditMode ? 'html_editor_from_edit' : 'html_editor_create_campaign'}` +
    //       `&camp_id=${isEditMode ? router?.query?.id : campaignState?.sendEmailData?.encoded_key_id}` +
    //       `&is_open_page=campaign`
    //   );
    //   setshouldChoosePreMadeCall(false);
    //   setActionType(''); // reset
    // }
  }, [
    actionType,
    shouldChoosePreMadeCall,
    campaignState?.sendEmailData?.encoded_key_id,
  ]);

  useEffect(() => {
    if (actionType === 'pre_made_template_from_edit') {
      setTemplateListModalVisible(true);
      setActionType(''); // reset
    }
  }, [actionType]);

  //after use template when campign create
  useEffect(() => {
    if (templateState?.copyTemplateApiState === 'success') {
      setTemplateNameModalVisible(false);
      setTemplateListModalVisible(false);

      dispatch(clearCopyTemplateFilter());
      if (
        router?.pathname === '/email-marketing/campaign/create-campaign' ||
        isEditMode
      ) {
        handleUseTemplateOpenEditorFromCreateCampaign();
      }
    }

    if (templateState?.copyTemplateApiState === 'error') {
      notification.error({
        message: templateState.copyTemplateMessage,
      });
      dispatch(clearCopyTemplateFilter());
    }
  }, [templateState?.copyTemplateApiState]);

  // end trial

  useEffect(() => {
    if (endTrialApiState === 'success') {
      notification.success({
        message: endTrialMessage,
      });
      setSubscriptionPlanTypePopupVisible(false);
      setEndTrialPopupVisible(false);
      dispatch(endTrialReset());
    }
    if (endTrialApiState === 'error') {
      notification.error({
        message: endTrialMessage,
      });
      dispatch(endTrialReset());
    }
  }, [endTrialApiState]);

  //functions
  const handleSendTestEmailModalOpen = (values, setFieldError) => {
    if (values.EmailNotificationfromSubject) {
      setModalVisible(true);
    } else if (!values.EmailNotificationfromMsg) {
      notification.error({
        message: 'Missing Email Content',
        description: 'Email content is required to send the test email.',
      });
      return;
    } else {
      notification.error({
        message: 'Please enter email subject',
      });
      setFieldError(
        'EmailNotificationfromSubject',
        'Please enter email subject'
      );
    }
  };

  const handleSendTestEmail = (passedEmail) => {
    if (!isFormikReady) return; // Don't run if Formik not ready

    const finalEmail = passedEmail || testEmail; // prefer passed email, fallback to state

    const htmlCode =
      formikRef?.current?.values?.EmailNotificationfromMsg ??
      templateDetailsById?.email_html_code ??
      (isEditMode && !campaignState?.templateDetailsById?.id
        ? campaignState?.campaignDetailsData?.campaignInfo?.email_content || ''
        : campaignState?.templateDetailsById?.content ||
          campaignState?.templateDetailsById?.email_html_code ||
          '');

    const payload = {
      EmailNotificationToEmail: finalEmail,

      EmailNotificationfromEmail: `${
        formikRef?.current?.values?.emailNotificationfromEmail
      }${
        emailCampaignData?.email_data?.domain_name?.startsWith('@')
          ? emailCampaignData?.email_data?.domain_name
          : '@' + (emailCampaignData?.email_data?.domain_name || '')
      }`,

      EmailNotificationfromMsg: htmlCode,

      //when choose from message modal

      email_content_html:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignState?.campaignDetailsData?.campaignInfo
              ?.email_content_html || ''
          : campaignState?.templateDetailsById?.template_html || '',

      email_content_css:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignDetailsData?.campaignInfo?.email_content_css
          : campaignState?.templateDetailsById?.template_css || '',
      EmailNotificationfromName:
        formikRef?.current?.values?.emailNotificationfromName ||
        emailCampaignData?.email_data?.from_name,
      EmailNotificationfromReplyTo:
        formikRef?.current?.values?.emailNotificationfromReplyTo ||
        emailCampaignData?.email_data?.reply_to,
      EmailNotificationfromSubject:
        actionType === 'pre-made-template'
          ? formikRef?.current?.values?.EmailNotificationfromSubject?.trim() ||
            formikRef?.current?.values?.campaignName
          : formikRef?.current?.values?.EmailNotificationfromSubject,

      EmailfromEmailAfter: emailCampaignData?.email_data?.domain_name,
      EmailfromEmailBefore:
        formikRef?.current?.values?.emailNotificationfromEmail ||
        emailCampaignData?.email_data?.fromEmailBefore,
      act:
        actionType === 'pre-made-template'
          ? 'insert_email_message_log'
          : 'send_test_mail_notification',
      act_type: 'need_to_select',
      include_lists: formikRef?.current?.values?.include_lists,
      include_segments: formikRef?.current?.values?.include_segments,
      exclude_lists: formikRef?.current?.values?.exclude_lists,
      exclude_segments: formikRef?.current?.values?.exclude_segments,
      campaignName: formikRef?.current?.values.campaignName,
      email_html_code: '',
      encodedData: emailCampaignData?.email_data?.reply_to,
      is_ab_testing: 0,
      is_html_code: 0,
      is_new_template: '1',
      isnewtemplate: '1',
      selectedTimezone: emailCampaignData?.selected_timezone,
      sentDate: '',
      timezone: emailCampaignData?.timezone,
      whenToSend:
        actionType === 'pre-made-template'
          ? 'draft'
          : formikRef?.current?.values?.whenToSend,
      page_action: actionType === 'pre-made-template' ? 'dummey_campaign' : '',
    };
    dispatch(
      setCurrentEmailAct(
        actionType === 'pre-made-template'
          ? 'insert_email_log_with_draft'
          : payload.act
      )
    );
    dispatch(sendEmailCampaignApi(payload));
  };

  const handleSendNowSubmit = (values) => {
    if (!isFormikReady) return; // Don't run if Formik not ready
    // Extract external values
    const emailData = emailCampaignData?.email_data;

    const htmlCode = [
      formikRef?.current?.values?.EmailNotificationfromMsg,
      templateDetailsById?.email_html_code,
      isEditMode
        ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
        : campaignState?.templateDetailsById?.email_html_code,
    ].find((val) => val && val.trim() !== '');

    // setFormData(values);
    // Check required external dependencies
    if (!emailData?.fromEmailBefore || !emailData?.domain_name) {
      notification.error({
        message: 'Missing From Email Details',
        description:
          'From email address or domain is missing in email settings.',
      });
      return;
    }

    if (!emailData?.from_name || !emailData?.reply_to) {
      notification.error({
        message: 'Missing Sender Info',
        description: 'Sender name or reply-to email is missing.',
      });
      return;
    }

    if (!htmlCode) {
      notification.error({
        message: 'Missing Email Content',
        description:
          'Message content cannot be empty. Please choose a template or editor.',
      });
      return;
    }
    const totalSubs = Number(
      getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers || 0
    );

    if (!totalSubs) {
      notification.error({
        message: 'Missing Audience count',
        description: 'Audience cannot be Zero.',
      });
      return;
    }

    // If all checks pass
    dispatch(
      setCurrentEmailAct(
        formikRef?.current?.values?.whenToSend === 'draft'
          ? 'save_draft'
          : 'insert_email_message_log'
      )
    );
    dispatch(setAiShopSettingFilters({ shop_id: shop_id }));
    dispatch(getAiShopSetting());
  };

  const determineActValue = (forcedAct, campaignState, whenToSendValue) => {
    if (forcedAct) return forcedAct;
    if (
      [
        'save_draft_for_dkim',
        'save_draft_from_email_limit',
        'save_draft_from_suspecious_email',
      ].includes(campaignState?.currentEmailAct)
    ) {
      return campaignState?.currentEmailAct;
    }
    return whenToSendValue === 'draft'
      ? 'insert_email_log_with_draft'
      : 'insert_email_message_log';
  };

  const handleFinalSubmit = (forcedWhenToSend, forcedAct) => {
    if (!isFormikReady) return; // Don't run if Formik not ready

    const whenToSendValue =
      forcedWhenToSend ?? formikRef?.current?.values?.whenToSend;

    const actValue = determineActValue(
      forcedAct,
      campaignState,
      whenToSendValue
    );
    dispatch(setCurrentEmailAct(actValue));

    const emailData = emailCampaignData?.email_data;
    const emailParts = (
      formikRef?.current?.values?.emailNotificationfromEmail || ''
    ).split('@');

    const htmlCode =
      formikRef?.current?.values?.EmailNotificationfromMsg ??
      templateDetailsById?.email_html_code ??
      (isEditMode && !campaignState?.templateDetailsById?.id
        ? campaignState?.campaignDetailsData?.campaignInfo?.email_content || ''
        : campaignState?.templateDetailsById?.content ||
          campaignState?.templateDetailsById?.email_html_code ||
          '');

    const sendCampaignPayload = {
      EmailNotificationToEmail: formikRef?.current?.values?.testEmail,
      EmailNotificationfromEmail: `${
        formikRef?.current?.values?.emailNotificationfromEmail
      }${
        emailData?.domain_name?.startsWith('@')
          ? emailData.domain_name
          : '@' + (emailData?.domain_name || '')
      }`,
      EmailNotificationfromMsg: htmlCode,
      //when choose from message modal
      email_content_html:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignState?.campaignDetailsData?.campaignInfo
              ?.email_content_html || ''
          : campaignState?.templateDetailsById?.template_html || '',

      email_content_css:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignDetailsData?.campaignInfo?.email_content_css
          : campaignState?.templateDetailsById?.template_css || '',

      EmailNotificationfromName:
        formikRef?.current?.values?.emailNotificationfromName ||
        emailData?.from_name,
      EmailNotificationfromReplyTo:
        formikRef?.current?.values?.emailNotificationfromReplyTo ||
        emailData?.reply_to,
      EmailNotificationfromSubject:
        formikRef?.current?.values?.EmailNotificationfromSubject,
      EmailfromEmailAfter: emailData?.domain_name,
      EmailfromEmailBefore:
        formikRef?.current?.values?.emailNotificationfromEmail ||
        emailData?.fromEmailBefore,
      act: 'insert_email_message_log',
      act_type: 'view_html',
      campaignName: formikRef?.current?.values?.campaignName,
      //when message Id
      campaignTypeUpdateID: '0',
      couponWarningByferget: 0,
      create_act: 'new',
      include_lists: formikRef?.current?.values?.include_lists,
      include_segments: formikRef?.current?.values?.include_segments,
      exclude_lists: formikRef?.current?.values?.exclude_lists,
      exclude_segments: formikRef?.current?.values?.exclude_segments,
      is_ab_testing: 0,
      is_card_declined: 0,
      is_html_code: campaignState?.templateDetailsById?.is_html_code,
      is_new_template: campaignState?.templateDetailsById?.is_new_template,
      isnewtemplate: '1',
      masterFilter: [],
      messageId: isEditMode ? router.query.id : '',
      messageUpdateID: isEditMode ? router.query.id : '',
      //when select from choose message modal
      masterMessageId: campaignState?.templateDetailsById?.id || '0',
      selectedCustomers: [],
      selectedOperatorType: 'and',
      selectedTimezone: formikRef?.current?.values?.selectedTimezone || '',

      sentDate: formikRef?.current?.values?.sentDate
        ? dayjs(formikRef?.current?.values?.sentDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        : '',
      shop_id: shop_id,
      templateUpdateID: '',
      timeZone: emailCampaignData?.timeZone,
      customUtm: formikRef?.current?.values?.customUtm === true ? '1' : '0',
      utm_campaign: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_campaign
        : null,
      utm_content: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_content
        : null,
      utm_medium: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_medium
        : null,
      utm_source: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_source
        : null,
      utm_term: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_term
        : null,
      whenToSend: whenToSendValue,
      //  conditionally add is_new_template
      ...(fromChooseTemplateModal
        ? {
            is_new_template: templateDetailsById?.is_new_template,
            isnewtemplate: templateDetailsById?.is_new_template,
          }
        : {}),
    };
    setFromChooseTemplateModal(false);
    dispatch(sendEmailCampaignApi(sendCampaignPayload));
  };

  const handleSummaryModalSendClick = () => {
    if (!isFormikReady) return;
    dispatch(
      setCheckEmailSendLimitFilters({
        totalEmailSubscribers:
          getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers,
        whenToSend: formikRef?.current?.values?.whenToSend,
        sentDate: formikRef?.current?.values?.sentDate
          ? formikRef?.current?.values?.sentDate.format('MM/DD/YYYY h:mm A')
          : null,
        selectedTimezone: formikRef?.current?.values?.selectedTimezone || '',
      })
    );
    dispatch(checkEmailSendLimit());
  };

  const handleCheckSubscription = () => {
    const payload = {};
    [
      'include_lists',
      'include_segments',
      'exclude_lists',
      'exclude_segments',
    ].forEach((key) => {
      if (formikRef?.current?.values[key]?.length > 0) {
        payload[key] = formikRef?.current?.values[key];
      }
    });

    dispatch(
      setCheckActiveUserLimitSubscriptionFilters({
        ...payload,
        act: 'check_active_user_limit',
        act_module: 'email',
        returnType: 'count',
        limit: 20,
        list_segment_report: 1,
        masterFilter: [],
        order: false,
        selectedChennalType: 'Email',
        selectedCustomers: [],
        selectedOperatorType: 'and',
        selectedpeopleType: 'customer',
        sort: 'c.last_seen_date',
      })
    );

    dispatch(checkActiveUserLimitSubscription());
  };

  const handleChoosePreMadeTemplate = (type) => {
    if (campaignState?.sendEmailData?.encoded_key_id) {
      // ✅ Campaign already exists → just open template list modal
      setTemplateListModalVisible(true);
      setActionType('');
      setshouldChoosePreMadeCall(false);
    } else {
      // ✅ No campaign yet → create draft
      setActionType(type);
      setshouldChoosePreMadeCall(true);
    }
  };

  // from template list modal create from scratch button
  const handleCreateTemplateFromScratch = (type, type2, campaignId) => {
    router.events.off('routeChangeStart', handleRouteChangeStart);
    window.onbeforeunload = null;
    const campaignInfo = campaignDetailsData?.campaignInfo || {};

    const campaignName = isEditMode
      ? campaignInfo?.campaign_name || ''
      : formikRef?.current?.values?.campaignName;

    router.push(
      `/email-marketing/templates/editorv2?type=${type}&type2=${type2}&camp_id=${isEditMode ? router?.query?.id : campaignId}&c_name=${encodeURIComponent(campaignName)}`
    );
  };

  const handleUseTemplateOpenEditorFromCreateCampaign = (slug = '') => {
    const campaignInfo = campaignDetailsData?.campaignInfo || {};

    const campaignName = isEditMode
      ? campaignInfo?.campaign_name || ''
      : formikRef?.current?.values?.campaignName;

    // 1. Remove route change guard
    router.events.off('routeChangeStart', handleRouteChangeStart);

    // 2. Remove beforeunload listener
    window.onbeforeunload = null;
    router.push(
      `/email-marketing/templates/editorv2?type=campaign&type2=${isEditMode ? 'change-template' : 'use_template_create_campaign'}` +
        `&etid=${templateState?.copyTemplateData?.template_id}` +
        `&camp_id=${isEditMode ? router?.query?.id : campaignState?.sendEmailData?.encoded_key_id}` +
        `&c_name=${encodeURIComponent(campaignName)}` +
        `&is_open_page=campaign`
    );

    dispatch(clearCopyTemplateFilter());
  };

  const handleUseNowTemplateClick = (templateId) => {
    const campaignInfo = campaignDetailsData?.campaignInfo || {};

    const campaignName = isEditMode
      ? campaignInfo?.campaign_name || ''
      : formikRef?.current?.values?.campaignName;

    // 1. Remove route change guard
    router.events.off('routeChangeStart', handleRouteChangeStart);

    // 2. Remove beforeunload listener
    window.onbeforeunload = null;

    router.push(
      `/email-marketing/templates/editorv2?type=campaign&type2=use-now&etid=${templateId}&c_name=${encodeURIComponent(campaignName)}&camp_id=${isEditMode ? router?.query?.id : campaignState?.sendEmailData?.encoded_key_id}&is_open_page=campaign`
    );
  };

  const handleEditEmailClick = () => {
    // 1. Remove route change guard
    // ✅ 1. Check for unsaved changes / template loaded condition
    if (campaignState?.templateDetailsById?.id) {
      modal.confirm({
        title: 'Unsaved Changes',
        content:
          'You have unsaved changes or a loaded template. Do you want to save this campaign as a draft before editing the email?',
        okText: 'Save & Continue',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            // ✅ Step 1: Save current campaign as draft
            await handleFinalSubmit(
              'draft',
              'insert_email_log_with_draft_message_campaign_case'
            );

            // ✅ Step 2: Clean up navigation guards
            router.events.off('routeChangeStart', handleRouteChangeStart);
            window.onbeforeunload = null;

            // ✅ Step 3: Redirect to Stripo Editor
            router.push(
              `/email-marketing/templates/editorv2?type=campaign&type2=edit-email&camp_id=${isEditMode && router?.query?.id}&is_open_page=campaign`
            );
          } catch (err) {
            console.error('Error saving draft before redirect:', err);
            notification.error({
              message: 'Failed to save draft',
              description: 'Please try again before editing the email.',
            });
          }
        },
      });
      return; // Stop normal execution until user confirms
    }

    // ✅ 2. Normal safe redirect (no existing template)
    router.events.off('routeChangeStart', handleRouteChangeStart);
    window.onbeforeunload = null;

    router.push(
      `/email-marketing/templates/editorv2?type=campaign&type2=edit-email&camp_id=${isEditMode && router?.query?.id}&is_open_page=campaign`
    );
  };

  const handleCreateAbTest = (values) => {
    if (!isFormikReady) return; // Don't run if Formik not ready
    const emailData = emailCampaignData?.email_data;

    // const htmlCode = [
    //   formikRef?.current?.values?.EmailNotificationfromMsg,
    //   templateDetailsById?.email_html_code,
    //   isEditMode
    //     ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
    //     : campaignState?.templateDetailsById?.email_html_code,
    // ].find((val) => val && val.trim() !== '');

    if (emailCampaignData?.email_data?.dkim_status === 0) {
      notification.error({
        message: 'DKIM Not Configured',
        description:
          'It’s mandatory to complete DKIM settings for domain authentication and reliable delivery before sending campaigns',
        placement: 'top',
      });
      return;
    }
    const htmlCode =
      formikRef?.current?.values?.EmailNotificationfromMsg ??
      templateDetailsById?.email_html_code ??
      (isEditMode && !campaignState?.templateDetailsById?.id
        ? campaignState?.campaignDetailsData?.campaignInfo?.email_content || ''
        : campaignState?.templateDetailsById?.content ||
          campaignState?.templateDetailsById?.email_html_code ||
          '');

    if (!emailData?.fromEmailBefore || !emailData?.domain_name) {
      notification.error({
        message: 'Missing From Email Details',
        description:
          'From email address or domain is missing in email settings.',
      });
      return;
    }

    if (!emailData?.from_name || !emailData?.reply_to) {
      notification.error({
        message: 'Missing Sender Info',
        description: 'Sender name or reply-to email is missing.',
      });
      return;
    }

    if (!htmlCode) {
      notification.error({
        message: 'Missing Email Content',
        description:
          'Message content cannot be empty. Please choose a template or editor.',
      });
      return;
    }

    const createAbPayload = {
      EmailNotificationToEmail: formikRef?.current?.values?.testEmail || '',
      EmailNotificationfromEmail: `${
        formikRef?.current?.values?.emailNotificationfromEmail
      }${
        emailData?.domain_name?.startsWith('@')
          ? emailData.domain_name
          : '@' + (emailData?.domain_name || '')
      }`,

      EmailNotificationfromMsg: htmlCode,

      //when choose from message modal
      // email_content_html: isEditMode
      //   ? campaignState?.campaignDetailsData?.campaignInfo?.email_content_html
      //   : campaignState?.templateDetailsById?.template_html || '',

      // email_content_css: isEditMode
      //   ? campaignDetailsData?.campaignInfo?.email_content_css
      //   : campaignState?.templateDetailsById?.template_css || '',

      email_content_html:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignState?.campaignDetailsData?.campaignInfo
              ?.email_content_html || ''
          : campaignState?.templateDetailsById?.template_html || '',

      email_content_css:
        isEditMode && !campaignState?.templateDetailsById?.id
          ? campaignDetailsData?.campaignInfo?.email_content_css
          : campaignState?.templateDetailsById?.template_css || '',

      EmailNotificationfromName:
        formikRef?.current?.values?.emailNotificationfromName ||
        emailData.from_name,
      EmailNotificationfromReplyTo:
        formikRef?.current?.values?.emailNotificationfromReplyTo ||
        emailData.reply_to,
      encodedData: emailData.reply_to,
      EmailNotificationfromSubject:
        formikRef?.current?.values?.EmailNotificationfromSubject,
      EmailfromEmailAfter: emailData?.domain_name || '',
      EmailfromEmailBefore:
        formikRef?.current?.values?.emailNotificationfromEmail ||
        emailData?.fromEmailBefore,
      act: 'insert_email_message_log',
      act_type: 'view_html',
      act_type2: 'campaign_ab_test',
      campaignName: formikRef?.current?.values?.campaignName,
      // campaignTypeUpdateID: isEditMode ? 'edit' : '',
      campaignTypeUpdateID: '0',
      couponWarningByferget: 0,
      is_ab_testing: 1,
      is_html_code: 0,
      email_html_code: campaignState?.templateDetailsById?.is_html_code,
      is_new_template: '1',
      isnewtemplate: '1',
      include_lists: formikRef?.current?.values?.include_lists,
      include_segments: formikRef?.current?.values?.include_segments,
      exclude_lists: formikRef?.current?.values?.exclude_lists,
      exclude_segments: formikRef?.current?.values?.exclude_segments,
      masterFilter: [],
      //when  template choose from modal so need to send template Id in this masterMessageId key !important
      masterMessageId: campaignState?.templateDetailsById?.id,
      //when template choose from pre made template so need to send those template id with in the messageId key !important
      messageId: isEditMode ? router.query.id : '',
      messageUpdateID: isEditMode ? router.query.id : '',
      message_id: campaignState?.templateDetailsById?.id || '0',

      page_action: 'dummey_campaign',
      selectedCustomers: [],
      selectedOperatorType: 'and',
      selectedTimezone: formikRef?.current?.values?.selectedTimezone || '',
      sentDate: formikRef?.current?.values?.sentDate
        ? formikRef?.current?.values?.sentDate.format('MM/DD/YYYY h:mm A')
        : null,
      // shop_id: shop_id,
      templateUpdateID: '',
      template_id: '',
      timeZone: emailCampaignData?.timeZone,
      customUtm: formikRef?.current?.values?.customUtm === true ? '1' : '0',
      utm_campaign: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_campaign
        : null,
      utm_content: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_content
        : null,
      utm_medium: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_medium
        : null,
      utm_source: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_source
        : null,
      utm_term: formikRef?.current?.values?.customUtm
        ? formikRef?.current?.values?.utm_term
        : null,
      whenToSend: 'draft',
      ...(fromChooseTemplateModal
        ? {
            is_new_template: templateDetailsById?.is_new_template,
            isnewtemplate: templateDetailsById?.is_new_template,
          }
        : {}),
    };
    setFromChooseTemplateModal(false);
    dispatch(setCurrentEmailAct(createAbPayload.act_type2));
    dispatch(sendEmailCampaignApi(createAbPayload));
  };

  const handleEndTrial = () => {
    const payload = {
      act: 'end_trial_period',
    };
    dispatch(endTrialApi(payload));
  };

  return (
    <LayoutContainer>
      <StickyAlertWrapper>
        {!!emailCampaignData?.email_data &&
          emailCampaignData.email_data.dkim_status === 0 && <DkimAlertBar />}

        {login_auth?.is_email_campaign_suspicious === '1' && (
          <SuspiciousEmailAlertBar />
        )}
      </StickyAlertWrapper>
      <StickySubHeader>
        <div style={{ display: 'flex' }}>
          <BackButton
            marginTop={'4px'}
            color={'var(--ant-color-text-primary)'}
            handleBack={() => {
              router.push('/email-marketing/campaign/list');
            }}
          />
          {campaignInitialData?.campaignName?.length > 0 && (
            <div className="left" style={{ marginLeft: '10px' }}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <AitButton
                    onClick={() =>
                      router.push('/email-marketing/campaign/list')
                    }
                    variant="link"
                    color="default"
                    padding="0px 0px 0px 0px"
                    title={
                      <Title level={5} color="default">
                        {'Campaigns'}
                      </Title>
                    }
                  />
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Title level={5} color="default">
                    {campaignInitialData?.campaignName}
                  </Title>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          )}
        </div>

        <div className="right">
          {(isEditMode || showTemplatePreview) && (
            <Tooltip title="See preview">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setPreviewModalVisible(true);
                }}
              >
                <TemplatePreviewIcon />
              </div>
            </Tooltip>
          )}

          <AitButton
            variant="outlined"
            color="primary"
            title="Create A/B test"
            rightTagLabel="NEW"
            rightTagColor="#e3fbf1"
            onClick={() => {
              handleCreateAbTest();
            }}
            loading={
              (campaignState?.sendEmailApiState === 'pending' ||
                campaignState?.sendEmailLoading) &&
              campaignState?.currentEmailAct === 'campaign_ab_test'
            }
            style={{ minWidth: '176px' }}
          />
          {/* ===================== */}

          {/* In the case of create  */}
          {showTemplatePreview && !isEditMode && (
            <AitDropdownButton
              title={'Action'}
              menuItems={[
                {
                  key: 'change_template',
                  label: 'Change template',
                  onClick: () => {
                    if (formikRef?.current) {
                      // ✅ Only reset subject if it was auto-filled earlier
                      if (wasSubjectAutoFilled) {
                        formikRef.current.setFieldValue(
                          'EmailNotificationfromSubject',
                          ''
                        );
                        setWasSubjectAutoFilled(false);
                      }

                      // ✅ Always clear the message HTML when changing template
                      formikRef.current.setFieldValue(
                        'EmailNotificationfromMsg',
                        ''
                      );
                    }

                    dispatch(templateDetailsByIdReset());
                    setShowTemplatePreview(false);
                  },
                },
                // {
                //   key: 'edit_html',
                //   label: 'Edit HTML version',
                //   onClick: () => console.log('Edit HTML clicked'),
                // },
              ]}
              loading={false}
            />
          )}
          {/* ================================= */}
          {/* in the case of update */}
          {isEditMode && (
            <AitDropdownButton
              title={'Edit email'}
              menuItems={[
                {
                  key: 'change_template',
                  label: 'Change template',
                  onClick: () => {
                    if (isEditMode) {
                      setChangeTemplateOnEditModal(true);
                    }
                  },
                },
              ]}
              loading={false}
              onClick={() => {
                handleEditEmailClick();
              }}
            />
          )}
        </div>
      </StickySubHeader>
      <Formik
        innerRef={formikRef}
        initialValues={formInitialState}
        // enableReinitialize={true}
        enableReinitialize={true}
        validationSchema={sendNowValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSendNowSubmit(values);
          setSubmitting(false);
        }}
      >
        {(formik) => {
          return (
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                if (emailCampaignData?.email_data?.dkim_status === 0) {
                  notification.error({
                    message: 'DKIM Not Configured',
                    description:
                      'It’s mandatory to complete DKIM settings for domain authentication and reliable delivery before sending campaigns',
                    placement: 'top',
                  });
                  return; // ❌ stop submission here
                }

                // 🔑 Run fresh validation
                const errors = await formik.validateForm();

                if (Object.keys(errors).length > 0) {
                  // 🔑 Mark all errored fields as touched
                  Object.keys(errors).forEach((field) => {
                    formik.setFieldTouched(field, true, false);
                  });

                  // 🔑 Scroll to first error
                  const firstErrorKey = Object.keys(errors)[0];
                  const errorElement = document.querySelector(
                    `[name="${firstErrorKey}"]`
                  );
                  if (errorElement) {
                    errorElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                    errorElement.focus();
                  }

                  // 🔑 Show global alert
                  notification.error({
                    message: 'Error',
                    description: errors[firstErrorKey],
                    placement: 'topRight',
                  });

                  return; // ❌ stop actual submit
                }

                // ✅ If no errors → continue
                await formik.submitForm();
              }}
            >
              <StyleLeftRightPannelWrapper>
                <Col xs={24} md={10} lg={7}>
                  <ScrollableLeftPanel>
                    {campaignDetailsLoading ? (
                      <CreateCampaignLeftSkeleton />
                    ) : (
                      <CreateCampaignLeftSectionNew
                        setCampaignInitialData={setCampaignInitialData}
                        formik={formik}
                        handleSendTestEmailModalOpen={(values, setFieldError) =>
                          handleSendTestEmailModalOpen(values, setFieldError)
                        }
                        handleCreateAbTest={handleCreateAbTest}
                        isEditMode={isEditMode}
                        setWasSubjectAutoFilled={(value) => {
                          setWasSubjectAutoFilled(value);
                        }}
                      />
                    )}
                  </ScrollableLeftPanel>
                </Col>

                <Col xs={24} md={14} lg={17}>
                  {campaignDetailsLoading ? (
                    <CreateCampaignPreviewSkeleton />
                  ) : showTemplatePreview ? (
                    (() => {
                      // determine HTML content safely
                      const html =
                        campaignState?.templateDetailsById?.email_html_code ??
                        campaignDetailsData?.templateData?.email_content ??
                        '';

                      // If empty (e.g., edit mode, but API still loading), show fallback
                      if (!html.trim()) {
                        return (
                          <CreateCampaignRightSectionNew
                            handleChoosePreMadeTemplate={(type) =>
                              handleChoosePreMadeTemplate(type)
                            }
                            formik={formik}
                            setChooseTemplateModalVisible={
                              setChooseTemplateModalVisible
                            }
                            setWasSubjectAutoFilled={(value) =>
                              setWasSubjectAutoFilled(value)
                            }
                          />
                        );
                      }

                      // Otherwise render preview normally
                      return <HtmlPreviewer htmlString={html} />;
                    })()
                  ) : (
                    <CreateCampaignRightSectionNew
                      handleChoosePreMadeTemplate={(type) =>
                        handleChoosePreMadeTemplate(type)
                      }
                      formik={formik}
                      setChooseTemplateModalVisible={
                        setChooseTemplateModalVisible
                      }
                      setWasSubjectAutoFilled={(value) =>
                        setWasSubjectAutoFilled(value)
                      }
                    />
                  )}
                </Col>
              </StyleLeftRightPannelWrapper>
            </Form>
          );
        }}
      </Formik>
      <ChooseTemplateModal
        visible={chooseTemplateModalVisible}
        setVisible={setChooseTemplateModalVisible}
        handleShowTemplatePreview={(value) => {
          setShowTemplatePreview(value);
        }}
        setFromChooseTemplateModal={setFromChooseTemplateModal}
      />
      <TemplateListModal
        handleOpenEditorClick={(type, type2, campaignId) => {
          handleCreateTemplateFromScratch(type, type2, campaignId);
        }}
        visible={templateListModalVisible}
        setVisible={setTemplateListModalVisible}
        handleUseTemplateClick={(templateId) => {
          setTemplateNameModalVisible(true);
          setUseTemplateId(templateId);
        }}
        handleUseNowTemplateClick={(templateId) => {
          handleUseNowTemplateClick(templateId);
        }}
      />
      <TemplateNameModal
        visible={templateNameModalVisible}
        setVisible={setTemplateNameModalVisible}
        useTemplateId={useTemplateId}
        isEditMode={isEditMode}
      />
      <SendTestModal
        visible={modalVisible}
        setVisible={setModalVisible}
        handleSendTestEmail={(email) => {
          handleSendTestEmail(email);
        }}
        setEmailValue={(value) => {
          setTestEmail(value);
        }}
      />
      <TemplatePreviewModal
        visible={previewModalVisible}
        setVisible={setPreviewModalVisible}
        htmlString={
          campaignState?.templateDetailsById?.email_html_code ??
          (isEditMode
            ? (
                campaignDetailsData?.templateData?.email_content || ''
              ).trim() !== ''
              ? campaignDetailsData?.templateData?.email_content
              : '<p>No content</p>'
            : '<p>No content</p>')
        }
        isActionButtonShow={true}
      />
      <CampaignDraftModal
        visible={draftModalVisible}
        setVisible={setDraftModalVisible}
        saveAsDraftClick={() => {
          handleFinalSubmit();
        }}
      />
      <CampaignSummaryModal
        visible={summaryModalVisible}
        setVisible={setSummaryModalVisible}
        formData={formikRef?.current?.values}
        handleSummaryModalSendClick={handleSummaryModalSendClick}
      />
      {/* for edit page */}
      <ChangeTemplateModalOnEdit
        visible={changeTemplateOnEditModal}
        setVisible={setChangeTemplateOnEditModal}
        handleShowTemplatePreview={(value) => {
          setShowTemplatePreview(value);
        }}
        handleChoosePreMadeTemplateonEdit={(type) => {
          handleChoosePreMadeTemplate(type);
        }}
        setShowTemplatePreview={setShowTemplatePreview}
        isEditMode={isEditMode}
        setChooseTemplateModalVisible={setChooseTemplateModalVisible}
        setWasSubjectAutoFilled={(value) => {
          setWasSubjectAutoFilled(value);
        }}
      />
      {/* for DKIM setting redirection */}
      <AitConfirmationModal
        visible={dkimPopupVisible}
        setVisible={setDkimPopupVisible}
        description={
          'Complete the DKIM setup and verification before initiating any email sending to ensure proper domain authentication and deliverability. Your campaign will be saved in draft until then.'
        }
        onConfirm={() => {
          handleFinalSubmit('draft', 'save_draft_for_dkim');
        }}
        message={''}
        confirmText={'Save draft & continue'}
        cancelText={'Cancel'}
        confirmButtonLoading={campaignState?.sendEmailLoading}
      />
      {/* subscription_plan_type popup */}
      <AitConfirmationModal
        visible={subscriptionPlanTypePopupVisible}
        setVisible={setSubscriptionPlanTypePopupVisible}
        description={
          <>
            Your account is currently on a trial plan, which comes with limited
            email sending capacity. To increase your email limits or end your
            trial, please contact our support team via live chat or email at{' '}
            <Link target="_blank" href="mailto:support@aitrillion.com">
              support@aitrillion.com
            </Link>
            . We’ll be happy to assist you with the next steps.
          </>
        }
        onConfirm={() => {
          if (endTrialPopupVisible) {
            handleEndTrial();
          } else {
            setSubscriptionPlanTypePopupVisible(false);
            window.open(
              `${process.env.NEXT_PUBLIC_APP_URL}/index/support`,
              '_blank',
              'noopener,noreferrer'
            );
          }
        }}
        message={endTrialPopupVisible ? 'End trial' : 'Contact support'}
        confirmText={endTrialPopupVisible ? 'End trial' : 'Contact support'}
        cancelText={'Cancel'}
        confirmButtonLoading={endTrialPopupVisible ? endTrialLoading : false}
      />
      {/* Email Limit Popup setEmailLimitPopupVisible */}
      {/* draft in campaign before redirection */}
      <AitConfirmationModal
        visible={emailLimitPopupVisible}
        setVisible={setEmailLimitPopupVisible}
        description={
          <>
            <Paragraph>
              <Text>You have reached your limit for sending emails.</Text>
              <br />
              <Text>
                To send more emails, please purchase an additional email block.
              </Text>
            </Paragraph>
            <Paragraph>
              <Text strong>Note:</Text>{' '}
              <Text type="warning">
                Your current campaign will be saved as a draft
              </Text>{' '}
              while your purchase is in progress. You can resume it anytime once
              your email credits are updated.
            </Paragraph>
          </>
        }
        onConfirm={() => {
          handleFinalSubmit('draft', 'save_draft_from_email_limit');
        }}
        message={'Your email limit is over !'}
        confirmText={'Purchase now'}
        cancelText={'Cancel'}
        confirmButtonLoading={campaignState?.sendEmailLoading}
      />
      {/* daily Email limit over popup */}
      <AitConfirmationModal
        visible={dailyEmailLimitPopup}
        setVisible={setDailyEmailLimitPopup}
        description={
          'It seems your daily email sending limit is over. We are converting your send/schedule message in the draft message. Please contact the support team to increase the limit of emails.'
        }
        onConfirm={() => {
          setDailyEmailLimitPopup(false);
          setSummaryModalVisible(true);
        }}
        message={'Daily email limit is over !'}
        confirmText={'Ok'}
        cancelText={'Cancel'}
      />
      {/* suspicious email popup */}
      {campaignState?.checkActiveUserLimitSubscriptionApiState === 'error' && (
        <AitConfirmationModal
          visible={suspiciousEmailPopupVisible}
          setVisible={setSuspiciousEmailPopupVisible}
          description={campaignState?.checkActiveUserLimitSubscriptionerror}
          onConfirm={() => {
            handleFinalSubmit('draft', 'save_draft_from_suspecious_email');
          }}
          message={'Module has been suspended !'}
          confirmText={'Contact us'}
          cancelText={'Cancel'}
          confirmButtonLoading={campaignState?.sendEmailLoading}
        />
      )}

      <AitConfirmationModal
        visible={freePlanModalVisible}
        setVisible={setFreePlanModalVisible}
        description={
          'You have reached your limit of sending emails. Please upgrade to continue sending more messages.'
        }
        onConfirm={() => {
          handleFinalSubmit('draft', 'save_draft_from_free_plan');
        }}
        message={'Email limit over !'}
        confirmText={'Upgrade plan'}
        cancelText={'Cancel'}
        confirmButtonLoading={campaignState?.sendEmailLoading}
      />
    </LayoutContainer>
  );
});

export default CreateCampaignTemplateNew;
