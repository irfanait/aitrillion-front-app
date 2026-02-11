import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'formik';
import { Row, Col, App } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { addMembershipPlanReset } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';
import {
  customerDetailsAddMembershipPlanApi,
  customerDetailsMembershipPlanListApi,
} from '@/redux/apis/customers-api/customersApi';
import {
  disableFutureDate,
  disableFutureTime,
  disablePastDate,
  disablePastTime,
} from '@/modules/email-marketing/utils/helper';
import { Formik, Field } from 'formik';
import { addMembershipSchema } from '../../utils/validationSchema';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitButton from '@/components/atoms/ait-button/aitButton';
import dayjs from 'dayjs';

const CustomerDetailsAddMembershipModal = ({
  visible,
  setVisible,
  customerId,
}) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const {
    membershipPlans,
    membershipPlansLoading,
    addMembershipPlanApiState,
    addMembershipPlansLoading,
    addMembershipPlansError,
  } = useSelector((state) => state.customerDetailsState);

  const { login_auth } = useSelector((s) => s.jwtState);

  // Fetch list of available membership plans
  useEffect(() => {
    if (visible) {
      const payload = {
        act: 'get_plan_list_by_type',
        membership_type: 2,
        shop_id: login_auth?.shop_id,
        shop_name: login_auth?.shop_name,
      };
      dispatch(customerDetailsMembershipPlanListApi(payload));
    }
  }, [visible, customerId]);

  useEffect(() => {
    if (addMembershipPlanApiState === 'success') {
      notification.success({
        message: addMembershipPlansError || 'Membership added successfully',
      });
      setVisible(false);
      dispatch(addMembershipPlanReset());
    }

    if (addMembershipPlanApiState === 'error') {
      notification.error({
        message: addMembershipPlansError || 'Membership added successfully',
      });
      dispatch(addMembershipPlanReset());
    }
  }, [addMembershipPlanApiState]);

  const initialValues = {
    plan_id: '',
    subscription_date: '',
    expire_date: '',
    customerId: customerId,
  };

  const planOptions =
    membershipPlans?.map((item) => ({
      label: item.plan_name,
      value: item.id,
    })) || [];

  const handleSubmit = async (values) => {
    const payload = {
      customer_id: customerId,
      plan_id: values.plan_id,
      act: 'create_manual_membership',
      subscription_date: dayjs(values.subscription_date).format('MM/DD/YYYY'),
      expire_date: dayjs(values.expire_date).format('MM/DD/YYYY'),
    };
    dispatch(customerDetailsAddMembershipPlanApi(payload));
  };

  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      title="Add membership"
      centered
      destroyOnClose
      width={550}
      footer={false}
      closeIconVisible={true}
      headerVisible={true}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={addMembershipSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {(formik) => {
          return (
            <Form>
              <Row gutter={[12, 24]} style={{ marginTop: '10px' }}>
                {/* MEMBERSHIP SELECT */}
                <Col span={24}>
                  <Field
                    as={AitSelectBox}
                    name="plan_id"
                    label="Select membership"
                    placeholder="Select membership"
                    options={planOptions}
                    loading={membershipPlansLoading}
                    value={formik.values.plan_id}
                    onChange={(val) => formik.setFieldValue('plan_id', val)}
                    required
                    error={formik.touched.plan_id && !!formik.errors.plan_id}
                    errorMessage={formik.errors.plan_id}
                  />
                </Col>

                {/* SUBSCRIPTION DATE */}
                <Col xs={24} sm={12}>
                  <Field
                    as={AitDatePicker}
                    name="subscription_date"
                    placeholder="MM-DD-YYYY"
                    label="Subscription date"
                    picker="date"
                    format="MM-DD-YYYY"
                    disabledDate={disableFutureDate}
                    disabledTime={disableFutureTime}
                    required
                    showTime={false}
                    value={
                      formik.values.subscription_date
                        ? dayjs(formik.values.subscription_date)
                        : null
                    }
                    onChange={(val) => {
                      if (!val) {
                        formik.setFieldValue('subscription_date', '');
                        return;
                      }

                      // Format exactly like your example
                      const formatted = dayjs(val).format('YYYY-MM-DD');

                      formik.setFieldValue('subscription_date', formatted);
                    }}
                    error={
                      formik.touched.subscription_date &&
                      !!formik.errors.subscription_date
                    }
                    errorMessage={formik.errors.subscription_date}
                  />
                </Col>

                {/* EXPIRATION DATE */}
                <Col xs={24} sm={12}>
                  <Field
                    as={AitDatePicker}
                    name="expire_date"
                    placeholder="MM-DD-YYYY"
                    label="Expiration date"
                    disabledDate={disablePastDate}
                    disabledTime={disablePastTime}
                    required
                    picker="date"
                    format="MM-DD-YYYY"
                    showTime={false}
                    value={
                      formik.values.expire_date
                        ? dayjs(formik.values.expire_date)
                        : null
                    }
                    onChange={(val) => {
                      if (!val) {
                        formik.setFieldValue('expire_date', '');
                        return;
                      }
                      const formatted = dayjs(val).format('YYYY-MM-DD');
                      formik.setFieldValue('expire_date', formatted);
                    }}
                    error={
                      formik.touched.expire_date && !!formik.errors.expire_date
                    }
                    errorMessage={formik.errors.expire_date}
                  />
                </Col>

                {/* BUTTONS */}
                <Col span={24}>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <AitButton
                        title="Add"
                        htmlType="submit"
                        type="primary"
                        style={{ width: '100%' }}
                        loading={addMembershipPlansLoading}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <AitButton
                        title="Cancel"
                        color="default"
                        variant="filled"
                        style={{ width: '100%' }}
                        onClick={() => setVisible(false)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </AitModal>
  );
};

export default CustomerDetailsAddMembershipModal;
