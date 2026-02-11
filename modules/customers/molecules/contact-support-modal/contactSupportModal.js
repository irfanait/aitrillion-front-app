// ContactSupportModal.jsx
import React from 'react';
import { Row, Col, App } from 'antd';
import styled from 'styled-components';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';

import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { useDispatch, useSelector } from 'react-redux';
import AitTextAreaBox from '@/components/atoms/ait-text-area-box/aitTextAreaBox';
import { contactSupportApi } from '@/redux/apis/customers-api/customersApi';

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
`;

const departmentOptions = [
  { label: 'Technical', value: 'Technical,irfan+support@aitrillion.com' },
  { label: 'Billing', value: 'Billing,irfan+support@aitrillion.com' },
  { label: 'General', value: 'General,irfan+support@aitrillion.com' },
  { label: 'Enterprises', value: 'Enterprise,support@aitrillion.com' },
];

const ContactSupportModal = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { login_auth } = useSelector((s) => s.jwtState);

  const initialValues = {
    department: 'Billing,irfan+support@aitrillion.com',
    first_name: login_auth?.first_name || '',
    last_name: login_auth?.last_name || '',
    email: login_auth?.email || '',
    phone: '',
    message: '',
  };

  const schema = Yup.object().shape({
    department: Yup.string().required('Required'),
    first_name: Yup.string().required('Required'),
    email: Yup.string().email().required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      email: values.email,
      first_name: `${values.first_name} ${values.last_name}`.trim(),
      department: values.department,
      message: values.message,
      domain: login_auth?.domain,
      sub: 'Contacting Us',
    };

    const response = await dispatch(contactSupportApi(payload));

    if (response?.payload?.status === 'success') {
      notification.success({ message: 'Request sent successfully' });
      setVisible(false);
    } else {
      notification.error({
        message: response?.payload?.msg || 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <AitModal open={visible} setVisible={setVisible} width={540} centered>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <>
            <Title>We are here to help you</Title>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Field
                  as={AitSelectBox}
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={(val) => formik.setFieldValue('department', val)}
                  options={departmentOptions}
                  error={
                    formik.touched.department && !!formik.errors.department
                  }
                  errorMessage={formik.errors.department}
                />
              </Col>

              <Col span={12}>
                <Field
                  as={AitInputBox}
                  name="first_name"
                  placeholder="First Name"
                  value={formik.values.first_name}
                  onChange={(e) =>
                    formik.setFieldValue('first_name', e.target.value)
                  }
                  error={
                    formik.touched.first_name && !!formik.errors.first_name
                  }
                  errorMessage={formik.errors.first_name}
                />
              </Col>

              <Col span={12}>
                <Field
                  as={AitInputBox}
                  name="last_name"
                  placeholder="Last Name"
                  value={formik.values.last_name}
                  onChange={(e) =>
                    formik.setFieldValue('last_name', e.target.value)
                  }
                  error={formik.touched.last_name && !!formik.errors.last_name}
                  errorMessage={formik.errors.last_name}
                />
              </Col>

              <Col span={12}>
                <Field
                  as={AitInputBox}
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue('email', e.target.value)
                  }
                  error={formik.touched.email && !!formik.errors.email}
                  errorMessage={formik.errors.email}
                />
              </Col>

              <Col span={12}>
                <Field
                  as={AitInputBox}
                  name="phone"
                  placeholder="Phone Number"
                  value={formik.values.phone}
                  onChange={(e) =>
                    formik.setFieldValue('phone', e.target.value)
                  }
                />
              </Col>

              <Col span={24}>
                <Field
                  as={AitTextAreaBox}
                  name="message"
                  placeholder="Message"
                  value={formik.values.message}
                  onChange={(e) =>
                    formik.setFieldValue('message', e.target.value)
                  }
                  rows={3}
                />
              </Col>

              <Col span={24}>
                <AitButton
                  title="Send request"
                  type="primary"
                  style={{ width: '100%' }}
                  onClick={formik.handleSubmit}
                  loading={formik.isSubmitting}
                />
              </Col>
            </Row>
          </>
        )}
      </Formik>
    </AitModal>
  );
};

export default ContactSupportModal;
