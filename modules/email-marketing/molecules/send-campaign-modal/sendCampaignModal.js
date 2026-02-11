import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import React, { useEffect, useState } from 'react';
import { ButtonWrapper, StyledFormWrapper } from './style';
import AitBlockWrapper from '@/components/atoms/ait-block-wrapper/aitBlockWrapper';
import { App, Col, message, Row } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useDispatch, useSelector } from 'react-redux';
import { sendEmailCampaignApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { useRouter } from 'next/router';
import { sendTestEmailReset } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';

const SendCampaignModal = (props) => {
  const { visible, setVisible, selectedTemplate } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification } = App.useApp();
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState({
    error: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (campaignState?.sendEmailApiState === 'success') {
      const campaignId = campaignState?.sendEmailData?.enc_camp_id;
      if (!campaignId) return;
      setError({ error: false, errorMessage: '' });
      setVisible(false);
      setCampaignName('');
      notification.success({
        message: campaignState?.sendEmailMessage,
      });
      dispatch(sendTestEmailReset());
      router.push(
        `/email-marketing/campaign/${campaignId}/edit-campaign?from=template_list`
      );
    }
    if (campaignState?.sendEmailApiState === 'error') {
      notification.error({
        message: campaignState?.sendEmailMessage,
      });
      dispatch(sendTestEmailReset());
    }
  }, [campaignState?.sendEmailApiState]);

  const createCampaignClick = () => {
    if (!campaignName || campaignName.trim().length === 0) {
      setError({ error: true, errorMessage: 'Campaign name is mandatory' });
    } else {
      const payload = {
        act: 'save_template_to_campaign',
        template_id: selectedTemplate?.id,
        campaign_name: campaignName,
        type: 'template',
      };
      dispatch(sendEmailCampaignApi(payload));
      setError({ error: false, errorMessage: '' });
    }
  };

  return (
    <div>
      <AitModal
        width={450}
        open={visible}
        footer={false}
        headerVisible={true}
        closeIconVisible={true}
        centered
        title="Create campaign"
        setVisible={() => setVisible(false)}
      >
        <StyledFormWrapper>
          <AitBlockWrapper padding={'0px 0px'}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <AitInputBox
                  name="campaignName"
                  placeholder="Enter campaign name"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setError({ error: false, errorMessage: '' });
                      setCampaignName(value);
                    }
                  }}
                  error={Boolean(error.error)}
                  errorMessage={error.errorMessage || ''}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={24}>
                <ButtonWrapper gutter={[0, 10]}>
                  <Col span={24}>
                    <AitButton
                      title="Create campaign"
                      htmlType="button"
                      type="primary"
                      onClick={() => {
                        createCampaignClick();
                      }}
                      loading={campaignState?.sendEmailLoading}
                      style={{ width: '100%', height: '38px' }}
                    />
                  </Col>
                </ButtonWrapper>
              </Col>
            </Row>
          </AitBlockWrapper>
        </StyledFormWrapper>
      </AitModal>
    </div>
  );
};

export default SendCampaignModal;
