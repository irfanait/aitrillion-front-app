import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Space, Alert } from 'antd';
import { Field } from 'formik';
import AitAutocomplete from '@/components/atoms/ait-autocomplete/aitAutocomplete';
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { FormWrapper } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { validateFetchAudienceCounts } from '../../utils/validation';
import {
  resetCustomerCount,
  setAudienceCountFilter,
} from '@/redux/email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import { fetchAudienceCount } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { calculateABTestDistribution } from '../../utils/helper';

const { Title, Text } = Typography;

const CreateAbTargetAudienceForm = (props) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    setFieldError,
    setDistriutionCounts,
  } = props;

  const dispatch = useDispatch();
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const getAudienceCountState = useSelector(
    (state) => state.getAudienceCountState
  );

  const [includeAudienceList, setIncludeAudienceList] = useState([]);
  const [includeSegmentList, setIncludeSegmentList] = useState([]);

  useEffect(() => {
    const {
      audienceListApiState,
      audienceList,
      segmentListApiState,
      segmentList,
    } = campaignState;

    if (audienceListApiState === 'success' && audienceList?.length > 0) {
      const includeAudienceList = audienceList?.map((item) => ({
        label: item.external_name,
        value: item.id,
      }));
      setIncludeAudienceList(includeAudienceList);
    }
    if (segmentListApiState === 'success' && segmentList?.length > 0) {
      const includeSegment = segmentList?.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setIncludeSegmentList(includeSegment);
    }
  }, [
    campaignState?.audienceListApiState,
    campaignState?.initCustomerApiState,
    campaignState?.segmentListApiState,
  ]);

  useEffect(() => {
    if (getAudienceCountState?.fetchAudienceCountApiState === 'success') {
      const totalSubscribers = Number(
        getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers
      );

      // ⬇️ update Formik field directly
      setFieldValue('total_count', totalSubscribers);

      if (totalSubscribers > 10) {
        const percentageValue = Number(values?.abtesting_win_percentage);
        const getCounts = calculateABTestDistribution(
          totalSubscribers,
          percentageValue
        );
        setDistriutionCounts(getCounts);
      } else {
        setDistriutionCounts(null); // Optional: reset if below 10
      }
    }
  }, [
    getAudienceCountState?.fetchAudienceCountApiState,
    values?.abtesting_win_percentage,
  ]);

  const handleFetchAudienceCounts = async () => {
    // Run Formik field validation
    await validateForm();

    // Run custom validation (for include_lists / include_segments requirement)
    const fetchErrors = validateFetchAudienceCounts(values);

    if (Object.keys(fetchErrors).length > 0) {
      Object.entries(fetchErrors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
      return;
    }

    // Only send keys that have values to avoid unnecessary params
    const payload = {};
    [
      'include_lists',
      'include_segments',
      'exclude_lists',
      'exclude_segments',
    ].forEach((key) => {
      if (Array.isArray(values[key]) && values[key].length > 0) {
        payload[key] = values[key];
      }
    });

    dispatch(setAudienceCountFilter(payload));
    dispatch(fetchAudienceCount());
  };

  const handleCliearAudienceFilter = () => {
    setFieldValue('include_lists', []);
    setFieldValue('include_segments', []);
    setFieldValue('exclude_lists', []);
    setFieldValue('exclude_segments', []);

    setFieldValue('variantA.include_lists', []);
    setFieldValue('variantA.include_segments', []);
    setFieldValue('variantA.exclude_lists', []);
    setFieldValue('variantA.exclude_segments', []);

    setFieldValue('variantB.include_lists', []);
    setFieldValue('variantB.include_segments', []);
    setFieldValue('variantB.exclude_lists', []);
    setFieldValue('variantB.exclude_segments', []);

    dispatch(resetCustomerCount());
  };

  return (
    <FormWrapper>
      <Row gutter={[24, 24]}>
        {/* Include Audience Section */}
        <Col xs={24} md={12}>
          <Title level={5} type="primary">
            Include audience
          </Title>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: 'flex', marginTop: 12 }}
          >
            <Field
              as={AitAutocomplete}
              name="include_lists"
              label="Select include audience"
              placeholder="Choose list"
              value={values.include_lists}
              onChange={(value) => {
                setFieldValue('include_lists', value);
              }}
              labelIcon={<InfoCircleOutlined />}
              tooltipText="Exclude audience would not work If you will select In the case of selecting  all active customers will include."
              options={includeAudienceList}
              error={Boolean(errors.include_lists)}
              errorMessage={errors.include_lists || ''}
            />
            <Field
              as={AitAutocomplete}
              name="include_segments"
              placeholder="Choose segments"
              value={values.include_segments}
              onChange={(value) => {
                setFieldValue('include_segments', value);
              }}
              options={includeSegmentList}
              error={Boolean(errors.include_segments)}
              errorMessage={errors.include_segments || ''}
            />
          </Space>
        </Col>

        {/* Exclude Audience Section */}
        <Col xs={24} md={12}>
          <Title level={5} type="primary">
            Exclude audience <Text type="secondary">(Optional)</Text>
          </Title>

          <Space
            direction="vertical"
            size="middle"
            style={{ display: 'flex', marginTop: 12 }}
          >
            <Field
              as={AitAutocomplete}
              name="exclude_lists"
              label="Select exclude audience"
              placeholder="Choose list"
              value={values.exclude_lists}
              onChange={(value) => {
                setFieldValue('exclude_lists', value);
              }}
              options={includeAudienceList}
              error={Boolean(errors.exclude_lists)}
              errorMessage={errors.exclude_lists || ''}
            />
            <Field
              as={AitAutocomplete}
              name="exclude_segments"
              value={values.exclude_segments}
              onChange={(value) => {
                setFieldValue('exclude_segments', value);
              }}
              placeholder="Choose segments"
              options={includeSegmentList}
              error={Boolean(errors.exclude_segments)}
              errorMessage={errors.exclude_segments || ''}
            />
          </Space>
        </Col>
      </Row>

      {getAudienceCountState?.fetchAudienceCountApiState === 'success' &&
        getAudienceCountState?.fetchAudienceCounts?.totalEmailSubscribers <=
          Number(process.env.NEXT_PUBLIC_CREATE_AB_MINIMUM_CUSTOMER || 10) && (
          <Row justify="start" style={{ marginTop: 14 }}>
            <Col xs={24} md={24}>
              <Alert
                type="error"
                closable
                icon={<ExclamationCircleOutlined />}
                showIcon
                // onClose={handleCliearAudienceFilter}
                message={`A minimum of ${process.env.NEXT_PUBLIC_CREATE_AB_MINIMUM_CUSTOMER} contacts is needed to start the A/B test campaign.`}
              />
            </Col>
          </Row>
        )}
      <Row justify="start" gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={12} sm={12} md={12} lg={4}>
          <AitButton
            title="Fetch audience"
            htmlType="button"
            type="primary"
            // onClick={() => {
            //   handleFetchAudienceCounts(values, validateForm, setFieldError);
            // }}
            onClick={handleFetchAudienceCounts}
            loading={
              getAudienceCountState?.fetchAudienceCountApiState === 'pending'
            }
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={4}>
          <AitButton
            htmlType="button"
            color="default"
            variant="filled"
            title="Clear"
            onClick={handleCliearAudienceFilter}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default CreateAbTargetAudienceForm;
