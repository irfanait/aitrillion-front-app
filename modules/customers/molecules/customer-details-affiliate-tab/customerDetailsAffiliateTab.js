import React, { useState, useEffect } from 'react';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Col, Row, Spin, Typography } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { PlusOutlined } from '@ant-design/icons';
import AitTable from '@/components/molecules/ait-table/aitTable';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import { useDispatch, useSelector } from 'react-redux';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import {
  customerDetailsAffiliateListApi,
  customerDetailsExcludeFromAutoAssignedGroupApi,
  customerDetailsRemoveGroupCustomer,
} from '@/redux/apis/customers-api/customersApi';
import CustomerDetailsUpdateAffiliateGroupModal from '../customer-details-update-affiliate-group-modal/customerDetailsUpdateAffiliateGroupModal';

const { Title, Text } = Typography;

const CustomerDetailsAffiliateTab = ({
  customerId,
  handleUpdateGroupModal,
  visible,
  setVisible,
}) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { login_auth } = useSelector((s) => s.jwtState);

  const { affiliateGroups, affiliateGroupLoading, data } = useSelector(
    (state) => state.customerDetailsState
  );

  const [excludeGroup, setExcludeGroup] = useState(
    data?.[0]?.is_exclude_aff_group_auto_assigned === '0' ? false : true
  );
  const [removeModal, setRemoveModal] = useState(false);
  const [excludeLoading, setExcludeLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const columns = [
    {
      title: 'Group',
      dataIndex: 'group_name',
      key: 'group_name',
      render: (text) => (
        <Text
          style={{ fontSize: '14px', fontWeight: 500 }}
        >{`Group - ${text}`}</Text>
      ),
    },
    {
      title: 'Action',
      width: 120,
      render: (_, record) => (
        <Text
          onClick={() => {
            setSelectedGroupId(record.id);
            setRemoveModal(true);
          }}
          style={{ color: '#1a73e8', cursor: 'pointer' }}
        >
          Remove
        </Text>
      ),
    },
  ];

  useEffect(() => {
    handleFetchAffiliateGroups();
  }, []);

  const handleFetchAffiliateGroups = async () => {
    const payload = {
      act: 'get_groups_list_assigned',
      customer_id: customerId,
      shop_id: login_auth?.shop_id,
    };
    await dispatch(customerDetailsAffiliateListApi(payload));
  };

  const handleExcludeChecked = (checked) => {
    setExcludeGroup(checked);
    setExcludeLoading(true);
    const payload = {
      act: 'group_assigned_log',
      customer_id: customerId,
      new_group_id: checked === true ? 1 : 0,
      old_group_id: 'update_exclude_grp_option',
      shop_id: login_auth?.shop_id,
    };

    dispatch(customerDetailsExcludeFromAutoAssignedGroupApi(payload)).then(
      (res) => {
        if (res.payload.status === 'success') {
          notification.success({
            message: 'Customer is excluded from auto-assigned groups',
          });
          setExcludeLoading(false);
        }
        if (res.payload.status === 'error') {
          notification.error({
            message: res.payload.msg,
          });
          setExcludeLoading(false);
        }
      }
    );
  };

  const handleRemoveGroup = async () => {
    try {
      // 1. First API call (assign log)
      const assignLogPayload = {
        act: 'group_assigned_log',
        customer_id: customerId,
        new_group_id: 0,
        old_group_id: 0,
        shop_id: login_auth?.shop_id,
      };

      await dispatch(
        customerDetailsExcludeFromAutoAssignedGroupApi(assignLogPayload)
      ).unwrap();

      const payload2 = {
        act: 'remove_group_customer',
        group_id: 0,
        customer_id: customerId,
        shop_id: login_auth?.shop_id,
        shopify_customer_id: data?.[0]?.shopify_customer_id,
      };

      const res2 = await dispatch(
        customerDetailsRemoveGroupCustomer(payload2)
      ).unwrap();

      if (res2.status === 'success') {
        notification.success({
          message: 'Group removed successfully',
        });

        setRemoveModal(false);
        await handleFetchAffiliateGroups();
      } else {
        notification.error({
          message: res2.msg || 'Group remove failed',
        });
      }
    } catch (err) {
      notification.error({
        message: 'Something went wrong',
      });
    }
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
                Group
              </Title>
            </Col>
            <Col>
              <AitButton
                title="Update group"
                variant="outlined"
                color="primary"
                padding={'4px 10px'}
                onClick={handleUpdateGroupModal}
                icon={<PlusOutlined />}
              />
            </Col>
          </Row>
        }
      >
        {/* TABLE - like the List tab */}
        <AitTable
          rowKey="id"
          columns={columns}
          loading={affiliateGroupLoading}
          dataSource={affiliateGroups}
          pagination={false}
          showFilters={false}
          showSorterTooltip={false}
          scroll={{ x: 'max-content', y: '56vh' }}
          marginleft="-10px"
          marginright="-10px"
        />

        {/* CHECKBOX BELOW TABLE */}
        <div
          style={{
            marginTop: 20,
            display: 'flex',
          }}
        >
          <AitCheckboxButton
            checked={excludeGroup}
            onChange={(e) => handleExcludeChecked(e.target.checked)}
            label="Exclude from Auto-Assigned Groups"
          />

          {excludeLoading && (
            <Spin
              style={{ marginTop: '2px', marginLeft: '10px' }}
              size="small"
            />
          )}
        </div>
      </AitCard>

      <CustomerDetailsUpdateAffiliateGroupModal
        visible={visible}
        setVisible={setVisible}
        customerId={customerId}
        handleFetchAffiliateGroups={handleFetchAffiliateGroups}
      />

      {/* CONFIRM REMOVE */}
      <AitConfirmationModal
        visible={removeModal}
        setVisible={setRemoveModal}
        description="This group will be removed"
        onConfirm={handleRemoveGroup}
      />
    </>
  );
};

export default CustomerDetailsAffiliateTab;
