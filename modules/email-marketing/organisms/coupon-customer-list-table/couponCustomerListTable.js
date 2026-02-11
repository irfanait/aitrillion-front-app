import AitTable from '@/components/molecules/ait-table/aitTable';
import { Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const CouponCustomerListTable = (props) => {
  const { handleTableChange, forceLoading } = props;

  const couponsState = useSelector((state) => state.emailMarketingCouponState);
  console.log(couponsState, 'couponsState');

  const {
    getCoponsCustomerListArr,
    getCoponsCustomerListLoading,
    getCouponCustomerListFilter,
  } = couponsState;
  console.log(getCoponsCustomerListArr, 'getCoponsCustomerListArr');

  const couponsCustomerColumns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      fixed: 'left',
      sorter: true,
      width: 180,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.full_name}</Text>
        </>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'decoded_email',
      key: 'decoded_email',
      fixed: 'left',
      sorter: true,
      width: 250,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.decoded_email}</Text>
        </>
      ),
    },
    {
      title: 'Discount code',
      dataIndex: 'discount_code',
      key: 'discount_code',
      width: 180,
      sorter: true,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.discount_code}</Text>
        </>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      sorter: true,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.type}</Text>
        </>
      ),
    },
    {
      title: 'Created date',
      dataIndex: 'created_date',
      key: 'created_date',
      width: 180,
      sorter: true,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.created_date}</Text>
        </>
      ),
    },
  ];

  return (
    <>
      <AitTable
        rowKey={(record, index) => `${record.id}-${index}`}
        heading=""
        showFilters={false}
        dataSource={
          Array.isArray(getCoponsCustomerListArr)
            ? getCoponsCustomerListArr
            : []
        }
        loading={forceLoading || getCoponsCustomerListLoading}
        columns={couponsCustomerColumns}
        // resetFilters={handleResetFilters}
        onChange={handleTableChange}
        pagination={{
          current: Number(getCouponCustomerListFilter?.currentPage || 1),
          pageSize: Number(getCouponCustomerListFilter?.limit || 10),
          total: Number(getCouponCustomerListFilter?.totalRecords || 0),
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content', y: 100 * 5 }}
        sticky
        marginleft="-10px"
        marginright="-10px"
      />
    </>
  );
};

export default CouponCustomerListTable;
