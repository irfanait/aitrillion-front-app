import React, { useEffect, useState } from 'react';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { ButtonWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  copyTemplateApi,
  sendEmailCampaignApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { setCopyTemplateFilters } from '@/redux/email-marketing-slices/templateSlice/email-marketing-template-slice';
import { useRouter } from 'next/router';
import { sendTestEmailReset } from '@/redux/email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import { Col, Row } from 'antd';

const CloneCampaignNameModal = (props) => {
  const { visible, setVisible, setSelectedCampaignId, selectedCampaignId } =
    props;
  const dispatch = useDispatch();
  const router = useRouter();
  const templateState = useSelector(
    (state) => state.emailMarketingTemplateState
  );
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { sendEmailData } = campaignState;

  // const [useTemplateName, setUseTemplateName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [error, setError] = useState({
    errorState: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (campaignState?.sendEmailApiState === 'success') {
      setError({
        errorState: false,
        errorMessage: '',
      });
      setCampaignName('');
      setVisible(false);
      dispatch(sendTestEmailReset());
      router.push(
        `/email-marketing/campaign/${sendEmailData?.enc_camp_id}/edit-campaign?from=clone-campaign`
      );
    }
  }, [campaignState?.sendEmailApiState]);

  const handleCloneClick = () => {
    if (campaignName.trim().length === 0) {
      setError({ errorState: true, errorMessage: 'Please enter name' });
      return;
    }
    const payload = {
      act: 'save_template_to_campaign',
      campaign_name: campaignName,
      template_id: selectedCampaignId,
      type: 'camp_clone',
    };
    dispatch(sendEmailCampaignApi(payload));
  };

  return (
    <>
      <AitModal
        open={visible}
        setVisible={setVisible}
        title="Create campaign"
        centered
        width={500}
      >
        <div style={{ marginTop: 16 }}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <AitInputBox
                labelFontSize="20px"
                name="campaign"
                // required
                value={campaignName}
                onChange={(e) => {
                  if (e.target.value) {
                    setError({ errorState: false, errorMessage: '' });
                  }
                  setCampaignName(e.target.value);
                }}
                placeholder="Enter campaign name"
                style={{
                  marginBottom: '16px',
                }}
                error={error.errorState}
                errorMessage={error.errorMessage}
              />
            </Col>
          </Row>

          <ButtonWrapper>
            <AitButton
              title={'Create campaign'}
              type="primary"
              onClick={() => {
                handleCloneClick();
              }}
              loading={campaignState?.sendEmailLoading}
              style={{
                height: '38px',
                width: '100%',
              }}
            />
          </ButtonWrapper>
        </div>
      </AitModal>
    </>
  );
};

export default CloneCampaignNameModal;
