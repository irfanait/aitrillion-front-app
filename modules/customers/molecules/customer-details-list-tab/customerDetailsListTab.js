import React, { useEffect, useState } from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Col, Row, Typography } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { PlusOutlined } from '@ant-design/icons';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  customerDetailsgetListsApi,
  customerDetailsRemoveListApi,
} from '@/redux/apis/customers-api/customersApi';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { customerDetailsRemoveListReset } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';

const { Title, Text } = Typography;

const CustomerDetailsListTab = ({ customerId, handleAddListModal }) => {
  const dispatch = useDispatch();

  const { notification } = App.useApp();

  const {
    getOrderLineItems,
    getOrderLineItemsLoading,
    customerDetailsRemoveListApiState,
    customerDetailsRemoveListLoading,
    customerDetailsRemoveListError,
  } = useSelector((state) => state.customerDetailsState);

  const [removeLIstModal, setRemoveLIstModal] = useState(false);
  const [listId, setlistId] = useState('');

  const columns = [
    {
      title: 'List name',
      dataIndex: 'external_name',
      key: 'external_name',
      render: (text, record) => <Text>{record.external_name}</Text>,
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Text
          onClick={() => {
            setlistId(record?.id);
            setRemoveLIstModal(true);
          }}
          style={{ color: '#1a73e8', cursor: 'pointer' }}
        >
          {'Remove'}
        </Text>
      ),
      width: 120,
    },
  ];

  useEffect(() => {
    const payload = {
      act: 'customer_list',
      customer_id: customerId,
    };
    dispatch(customerDetailsgetListsApi(payload));
  }, []);

  useEffect(() => {
    if (customerDetailsRemoveListApiState === 'success') {
      notification.success({
        message: customerDetailsRemoveListError,
      });
      setlistId('');
      setRemoveLIstModal(false);
      dispatch(customerDetailsRemoveListReset());
    }
    if (customerDetailsRemoveListApiState === 'error') {
      notification.error({
        message: customerDetailsRemoveListError,
      });
      dispatch(customerDetailsRemoveListReset());
    }
  }, [customerDetailsRemoveListApiState]);

  const handleRemoveClick = () => {
    const payload = {
      act: 'customerremovelist',
      list_id: listId,
    };
    dispatch(customerDetailsRemoveListApi(payload));
  };

  return (
    <>
      <AitCard
        headerpadding={{ xs: '10px 15px', sm: '10px 15px', md: '10px 15px' }}
        bodypadding={{ xs: '10px 15px', sm: '10px 15px', md: '10px 15px' }}
        title={
          <Row gutter={[20, 20]} justify="space-between" align="middle">
            <Col>
              <Title type="primary" level={5} style={{ margin: 'auto' }}>
                Lists
              </Title>
            </Col>
            <Col>
              <AitButton
                title="Add to list"
                variant="outlined"
                color="primary"
                padding={'4px 10px'}
                onClick={handleAddListModal}
                icon={<PlusOutlined />}
              />
            </Col>
          </Row>
        }
      >
        <AitTable
          rowKey="id"
          columns={columns}
          dataSource={getOrderLineItems || []}
          loading={getOrderLineItemsLoading}
          pagination={false}
          showFilters={false}
          showSorterTooltip={false}
          scroll={{ x: 'max-content', y: '58vh' }}
          marginleft="-10px"
          marginright="-10px"
        />
      </AitCard>
      <AitConfirmationModal
        visible={removeLIstModal}
        setVisible={setRemoveLIstModal}
        description="This list will be remove"
        onConfirm={() => handleRemoveClick()}
        confirmButtonLoading={customerDetailsRemoveListLoading}
      />
    </>
  );
};

export default CustomerDetailsListTab;
