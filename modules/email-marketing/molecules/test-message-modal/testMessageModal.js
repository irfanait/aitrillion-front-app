import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import React from 'react';
import { ButtonWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useSelector } from 'react-redux';

const TestMessageModal = (props) => {
  const { modalVisible, setModalVisible, handleSendTestEmail, setTestEmail } =
    props;
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  return (
    <>
      <AitModal
        width={500}
        open={modalVisible}
        footer={false}
        headerVisible={true}
        closeIconVisible={true}
        centered
        setVisible={() => setModalVisible(false)}
        title={'Send test email'}
      >
        <>
          <AitInputBox
            label="Enter recipient's email"
            labelFontSize="20px"
            name="email"
            onChange={(e) => {
              setTestEmail(e.target.value);
            }}
            placeholder="Email"
            style={{
              marginBottom: '16px',
            }}
          />
          <ButtonWrapper>
            <AitButton
              title={'Send'}
              type="primary"
              onClick={handleSendTestEmail}
              loading={campaignState?.sendEmailLoading}
              style={{ height: '38px', padding: '0 24px' }}
            />
          </ButtonWrapper>
        </>
      </AitModal>
    </>
  );
};

export default TestMessageModal;
