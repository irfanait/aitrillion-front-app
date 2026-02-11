import React, { useEffect, useRef } from 'react';
import { App, Button, Col, Row, Space } from 'antd';
import { Typography } from 'antd';
import AitTable from '@/components/molecules/ait-table/aitTable';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDomainReset,
  setDomainListFilters,
} from '@/redux/email-marketing-slices/settingsSlice/settingsSlice';
import {
  addDomainApi,
  getDomainListApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { domainSchema } from '../../utils/validation';

const { Text } = Typography;
const DomainSuppressionTab = (props) => {
  const { onDeleteClick } = props;
  const columns = [
    {
      title: 'Domain Name',
      width:200,
      dataIndex: 'suppress_domain',
      key: 'suppress_domain',
    },
    {
      title: 'Domain Status',
      width:150,
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        // You can customize this to show labels like 'Active', 'Deleting' etc.
        const statusMap = {
          1: 'In process',
          2: 'Completed',
          3: 'Deleting',
        };
        return statusMap[status] || 'Not processed';
      },
    },
    {
      title: 'Created Date',
      width:150,
      dataIndex: 'created_date',
      key: 'created_date',
    },
    {
      title: 'Updated Date',
      width:150,
      dataIndex: 'updated_date',
      key: 'updated_date',
    },
    {
      title: 'Action',
      width:120,
      key: 'action',
      width:120,
     // className:"action-column",
      render: (_, record) =>
        record.status !== '3' ? (
          <Button color="primary" variant="outlined" size="small"
            onClick={() => onDeleteClick(record.id)}
          >Delete</Button>
        ) : null,
    },
  ];

  const dispatch = useDispatch();

  const { notification } = App.useApp();
  const {
    domainList,
    addDomainApiState,
    addDomainMessage,
    addDomainLoading,
    getDomainListLoading,
  } = useSelector((state) => state.emailMarketingSettingsState);
  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '' } = userDetails || {};

  useEffect(() => {
    dispatch(setDomainListFilters({ act: 'get_suppress_domains' }));
    dispatch(getDomainListApi());
  }, []);

  useEffect(() => {
    if (addDomainApiState === 'success') {
      notification.success({
        message: addDomainMessage,
      });

      dispatch(addDomainReset());
      dispatch(setDomainListFilters({ act: 'get_suppress_domains' }));
      dispatch(getDomainListApi());
    }
    if (addDomainApiState === 'error') {
      notification.error({
        message: addDomainMessage,
      });
      dispatch(addDomainReset());
    }
  }, [addDomainApiState]);

  const handleSaveDomain = (values) => {
    const payload = {
      act: 'save_suppress_domain',
      shop_id: shop_id,
      suppress_domain: values?.domainName,
    };
    dispatch(addDomainApi(payload));
  };

  return (
    <>
      <Formik
        initialValues={{ domainName: '' }}
        validationSchema={domainSchema}
        onSubmit={(values) => {
          handleSaveDomain(values); // call your API or save logic here
        }}
      >
        {({ values, errors, touched, setFieldValue, setTouched }) => (
          <Form>
            <Row gutter={[15, 10]} align="start">
              <Col xs={24} sm={12} md={8}>
                <Field
                  as={AitInputBox}
                  name="domainName"
                  value={values?.domainName}
                  placeholder="Enter domain suppress"
                  error={touched.domainName && !!errors.domainName}
                  errorMessage={touched.domainName && errors.domainName}
                />
              </Col>
              <Col xs={12} sm={6} md={2}>
                <AitButton
                  htmlType="submit"
                  title="Save"
                  type="primary"
                  loading={addDomainLoading}
                  style={{ height: 40, width: '100%' }}
                />
              </Col>
              <Col xs={12} sm={6} md={2}>
                <AitButton
                  title="Clear"
                  type="default"
                  style={{ height: 40, width: '100%' }}
                  onClick={() => {
                    setFieldValue('domainName', '');
                    setTouched({ domainName: false });
                  }}
                />
              </Col>
                <Col xs={24} sm={24} md={24}>
                   <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    Ex.: Please enter email domain like flipkart.com
                  </Text>
                </Col>
            </Row>           
          </Form>
        )}
      </Formik>
      <AitTable
        columns={columns}
        dataSource={domainList}
        showFilters={false}
        loading={getDomainListLoading}
        marginleft={'-10px'}
        marginright={'-10px'}
        style={{marginTop:10}}
          scroll={{ y: 55 * 5 }}        
      />
    </>
  );
};

export default DomainSuppressionTab;
