import React, { useState } from 'react';
import { Form, Row, Col, Flex, Divider } from 'antd';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitText from '@/components/atoms/ait-text/aitText';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import moment from 'moment';

const DiscountCodeFilter = ({ onApplyFilter, onResetFilter, onClose }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    discountCode: '',
    status: '',
    startDate: null,
    endDate: null,
  });

  const statusOptions = [
    { label: 'Claimed', value: 'claimed' },
    { label: 'Used', value: 'used' },
  ];

  const handleValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const handleApply = () => {
    const values = form.getFieldsValue();

    // Always apply filter when Apply is clicked
    // This allows users to clear filters and apply the cleared state
    if (onApplyFilter) {
      onApplyFilter(values);
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
      status: '',
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
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '10px 12px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <AitText size={16} weight={600}>
          Filters
        </AitText>
        <AitLink href="#" onClick={handleClearAll} color="primary" size={14}>
          Clear all
        </AitLink>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={formValues}
      >
        <div style={{ marginBottom: 8 }}>
          <Row gutter={[8, 10]}>
            <Col xs={24} sm={12} style={{ minWidth: 0 }}>
              <Form.Item
                label="From"
                name="startDate"
                style={{ marginBottom: 0 }}
              >
                <AitDatePicker
                  showTime={false}
                  showToday={false}
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%', minWidth: 0 }}
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
            <Col xs={24} sm={12} style={{ minWidth: 0 }}>
              <Form.Item label="To" name="endDate" style={{ marginBottom: 0 }}>
                <AitDatePicker
                  showTime={false}
                  showToday={false}
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%', minWidth: 0 }}
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

        {/* Status and Name Section */}
        <Row gutter={[8, 10]} style={{ marginBottom: 0 }}>
          <Col xs={24} sm={12} style={{ minWidth: 0 }}>
            <Form.Item name="status" label="Status" style={{ marginBottom: 0 }}>
              <AitSelectBox
                options={statusOptions}
                placeholder="Select status"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ minWidth: 0 }}>
            <Form.Item name="name" label="Name" style={{ marginBottom: 0 }}>
              <AitInputBox
                placeholder="Enter name"
                allowClear
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Email and Discount Code Section */}
        <Row gutter={[8, 10]} style={{ marginTop: 10 }}>
          <Col xs={24} sm={12} style={{ minWidth: 0 }}>
            <Form.Item name="email" label="Email" style={{ marginBottom: 0 }}>
              <AitInputBox
                placeholder="Enter email"
                allowClear
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} style={{ minWidth: 0 }}>
            <Form.Item
              name="discountCode"
              label="Discount code"
              style={{ marginBottom: 0 }}
            >
              <AitInputBox
                placeholder="Enter code"
                allowClear
                autoComplete="off"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Apply Button */}
        <div style={{ marginTop: 14, paddingBottom: 4 }}>
          <AitButton title="Apply" type="primary" block onClick={handleApply} />
        </div>
      </Form>
    </div>
  );
};

export default DiscountCodeFilter;
