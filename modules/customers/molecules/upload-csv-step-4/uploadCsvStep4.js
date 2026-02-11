import React, { useState } from 'react';
import { Row, Col, Typography, App } from 'antd';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAiShopSettingApi,
  updateListImportStep4Api,
} from '@/redux/apis/customers-api/customersApi';
import ImportCsvFinalModal from '../import-csv-final-modal/importCsvFinalModal';
import ContactSupportModal from '../contact-support-modal/contactSupportModal';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useRouter } from 'next/router';
import { Field } from 'formik';

const { Title, Text } = Typography;

const UploadCsvStep4 = ({ formik, back }) => {
  const { values } = formik;
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification } = App.useApp();
  const { uploadCsvData } = useSelector((s) => s.importCsvState);

  const { list } = useSelector((state) => state.importCsvState);

  const { login_auth } = useSelector((s) => s.jwtState);
  const [finalModalVisible, setFinalModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailChacked, setEmailChacked] = useState(false);
  const [email, setEmail] = useState('');

  const includedListTitles = list
    ?.filter((item) => values.selectedListId.includes(item.id))
    .map((item) => item.external_name);

  const exclusiveListTitle = list
    ?.filter((item) => values.removeFromListIds.includes(item.id))
    .map((item) => item.external_name);

  const csvHeaders = uploadCsvData?.csvHeaders || [];
  const csvFields = uploadCsvData?.fields || [];
  const mapping = values.mapping || {};

  const getMappedLabel = (fieldName) =>
    csvFields.find((f) => f.name === fieldName)?.title || fieldName;

  const getAiShopSetting = async () => {
    setLoading(true);
    const payload = {
      act: 'get_ai_shop_setting',
      shop_id: login_auth?.shop_id,
    };

    const response = await dispatch(getAiShopSettingApi(payload));
    if (response?.payload?.status === 'success') {
      notification.success({ message: 'Request sent successfully' });
      await handleFinish();
    } else {
      notification.error({
        message: response?.payload?.msg || 'Something went wrong',
      });
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    const payload = {
      shop_id: Number(login_auth?.shop_id),
      csv_id: Number(uploadCsvData?.csvDetails?.id),
      isFinish: 1,
      reason_of_block: 1,
      notify_email: values.notify_email || '',
      send_email: values.send_email ? 1 : 0,
    };

    const response = await dispatch(updateListImportStep4Api(payload));

    if (response?.payload?.status === 'success') {
      notification.success({ message: 'Import completed successfully' });
      setLoading(false);
      setEmailChacked(false);
      setEmail('');
      router.push('/customers/import-csv/list');
    } else {
      notification.error({
        message: response?.payload?.msg || 'Something went wrong',
      });
    }
  };

  return (
    <div style={{ padding: '12px 6px' }}>
      <Title level={4}>Please review the details of your contact import</Title>

      <Row gutter={[40, 20]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Text strong>Import Type:</Text>
          <br />
          <Text>{values.upload_action.replace(/_/g, ' ')}</Text>
          <br />
          <br />

          <Text strong>File Name:</Text>
          <br />
          <Text>{values.file_name}</Text>
          <br />
          <br />

          <Text strong>From:</Text>
          <br />
          <Text>Comma-separated value (CSV) file</Text>
          <br />
          <br />

          <Text strong>Header Row Present:</Text>
          <br />
          <Text>{values.first_row_header ? 'Yes' : 'No'}</Text>
          <br />
          <br />

          <Text strong>Contact Source:</Text>
          <br />
          <Text>{values.obtain_from}</Text>
          <br />
          <br />

          <Text strong>Source Description:</Text>
          <br />
          <Text>{values.source_desc}</Text>
          <br />
          <br />
          <Text strong>
            Would you like to be notified by email when this import is
            finished?:
          </Text>
          <br />
          <AitCheckboxButton
            name="send_email"
            label="Send email"
            value={values.send_email}
            onChange={(e) => {
              formik.setFieldValue('send_email', e.target.checked);
              if (!e.target.checked) {
                formik.setFieldValue('notify_email', '');
              }
            }}
          />

          {values.send_email && (
            <Field
              as={AitInputBox}
              name="notify_email"
              placeholder="Enter email address"
              value={values.notify_email}
              onChange={(e) =>
                formik.setFieldValue('notify_email', e.target.value)
              }
              error={formik.touched.notify_email && formik.errors.notify_email}
              errorMessage={formik.errors.notify_email}
            />
          )}
        </Col>

        <Col span={12}>
          <Text strong>Create New List:</Text>
          <br />
          <Text>{values.createNewList ? 'Yes' : 'No'}</Text>
          <br />
          <br />

          <Text strong>New List Name:</Text>
          <br />
          <Text>
            {values.createNewList
              ? `${values.internal_name} / ${values.external_name}`
              : '-'}
          </Text>
          <br />
          <br />

          <Text strong>Inclusive List:</Text>
          <br />
          <Text>
            {includedListTitles?.length > 0 && (
              <Text type="primary">
                {includedListTitles.length > 0
                  ? includedListTitles.join(', ')
                  : '—'}
              </Text>
            )}
          </Text>
          <br />
          <br />

          <Text strong>Exclusive List:</Text>
          <br />
          <Text>
            {exclusiveListTitle?.length > 0 && (
              <Text type="primary">
                {exclusiveListTitle.length > 0
                  ? exclusiveListTitle.join(', ')
                  : '—'}
              </Text>
            )}
          </Text>
          <br />
          <br />

          <Text strong>Column to Field Mappings:</Text>
          <br />
          {Object.keys(mapping).map((header) => (
            <div key={header}>
              <Text strong>{header}</Text> <Text>=&gt;</Text>{' '}
              <Text>{getMappedLabel(mapping[header])}</Text>
            </div>
          ))}
        </Col>
      </Row>

      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <AitButton title="Back" onClick={back} />
        <AitButton
          type="primary"
          title="Finish"
          loading={loading}
          onClick={async () => {
            // mark step-4 fields as touched
            formik.setFieldTouched('send_email', true);
            formik.setFieldTouched('notify_email', true);

            const errors = await formik.validateForm();
            if (errors.notify_email) return; // ❌ stop here

            // ✅ only proceed if valid
            getAiShopSetting();
          }}
        />
      </div>

      {/* <ImportCsvFinalModal
        visible={finalModalVisible}
        setVisible={setFinalModalVisible}
        setContactModalVisible={setContactModalVisible}
        email={email}
        setEmail={setEmail}
        setEmailChacked={setEmailChacked}
        emailChacked={emailChacked}
      />

      <ContactSupportModal
        visible={contactModalVisible}
        setVisible={setContactModalVisible}
      /> */}
    </div>
  );
};

export default UploadCsvStep4;
