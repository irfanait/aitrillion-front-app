import React, { useEffect } from 'react';
import { Row, Col, Upload, Typography, Divider, App, Flex } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitTextAreaBox from '@/components/atoms/ait-text-area-box/aitTextAreaBox';

import { Field } from 'formik';
import s3 from '@/utils/config/awsConfig';
import { useDispatch, useSelector } from 'react-redux';

import { uploadCsvApi } from '@/redux/apis/customers-api/customersApi';
import {
  imporCsvPartiallyReset,
  setIMportCsvLoading,
} from '@/redux/customers-slice/import-csv-slices/importCsvSlices';
import AitText from '@/components/atoms/ait-text/aitText';

const { Text, Paragraph, Title } = Typography;

const UploadCsvStep1 = ({ formik, next }) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setFieldTouched,
    setFieldError,
  } = formik;

  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const {
    uploadCsvData,
    uploadCsvLoading,
    uploadCsvApiState,
    uploadCsvMessage,
  } = useSelector((state) => state.importCsvState);

  const radioOptions = [
    {
      label: 'Update existing contacts, add new contacts',
      value: 'update_existing_add_new_contacts',
    },
    { label: 'Add new contacts', value: 'add_new_contacts' },
    { label: 'Update existing contacts', value: 'update_existing_contacts' },
    {
      label: 'Unsubscribe both new and existing contacts',
      value: 'unsubscribe_all',
    },
    {
      label: 'Unsubscribe only existing contacts',
      value: 'unsubscribe_existing',
    },
  ];

  /* ------------------------------------------------------
      HANDLE API RESPONSE 
  ------------------------------------------------------ */
  useEffect(() => {
    if (uploadCsvApiState === 'success') {
      dispatch(imporCsvPartiallyReset());
      notification.success({ message: uploadCsvMessage });

      /** very important:
       * update isUpdating with id returned from backend
       */
      if (uploadCsvData?.csvDetails?.id) {
        setFieldValue('isUpdating', uploadCsvData.csvDetails.id);
      }

      next();
    }

    if (uploadCsvApiState === 'error') {
      dispatch(imporCsvPartiallyReset());
      notification.error({
        message: uploadCsvMessage || 'Something went wrong',
      });
    }
  }, [uploadCsvApiState]);

  const handleCsvUpload = async () => {
    try {
      dispatch(setIMportCsvLoading(true));

      const file = values.file;

      if (!file) {
        setFieldError('file', 'CSV file is required');
        return;
      }

      await new Promise((resolve, reject) => {
        AWS.config.credentials.get((err) => {
          if (err) {
            console.error('Cognito error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Create unique key (same as Angular)
      const generatedName = `csv-${Date.now()}.csv`;
      const key = `contact-csv-import/${generatedName}`;

      const uploadParams = {
        Key: key,
        Body: file,
        ContentType: 'text/csv',
        ACL: 'public-read',
      };

      // Upload to S3
      await s3.upload(uploadParams).promise();

      // Prepare final backend payload
      const payload = {
        file_name: values.file_name,
        key,
        isUpdating: values.isUpdating, // If coming back after step2, this will be updated
        shop_id: Number(values.shop_id),
        first_row_header: values.first_row_header,
        upload_action: values.upload_action,
        emailMapped: values.emailMapped,
        term_service: values.term_service,
        obtain_from: values.obtain_from,
        source_desc: values.source_desc,
        double_obtain_customer: values.double_obtain_customer,
      };

      dispatch(uploadCsvApi(payload));
    } catch (err) {
      dispatch(setIMportCsvLoading(false));
      setFieldError('file', err.message);
      notification.error({ message: err.message });
    }
  };

  return (
    <div>
      <AitText type="primary" bottommargin={20}>
        Before importing any contacts into AiTrillion, you must certify that the
        contacts have been collected in compliance with the permission marketing
        policy; specifically, the list consists only of contacts who have
        provided explicit and deliberated permission to receive email from you.
        Please be advised we will remove addresses with a prefix of jhon-doe@ or
        tom@.
      </AitText>

      <AitText type="primary" bottommargin={30}>
        Additionally, you must provide a brief description of the source and
        methods used to collect these contacts.{' '}
      </AitText>

      <AitText size="18" weight="500" bottommargin={20} type="primary">
        Certify list compliance
      </AitText>

      {/* Terms Checkbox */}
      <Field
        as={AitCheckboxButton}
        name="term_service"
        label="I agree to the Terms of Service above"
        checked={values.term_service}
        onChange={(e) => setFieldValue('term_service', e.target.checked)}
        marginbottom="20"
        error={touched.term_service && errors.term_service}
        errorMessage={errors.term_service}
      />

      <Row gutter={[24, 24]}>
        {/* Obtain From */}
        <Col xs={24} sm={24} md={12}>
          <Field
            as={AitInputBox}
            name="obtain_from"
            label="Where did you obtain these contacts from?"
            placeholder="Enter source"
            value={values.obtain_from}
            onChange={(e) => setFieldValue('obtain_from', e.target.value)}
            error={touched.obtain_from && errors.obtain_from}
            errorMessage={errors.obtain_from}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {/* Description */}
        <Col xs={24} sm={24} md={12} style={{ marginTop: 24 }}>
          <Field
            as={AitInputBox}
            name="source_desc"
            label="Source description"
            labelSubText="Minimum 20 characters"
            required
            textArea // ✅ IMPORTANT
            rows={4} // ✅ AntD TextArea prop
            value={values.source_desc}
            onChange={(e) => setFieldValue('source_desc', e.target.value)}
            error={touched.source_desc && errors.source_desc}
            errorMessage={errors.source_desc}
          />
        </Col>

        {/* Double Opt-In */}
        <Col xs={24}>
          <Field
            as={AitCheckboxButton}
            name="double_obtain_customer"
            label="Is this list containing double opt-in customers?"
            checked={values.double_obtain_customer}
            onChange={(e) =>
              setFieldValue('double_obtain_customer', e.target.checked)
            }
            error={
              touched.double_obtain_customer && errors.double_obtain_customer
            }
            errorMessage={errors.double_obtain_customer}
          />
        </Col>

        {/* CSV UPLOAD */}

        <Col xs={24}>
          <Flex vertical gap={8}>
            <AitText strong size={18} marginBottom={0}>
              Import CSV file:
            </AitText>
            <Upload
              beforeUpload={(file) => {
                const maxSize = 50 * 1024 * 1024;
                if (file.size > maxSize) {
                  setFieldValue('file', null);
                  setFieldValue('file_name', '');
                  setFieldError('file', 'File must be less than 50MB');
                  return Upload.LIST_IGNORE;
                }

                setFieldValue('file', file);
                setFieldValue('file_name', file.name);

                setFieldTouched('file', true);
                setFieldError('file', undefined);

                return false;
              }}
              showUploadList={false}
              accept=".csv"
            >
              <AitButton title="Browse file" icon={<UploadOutlined />} />
            </Upload>
          </Flex>

          {values.file_name && (
            <>
              <span style={{ color: '#1890ff', fontWeight: 500 }}>
                {values.file_name}
              </span>

              <span
                style={{ cursor: 'pointer', color: '#999' }}
                onClick={() => {
                  setFieldValue('file', null);
                  setFieldValue('file_name', '');
                  setFieldTouched('file', false);
                  setFieldError('file', undefined);
                }}
              >
                <DeleteOutlined />
              </span>
            </>
          )}

          {touched.file && errors.file && (
            <Text type="danger">{errors.file}</Text>
          )}
        </Col>

        {/* Header Row */}
        <Col xs={24}>
          <Field
            as={AitCheckboxButton}
            name="first_row_header"
            label="First row of file is header row"
            checked={values.first_row_header}
            onChange={(e) =>
              setFieldValue('first_row_header', e.target.checked)
            }
            marginbottom={0}
          />
        </Col>

        {/* Radio Options */}
        <Col xs={24}>
          <p style={{ fontWeight: 500 }}>
            What do you want to do with these contacts?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {radioOptions.map((option) => (
              <div key={option.value} style={{ width: '32%', marginBottom: 8 }}>
                <Field
                  as={AitRadioButton}
                  name="upload_action"
                  options={[option]}
                  value={values.upload_action}
                  onChange={(e) =>
                    setFieldValue('upload_action', e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </Col>

        {/* NEXT BUTTON */}
        <Col xs={24}>
          <AitButton
            type="primary"
            title="Next"
            loading={uploadCsvLoading}
            onClick={async () => {
              Object.keys(values).forEach((field) =>
                setFieldTouched(field, true)
              );

              const formErrors = await formik.validateForm();
              if (Object.keys(formErrors).length > 0) return;

              await handleCsvUpload();
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UploadCsvStep1;
