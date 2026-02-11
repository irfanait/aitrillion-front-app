import React from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { UserOutlined } from '@ant-design/icons';
import { processBulkCustomerStatusApi } from '@/redux/apis/customers-api/customersApi';
import { useDispatch, useSelector } from 'react-redux';
import { App, Col, Row, Typography } from 'antd';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitButton from '@/components/atoms/ait-button/aitButton';
const { Title, Text } = Typography;

const BulkStatusUpdateWithEmailModal = (props) => {
  const {
    visible,
    setVisible,
    pendingStatus,
    setNotifyEmail,
    notifyEmail,
    totalCustomersCount,
    selectAll = false,
    selectedRowKeys = [],
    filters = {},
  } = props;

  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const allCustomerState = useSelector((state) => state.allCustomersState);

  const { processBulkCustomerStatusLoading } = allCustomerState;

  const handleProcessWithEmail = () => {
    if (!notifyEmail) {
      notification.error({ message: 'Enter correct email to proceed.' });
      return;
    }

    const payload = {
      selectedpeopleType: 'Customers',
      isRequestForActiveCustomers: filters.isRequestForActiveCustomers || 0,
      selectedOperatorType: filters.selectedOperatorType || 'and',
      masterFilter: Array.isArray(filters.masterFilter)
        ? filters.masterFilter
        : [],
      selectedCustomerCount: String(totalCustomersCount),
      status: String(pendingStatus),
      selectedCustomers: selectAll ? 'All' : JSON.stringify(selectedRowKeys),
      notify_email: notifyEmail,
      act: 'blk_chng_cst_status_process_data',
    };

    dispatch(processBulkCustomerStatusApi(payload));
  };

  return (
    <AitModal
      open={visible}
      centered
      width={420}
      footer={false}
      onCancel={() => {
        setVisible(false);
        setNotifyEmail('');
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <UserOutlined style={{ color: 'rgb(255, 242, 0)' }} />
        <Title level={5}>
          {pendingStatus === 1 ? 'Set as Active' : 'Set as Non-active'}
        </Title>

        <Text type="secondary">
          Enter your email below. We will notify you once the process is
          completed.
        </Text>

        <AitInputBox
          type="email"
          placeholder="Email address"
          value={notifyEmail}
          onChange={(e) => setNotifyEmail(e.target.value)}
          style={{ marginTop: 16 }}
        />

        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <AitButton
              title="Process"
              type="primary"
              block
              loading={processBulkCustomerStatusLoading}
              onClick={() => handleProcessWithEmail()}
            />
          </Col>
          <Col span={12}>
            <AitButton
              title="Cancel"
              block
              onClick={() => {
                setVisible(false);
                setNotifyEmail('');
              }}
            />
          </Col>
        </Row>
      </div>
    </AitModal>
  );
};

export default BulkStatusUpdateWithEmailModal;
