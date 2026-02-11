import React, { useState } from 'react';
import { Form, Row, Col, Flex, Divider } from 'antd';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitText from '@/components/atoms/ait-text/aitText';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

const DiscountCodeFilterForm = ({ onApplyFilter, onResetFilter, onClose }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    discountCode: '',
    discountCategory: 'all',
    discountStatus: 'all',
    discountType: 'all',
    startDate: null,
    endDate: null,
  });

  const categoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Birthday discounts', value: '2000' },
    { label: 'Points redeemed discounts', value: '1' },
  ];

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Claimed', value: '1' },
    { label: 'Used', value: '2' },
  ];

  const typeOptions = [
    { label: 'All', value: 'all' },
    { label: 'Other (Amount and Percentage off)', value: 'am_and_per' },
    { label: 'Free shipping', value: 'FREESHIPPING' },
  ];

  const handleValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const handleApply = () => {
    const values = form.getFieldsValue();

    // Transform 'all' values to empty string for API payload
    const transformedValues = {
      ...values,
      discountCategory:
        values.discountCategory === 'all' ? '' : values.discountCategory,
      discountStatus:
        values.discountStatus === 'all' ? '' : values.discountStatus,
      discountType: values.discountType === 'all' ? '' : values.discountType,
    };

    // Always apply filter when Apply is clicked
    // This allows users to clear filters and apply the cleared state
    if (onApplyFilter) {
      onApplyFilter(transformedValues);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClearAll = (e) => {
    e.preventDefault();

    const emptyValues = {
      name: '',
      email: '',
      discountCode: '',
      discountCategory: 'all',
      discountStatus: 'all',
      discountType: 'all',
      startDate: null,
      endDate: null,
    };

    // Explicitly set all fields to empty/null values
    form.setFieldsValue(emptyValues);
    setFormValues(emptyValues);

    // Always call onResetFilter to clear parent component's filter state
    // This ensures that any previously applied filters are cleared, even if
    // the form fields were manually cleared with the (×) icon before clicking Clear All
    if (onResetFilter) {
      onResetFilter();
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 180px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '12px 16px',
        boxSizing: 'border-box',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <AitText size={16} weight={600}>
          Filters
        </AitText>
        <CloseOutlined
          onClick={onClose}
          style={{
            fontSize: 16,
            cursor: 'pointer',
            padding: 8,
            color: '#666',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
        />
      </Flex>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={formValues}
      >
        {/* Discount Category Section */}
        <div style={{ marginBottom: 12 }}>
          <Form.Item
            name="discountCategory"
            label="Discount category"
            style={{ marginBottom: 0 }}
          >
            <AitSelectBox
              showSearch={false}
              allowClear={false}
              options={categoryOptions}
              placeholder="Select discount category"
              style={{ width: '100%', minHeight: 40 }}
            />
          </Form.Item>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Form.Item
            name="discountType"
            label="Discount type"
            style={{ marginBottom: 0 }}
          >
            <AitSelectBox
              showSearch={false}
              allowClear={false}
              options={typeOptions}
              placeholder="Select discount type"
              style={{ width: '100%', minHeight: 40 }}
            />
          </Form.Item>
        </div>

        {/* Date Range Section */}

        {/* Discount Status and Discount Type Section */}
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
            <Form.Item
              name="discountStatus"
              label="Discount status"
              style={{ marginBottom: 0 }}
            >
              <AitSelectBox
                showSearch={false}
                allowClear={false}
                options={statusOptions}
                placeholder="Select discount status"
                style={{ width: '100%', minHeight: 40 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
            <Form.Item
              name="discountCode"
              label="Discount code"
              style={{ marginBottom: 0 }}
            >
              <AitInputBox
                placeholder="Enter discount code"
                autoComplete="off"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Name and Email Section */}
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
            <Form.Item name="name" label="Name" style={{ marginBottom: 0 }}>
              <AitInputBox placeholder="Enter name" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
            <Form.Item name="email" label="Email" style={{ marginBottom: 0 }}>
              <AitInputBox placeholder="Enter email" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginBottom: 12 }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
              <Form.Item
                label="From"
                name="startDate"
                style={{ marginBottom: 0 }}
              >
                <AitDatePicker
                  showTime={false}
                  showToday={false}
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%', minWidth: 0, minHeight: 40 }}
                  format="DD/MM/YYYY"
                  autoComplete="off"
                  disabledDate={(current) => {
                    const to = form.getFieldValue('endDate');
                    if (!to) return current && current.isAfter(moment());
                    return (
                      current &&
                      (current.isAfter(moment()) || current.isAfter(to))
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} style={{ minWidth: 0 }}>
              <Form.Item label="To" name="endDate" style={{ marginBottom: 0 }}>
                <AitDatePicker
                  showTime={false}
                  showToday={false}
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%', minWidth: 0, minHeight: 40 }}
                  format="DD/MM/YYYY"
                  autoComplete="off"
                  disabledDate={(current) => {
                    const from = form.getFieldValue('startDate');
                    if (!from) return current && current.isAfter(moment());
                    return (
                      current &&
                      (current.isAfter(moment()) || current.isBefore(from))
                    );
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Discount Code Section */}
        {/* <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
         
        </Row> */}

        {/* Action Buttons */}
        <Row gutter={[12, 12]} style={{ marginTop: 20, paddingBottom: 8 }}>
          <Col xs={24} sm={12}>
            <AitButton
              title="Clear all"
              type="default"
              block
              onClick={handleClearAll}
              style={{ minHeight: 44, fontSize: 15, fontWeight: 500 }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <AitButton
              title="Apply"
              type="primary"
              block
              onClick={handleApply}
              style={{ minHeight: 44, fontSize: 15, fontWeight: 500 }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DiscountCodeFilterForm;
