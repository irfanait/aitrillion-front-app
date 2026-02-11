import React from 'react';
import { Row, Col } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitButton from '@/components/atoms/ait-button/aitButton';

import { useSelector } from 'react-redux';
import { LabelText, ValueText } from './style';

const CampaignSummaryModal = (props) => {
  const { visible, setVisible, handleSummaryModalSendClick, formData } = props;

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { emailCampaignData } = campaignState;

  return (
    <AitModal
      title="Campaign summary"
      width={550}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      setVisible={setVisible}
    >
      <Row gutter={[24, 20]} style={{ marginTop: 20 }}>
        <Col span={10}>
          <LabelText>Campaign name</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>{formData?.campaignName}</ValueText>
        </Col>

        <Col span={10}>
          <LabelText>Subject</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>{formData?.EmailNotificationfromSubject}</ValueText>
        </Col>

        <Col span={10}>
          <LabelText>When to send</LabelText>
        </Col>
        <Col span={14}>
          <ValueText
            type={
              String(formData?.whenToSend).toLowerCase() === 'scheduled'
                ? ''
                : 'success'
            }
          >
            {String(formData?.whenToSend).toLowerCase() === 'scheduled' ? (
              <>
                <p>
                  Scheduled on{' '}
                  {formData?.sentDate && formData?.selectedTimezone
                    ? formData.sentDate.format('MM/DD/YYYY h:mm A') // ✅ format properly
                    : '—'}
                </p>
                <p>
                  in{' '}
                  {
                    emailCampaignData?.timeZone?.find(
                      (tz) => tz.name === formData?.selectedTimezone
                    )?.value
                  }{' '}
                  (Time Zone)
                </p>
              </>
            ) : String(formData?.whenToSend).toLowerCase() === 'draft' ? (
              'Save as draft'
            ) : (
              'Send now'
            )}
          </ValueText>
        </Col>

        <Col span={10}>
          <LabelText>Number of audience</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>
            {getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers}
          </ValueText>
        </Col>

        <Col span={10}>
          <LabelText>Sender’s name</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>{emailCampaignData?.email_data?.from_name}</ValueText>
        </Col>

        <Col span={10}>
          <LabelText>Sender’s email address</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>
            {emailCampaignData?.email_data?.fromEmailBefore +
              emailCampaignData?.email_data?.domain_name}
          </ValueText>
        </Col>

        <Col span={10}>
          <LabelText>Reply to (optional)</LabelText>
        </Col>
        <Col span={14}>
          <ValueText>{emailCampaignData?.email_data?.reply_to}</ValueText>
        </Col>
      </Row>
      <Row gutter={[12, 10]} style={{ marginTop: 24 }}>
        <Col xs={{ span: 8 }} sm={{ span: 6 }}>
          <AitButton
            title="Send"
            type="primary"
            loading={
              campaignState?.checkEmailSendLimitLoading ||
              campaignState?.checkActiveUserLimitSubscriptionLoading ||
              campaignState?.sendEmailLoading
            }
            onClick={handleSummaryModalSendClick}
            width={'100%'}
          />
        </Col>
        <Col xs={{ span: 8 }} sm={{ span: 6 }}>
          <AitButton
            title="Cancel"
            variant="filled"
            color="default"
            onClick={() => setVisible(false)}
            width={'100%'}
          />
        </Col>
      </Row>
    </AitModal>
  );
};

export default CampaignSummaryModal;
