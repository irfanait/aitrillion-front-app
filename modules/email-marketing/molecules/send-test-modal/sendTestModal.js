import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';

const SendTestModal = (props) => {
  const {
    visible,
    setVisible,
    setEmailValue,
    handleSendTestEmail,
    loading,
    previewModalOpen,
  } = props;
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setEmail('');
      setError('');
      setEmailValue('');
    }
  }, [visible]);

  // Simple email regex
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      return 'Email is required';
    }

    // Split by comma, trim whitespace
    const emails = value.split(',').map((email) => email.trim());

    for (let email of emails) {
      if (!email) {
        return 'Email cannot be empty. Please remove extra commas.';
      }
      if (!regex.test(email)) {
        return `Invalid email address: ${email}`;
      }
    }

    return '';
  };

  const handleClick = () => {
    const errorMsg = validateEmail(email);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
    setEmailValue(email);
    handleSendTestEmail(email);
  };

  return (
    <AitModal
      width={500}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      setVisible={() => {
        setVisible(false);
        setEmail('');
        setError('');
        setEmailValue('');
      }}
      onCancel={() => {
        setVisible(false);
        setEmail('');
        setError('');
        setEmailValue('');
      }}
      title={'Send test email'}
    >
      <div style={{ marginTop: '16px' }}>
        <AitInputBox
          label="Enter recipient's email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(''); // clear error when typing
          }}
          helperText={
            previewModalOpen
              ? 'Separate multiple email addresses with commas.'
              : ''
          }
          placeholder="Email"
          style={{
            marginBottom: '8px',
          }}
        />
        {error && (
          <div style={{ color: 'red', fontSize: '12px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        <ButtonWrapper>
          <AitButton
            title={
              loading || campaignState?.sendEmailLoading
                ? 'Processing...'
                : 'Send'
            }
            type="primary"
            onClick={handleClick}
            loading={loading ? loading : campaignState?.sendEmailLoading}
            style={{ height: '38px', padding: '0 24px' }}
          />
        </ButtonWrapper>
      </div>
    </AitModal>
  );
};

export default SendTestModal;
