import React, { useEffect, useMemo } from 'react';
import { Formik } from 'formik';
import { Row, Col, Spin, App, Flex } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCustomerDetailsaddToList,
  customerDetailsaddToList,
  customerDetailsgetListsApi,
} from '@/redux/apis/customers-api/customersApi';
import { createLisCustomerDetailstReset } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';
import AitText from '@/components/atoms/ait-text/aitText';

const CustomerDetailsAddListModal = (props) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { visible, setVisible, customerId } = props;

  const {
    listForAddList,
    listForAddListLoading,
    createLisCustomerDetailstApiState,
    createLisCustomerDetailstLoading,
    createLisCustomerDetailstError,
  } = useSelector((state) => state.customerDetailsState);

  useEffect(() => {
    if (!visible) return;

    const payload = {
      act: 'customer_list_for_addlist',
      customer_id: customerId,
    };
    dispatch(customerDetailsaddToList(payload));
  }, [visible]);

  useEffect(() => {
    if (createLisCustomerDetailstApiState === 'success') {
      notification.success({
        message: createLisCustomerDetailstError,
      });

      const payload = {
        act: 'customer_list',
        customer_id: customerId,
      };
      dispatch(customerDetailsgetListsApi(payload));

      setVisible(false);
      dispatch(createLisCustomerDetailstReset());
    }
    if (createLisCustomerDetailstApiState === 'error') {
      notification.error({
        message: createLisCustomerDetailstError,
      });
      dispatch(createLisCustomerDetailstReset());
    }
  }, [createLisCustomerDetailstApiState]);

  const availableLists = useMemo(() => {
    return listForAddList?.data || [];
  }, [listForAddList]);

  const alreadyAssignedLists = useMemo(() => {
    return listForAddList?.allreadyonlistdata || [];
  }, [listForAddList]);

  const listOptions = useMemo(() => {
    return availableLists.map((item) => ({
      id: item.id,
      name: item.external_name || item.internal_name || 'Unnamed List',
    }));
  }, [availableLists]);

  const handleSave = (values) => {
    if (values?.selected.length < 1) {
      notification.error({
        message: 'Please select at least one option',
      });
      return;
    }

    const payload = {
      act: 'customer_add_on_list',
      customer_id: customerId,
      id: values?.selected,
    };
    dispatch(createCustomerDetailsaddToList(payload));
  };

  const showEmptyState = !listForAddListLoading && availableLists.length === 0;

  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      title="List"
      centered
      width={450}
      footer={false}
      closeIconVisible
      headerVisible
    >
      {listForAddListLoading ? (
        <Flex
          justify="center"
          align="center"
          style={{
            height: 150,
          }}
        >
          <Spin />
        </Flex>
      ) : showEmptyState ? (
        <Flex
          justify="center"
          align="center"
          style={{
            height: 200,
            padding: '0 24px',
          }}
        >
          <AitText type="secondary" style={{ textAlign: 'center' }}>
            List not available. May be you have not created any list or all
            lists are assigned to this customer.
          </AitText>
        </Flex>
      ) : (
        <Formik
          initialValues={{
            selected: [],
          }}
          //   enableReinitialize
          onSubmit={(values) => {
            handleSave(values);
          }}
        >
          {(formik) => {
            const allIds = listOptions.map((x) => x.id);
            const isAllSelected =
              formik.values.selected.length === allIds.length;

            const toggleItem = (id, checked) => {
              if (checked) {
                formik.setFieldValue('selected', [
                  ...formik.values.selected,
                  id,
                ]);
              } else {
                formik.setFieldValue(
                  'selected',
                  formik.values.selected.filter((x) => x !== id)
                );
              }
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
                    {/* SELECT ALL */}
                    <AitCheckboxButton
                      label="Select all"
                      checked={isAllSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        if (checked) {
                          formik.setFieldValue('selected', allIds);
                        } else {
                          formik.setFieldValue('selected', []);
                        }
                      }}
                    />

                    {/* LIST ITEMS */}
                    <div style={{ marginTop: 10 }}>
                      {listOptions.map((item) => (
                        <div key={item.id} style={{ marginBottom: 10 }}>
                          <AitCheckboxButton
                            label={item.name}
                            checked={formik.values.selected.includes(item.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              formik.setFieldValue(
                                'selected',
                                checked
                                  ? [...formik.values.selected, item.id]
                                  : formik.values.selected.filter(
                                      (x) => x !== item.id
                                    )
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>

                {/* SAVE BUTTON */}
                <Col span={24}>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <AitButton
                        title="Save"
                        onClick={formik.handleSubmit}
                        type="primary"
                        // disabled={isSaveDisabled}
                        loading={createLisCustomerDetailstLoading}
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

export default CustomerDetailsAddListModal;
