import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { App, Col, Divider, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonWrapper, LeftSection, StyledCol } from './style';
import { Field, Form, Formik } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import moment from 'moment';
import {
  sendNowValidationSchema,
  validateFetchAudienceCounts,
} from '../../utils/validation';
import {
  checkActiveUserLimitSubscription,
  checkEmailSendLimit,
  fetchAudienceCount,
  getAiShopSetting,
  sendEmailCampaignApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  resetCustomerCount,
  setAudienceCountFilter,
} from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import {
  clearEmailMarketingCampaigns,
  sendTestEmailReset,
  setAiShopSettingFilters,
  setCheckActiveUserLimitSubscriptionFilters,
  setCheckEmailSendLimitFilters,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import CampaignSummaryModal from '../../molecules/campaign-summary-modal/campaignSummaryModal';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import { useRouter } from 'next/router';
import { getEmailSubject } from '../../utils/helper';
import CampaignDraftModal from '../../molecules/campaign-draft-modal/campaignDraftModal';
import AitBlockWrapper from '@/components/atoms/ait-block-wrapper/aitBlockWrapper';
import AitFieldWrapper from '@/components/atoms/ait-fiels-wrapper/AatFieldWrapper';
import SendTestModal from '../../molecules/send-test-modal/sendTestModal';
const { Title: AntTitle } = Typography;

const CreateCampaignLeftSection = forwardRef((props, ref) => {
  //variable & states
  const { setCampaignInitialData, actionType, handleTemplateModalVisible } =
    props;

  const dispatch = useDispatch();
  const router = useRouter();
  const isEditMode = !!router.query.id;
  const formikRef = useRef();
  const { notification } = App.useApp();

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    handleSendTestEmail,
    handleCreateAbTest: () => {
      const values = formikRef.current.values;

      handleCreateAbTest(values); // use latest formik values
    },
  }));

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '' } = userDetails || {};

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { emailCampaignData, campaignDetailsData } = campaignState;

  const formInitialState = {
    campaignName: isEditMode
      ? campaignDetailsData?.campaignInfo?.campaign_name || ''
      : `Email Campaign - ${moment().format('LLL')}`,

    EmailNotificationfromSubject: getEmailSubject({
      isEditMode,
      campaignDetailsData,
      templateDetailsById: campaignState?.templateDetailsById,
    }),

    shortcode: '',

    sendOption: isEditMode
      ? campaignDetailsData?.campaignInfo?.when_to_send || 'now'
      : 'now',

    whenToSend: isEditMode
      ? campaignDetailsData?.campaignInfo?.when_to_send || 'now'
      : 'now',

    include_lists: isEditMode
      ? campaignDetailsData?.campaignInfo?.include_lists
          ?.split(',')
          .filter(Boolean) || []
      : [],

    include_segments: isEditMode
      ? campaignDetailsData?.campaignInfo?.include_segments
          ?.split(',')
          .filter(Boolean) || []
      : [],

    exclude_lists: isEditMode
      ? campaignDetailsData?.campaignInfo?.exclude_lists
          ?.split(',')
          .filter(Boolean) || []
      : [],

    exclude_segments: isEditMode
      ? campaignDetailsData?.campaignInfo?.exclude_segments
          ?.split(',')
          .filter(Boolean) || []
      : [],
    EmailNotificationfromMsg: isEditMode
      ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
      : campaignState?.templateDetailsById?.email_html_code,

    emailNotificationfromName: isEditMode
      ? campaignDetailsData?.campaignInfo?.from_name ||
        emailCampaignData?.email_data?.from_name
      : emailCampaignData?.email_data?.from_name || '',

    emailNotificationfromReplyTo: isEditMode
      ? campaignDetailsData?.campaignInfo?.reply_to_email ||
        emailCampaignData?.email_data?.reply_to
      : emailCampaignData?.email_data?.reply_to || '',

    emailNotificationfromEmail: isEditMode
      ? campaignDetailsData?.campaignInfo?.from_email ||
        emailCampaignData?.email_data?.fromEmailBefore
      : emailCampaignData?.email_data?.fromEmailBefore || '',

    sentDate: isEditMode
      ? campaignDetailsData?.campaignInfo?.send_time || ''
      : '',

    utm_source: isEditMode
      ? campaignDetailsData?.campaignInfo?.utm_source || 'AiTrillion.com'
      : 'AiTrillion.com',

    utm_medium: isEditMode
      ? campaignDetailsData?.campaignInfo?.utm_medium || 'Marketing_Email'
      : 'Marketing_Email',

    utm_content: isEditMode
      ? campaignDetailsData?.campaignInfo?.utm_content || ''
      : '',

    utm_term: isEditMode
      ? campaignDetailsData?.campaignInfo?.utm_term || ''
      : '',

    utm_campaign: isEditMode
      ? campaignDetailsData?.campaignInfo?.utm_campaign ||
        `Email Campaign - ${moment().format('LLL')}`
      : `Email Campaign - ${moment().format('LLL')}`,

    customUtm: isEditMode
      ? campaignDetailsData?.campaignInfo?.customUtm === '1'
      : false,
  };

  const [shortcodeList, setShortcodeList] = useState([]);
  const [includeAudienceList, setIncludeAudienceList] = useState([]);
  const [includeSegmentList, setIncludeSegmentList] = useState([]);
  const [showExcludeAudience, setShowExcludeAudience] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [formData, setFormData] = useState(formInitialState);
  const [testEmail, setTestEmail] = useState('');
  const [draftModalVisible, setDraftModalVisible] = useState(false);

  useEffect(() => {
    if (formInitialState?.campaignName) {
      setCampaignInitialData(formInitialState);
    }
  }, [formInitialState?.campaignName]);
  // fetch audience when form is in the edit mode
  useEffect(() => {
    if (isEditMode && campaignDetailsData?.campaignInfo && formikRef.current) {
      const hasAudience =
        formikRef.current.values.include_lists?.length > 0 ||
        formikRef.current.values.include_segments?.length > 0;

      // Only trigger fetch if lists are present (to avoid premature validation)
      if (hasAudience) {
        const { values, validateForm, setFieldError } = formikRef.current;
        handleFetchAudienceCounts(values, validateForm, setFieldError);
      }
    }
  }, [
    isEditMode,
    campaignDetailsData,
    formikRef.current?.values.include_lists, // <-- Watch for value changes
    formikRef.current?.values.include_segments,
  ]);

  // load initial lists
  useEffect(() => {
    const {
      initCustomerApiState,
      createCampaignLists,
      audienceListApiState,
      audienceList,
      segmentListApiState,
      segmentList,
    } = campaignState;
    if (
      initCustomerApiState === 'success' &&
      createCampaignLists?.moduleFieldsRows.length > 0
    ) {
      const shortcodeOptions = createCampaignLists?.moduleFieldsRows?.map(
        (item) => ({
          label: item.field_name,
          value: item.id,
        })
      );
      setShortcodeList(shortcodeOptions);
    }

    if (audienceListApiState === 'success' && audienceList?.length > 0) {
      const includeAudienceList = audienceList?.map((item) => ({
        label: item.external_name,
        value: item.id,
      }));
      setIncludeAudienceList(includeAudienceList);
    }
    if (segmentListApiState === 'success' && segmentList?.length > 0) {
      const includeSegment = segmentList?.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setIncludeSegmentList(includeSegment);
    }
  }, [
    campaignState?.audienceListApiState,
    campaignState?.initCustomerApiState,
    campaignState?.segmentListApiState,
  ]);

  // send email states
  useEffect(() => {
    if (campaignState?.sendEmailApiState !== 'success') return;

    // 1. Handle A/B test in edit mode + draft
    if (
      isEditMode &&
      formData?.whenToSend === 'draft' &&
      campaignState?.sendEmailData?.is_created_ab_testing === 1
    ) {
      dispatch(sendTestEmailReset());
      router.push(
        `/email-marketing/campaign/${campaignState?.sendEmailData?.encoded_key_id}/createAB?fromEditMode=${isEditMode}`
      );
      return;
    }

    // 2. Handle draft save (non-A/B or new)
    if (formData?.whenToSend === 'draft') {
      setDraftModalVisible(false);
      dispatch(sendTestEmailReset());
      dispatch(clearEmailMarketingCampaigns());
      router.push('/email-marketing/campaign/list');
      return;
    }

    // 3. Handle pre-made template flow
    if (actionType === 'pre-made-template') {
      handleTemplateModalVisible(true);
      return;
    }

    // 4. Handle A/B test redirect (create new)
    if (campaignState?.sendEmailData?.is_created_ab_testing === 1) {
      dispatch(sendTestEmailReset());
      router.push(
        `/email-marketing/campaign/${campaignState?.sendEmailData?.encoded_key_id}/createAB`
      );
      return;
    }

    // 5. Default success case
    notification.success({
      message: campaignState?.sendEmailMessage,
    });
    setModalVisible(false);
    setSummaryModalVisible(false);
    dispatch(sendTestEmailReset());
    dispatch(clearEmailMarketingCampaigns());
    router.push('/email-marketing/campaign/list');
  }, [campaignState?.sendEmailApiState]);

  // Handle error separately
  useEffect(() => {
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
      if (campaignState?.aiShopSettingData?.is_email_verified === '1') {
        if (formData?.whenToSend === 'draft') {
          setDraftModalVisible(true);
        } else {
          setSummaryModalVisible(true);
        }
      }

      // add some other popup conditions and popup also

      // pending_work
    }

    if (campaignState?.aiShopSettingApiState === 'error') {
      notification.error({
        message: campaignState?.aiShopSettingError,
      });
    }
  }, [campaignState?.aiShopSettingApiState]);

  useEffect(() => {
    if (campaignState?.checkEmailSendLimitApiState === 'success') {
      const {
        is_enterprise_free_plan_notify,
        is_cross_monthly_email_limit,
        is_notify_email_limit,
      } = campaignState?.checkEmailSendLimitData;

      if (is_enterprise_free_plan_notify === 1) {
        //Show popup
        return;
      }

      if (is_cross_monthly_email_limit === 1) {
        return;
        // check logged in user conditions
      } else if (is_notify_email_limit === 1) {
        if (is_trial === 1) {
          return;
          //upgradeTrialEndPlan
        } else {
          return;
          //Daily email sending limit is over popup
          // confirm popup
        }
      } else {
        handleCheckSubscription();
      }
    }
  }, [campaignState?.checkEmailSendLimitApiState]);

  useEffect(() => {
    if (campaignState?.checkActiveUserLimitSubscriptionApiState === 'success') {
      const { is_card_declined, is_notify_customer } =
        campaignState?.checkActiveUserLimitSubscriptionData;
      if (is_card_declined) {
        return;
      } else if (is_notify_customer) {
        return;
      } else {
        handleFinalSubmit();
      }
    }
  }, [campaignState?.checkActiveUserLimitSubscriptionApiState]);

  const handleFinalSubmit = () => {
    const emailData = emailCampaignData?.email_data;
    const htmlCode = isEditMode
      ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
      : campaignState?.templateDetailsById?.email_html_code;

    const sendCampaignPayload = {
      EmailNotificationToEmail: formData?.testEmail,
      EmailNotificationfromEmail:
        emailData.fromEmailBefore + emailData.domain_name,
      EmailNotificationfromMsg: htmlCode,
      EmailNotificationfromName: emailData.from_name,
      EmailNotificationfromReplyTo: emailData.reply_to,
      EmailNotificationfromSubject: formData?.EmailNotificationfromSubject,
      EmailfromEmailAfter: emailData.domain_name,
      EmailfromEmailBefore: emailData.fromEmailBefore,
      act: 'insert_email_message_log',
      act_type: 'view_html',
      campaignName: formData?.campaignName,
      campaignTypeUpdateID: isEditMode ? 'edit' : '',
      couponWarningByferget: 0,
      create_act: 'new',
      include_lists: formData?.include_lists,
      include_segments: formData?.include_segments,
      exclude_lists: formData?.exclude_lists,
      exclude_segments: formData?.exclude_segments,
      is_ab_testing: 0,
      is_card_declined: 0,
      is_html_code: campaignState?.templateDetailsById?.is_html_code,
      is_new_template: campaignState?.templateDetailsById?.is_new_template,
      isnewtemplate: '0',
      masterFilter: [],
      masterMessageId: '',
      messageId: isEditMode ? router.query.id : '',
      messageUpdateID: isEditMode ? router.query.id : '',
      selectedCustomers: [],
      selectedOperatorType: 'and',
      selectedTimezone: '',
      sentDate: formData?.sentDate,
      shop_id: shop_id,
      templateUpdateID: '',
      timeZone: emailCampaignData?.timeZone,
      customUtm: formData?.customUtm === true ? '1' : '0',
      utm_campaign: formData?.customUtm ? formData?.utm_campaign : null,
      utm_content: formData?.customUtm ? formData?.utm_content : null,
      utm_medium: formData?.customUtm ? formData?.utm_medium : null,
      utm_source: formData?.customUtm ? formData?.utm_source : null,
      utm_term: formData?.customUtm ? formData?.utm_term : null,
      whenToSend: formData?.whenToSend,
    };

    dispatch(sendEmailCampaignApi(sendCampaignPayload));
  };

  const handleCreateAbTest = (values) => {
    setFormData(values);
    const emailData = emailCampaignData?.email_data;
    const htmlCode = isEditMode
      ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
      : campaignState?.templateDetailsById?.email_html_code;

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
      EmailNotificationToEmail: formData?.testEmail || '',
      EmailNotificationfromEmail:
        emailData.fromEmailBefore + emailData.domain_name,
      EmailNotificationfromMsg: htmlCode,
      EmailNotificationfromName: emailData.from_name,
      EmailNotificationfromReplyTo: emailData.reply_to,
      encodedData: emailData.reply_to,
      EmailNotificationfromSubject: values?.EmailNotificationfromSubject,
      EmailfromEmailAfter: emailData.domain_name,
      EmailfromEmailBefore: emailData.fromEmailBefore,
      act: 'insert_email_message_log',
      act_type: 'view_html',
      act_type2: 'campaign_ab_test',
      campaignName: formData?.campaignName,
      campaignTypeUpdateID: isEditMode ? 'edit' : '',
      couponWarningByferget: 0,
      is_ab_testing: 1,
      is_html_code: 0,
      email_html_code: campaignState?.templateDetailsById?.is_html_code,
      is_new_template: '0',
      isnewtemplate: '0',
      masterFilter: [],
      //when  template choose from modal so need to send template Id in this masterMessageId key !important
      masterMessageId: campaignState?.templateDetailsById?.id,
      //when template choose from pre made template so need to send those template id with in the messageId key !important
      messageId: isEditMode ? router.query.id : '',
      messageUpdateID: isEditMode ? router.query.id : '',
      page_action: 'dummey_campaign',
      selectedCustomers: [],
      selectedOperatorType: 'and',
      selectedTimezone: '', //this will be done after token login_auth
      sentDate: formData?.sentDate,
      // shop_id: shop_id,
      templateUpdateID: '',
      template_id: '',
      timeZone: emailCampaignData?.timeZone,
      customUtm: formData?.customUtm === true ? '1' : '0',
      utm_campaign: formData?.customUtm ? formData?.utm_campaign : null,
      utm_content: formData?.customUtm ? formData?.utm_content : null,
      utm_medium: formData?.customUtm ? formData?.utm_medium : null,
      utm_source: formData?.customUtm ? formData?.utm_source : null,
      utm_term: formData?.customUtm ? formData?.utm_term : null,
      whenToSend: 'draft',
    };

    dispatch(sendEmailCampaignApi(createAbPayload));
  };
  const handleCheckSubscription = () => {
    const payload = {};
    [
      'include_lists',
      'include_segments',
      'exclude_lists',
      'exclude_segments',
    ].forEach((key) => {
      if (formData[key]?.length > 0) {
        payload[key] = formData[key];
      }
    });

    dispatch(setCheckActiveUserLimitSubscriptionFilters(payload));

    dispatch(checkActiveUserLimitSubscription());
  };

  // const handleFetchAudienceCounts = async (
  //   values,
  //   validateForm,
  //   setFieldError,
  //   includeAudienceList,
  //   includeSegmentList
  // ) => {
  //   // Run Formik-level validation
  //   await validateForm();

  //   // Run custom fetch validation
  //   const fetchErrors = validateFetchAudienceCounts(
  //     values,
  //     includeAudienceList,
  //     includeSegmentList
  //   );

  //   if (Object.keys(fetchErrors).length > 0) {
  //     // Set Formik field errors so they reflect in the UI
  //     Object.entries(fetchErrors).forEach(([field, message]) => {
  //       setFieldError(field, message);
  //     });

  //     return;
  //   }

  //   // Only include non-empty keys you care about
  //   const payload = {};
  //   [
  //     'include_lists',
  //     'include_segments',
  //     'exclude_lists',
  //     'exclude_segments',
  //   ].forEach((key) => {
  //     if (values[key]?.length > 0) {
  //       payload[key] = values[key];
  //     }
  //   });

  //   // Dispatch only changed keys; others remain from default
  //   dispatch(setAudienceCountFilter(payload));
  //   dispatch(fetchAudienceCount());
  // };

  const handleFetchAudienceCounts = async (
    values,
    validateForm,
    setFieldError,
    includeAudienceList,
    includeSegmentList
  ) => {
    await validateForm();

    const fetchErrors = validateFetchAudienceCounts(
      values,
      includeAudienceList,
      includeSegmentList
    );

    if (Object.keys(fetchErrors).length > 0) {
      Object.entries(fetchErrors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
      return;
    }

    // Only include relevant keys
    const payload = {};
    [
      'include_lists',
      'include_segments',
      'exclude_lists',
      'exclude_segments',
    ].forEach((key) => {
      if (values[key]?.length > 0) {
        payload[key] = values[key];
      }
    });

    // Add required static payload props (if needed by API)
    payload.act = 'get_customers_count';
    payload.act_module = 'email';
    payload.returnType = 'count';

    // ⚠️ Don't update `audienceCountFilter` Redux state — just fetch
    dispatch(fetchAudienceCount(payload));
  };

  const handleCliearAudienceFilter = (setFieldValue) => {
    setFieldValue('include_lists', []);
    setFieldValue('include_segments', []);
    setFieldValue('exclude_lists', []);
    setFieldValue('exclude_segments', []);
    dispatch(resetCustomerCount());
  };

  const handleSendTestEmailModalOpen = (values, setFieldError) => {
    if (values.EmailNotificationfromSubject) {
      setModalVisible(true);
      setFormData(values);
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

  const htmlCode = isEditMode
    ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
    : campaignState?.templateDetailsById?.email_html_code;

  const handleSendTestEmail = () => {
    const payload = {
      EmailNotificationToEmail: testEmail,
      EmailNotificationfromEmail:
        emailCampaignData?.email_data?.fromEmailBefore +
        emailCampaignData?.email_data?.domain_name,
      EmailNotificationfromMsg: htmlCode,
      EmailNotificationfromName: emailCampaignData?.email_data?.from_name,
      EmailNotificationfromReplyTo: emailCampaignData?.email_data?.reply_to,
      EmailNotificationfromSubject: formData?.EmailNotificationfromSubject,
      EmailfromEmailAfter: emailCampaignData?.email_data?.domain_name,
      EmailfromEmailBefore: emailCampaignData?.email_data?.fromEmailBefore,
      act:
        actionType === 'pre-made-template'
          ? 'insert_email_message_log'
          : 'send_test_mail_notification',
      act_type: 'need_to_select',
      campaignName: formData.campaignName,
      email_html_code: '',
      encodedData: emailCampaignData?.email_data?.reply_to,
      is_ab_testing: 0,
      is_html_code: 0,
      is_new_template: '1',
      isnewtemplate: '1',
      selectedTimezone: '',
      sentDate: '',
      timezone: emailCampaignData?.timeZone,
      whenToSend:
        actionType === 'pre-made-template' ? 'draft' : formData?.whenToSend,
      page_action: actionType === 'pre-made-template' ? 'dummey_campaign' : '',
    };
    dispatch(sendEmailCampaignApi(payload));
  };

  const handleSendNowSubmit = (values) => {
    // Extract external values
    const emailData = emailCampaignData?.email_data;
    const htmlCode = isEditMode
      ? campaignState?.campaignDetailsData?.campaignInfo?.email_content
      : campaignState?.templateDetailsById?.email_html_code;

    setFormData(values);
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

    if (
      !getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers?.length
    ) {
      notification.error({
        message: 'Missing Audience count',
        description: 'Audience can not be Zero.',
      });
      return;
    }

    // If all checks pass

    dispatch(setAiShopSettingFilters({ shop_id: shop_id }));
    dispatch(getAiShopSetting());
  };

  const handleSummaryModalSendClick = () => {
    dispatch(
      setCheckEmailSendLimitFilters({
        totalEmailSubscribers:
          getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers,
        whenToSend: formData?.whenToSend,
        selectedTimezone: '', // this will be getting from the login Auth after decoding the token
      })
    );
    dispatch(checkEmailSendLimit());
  };

  return (
    <>
      <LeftSection>
        <AitBlockWrapper padding="0px 25px 10px 25px">
          <Row gutter={16}>
            <Col span={24}>
              <AntTitle
                level={3}
              >{`${isEditMode ? `Edit` : `Create`} email campaign`}</AntTitle>
            </Col>
          </Row>
        </AitBlockWrapper>

        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={formInitialState}
          validationSchema={sendNowValidationSchema}
          onSubmit={(values) => {
            handleSendNowSubmit(values);
          }}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            validateForm,
            setFieldError,
          }) => {
            return (
              <Form>
                {/* <Title level={4}>Create Email Campaign</Title> */}
                <AitBlockWrapper padding="0px 25px 10px 25px">
                  <Row gutter={16}>
                    <Col span={24}>
                      <AitFieldWrapper>
                        <Field
                          as={AitInputBox}
                          name="campaignName"
                          label="Campaign name"
                          values={values.campaignName}
                          onChange={(e) => {
                            setFieldValue('campaignName', e.target.value);
                            setCampaignInitialData({
                              ...formData,
                              campaignName: e.target.value,
                            });
                          }}
                          placeholder="Enter campaign name"
                          required
                          error={touched.campaignName && !!errors.campaignName}
                          errorMessage={errors.campaignName}
                        />
                      </AitFieldWrapper>
                    </Col>

                    <Col span={24}>
                      <AitFieldWrapper>
                        <Field
                          as={AitInputBox}
                          name="EmailNotificationfromSubject"
                          label="Subject"
                          values={values.EmailNotificationfromSubject}
                          onChange={(e) =>
                            setFieldValue(
                              'EmailNotificationfromSubject',
                              e.target.value
                            )
                          }
                          placeholder="Subject"
                          required
                          error={Boolean(errors.EmailNotificationfromSubject)}
                          errorMessage={
                            errors.EmailNotificationfromSubject || ''
                          }
                        />
                      </AitFieldWrapper>
                    </Col>
                    <Col span={24}>
                      <AitFieldWrapper margin="0px 0px 10px 0px">
                        <Field
                          as={AitSelectBox}
                          name="shortcode"
                          label="Shortcode"
                          placeholder="Select shortcode"
                          value={values.shortcode}
                          onChange={(value) =>
                            setFieldValue('shortcode', value)
                          }
                          options={shortcodeList}
                          error={touched.shortcode && !!errors.shortcode}
                          errorMessage={errors.shortcode}
                        />
                      </AitFieldWrapper>
                    </Col>
                    {values?.shortcode && (
                      <Col span={24}>
                        <AitFieldWrapper margin="0px 0px 10px 0px">
                          <Field name="shortcode">
                            {() => {
                              const label =
                                shortcodeList.find(
                                  (item) => item.value === values.shortcode
                                )?.label || '';

                              return (
                                <AitInputBox
                                  disabled
                                  value={`{{${label}}}`}
                                  suffix={
                                    <Tooltip title="Copy">
                                      <CopyOutlined
                                        onClick={() => {
                                          navigator.clipboard.writeText(label);
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                          color: '#000', // Ant Design primary blue
                                          fontSize: '18px', // Slightly bigger
                                          transition: 'color 0.3s',
                                        }}
                                      />
                                    </Tooltip>
                                  }
                                />
                              );
                            }}
                          </Field>
                        </AitFieldWrapper>
                      </Col>
                    )}
                  </Row>
                </AitBlockWrapper>
                <AitCollapse
                  itemHeaderPadding="15px 25px"
                  itemBodyPadding="0px 0px 0px 0px"
                  defaultActiveKey={['1', '2', '3']}
                  minimumCustomerCount={0}
                  itemSpacing="0px"
                  firstItemTopspacing="0px"
                  collapseIconTopSpacing="0px"
                  headerLeftRightTopSpacing="0px"
                  bodyBorderTop="none"
                  panels={[
                    {
                      key: '1',
                      title: 'Target audience',
                      extra: (
                        <>
                          {getAudienceCountState?.fetchAudienceLoading ? (
                            <Spin />
                          ) : getAudienceCountState?.fetchAudienceCountApiState ===
                            'success' ? (
                            `${getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers} customers`
                          ) : null}
                        </>
                      ),
                      children: (
                        <AitBlockWrapper padding="0px 25px">
                          <Row gutter={[16]}>
                            <StyledCol span={24}>
                              <AitFieldWrapper margin="0px 0px 10px 0px">
                                <Field
                                  as={AitAutocomplete}
                                  name="include_lists"
                                  label="Include audience"
                                  value={values.include_lists}
                                  onChange={(value) => {
                                    setFieldValue('include_lists', value);
                                  }}
                                  labelIcon={<InfoCircleOutlined />}
                                  tooltipText="Exclude audience would not work If you will select In the case of selecting  all active customers will include."
                                  options={includeAudienceList}
                                  error={Boolean(errors.include_lists)}
                                  errorMessage={errors.include_lists || ''}
                                />
                              </AitFieldWrapper>
                            </StyledCol>
                            <Col span={24}>
                              <AitFieldWrapper>
                                <Field
                                  as={AitAutocomplete}
                                  name="include_segments"
                                  placeholder="Choose segments"
                                  value={values.include_segments}
                                  onChange={(value) =>
                                    setFieldValue('include_segments', value)
                                  }
                                  options={includeSegmentList}
                                  error={Boolean(errors.include_segments)}
                                  errorMessage={errors.include_segments || ''}
                                />
                              </AitFieldWrapper>
                            </Col>

                            <Divider
                              plain
                              orientation="center"
                              style={{
                                borderTopStyle: 'solid',
                                borderTopColor: '#d9d9d9',
                                margin: '10px 0px 20px 0px',
                              }}
                            >
                              <Tag
                                color="blue"
                                style={{
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  padding: '4px 12px',
                                  marginInlineEnd: '0px',
                                }}
                                onClick={() =>
                                  setShowExcludeAudience((prev) => !prev)
                                }
                              >
                                + Exclude audience (optional)
                              </Tag>
                            </Divider>

                            {showExcludeAudience && (
                              <>
                                <Col span={24}>
                                  <AitFieldWrapper margin="0px 0px 10px 0px">
                                    <Field
                                      as={AitAutocomplete}
                                      name="exclude_lists"
                                      label="Exclude audience"
                                      placeholder="Choose list"
                                      value={values.exclude_lists}
                                      onChange={(value) =>
                                        setFieldValue('exclude_lists', value)
                                      }
                                      options={includeAudienceList}
                                      error={Boolean(errors.exclude_lists)}
                                      errorMessage={errors.exclude_lists || ''}
                                    />
                                  </AitFieldWrapper>
                                </Col>
                                <Col span={24}>
                                  <AitFieldWrapper>
                                    <Field
                                      as={AitAutocomplete}
                                      name="exclude_segments"
                                      placeholder="Choose segment"
                                      value={values.exclude_segments}
                                      onChange={(value) =>
                                        setFieldValue('exclude_segments', value)
                                      }
                                      options={includeSegmentList}
                                      error={Boolean(errors.exclude_segments)}
                                      errorMessage={
                                        errors.exclude_segments || ''
                                      }
                                    />
                                  </AitFieldWrapper>
                                </Col>
                              </>
                            )}

                            <Col span={24}>
                              <Row gutter={16}>
                                <Col span={12}>
                                  <AitFieldWrapper>
                                    <AitButton
                                      title="Fetch audience"
                                      htmlType="button"
                                      type="primary"
                                      onClick={() => {
                                        handleFetchAudienceCounts(
                                          values,
                                          validateForm,
                                          setFieldError
                                        );
                                      }}
                                      loading={
                                        getAudienceCountState?.fetchAudienceCountApiState ===
                                        'pending'
                                      }
                                      style={{ width: '100%' }}
                                    />
                                  </AitFieldWrapper>
                                </Col>
                                <Col span={12}>
                                  <AitButton
                                    variant="outlined"
                                    color="primary"
                                    title="Clear"
                                    onClick={() => {
                                      handleCliearAudienceFilter(setFieldValue);
                                    }}
                                    style={{ width: '100%' }}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </AitBlockWrapper>
                      ),
                    },
                    {
                      key: '2',
                      title: 'Email settings',
                      // extra: 'Updated',
                      children: (
                        <AitBlockWrapper padding="0px 25px">
                          <Row gutter={16}>
                            <Col span={24}>
                              <AitFieldWrapper>
                                <Field
                                  as={AitInputBox}
                                  addonAfter={
                                    emailCampaignData?.email_data?.domain_name
                                  }
                                  value={values.emailNotificationfromEmail}
                                  name="emailNotificationfromEmail"
                                  label="Sender's email address"
                                  placeholder="Email address"
                                  error={
                                    touched.emailNotificationfromEmail &&
                                    !!errors.emailNotificationfromEmail
                                  }
                                  errorMessage={
                                    errors.emailNotificationfromEmail
                                  }
                                />
                              </AitFieldWrapper>
                            </Col>

                            <Col span={24}>
                              <AitFieldWrapper>
                                <Field
                                  as={AitInputBox}
                                  name="emailNotificationfromName"
                                  label="Sender's name"
                                  placeholder="Enter Sender's name"
                                  value={values.emailNotificationfromName}
                                  error={
                                    touched.emailNotificationfromName &&
                                    !!errors.emailNotificationfromName
                                  }
                                  errorMessage={
                                    errors.emailNotificationfromName
                                  }
                                />
                              </AitFieldWrapper>
                            </Col>
                            <Col span={24}>
                              <AitFieldWrapper>
                                <Field
                                  as={AitInputBox}
                                  name="emailNotificationfromReplyTo"
                                  value={values.emailNotificationfromReplyTo}
                                  required
                                  label="Reply to email*"
                                  placeholder="Enter Reply to email*"
                                  error={
                                    touched.emailNotificationfromReplyTo &&
                                    !!errors.emailNotificationfromReplyTo
                                  }
                                  errorMessage={
                                    errors.emailNotificationfromReplyTo
                                  }
                                />
                              </AitFieldWrapper>
                            </Col>
                          </Row>
                        </AitBlockWrapper>
                      ),
                    },
                    {
                      key: '3',
                      title: 'When to send',
                      // extra: 'Updated',
                      children: (
                        <AitBlockWrapper padding="0px 25px">
                          <AitRadioButton
                            name="whenToSend"
                            className="vertical"
                            value={values.whenToSend}
                            onChange={(e) =>
                              setFieldValue('whenToSend', e.target.value)
                            }
                            options={[
                              { label: 'Send now', value: 'now' },
                              { label: 'Schedule', value: 'scheduled' },
                              { label: 'Keep in draft', value: 'draft' },
                            ]}
                          />
                          {values?.whenToSend === 'scheduled' && (
                            <Row gutter={16}>
                              <Col span={24}>
                                <AitFieldWrapper>
                                  <Field
                                    as={AitDatePicker}
                                    label="Select date"
                                    name="sentDate"
                                    format="MM/DD/YYYY h:mm A"
                                    showTime={{ format: 'h:mm A' }}
                                    value={values.sentDate}
                                    onChange={(e) => {
                                      setFieldValue('sentDate', e); // Fixed here
                                    }}
                                    placeholder="mm-dd-yyyy"
                                    style={{ height: 40 }}
                                  />
                                </AitFieldWrapper>
                              </Col>

                              <Col span={24}>
                                <AitFieldWrapper>
                                  <Field
                                    as={AitSelectBox}
                                    name="timeZone"
                                    label="Select time zone"
                                    placeholder="Select time zone"
                                    value={values.timeZone}
                                    error={
                                      touched.timeZone && !!errors.timeZone
                                    }
                                    errorMessage={errors.timeZone}
                                  />
                                </AitFieldWrapper>
                              </Col>
                            </Row>
                          )}
                        </AitBlockWrapper>
                      ),
                    },
                  ]}
                />
                <AitBlockWrapper padding="0px 25px">
                  <AitCheckboxButton
                    name="customUtm"
                    label="Custom UTM parameters"
                    value={values.customUtm}
                    onChange={(e) =>
                      setFieldValue('customUtm', e.target.checked)
                    }
                    error={touched.customUtm && Boolean(errors.customUtm)}
                    errorMessage={touched.customUtm && errors.customUtm}
                  />
                  {values?.customUtm && (
                    <Row gutter={16}>
                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitInputBox}
                            name="utm_source"
                            label="UTM source "
                            values={values.utm_source}
                            placeholder="Enter UTM source"
                            onChange={(e) =>
                              setFieldValue('utm_source', e.target.value)
                            }
                            required
                            error={touched.utm_source && !!errors.utm_source}
                            errorMessage={errors.utm_source}
                          />
                        </AitFieldWrapper>
                      </Col>

                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitInputBox}
                            name="utm_medium"
                            label="UTM medium"
                            values={values.utm_medium}
                            onChange={(e) =>
                              setFieldValue('utm_medium', e.target.value)
                            }
                            placeholder="Enter UTM medium"
                            required
                            error={touched.utm_medium && !!errors.utm_medium}
                            errorMessage={errors.utm_medium}
                          />
                        </AitFieldWrapper>
                      </Col>

                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitInputBox}
                            name="utm_campaign"
                            label="UTM campaign"
                            values={values.utm_campaign}
                            placeholder="Enter UTM campaign"
                            onChange={(e) =>
                              setFieldValue('utm_campaign', e.target.value)
                            }
                            required
                            error={
                              touched.utm_campaign && !!errors.utm_campaign
                            }
                            errorMessage={errors.utm_campaign}
                          />
                        </AitFieldWrapper>
                      </Col>
                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitInputBox}
                            name="utm_term"
                            label="UTM term"
                            values={values.utm_term}
                            placeholder="Enter UTM term"
                            onChange={(e) =>
                              setFieldValue('utm_term', e.target.value)
                            }
                            error={touched.utm_term && !!errors.utm_term}
                            errorMessage={errors.utm_term}
                          />
                        </AitFieldWrapper>
                      </Col>
                      <Col span={24}>
                        <AitFieldWrapper>
                          <Field
                            as={AitInputBox}
                            name="utm_content"
                            label="UTM content"
                            onChange={(e) =>
                              setFieldValue('utm_content', e.target.value)
                            }
                            values={values.utm_content}
                            placeholder="Enter UTM content"
                            error={touched.utm_content && !!errors.utm_content}
                            errorMessage={errors.utm_content}
                          />
                        </AitFieldWrapper>
                      </Col>
                    </Row>
                  )}
                </AitBlockWrapper>
                <AitBlockWrapper padding="0px 25px 25px">
                  <Row gutter={[0, 10]}>
                    <Col span={24}>
                      <AitFieldWrapper margin="0px">
                        <AitButton
                          htmlType="button"
                          variant="outlined"
                          color="primary"
                          title="Send a test message"
                          onClick={() => {
                            handleSendTestEmailModalOpen(values, setFieldError);
                          }}
                          style={{
                            width: '100%',
                            color: '#1A73E8',
                            fontWeight: 500,
                          }}
                        />
                      </AitFieldWrapper>
                    </Col>
                    <Col span={24}>
                      <AitButton
                        variant="outlined"
                        color="primary"
                        htmlType="button"
                        title="Create A/B test"
                        rightTagLabel="NEW"
                        rightTagColor="#e3fbf1"
                        style={{
                          width: '100%',
                        }}
                        loading={campaignState?.sendEmailLoading}
                        onClick={() => {
                          handleCreateAbTest(values);
                        }}
                      />
                    </Col>
                    <Col span={24}>
                      <AitButton
                        htmlType="submit"
                        title={
                          values?.whenToSend === 'draft'
                            ? 'Save draft'
                            : 'Send now'
                        }
                        type="primary"
                        loading={
                          campaignState?.aiShopSettingApiState === 'pending'
                        }
                        style={{ width: '100%' }}
                      />
                    </Col>
                  </Row>
                </AitBlockWrapper>
              </Form>
            );
          }}
        </Formik>
      </LeftSection>

      <SendTestModal
        visible={modalVisible}
        setVisible={setModalVisible}
        handleSendTestEmail={handleSendTestEmail}
        setEmailValue={(value) => {
          setTestEmail(value);
        }}
      />

      <CampaignSummaryModal
        visible={summaryModalVisible}
        setVisible={() => setSummaryModalVisible(false)}
        formData={formData}
        handleSummaryModalSendClick={handleSummaryModalSendClick}
      />

      <CampaignDraftModal
        visible={draftModalVisible}
        setVisible={setDraftModalVisible}
        saveAsDraftClick={() => {
          handleFinalSubmit();
        }}
      />
    </>
  );
});

export default CreateCampaignLeftSection;
