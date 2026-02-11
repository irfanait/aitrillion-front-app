import React, { useEffect, useState } from 'react';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { App, Col, Row, Spin, Flex } from 'antd';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  customerDetailsAssignGroupApi,
  customerDetailsGetAffiliateGroupListApi,
  customerDetailsUpdateAffiliateGroupApi,
} from '@/redux/apis/customers-api/customersApi';
import {
  customerDetailsAssignGroupReset,
  customerDetailsUpdateAffiliateGroupReset,
} from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';

const CustomerDetailsUpdateAffiliateGroupModal = (props) => {
  const { visible, setVisible, customerId, handleFetchAffiliateGroups } = props;
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { login_auth } = useSelector((s) => s.jwtState);

  const [newGroupId, setNewGroupId] = useState('');

  const {
    getAffiliateGroupList,
    getAffiliateGroupListLoading,
    affiliateGroups,
    customerDetailsUpdateAffiliateGroupApiState,
    customerDetailsUpdateAffiliateGroupLoading,
    customerDetailsUpdateAffiliateGroupError,

    customerDetailsAssignAffiliateGroupApiState,
    customerDetailsAssignAffiliateGroupLoading,
    customerDetailsAssignAffiliateGroupError,

    data,
  } = useSelector((state) => state.customerDetailsState);

  useEffect(() => {
    if (visible) {
      const payload = {
        act: 'get_groups_list_assigned',
        shop_id: login_auth?.shop_id,
      };
      dispatch(customerDetailsGetAffiliateGroupListApi(payload));
    }
  }, [visible]);

  useEffect(() => {
    if (customerDetailsUpdateAffiliateGroupApiState === 'success') {
      dispatch(customerDetailsUpdateAffiliateGroupReset());
      handleAssignGroup();
    }
    if (customerDetailsUpdateAffiliateGroupApiState === 'error') {
      notification.error({
        message: customerDetailsUpdateAffiliateGroupError,
      });
      dispatch(customerDetailsUpdateAffiliateGroupReset());
    }
  }, [customerDetailsUpdateAffiliateGroupApiState]);

  useEffect(() => {
    if (customerDetailsAssignAffiliateGroupApiState === 'success') {
      notification.success({
        message: customerDetailsAssignAffiliateGroupError,
      });
      setVisible(false);
      setNewGroupId('');
      handleFetchAffiliateGroups();
      dispatch(customerDetailsAssignGroupReset());
    }
    if (customerDetailsAssignAffiliateGroupApiState === 'error') {
      notification.error({
        message: customerDetailsAssignAffiliateGroupError,
      });
      dispatch(customerDetailsAssignGroupReset());
    }
  }, [customerDetailsAssignAffiliateGroupApiState]);

  // Save selected group
  const handleSave = (group_id) => {
    setNewGroupId(group_id);
    const oldAssignedGroupId = affiliateGroups?.[0]?.id || 0;

    const savePayload = {
      act: 'group_assigned_log',
      shop_id: login_auth?.shop_id,
      customer_id: customerId,
      new_group_id: group_id,
      old_group_id: oldAssignedGroupId,
      shop_id: login_auth?.shop_id,
    };

    dispatch(customerDetailsUpdateAffiliateGroupApi(savePayload));
  };

  const handleAssignGroup = () => {
    const assignPayload = {
      act: 'assign_group_customer',
      customer_id: customerId,
      group_id: newGroupId,
      shop_id: login_auth?.shop_id,
      shopify_customer_id: data?.[0]?.shopify_customer_id,
    };

    dispatch(customerDetailsAssignGroupApi(assignPayload));
  };

  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      title="Group"
      centered
      width={450}
      footer={false}
      closeIconVisible
      headerVisible
    >
      {getAffiliateGroupListLoading ? (
        <Flex
          justify="center"
          align="center"
          style={{
            height: 150,
          }}
        >
          <Spin />
        </Flex>
      ) : (
        <Formik
          initialValues={{
            selected: affiliateGroups?.[0]?.id || null,
          }}
          enableReinitialize
          onSubmit={(values) => handleSave(values.selected)}
        >
          {(formik) => {
            const handleSingleSelect = (id) => {
              formik.setFieldValue('selected', id);
            };

            return (
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <div
                    style={{
                      maxHeight: 330,
                      overflowY: 'auto',
                      paddingRight: 8,
                    }}
                  >
                    <div style={{ marginTop: 10 }}>
                      {getAffiliateGroupList?.map((item) => (
                        <div key={item.id} style={{ marginBottom: 10 }}>
                          <AitCheckboxButton
                            label={item.group_name}
                            checked={formik.values.selected === item.id}
                            onChange={() => handleSingleSelect(item.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>

                {/* SAVE BUTTONS */}
                <Col span={24}>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <AitButton
                        title="Save"
                        type="primary"
                        loading={
                          customerDetailsUpdateAffiliateGroupLoading ||
                          customerDetailsAssignAffiliateGroupLoading
                        }
                        onClick={formik.handleSubmit}
                        block
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <AitButton
                        title="Cancel"
                        variant="filled"
                        color="default"
                        onClick={() => setVisible(false)}
                        block
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          }}
        </Formik>
      )}
    </AitModal>
  );
};

export default CustomerDetailsUpdateAffiliateGroupModal;
