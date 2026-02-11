import React, { useEffect, useState } from 'react';
import { Typography, Space, App } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { CloudDownloadOutlined } from '@ant-design/icons';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useDispatch, useSelector } from 'react-redux';
import { exportCustomerFromSegmentApi } from '@/redux/apis/customers-api/customersApi';
import { resetExportCustomerfromSegment } from '@/redux/customers-slice/segment-slices/segment-slice';
import { useRouter } from 'next/router';

const { Text } = Typography;

const ExportSegmentModal = ({
  visible,
  setVisible,
  reportId,
  setSegmentId = () => {},
  handleClearList = () => {},
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification } = App.useApp();
  const { login_auth } = useSelector((state) => state.jwtState);
  const segmentState = useSelector((state) => state.segmentState);
  const {
    exportCustomerFromSegmentApiState,
    exportCustomerFromSegmentApiLoading,
    exportCustomerFromSegmentApiMessage,
  } = segmentState;
  const [email, setEmail] = useState(login_auth?.email || '');

  useEffect(() => {
    if (visible) {
      setEmail(login_auth?.email || '');
    }
  }, [visible, login_auth]);

  useEffect(() => {
    if (exportCustomerFromSegmentApiState === 'success') {
      notification.success({ message: exportCustomerFromSegmentApiMessage });
      setEmail('');
      setSegmentId('');
      handleClearList();
      dispatch(resetExportCustomerfromSegment());
      setVisible(false);
    }
    if (exportCustomerFromSegmentApiState === 'error') {
      notification.error({ message: exportCustomerFromSegmentApiMessage });
      dispatch(resetExportCustomerfromSegment());
    }
  }, [exportCustomerFromSegmentApiState]);

  const handleCancel = () => {
    setVisible(false);
    setEmail(email);
  };

  const handleExportCustomers = () => {
    const payload = {
      act:
        router?.pathname === '/customers/segment/list'
          ? 'export_segment_csv '
          : 'export_list_csv',
      report_id: reportId,
      email: email,
    };
    dispatch(exportCustomerFromSegmentApi(payload));
  };

  return (
    <AitModal
      open={visible}
      centered
      isHeaderAtCenter
      headerTitleLevel={3}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      width={480}
      title="Export in progress"
      setVisible={setVisible}
      destroyOnClose
      maskClosable
    >
      <Space
        direction="vertical"
        size="large"
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '16px 10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CloudDownloadOutlined
            style={{ fontSize: '100px', color: '#1a73e8' }}
          />
        </div>

        {/* Message 1 */}
        <Text
          type="primary"
          style={{
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          We are processing your export request. We will send you a notification
          with the download link on your email once completed.
        </Text>

        {/* Message 2 */}
        <Text
          type="primary"
          style={{
            fontSize: 16,
          }}
        >
          Please specify your email below where you wish to receive the download
          link.
        </Text>

        {/* Email Input */}

        <AitInputBox
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
        />

        {/* Buttons */}
        <AitButton
          type="primary"
          htmlType="button"
          title="Export"
          style={{ width: '100%', fontWeight: 600 }}
          onClick={handleExportCustomers}
          loading={exportCustomerFromSegmentApiLoading}
        />
        <AitButton
          type="outlined"
          title="No thanks"
          style={{ width: '100%', fontWeight: 600 }}
          onClick={handleCancel}
        />
      </Space>
    </AitModal>
  );
};

export default ExportSegmentModal;
