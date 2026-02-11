import React from 'react';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { Col, Row, Space } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitTextAreaBox from '@/components/atoms/ait-text-area-box/aitTextAreaBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitCheckboxGroup from '../../atoms/ait-checkbox-group/aitCheckboxGroup';

import { updateCustomFieldApi } from '@/redux/apis/customers-api/customersApi';
import { updateCustomFieldValue } from '@/redux/customers-slice/customer-details-slices/customerDetailsSlice';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import dayjs from 'dayjs';

const EditCustomFieldModal = ({ visible, setVisible, field }) => {
  const dispatch = useDispatch();

  const { customFieldUpdating } = useSelector(
    (state) => state.customerDetailsState
  );

  if (!field) return null;

  // -----------------------------
  //  HANDLE INITIAL VALUES
  // -----------------------------
  const getInitialValue = () => {
    if (field.front_type !== 'checkbox') {
      return field.field_value || '';
    }

    // CASE 1: backend stored "Hindi,English"
    if (
      typeof field.field_value_str === 'string' &&
      field.field_value_str.length
    ) {
      return field.field_value_str.split(',').map((v) => v.trim());
    }

    // CASE 2: backend stored object { Hindi: true, English: true }
    if (typeof field.field_value === 'object' && field.field_value !== null) {
      return Object.keys(field.field_value);
    }

    return [];
  };

  const initialValues = { value: getInitialValue() };

  const validationSchema = Yup.object({
    value: Yup.mixed(),
  });

  // -----------------------------
  // RENDER FIELD INPUTS
  // -----------------------------
  const renderFieldInput = (type, options, values, setFieldValue) => {
    switch (type) {
      case 'text':
        return (
          <Field
            as={AitInputBox}
            label={field.field_label}
            name="value"
            placeholder={field.field_label}
          />
        );

      case 'textarea':
        return (
          <Field
            as={AitTextAreaBox}
            label={field.field_label}
            name="value"
            placeholder={field.field_label}
            rows={4}
          />
        );

      case 'select':
        return (
          <AitSelectBox
            label={field.field_label}
            name="value"
            value={values.value}
            options={options?.map((opt) => ({
              label: opt.name,
              value: opt.value,
            }))}
            onChange={(val) => setFieldValue('value', val)}
          />
        );

      case 'radio':
        return (
          <AitRadioButton
            label={field.field_label}
            name="value"
            value={values.value}
            options={options?.map((opt) => ({
              label: opt.name,
              value: opt.value,
            }))}
            onChange={(e) => setFieldValue('value', e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <AitCheckboxGroup
            label={field.field_label}
            name="value"
            value={values.value}
            options={field.fieldOptions.map((opt) => ({
              label: opt.name,
              value: opt.value,
            }))}
            onChange={(checkedValues) => {
              setFieldValue('value', checkedValues);
            }}
            boldLabel={true}
          />
        );

      case 'date':
      case 'datetime-local': {
        const isDateTime = field.front_type === 'datetime-local';

        return (
          <AitDatePicker
            name="value"
            label={field.field_label}
            picker="date"
            showTime={isDateTime}
            format={isDateTime ? 'MM/DD/YYYY hh:mm A' : 'MM/DD/YYYY'}
            placeholder={isDateTime ? 'MM/DD/YYYY hh:mm AM' : 'MM/DD/YYYY'}
            value={
              values?.value
                ? dayjs(
                    values.value,
                    isDateTime
                      ? ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DD HH:mm:ss']
                      : ['YYYY-MM-DD'],
                    true
                  )
                : null
            }
            onChange={(val) => {
              if (!val) {
                setFieldValue('value', '');
                return;
              }

              const formattedValue = isDateTime
                ? dayjs(val).format('YYYY-MM-DDTHH:mm') // API
                : dayjs(val).format('YYYY-MM-DD');

              setFieldValue('value', formattedValue);
            }}
          />
        );
      }

      default:
        return (
          <Field
            as={AitInputBox}
            label={field.field_label}
            name="value"
            placeholder={field.field_label}
          />
        );
    }
  };

  // -----------------------------
  //  SUBMIT HANDLER
  // -----------------------------
  const handleSubmit = async (values) => {
    let formattedValue = values.value;

    // Checkbox must send object {"Hindi": true, "English": true}
    if (field?.front_type === 'checkbox') {
      const obj = {};
      (values.value || []).forEach((item) => {
        obj[item] = true;
      });
      formattedValue = obj;
    }

    const isDateTime = field.front_type === 'datetime-local';

    const payload = {
      id: field.id,
      field_type: isDateTime ? 'datetime' : 'date',
      field_name: field.field_name,
      field_value: formattedValue,
      enc_customer_key: field.enc_customer_key,
      act: 'save_custom_field_data',
    };

    const res = await dispatch(updateCustomFieldApi(payload));

    if (res?.payload?.status === 'success') {
      setVisible(false);

      // Update UI instantly
      dispatch(
        updateCustomFieldValue({
          key: field.field_name,
          value:
            field.front_type === 'checkbox'
              ? values.value.join(', ')
              : values.value,
        })
      );
    }
  };

  // -----------------------------
  //  COMPONENT JSX
  // -----------------------------
  return (
    <AitModal
      open={visible}
      centered
      width={600}
      title="Edit custom field"
      footer={false}
      setVisible={setVisible}
      destroyOnClose
      maskClosable
      headerVisible
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  {renderFieldInput(
                    field.front_type,
                    field.fieldOptions,
                    values,
                    setFieldValue
                  )}
                </Col>
              </Row>

              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <AitButton
                    type="default"
                    title="Cancel"
                    style={{ width: '100%' }}
                    onClick={() => setVisible(false)}
                  />
                </Col>
                <Col span={12}>
                  <AitButton
                    type="primary"
                    title="Update"
                    htmlType="submit"
                    loading={customFieldUpdating}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Space>
          </Form>
        )}
      </Formik>
    </AitModal>
  );
};

export default EditCustomFieldModal;
