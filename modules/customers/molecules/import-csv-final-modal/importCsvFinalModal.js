import React, { useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import {
  ModalContainer,
  ModalTitle,
  StepNumber,
  StepRow,
  StepText,
} from './style';
import { Typography, App } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateListImportStep4Api } from '@/redux/apis/customers-api/customersApi';
import { useRouter } from 'next/router';

const { Text } = Typography;

const ImportCsvFinalModal = ({
  visible,
  setVisible,
  setContactModalVisible,
  setEmailChacked,
  setEmail,
  email,
  emailChacked,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notification } = App.useApp();
  const { login_auth } = useSelector((s) => s.jwtState);

  const [loading, setLoading] = useState(false);

  const { uploadCsvData } = useSelector((s) => s.importCsvState);

  const handleFinish = async () => {
    setLoading(true);
    const payload = {
      shop_id: Number(login_auth?.shop_id),
      csv_id: Number(uploadCsvData?.csvDetails?.id),
      isFinish: 1,
      reason_of_block: 1,
      notify_email: email !== '' ? email : '',
      send_email: emailChacked,
    };

    const response = await dispatch(updateListImportStep4Api(payload));

    if (response?.payload?.status === 'success') {
      notification.success({ message: 'Import completed successfully' });
      setVisible(false);
      setLoading(false);
      setEmailChacked(false);
      setEmail('');
      router.push('/customers/import-csv/list');
    } else {
      notification.error({
        message: response?.payload?.msg || 'Something went wrong',
      });
    }
  };

  return (
    <AitModal
      closeIconVisible={false}
      open={visible}
      setVisible={setVisible}
      width={560}
      centered
    >
      <ModalContainer>
        <ModalTitle>
          To import CSV please perform the following steps -
        </ModalTitle>

        <StepRow>
          <StepNumber>1</StepNumber>
          <StepText>
            We encourage you to buy a dedicated IP to improve your email
            delivery&nbsp;
            <Text
              onClick={() => setContactModalVisible(true)}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              Contact support
            </Text>
          </StepText>
        </StepRow>
      </ModalContainer>

      <AitButton
        type="primary"
        title="Finish"
        onClick={handleFinish}
        loading={loading}
        style={{ width: '100%', marginTop: 20 }}
      />
    </AitModal>
  );
};

export default ImportCsvFinalModal;
