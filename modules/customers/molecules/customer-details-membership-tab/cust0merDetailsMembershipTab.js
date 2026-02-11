import React, { useEffect } from 'react';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { PlusOutlined } from '@ant-design/icons';
import { Typography, Col, Row, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  customerDetailsMembershipApi,
  customerDetailsMembershipListApi,
  customerDetailsMembershipPlanListApi,
} from '@/redux/apis/customers-api/customersApi';
import AitTable from '@/components/molecules/ait-table/aitTable';

const { Title, Text } = Typography;

const CustomerDetailsMembershipTab = ({
  handleAddMembershipModal,
  customerId,
}) => {
  const dispatch = useDispatch();
  const { login_auth } = useSelector((s) => s.jwtState);

  const { membershipList, customerMembershipListLoading } = useSelector(
    (state) => state.customerDetailsState
  );

  useEffect(() => {
    if (!customerId) return;

    const payload = {
      act: 'get_list_membership',
      activity_filter: 'active',
      customer_id: customerId,
      shop_id: login_auth?.shop_id,
      shop_name: login_auth?.shop_name,
    };

    dispatch(customerDetailsMembershipListApi(payload));
  }, [customerId]);

  // ---------------------- TABLE COLUMNS ---------------------- //

  const columns = [
    {
      title: 'Membership',
      dataIndex: 'plan_name',
      key: 'plan_name',
      render: (text, record) => (
        <Text style={{ color: '#1a73e8', cursor: 'pointer' }}>
          {record.plan_name}
        </Text>
      ),
    },

    {
      title: 'Type',
      dataIndex: 'membership_type',
      key: 'membership_type',
      render: (value) => {
        const label = value === '1' ? 'AUTO RENEWAL' : 'Manual';
        return (
          <Tag color="purple" style={{ borderRadius: 12 }}>
            {label}
          </Tag>
        );
      },
    },

    {
      title: 'Created type',
      dataIndex: 'created_type',
      key: 'created_type',
      render: (value) => (
        <Tag color="pink" style={{ borderRadius: 12 }}>
          {value?.toUpperCase()}
        </Tag>
      ),
    },

    {
      title: 'Next renewal/expiration',
      dataIndex: 'contract_next_billing_date',
      key: 'contract_next_billing_date',
      render: (date) => <Text>{date || '-'}</Text>,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <Tag color="green" style={{ borderRadius: 12 }}>
          {value?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <AitCard
      headerpadding={{ xs: '10px 15px', sm: '10px 15px', md: '10px 15px' }}
      bodypadding={{ xs: '10px 15px', sm: '10px 15px', md: '10px 15px' }}
      title={
        <Row gutter={[20, 20]} justify="space-between" align="middle">
          <Col>
            <Title type="primary" level={5} style={{ margin: 'auto' }}>
              Memberships
            </Title>
          </Col>
          <Col>
            <AitButton
              title="Add to membership"
              variant="outlined"
              color="primary"
              padding={'4px 10px'}
              onClick={handleAddMembershipModal}
              icon={<PlusOutlined />}
            />
          </Col>
        </Row>
      }
    >
      <AitTable
        rowKey="membership_id"
        columns={columns}
        dataSource={membershipList || []}
        loading={customerMembershipListLoading}
        pagination={false}
        showFilters={false}
        showSorterTooltip={false}
        scroll={{ x: 'max-content', y: '56vh' }}
        marginleft="-10px"
        marginright="-10px"
      />
    </AitCard>
  );
};

export default CustomerDetailsMembershipTab;
