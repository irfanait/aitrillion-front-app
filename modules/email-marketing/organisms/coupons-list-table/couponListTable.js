import AitButton from '@/components/atoms/ait-button/aitButton';
import AitPopover from '@/components/atoms/ait-popver/aitPopover';
import AitTable from '@/components/molecules/ait-table/aitTable';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const CouponListTable = (props) => {
  const {
    handleTableChange,
    handleViewClick,
    handleEditClick,
    handleDeleteCoupon,
    handleAddCouponCode,
    handleActivateDeactivateClick,
  } = props;
  const router = useRouter();
  const [popoverOpenRow, setPopoverOpenRow] = React.useState(null);
  const { loading } = useSelector((state) => state.loggedInUserDetailsState);
  const couponsState = useSelector((state) => state.emailMarketingCouponState);
  const { couponList, couponListLoading, filters } = couponsState;
  const couponsCodeColumns = [
    {
      title: 'Coupon',
      dataIndex: 'coupon_code',
      key: 'coupon_code',
      fixed: 'left',
      sorter: true,
      width: 180,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.coupon_code}</Text>
        </>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'discount_generator_type',
      key: 'discount_generator_type',
      fixed: 'left',
      sorter: true,
      width: 180,
      render: (_, record) => (
        <>
          <Text type="secondary">
            {record.discount_generator_type === '1'
              ? 'Bulk coupon'
              : 'Real-time coupon'}
          </Text>
        </>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'coupon_created_date',
      key: 'coupon_created_date',
      width: 250,
      sorter: true,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.coupon_created_date}</Text>
        </>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'coupon_update_date',
      key: 'coupon_update_date',
      width: 250,
      sorter: true,
      render: (_, record) => (
        <>
          <Text type="secondary">{record.coupon_update_date}</Text>
        </>
      ),
    },
    {
      title: 'Available/Total',
      dataIndex: 'discountCodeStatus',
      key: 'discountCodeStatus',
      width: 250,
      sorter: true,
      render: (_, record) => (
        <>
          {record?.discount_generator_type === '2' ? (
            <Text type="secondary">{record.discountCodeStatusRealtime}</Text>
          ) : (
            <Text type="secondary">{record.discountCodeStatus}</Text>
          )}
        </>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      className: 'action-column',
      width: 80,
      render: (_, record) => {
        const [available = 0, used = 0] = record?.discountCodeStatus
          ?.split('/')
          ?.map((v) => parseInt(v)) || [0, 0];

        const isDeactivated = record?.is_temporary_deactivated === '1';
        return (
          <AitPopover
            content={
              <Space direction="vertical">
                {used > 0 ? (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      handleViewClick(record?.id, 'view');
                      setPopoverOpenRow(null);
                    }}
                    title="View"
                  />
                ) : (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={<EditOutlined />}
                    title="Edit"
                    onClick={() => {
                      handleEditClick(record?.id, 'edit');
                      setPopoverOpenRow(null);
                    }}
                  />
                )}
                {record?.discount_generator_type !== '2' && (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      handleAddCouponCode(record?.id);
                      setPopoverOpenRow(null);
                    }}
                    title="Add codes"
                  />
                )}
                {available > 0 ? (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={
                      isDeactivated ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                    onClick={() => {
                      handleActivateDeactivateClick(record);
                      setPopoverOpenRow(null);
                    }}
                    title={isDeactivated ? 'Activate' : 'Deactivate'}
                  />
                ) : (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      handleDeleteCoupon(record?.id);
                      setPopoverOpenRow(null);
                    }}
                    title="Delete"
                  />
                )}
                {record?.discount_generator_type !== '1' && (
                  <AitButton
                    color="primary"
                    variant="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      router.push(
                        `/email-marketing/coupons/couponcustomerlist/${record?.id}`
                      );
                      setPopoverOpenRow(null);
                    }}
                    title="View customers"
                  />
                )}
              </Space>
            }
            trigger="click"
            overlayClassName="action-dropdown"
            placement="bottomRight"
            open={popoverOpenRow === record.id}
            onOpenChange={(open) => setPopoverOpenRow(open ? record.id : null)}
          >
            <Button type="text" color="primary" shape="circle" size={'large'}>
              <EllipsisOutlined />
            </Button>
          </AitPopover>
        );
      },
    },
  ];

  return (
    <>
      <AitTable
        rowKey="id"
        heading=""
        showFilters={false}
        dataSource={couponList}
        loading={couponListLoading}
        columns={couponsCodeColumns}
        // resetFilters={handleResetFilters}
        onChange={handleTableChange}
        pagination={{
          current: Number(filters.currentPage),
          pageSize: Number(filters.limit),
          // total: tabCounts?.All || 0,
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

export default CouponListTable;
