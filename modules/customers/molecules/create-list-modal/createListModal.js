import AitButton from '@/components/atoms/ait-button/aitButton';
import AitTextAreaBox from '@/components/atoms/ait-text-area-box/aitTextAreaBox';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { Col, Row, Space } from 'antd';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { createListValidationSchema } from '../../utils/validationSchema';
import { useDispatch, useSelector } from 'react-redux';
import { createListApi } from '@/redux/apis/customers-api/customersApi';

const CreateListModal = (props) => {
  const { visible, setVisible, mode, initialData } = props;
  const dispatch = useDispatch();
  const { createListLoading } = useSelector((state) => state.listState);
  const { login_auth } = useSelector((s) => s.jwtState);

  const initialValues =
    mode === 'edit' && initialData
      ? {
          internal_name: initialData.internal_name ?? '',
          external_name: initialData.external_name ?? '',
          description: initialData.description ?? '',
        }
      : {
          internal_name: '',
          external_name: '',
          description: '',
        };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      shop_id: login_auth.shop_id,
      id: mode === 'edit' ? initialData.id : undefined,
    };
    dispatch(createListApi(payload));
  };

  return (
    <>
      <AitModal
        open={visible}
        centered
        headerTitleLevel={3}
        footer={false}
        headerVisible
        closeIconVisible
        width={600}
        title={mode === 'edit' ? 'Edit list' : 'Create a new list'}
        setVisible={setVisible}
        destroyOnClose
        maskClosable
      >
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={createListValidationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <Space
                direction="vertical"
                size="large"
                style={{ width: '100%', marginTop: '16px' }}
              >
                {/* show form when creating or editing */}
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Field
                      as={AitInputBox}
                      name="internal_name"
                      label="Internal name"
                      placeholder="Internal name"
                      labelSubText="This name is only visible within your account"
                      value={values.internal_name}
                      required
                      error={touched.internal_name && errors.internal_name}
                      errorMessage={errors.internal_name}
                    />
                  </Col>
                  <Col span={24}>
                    <Field
                      as={AitInputBox}
                      name="external_name"
                      label="External name"
                      placeholder="External name"
                      value={values.external_name}
                      labelSubText="This name appears to your contacts if you make this list visible on a web form."
                      required
                      error={touched.external_name && errors.external_name}
                      errorMessage={errors.external_name}
                    />
                  </Col>

                  <Col span={24}>
                    <Field
                      as={AitTextAreaBox}
                      name="description"
                      label="Description"
                      placeholder="Description"
                      labelSubText="This description will only be displayed to you, not your contacts."
                      showCount
                      maxLength={1000}
                      value={values.description}
                      rows={5}
                      error={touched.description && errors.description}
                      errorMessage={errors.description}
                    />
                  </Col>
                  <Col span={24}>
                    {/* footer buttons */}
                    <Row gutter={[12, 12]} style={{ marginTop: 20 }}>
                      <Col span={12}>
                        <AitButton
                          type="primary"
                          htmlType="submit"
                          loading={createListLoading}
                          title={mode === 'edit' ? 'Update' : 'Save'}
                          block
                        />
                      </Col>
                      <Col span={12}>
                        <AitButton
                          title="Cancel"
                          variant="filled"
                          color="default"
                          block
                          onClick={() => {
                            setVisible(false);
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Space>
            </Form>
          )}
        </Formik>
      </AitModal>
    </>
  );
};

export default CreateListModal;
