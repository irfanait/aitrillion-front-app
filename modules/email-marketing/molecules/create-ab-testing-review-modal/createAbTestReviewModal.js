import React, { useEffect, useRef, useState } from 'react';
import { Typography, Card, App } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import {
  Bold,
  Container,
  FooterButtons,
  HorizontalLine,
  Section,
} from './style';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import {
  checkActiveUserLimitSubscription,
  checkEmailSendLimit,
  endTrialApi,
  sendEmailCampaignApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import {
  sendEmailCreateAbReset,
  setCheckActiveUserLimitSubscriptionFilters,
  setCheckEmailSendLimitFilters,
  setCurrentEmailAct,
} from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import Link from 'next/link';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { reviewModalValidationSchema } from '../../utils/validation';
import {
  disablePastDate,
  disablePastTime,
  winByOptions,
} from '../../utils/helper';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const { Title, Paragraph, Text } = Typography;

const CreateAbTestReviewModal = (props) => {
  const { visible, setVisible, formData = {}, distriutionCounts = {} } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  const { notification } = App.useApp();

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { login_auth } = useSelector((state) => state.jwtState);

  const {
    createAbDecodedData,
    segmentList,
    audienceList,
    sendEmailLoading,
    checkEmailSendLimitLoading,
  } = campaignState;

  const [
    subscriptionPlanTypePopupVisible,
    setSubscriptionPlanTypePopupVisible,
  ] = useState(false);

  const [emailLimitPopupVisible, setEmailLimitPopupVisible] = useState(false);
  const [endTrialPopupVisible, setEndTrialPopupVisible] = useState(false);
  const [dailyEmailLimitPopup, setDailyEmailLimitPopup] = useState(false);
  const [isFormikReady, setIsFormikReady] = useState(false);
  const [suspiciousEmailPopupVisible, setSuspiciousEmailPopupVisible] =
    useState(false);

  const totalSubscribers =
    getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers || 10;
  const includedListIds = formData?.include_lists || [];
  const includedSegmentIds = formData?.include_segments || [];
  const excludedListIds = formData?.exclude_lists || [];
  const excludedSegmentIds = formData?.exclude_segments || [];

  const includedAudienceTitles = audienceList
    ?.filter((item) => includedListIds.includes(item.id))
    .map((item) => item.title);

  const includedSegmentTitles = segmentList
    ?.filter((item) => includedSegmentIds.includes(item.id))
    .map((item) => item.title);

  const excludedAudienceTitles = audienceList
    ?.filter((item) => excludedListIds.includes(item.id))
    .map((item) => item.title);

  const excludedSegmentTitles = segmentList
    ?.filter((item) => excludedSegmentIds.includes(item.id))
    .map((item) => item.title);

  const [updatedFormData, setUpdatedFormData] = useState({});

  const modalInitialState = {
    act_type: 'content_setting',
    act: 'update_abtesting_datetime_message',

    ...formData,

    variantA: {
      ...formData?.variantA,
    },
    variantB: {
      ...formData?.variantB,
    },

    whenToSend: formData?.whenToSend || 'draft',
    when_to_send: formData?.when_to_send || 'draft',
    // sentDate: formData?.send_time
    //   ? dayjs.tz(
    //       formData.send_time,
    //       'YYYY-MM-DD hh:mm A', // matches API format
    //       formData?.selectedTimezone || 'UTC' // convert into selected timezone
    //     )
    //   : null,

    // sentDate: formData?.send_time
    //   ? dayjs
    //       .utc(formData.send_time, 'YYYY-MM-DD HH:mm:ss')
    //       .tz(formData?.selectedTimezone || 'UTC')
    //   : null,
    selectedTimezone: formData?.selectedTimezone || 'UTC',
    // send_time: formData?.send_time
    //   ? dayjs.tz(
    //       formData.send_time,
    //       'YYYY-MM-DD hh:mm A', // matches API format
    //       formData?.selectedTimezone || 'UTC' // convert into selected timezone
    //     )
    //   : null,

    sentDate: formData?.send_time
      ? dayjs(formData.send_time, 'YYYY-MM-DD hh:mm A')
      : null,

    send_time: formData?.send_time || '',
    abtesting_win_percentage_total_recepient: distriutionCounts?.totalCustomers,
    abtesting_win_percentage_a_total_recepient:
      distriutionCounts?.versionACount,
    abtesting_win_percentage_b_total_recepient:
      distriutionCounts?.versionBCount,
    abtesting_win_percentage_ab: distriutionCounts?.winnerPercent,
    selectedCustomers: [],
    include_lists_selected_text: includedAudienceTitles || '',
    include_segments_selected_text: includedSegmentTitles || '',
    exclude_lists_selected_text: excludedAudienceTitles || '',
    exclude_segments_selected_text: excludedSegmentTitles || '',
  };

  useEffect(() => {
    if (formikRef.current?.values) {
      setIsFormikReady(true);
    }
  }, [formikRef.current?.values]); // This gets triggered only after Formik initializes

  useEffect(() => {
    const { sendEmailApiState, sendEmailData, currentEmailAct } = campaignState;

    if (sendEmailApiState === 'success') {
      if (sendEmailData?.encoded_key_id) {
        // 🎯 Handle special act first
        if (currentEmailAct === 'save_draft_from_email_limit') {
          notification.success({
            message:
              'Campaign has been saved as a draft. Redirecting you shortly to complete your purchase.',
          });
          setTimeout(() => {
            setEmailLimitPopupVisible(false);
            dispatch(sendEmailCreateAbReset());
            router.push('/email-marketing/campaign/list');
            window.open(
              `${process.env.NEXT_PUBLIC_APP_URL}/billing#/activePlan`,
              '_blank',
              'noopener,noreferrer'
            );
          }, 2000);
          return;
        }

        if (currentEmailAct === 'save_draft_from_suspecious_email') {
          notification.success({
            message:
              'Campaign has been saved as a draft. Redirecting you shortly to contact us.',
          });
          setSuspiciousEmailPopupVisible(true);

          setTimeout(() => {
            router.push('/email-marketing/campaign/list'); // immediate navigation
            window.open(
              `${process.env.NEXT_PUBLIC_APP_URL}/index/support`,
              '_blank',
              'noopener,noreferrer'
            );
          }, 2000);
        }

        // ✅ General success case
        notification.success({
          message: sendEmailApiState,
          description: sendEmailData?.msg,
        });
        setVisible(false);
        dispatch(sendEmailCreateAbReset());
        setEmailLimitPopupVisible(false);
        router.push('/email-marketing/campaign/list');
      } else {
        setVisible(true);
        setEmailLimitPopupVisible(false);
        dispatch(sendEmailCreateAbReset());
      }
    }

    if (sendEmailApiState === 'error') {
      notification.error({
        message: sendEmailApiState || 'error',
        description: sendEmailData?.msg || 'error',
      });
      dispatch(sendEmailCreateAbReset());
    }
  }, [campaignState?.sendEmailApiState]);

  useEffect(() => {
    if (campaignState?.checkEmailSendLimitApiState !== 'success') return;

    const {
      is_enterprise_free_plan_notify,
      is_cross_monthly_email_limit,
      is_notify_email_limit,
      is_trial,
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

    dispatch(setCurrentEmailAct('update_abtesting_datetime_message'));

    // Default fallback if none of the above triggered
    handleCheckSubscription();
  }, [campaignState?.checkEmailSendLimitApiState]);

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
      })
    );

    dispatch(checkActiveUserLimitSubscription());
  };
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
        handleModalSubmit(
          formikRef?.current?.whenToSend,
          'update_abtesting_datetime_message',
          updatedFormData
        );
      }
    }

    if (campaignState?.checkActiveUserLimitSubscriptionApiState === 'error') {
      setSummaryModalVisible(false);
      setSuspiciousEmailPopupVisible(true);
    }
  }, [campaignState?.checkActiveUserLimitSubscriptionApiState]);

  const determineActValue = (forcedAct, campaignState, whenToSendValue) => {
    if (forcedAct) return forcedAct;
    if (
      [
        'save_draft_from_suspecious_email',
        'update_abtesting_datetime_message',
        'save_draft_from_suspecious_email',
      ].includes(campaignState?.currentEmailAct)
    ) {
      return campaignState?.currentEmailAct;
    }
    return whenToSendValue === 'draft'
      ? 'update_abtesting_message'
      : 'update_abtesting_message';
  };

  const handleModalSubmit = (forcedWhenToSend, forcedAct, values) => {
    // if (!isFormikReady) return; // Don't run if Formik not ready

    const whenToSendValue = forcedWhenToSend ?? values?.when_to_send;
    const actValue = determineActValue(
      forcedAct,
      campaignState,
      whenToSendValue
    );

    dispatch(setCurrentEmailAct(actValue));

    const payload = {
      ...values,
      variantA: {
        ...values?.variantA,
        when_to_send: whenToSendValue,
        email_subject: values?.variantA?.EmailNotificationfromSubject,
        from_name: values?.variantA?.emailNotificationfromName,
        from_email: values?.variantA?.emailNotificationfromEmail,
        reply_to_email: values?.variantA?.emailNotificationfromReplyTo,
        include_lists: values?.variantA?.include_lists,
        exclude_lists: values?.variantA?.exclude_lists,
        include_segments: values?.variantA?.include_segments,
        exclude_segments: values?.variantA?.exclude_segments,
      },
      variantB: {
        ...values?.variantB,
        when_to_send: whenToSendValue,
        email_subject: values?.variantB?.EmailNotificationfromSubject,
        from_name: values?.variantA?.emailNotificationfromName,
        from_email: values?.variantB?.emailNotificationfromEmail,
        reply_to_email: values?.variantB?.emailNotificationfromReplyTo,
        include_lists: values?.variantB?.include_lists,
        exclude_lists: values?.variantB?.exclude_lists,
        include_segments: values?.variantB?.include_segments,
        exclude_segments: values?.variantB?.exclude_segments,
      },
      when_to_send: whenToSendValue,
      whenToSend: whenToSendValue,
      sentDate: values.sentDate
        ? dayjs(values.sentDate).format('YYYY-MM-DD hh:mm A')
        : null,

      send_time: values.sentDate
        ? dayjs(values.sentDate).format('YYYY-MM-DD hh:mm A')
        : null,

      act_type: 'content_setting',
      act: 'update_abtesting_datetime_message',
    };

    dispatch(sendEmailCampaignApi(payload));
  };

  const handleCheckSendEmailLimit = (values) => {
    dispatch(
      setCheckEmailSendLimitFilters({
        totalEmailSubscribers: totalSubscribers,
        messageId: values?.messageId,
        whenToSend: values?.whenToSend,
        selectedTimezone: '', // this will be getting from the login Auth after decoding the token
      })
    );
    dispatch(checkEmailSendLimit());
  };

  const handleEndTrial = () => {
    const payload = {
      act: 'end_trial_period',
    };
    dispatch(endTrialApi(payload));
  };

  return (
    <AitModal
      title="Review and confirm"
      width={1000}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      setVisible={() => setVisible(false)}
    >
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={modalInitialState}
        validationSchema={reviewModalValidationSchema}
        onSubmit={(values) => {
          if (values?.when_to_send === 'now') {
            setUpdatedFormData(values);
            handleCheckSendEmailLimit(values);
          } else {
            handleModalSubmit(
              values?.when_to_send,
              'update_abtesting_message',
              values
            );
          }
        }}
      >
        {({ values, setFieldValue, errors, touched }) => {
          return (
            <Form>
              <Container>
                <Card bordered={false}>
                  {/* Campaign Info */}
                  <Section>
                    <Title level={5}>Campaign information</Title>
                    <Text type="primary">
                      <Bold>Version A:</Bold>
                      <br />
                      <Bold>Subject:</Bold>{' '}
                      <>{values?.variantA?.EmailNotificationfromSubject}</>
                      <br />
                      <Text type="secondary">
                        {values?.variantA?.emailNotificationfromName}
                      </Text>{' '}
                      <Text type="secondary">
                        &lt;
                        {values?.variantA?.emailNotificationfromEmail}
                        &gt;
                      </Text>
                    </Text>
                    <br />
                    <br />
                    <Text type="primary">
                      <Bold>Version B:</Bold>
                      <br />
                      <Bold>Subject:</Bold>{' '}
                      <>{values?.variantB?.EmailNotificationfromSubject}</>
                      <br />
                      <Text type="secondary">
                        {values?.variantB?.emailNotificationfromName}{' '}
                      </Text>{' '}
                      <Text type="secondary">
                        &lt;
                        {values?.variantB?.emailNotificationfromEmail}
                        &gt;
                      </Text>
                    </Text>
                  </Section>

                  <HorizontalLine />

                  {/* Audience */}
                  <Section>
                    <Title level={5}>Audience</Title>

                    {/* Include List */}
                    {includedAudienceTitles?.length > 0 && (
                      <Text type="primary">
                        <Bold>Include list {'  '}:</Bold>
                        {'  '}
                        {includedAudienceTitles.length > 0
                          ? includedAudienceTitles.join(', ')
                          : '—'}
                      </Text>
                    )}
                    <br />
                    {/* Include Segment */}
                    {includedSegmentTitles.length > 0 && (
                      <>
                        <Text type="primary">
                          <Bold>Include segment:</Bold>{' '}
                          {includedSegmentTitles.join(', ')}
                        </Text>
                        <br />
                      </>
                    )}

                    {/* Exclude Audience */}
                    {excludedAudienceTitles.length > 0 && (
                      <>
                        <Text type="primary">
                          <Bold>Exclude audience:</Bold>{' '}
                          {excludedAudienceTitles.join(', ')}
                        </Text>
                        <br />
                      </>
                    )}

                    {/* Exclude Segment */}
                    {excludedSegmentTitles.length > 0 && (
                      <>
                        <Text type="primary">
                          <Bold>Exclude segment:</Bold>{' '}
                          {excludedSegmentTitles.join(', ')}
                        </Text>
                        <br />
                      </>
                    )}

                    <Text type="secondary">
                      Email will be sent to {totalSubscribers} customers
                    </Text>
                  </Section>

                  <HorizontalLine />

                  {/* Content Test Settings */}
                  <Section>
                    <Title level={5}>Content test settings</Title>
                    <ul>
                      <li>{`A/B test campaign will be sent to ${distriutionCounts?.abTestCount}% ${`(${distriutionCounts?.totalCustomers - distriutionCounts?.winnerGroupCount})`} of customers`}</li>
                      <li>
                        {`Winner will be selected by ${
                          winByOptions[values?.abtesting_win_percent_by] || ''
                        } after ${formData?.abtesting_time_in_number} ${values?.abtesting_time_in_dayhours}(s)`}
                      </li>{' '}
                      <li>
                        {`A better performing version of the campaign will be sent to the
                remaining ${distriutionCounts?.winnerPercent}% ${`(${distriutionCounts?.winnerGroupCount})`} of customers`}
                      </li>
                    </ul>
                  </Section>

                  <HorizontalLine />

                  {/* Send Schedule */}
                  <Section>
                    <Title level={5}>When to send</Title>
                    <Field
                      as={AitRadioButton}
                      name="when_to_send"
                      className="vertical"
                      value={values.when_to_send}
                      onChange={(e) =>
                        setFieldValue('when_to_send', e.target.value)
                      }
                      options={[
                        { label: 'Send now', value: 'now' },
                        { label: 'Schedule', value: 'scheduled' },
                        { label: 'Keep in draft', value: 'draft' },
                      ]}
                    />
                  </Section>

                  {values?.when_to_send === 'scheduled' && (
                    <>
                      <Section>
                        <Field
                          as={AitDatePicker}
                          name="sentDate"
                          label="Select date"
                          placeholder="mm-dd-yyyy"
                          disabledDate={disablePastDate}
                          disabledTime={disablePastTime}
                          value={values?.sentDate} // now stored as moment, not string
                          onChange={(val) => setFieldValue('sentDate', val)} // val is moment
                          error={touched.sentDate && !!errors.sentDate}
                          errorMessage={errors.sentDate}
                        />
                      </Section>
                      <Section>
                        <Field
                          as={AitSelectBox}
                          name="selectedTimezone"
                          label="Select time zone"
                          placeholder="Select time zone"
                          options={formData?.timeZone?.map((tz) => ({
                            label: tz.value,
                            value: tz.name,
                          }))}
                          value={values?.selectedTimezone}
                          onChange={(val) => {
                            setFieldValue('selectedTimezone', val);
                          }}
                          error={
                            touched.selectedTimezone &&
                            !!errors.selectedTimezone
                          }
                          errorMessage={errors.selectedTimezone}
                        />
                      </Section>
                    </>
                  )}

                  {/* Footer Buttons */}
                </Card>
                <FooterButtons>
                  <AitButton
                    type="primary"
                    htmlType="submit"
                    title={
                      values?.when_to_send === 'draft'
                        ? 'Save A/B test'
                        : values?.when_to_send === 'now'
                          ? 'Send now A/B test'
                          : values?.when_to_send === 'scheduled'
                            ? 'Scheduled A/B test'
                            : 'Save A/B test'
                    }
                    loading={checkEmailSendLimitLoading || sendEmailLoading}
                  />

                  <AitButton
                    type="default"
                    title="Edit email"
                    onClick={() => setVisible(false)}
                  />

                  <AitButton
                    type="text"
                    title="Cancel"
                    color="default"
                    variant="filled"
                    onClick={() => {
                      router.push('/email-marketing/campaign/list');
                    }}
                  />
                </FooterButtons>
              </Container>
            </Form>
          );
        }}
      </Formik>

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
              <Text type="secondary" strong>
                Note:
              </Text>{' '}
              <Text type="secondary">
                Your current campaign AB test will be saved as a draft
              </Text>{' '}
              while your purchase is in progress. You can resume it anytime once
              your email credits are updated.
            </Paragraph>
          </>
        }
        onConfirm={() => {
          handleModalSubmit(
            'draft',
            'save_draft_from_email_limit',
            formikRef?.current?.values
          );
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
          // setSummaryModalVisible(true);
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
            handleModalSubmit(
              'draft',
              'save_draft_from_suspecious_email',
              formikRef?.current?.values
            );
          }}
          message={'Module has been suspended !'}
          confirmText={'Contact us'}
          cancelText={'Cancel'}
          confirmButtonLoading={campaignState?.sendEmailLoading}
        />
      )}
    </AitModal>
  );
};

export default CreateAbTestReviewModal;
