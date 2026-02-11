import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AitTable from '@/components/molecules/ait-table/aitTable';
import { customerDetailsOrdersApi } from '@/redux/apis/customers-api/customersApi';
import { Typography } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { checkValidData } from '@/utils/common.util';
import OrderHistoryDetails from '@/modules/loyalty-rewards/setUpProgram/gift-code-tamplate/CustomerDetailsPage/orderHistoryModal';
const { Text } = Typography;
const LIMIT = 10;

const CustomerDetailsOrdersTab = ({ handleModalOpen, customerId }) => {
  const dispatch = useDispatch();
  const [orderHistoryModal, setOrderHistoryModal] = useState('');

  const { customerOrders, customerOrdersLoading, customerOrdersPagination } =
    useSelector((state) => state.customerDetailsState);

  const { currentPage, totalRecords } = customerOrdersPagination;

  // Call API only once when tab is opened first time
  useEffect(() => {
    if (customerId) {
      dispatch(
        customerDetailsOrdersApi({
          act: 'customer_order_list',
          order: 0,
          customer_id: customerId,
          limit: LIMIT,
          currentPage,
          countSync: 1,
          totalRecords: 1,
        })
      );
    }
  }, [customerId]);

  const customerDetailsOrdersTabColumns = [
    {
      title: 'Order id',
      dataIndex: 'name', // example: "#1482"
      key: 'name',
      sorter: true,
      // render: (_, record) => (
      //   <Text
      //     style={{
      //       color: 'rgb(26, 115, 232)',
      //       fontWeight: 500,
      //       cursor: 'pointer',
      //     }}
      //     onClick={() => handleModalOpen(record, true)}
      //   >
      //     {record.name}
      //   </Text>
      // ),
      render: (cell, record) => (
        <div
          onClick={() => {
            console.log('order record', record);
            setOrderHistoryModal(record?.order_id);
          }}
          style={{
            color: 'var(--ant-color-primary)',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          #{checkValidData(record?.order_id)}
        </div>
      ),
    },

    {
      title: 'Shopify order id',
      dataIndex: 'shopify_order_id',
      key: 'shopify_order_id',
      sorter: true,
      render: (_, record) => <Text>{record.shopify_order_id}</Text>,
    },

    {
      title: 'First name',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: true,
      render: (_, record) => <Text>{record.first_name || '-'}</Text>,
    },

    {
      title: 'Last name',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: true,
      render: (_, record) => <Text>{record.last_name || '-'}</Text>,
    },

    {
      title: 'Order amount',
      dataIndex: 'total_price',
      key: 'total_price',
      sorter: true,
      render: (_, record) => <Text>{record.total_price || '-'}</Text>,
    },

    {
      title: 'Status',
      dataIndex: 'financial_status',
      key: 'financial_status',
      sorter: true,
      render: (_, record) => (
        <Text style={{ textTransform: 'capitalize' }}>
          {record.financial_status || '-'}
        </Text>
      ),
    },

    {
      title: 'Created date',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: true,
      render: (_, record) => {
        const date = record.created_at
          ? new Date(record.created_at).toLocaleString()
          : '-';
        return <Text>{date}</Text>;
      },
    },
  ];

  const handlePageChange = (page) => {
    dispatch(
      customerDetailsOrdersApi({
        order: 0,
        customer_id: customerId,
        limit: LIMIT,
        currentPage: page,
        countSync: 0,
        totalRecords: totalRecords, // backend wants this
      })
    );
  };

  return (
    <>
      <AitTable
        rowKey="id"
        heading="Orders"
        loading={customerOrdersLoading}
        columns={customerDetailsOrdersTabColumns}
        dataSource={customerOrders}
        showFilters={false}
        pagination={{
          current: currentPage,
          pageSize: LIMIT,
          total: totalRecords,
          showSizeChanger: false,
          onChange: handlePageChange,
        }}
        scroll={{ x: 'max-content', y: '58vh' }}
        marginleft="-10px"
        marginright="-10px"
        filterheaderbottomspace="0px"
      />
      <AitModal
        maskClosable={false}
        open={orderHistoryModal}
        title="Order details"
        handleModalClose={() => {
          setOrderHistoryModal('');
        }}
        footer={null}
        centered
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        destroyOnHidden
      >
        <OrderHistoryDetails
          orderHistoryModal={orderHistoryModal}
          setOrderHistoryModal={setOrderHistoryModal}
        />
      </AitModal>
    </>
  );
};

export default CustomerDetailsOrdersTab;
