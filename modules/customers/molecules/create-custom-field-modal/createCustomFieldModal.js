import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Row, Space, Tooltip, Divider, Spin, Flex } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import AitButton from '@/components/atoms/ait-button/aitButton';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';

import {
  continuousStringTooltip,
  fieldTypeOptions,
  filterGroupOptions,
  keyValueTooltip,
} from '../../utils/constant';
import { customFieldValidationSchema } from '../../utils/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkShopCustomFields,
  createCustomFieldApi,
} from '@/redux/apis/customers-api/customersApi';

const CreateCustomFieldModal = ({ visible, setVisible, initialData }) => {
  const isEdit = Boolean(initialData);

  const dispatch = useDispatch();

  const { createCusTomFieldLoading, checkFieldLoading } = useSelector(
    (state) => state.customFieldsState
  );

  const { shop_id } = useSelector((state) => state.jwtState.login_auth);

  const initialValues = {
    field_label: initialData?.field_label || '',
    field_type: initialData?.field_type || '',
    group: initialData?.group || '',
    map_type: initialData?.map_with_note_attribute_type || '',
    note_attribute_feild_name: initialData?.note_attribute_feild_name || '',
    is_show_in_my_account:
      initialData?.is_show_in_my_account === '1' ? true : false,
  };

  const validateLabelUniqueness = async (
    value,
    setFieldError,
    setFieldTouched
  ) => {
    if (isEdit) return true; // ✅ skip in edit mode

    const label = value?.trim();
    if (!label) return true;

    const alias = label.toLowerCase().replace(/\s+/g, '_');

    const action = await dispatch(
      checkShopCustomFields({
        act: 'check_shop_custom_fields',
        field_alias: alias,
        shop_id,
      })
    );

    if (
      checkShopCustomFields.fulfilled.match(action) &&
      action.payload?.status === 'error'
    ) {
      setFieldTouched('field_label', true, false);
      setFieldError('field_label', action.payload.msg);
      return false;
    }

    return true;
  };

  const handleCreateCustomField = async (
    values,
    { setFieldError, setFieldTouched }
  ) => {
    const label = values.field_label?.trim();
    if (!label) {
      setFieldTouched('field_label', true, false);
      setFieldError('field_label', 'Label name is required');
      return;
    }

    const alias = label.toLowerCase().replace(/\s+/g, '_');

    // ============================
    // VALIDATION: KEY NAME
    // ============================
    if (
      values.map_type === 'key_value' &&
      !values.note_attribute_feild_name?.trim()
    ) {
      setFieldTouched('note_attribute_feild_name', true, false);
      setFieldError('note_attribute_feild_name', 'Attribute key is required');
      return;
    }

    // ============================
    // UNIQUE CHECK (CREATE ONLY)
    // ============================
    if (!isEdit) {
      const checkAction = await dispatch(
        checkShopCustomFields({
          act: 'check_shop_custom_fields',
          field_alias: alias,
          shop_id,
        })
      );

      if (
        checkShopCustomFields.fulfilled.match(checkAction) &&
        checkAction.payload?.status === 'error'
      ) {
        setFieldTouched('field_label', true, false);
        setFieldError('field_label', checkAction.payload.msg);
        return;
      }
    }

    // ============================
    // BASE PAYLOAD
    // ============================
    const payload = {
      shop_id: Number(shop_id),
      field_label: values.field_label,
      field_alias: alias,
      field_type: values.field_type,
      group: values.group,
      map_with_note_attribute_type: values.map_type || null,
      note_attribute_feild_name:
        values.map_type === 'key_value'
          ? values.note_attribute_feild_name.trim()
          : '',
      is_show_in_my_account: values.is_show_in_my_account ? '1' : null,
    };

    // ============================
    // EDIT MODE – EXACT PAYLOAD
    // ============================
    if (isEdit) {
      Object.assign(payload, {
        id: initialData.id,
        field_id: initialData.field_id,
        field_name: initialData.field_name,
        data_type: null,
        options: initialData.options || '',
        deleted: initialData.deleted || '0',
        created_date: initialData.created_date,
        modified_date: initialData.modified_date,
        old_field_label: initialData.field_label,
        act: 'add_custom_field',
      });
    }

    // ============================
    // CREATE MODE
    // ============================
    else {
      Object.assign(payload, {
        act: 'add_custom_field',
        old_field_note_attr: '',
        last_field_count: -1,
        date_last_field_count: 0,
        text_last_field_count: 0,
      });
    }

    dispatch(createCustomFieldApi(payload));
  };

  return (
    <AitModal
      open={visible}
      centered
      width={550}
      footer={false}
      headerVisible
      closeIconVisible
      setVisible={setVisible}
      destroyOnClose
      title={isEdit ? 'Edit custom field' : 'Create custom field'}
      headerSubTitle
      headerSubTitleName="You are allowed to create up to 100 custom fields throughout your lifetime."
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={customFieldValidationSchema}
        onSubmit={handleCreateCustomField}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldError,
          setFieldTouched,
        }) => {
          return (
            <Form>
              <Space
                direction="vertical"
                style={{ width: '100%', marginTop: 20 }}
              >
                <Row gutter={[24, 20]}>
                  {/* Label name */}
                  <Col span={24}>
                    <Field
                      as={AitInputBox}
                      name="field_label"
                      label="Label name"
                      value={values.field_label}
                      placeholder="Enter label name"
                      required
                      suffix={checkFieldLoading ? <Spin size="small" /> : null}
                      onChange={(e) => {
                        setFieldValue('field_label', e.target.value);
                        setFieldError('field_label', '');
                      }}
                      onBlur={(e) =>
                        validateLabelUniqueness(
                          e.target.value,
                          setFieldError,
                          setFieldTouched
                        )
                      }
                      error={touched.field_label && !!errors.field_label}
                      errorMessage={errors.field_label}
                    />
                  </Col>

                  {/* Select type */}
                  <Col span={24}>
                    <Field
                      as={AitSelectBox}
                      name="field_type"
                      label="Select type"
                      required
                      disabled={isEdit}
                      options={fieldTypeOptions}
                      value={values.field_type}
                      onChange={(value) => setFieldValue('field_type', value)}
                      placeholder="Select type"
                      error={touched.field_type && !!errors.field_type}
                      errorMessage={errors.field_type}
                    />
                  </Col>

                  {/* Filter group */}
                  <Col span={24}>
                    <Field
                      as={AitSelectBox}
                      name="group"
                      label="Select filter group"
                      required
                      value={values.group}
                      options={filterGroupOptions}
                      onChange={(value) => setFieldValue('group', value)}
                      placeholder="Select group"
                      error={touched.group && !!errors.group}
                      errorMessage={errors.group}
                    />
                  </Col>

                  <Col span={24}>
                    {/* First radio option */}
                    <div>
                      <AitRadioButton
                        fontweight="500"
                        marginbottom="6"
                        name="map_type"
                        value={values.map_type}
                        onChange={(e) =>
                          setFieldValue('map_type', e.target.value)
                        }
                        options={[
                          {
                            value: 'key_value',
                            label: (
                              <Flex align="center">
                                Map with Shopify's note attribute using a
                                key-value format.
                                <Tooltip
                                  placement="top"
                                  title={keyValueTooltip}
                                >
                                  <InfoCircleOutlined
                                    style={{
                                      marginLeft: 2,
                                    }}
                                  />
                                </Tooltip>
                              </Flex>
                            ),
                          },
                        ]}
                      />
                      {/* Key name input */}
                      {values.map_type === 'key_value' && (
                        <div style={{ marginBottom: 20 }}>
                          <Field
                            as={AitInputBox}
                            name="note_attribute_feild_name"
                            placeholder="Enter attribute key"
                            value={values.note_attribute_feild_name}
                            required
                            error={
                              touched.note_attribute_feild_name &&
                              !!errors.note_attribute_feild_name
                            }
                            errorMessage={errors.note_attribute_feild_name}
                          />
                        </div>
                      )}
                    </div>

                    {/* Second radio option */}
                    <Flex style={{ marginTop: 10 }}>
                      <AitRadioButton
                        fontweight="500"
                        marginbottom="0"
                        name="map_type"
                        value={values.map_type}
                        onChange={(e) =>
                          setFieldValue('map_type', e.target.value)
                        }
                        options={[
                          {
                            value: 'string',
                            label: (
                              <Flex align="center">
                                Map with Shopify's note attribute as one
                                continuous string.
                                <Tooltip
                                  placement="top"
                                  title={continuousStringTooltip}
                                >
                                  <InfoCircleOutlined
                                    style={{
                                      marginLeft: 2,
                                    }}
                                  />
                                </Tooltip>
                              </Flex>
                            ),
                          },
                        ]}
                        error={touched.map_type && !!errors.map_type}
                        errorMessage={errors.map_type}
                      />
                    </Flex>
                  </Col>

                  {/* Checkbox */}
                  <Col span={24}>
                    <AitCheckboxButton
                      label="Show in customer account"
                      name="is_show_in_my_account"
                      value={values.is_show_in_my_account}
                      onChange={(e) =>
                        setFieldValue('is_show_in_my_account', e.target.checked)
                      }
                    />
                  </Col>
                </Row>

                {/* Footer */}
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <AitButton
                      type="primary"
                      htmlType="submit"
                      title="Save"
                      loading={createCusTomFieldLoading || checkFieldLoading}
                      block
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <AitButton
                      color="default"
                      title="Cancel"
                      variant="filled"
                      onClick={() => setVisible(false)}
                      block
                    />
                  </Col>
                </Row>
              </Space>
            </Form>
          );
        }}
      </Formik>
    </AitModal>
  );
};

export default CreateCustomFieldModal;
