import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { enterOnlyNumericValue } from '@/utils/common.util';
import { Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';

function FreeShippingForm({
  handleCancel,
  rowData,
  handleSubmit,
  formLoading,
  isEdit = true,
}) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    values.reward_id = rowData?.reward_id || rowData?.id;

    if (isEdit) {
      values.reward_setting_id = rowData?.id;
    } else {
      values.shop_reward_points = rowData?.points;
    }

    handleSubmit(values);
  };

  useEffect(() => {
    if (rowData && rowData !== null) {
      const formValues = {
        points_to_claim: rowData?.points_to_claim || '',
        heading_bottom_statement:
          rowData?.bottom_statement || 'Redeem {{POINTS}} points',
        reward_heading: rowData?.language || '{{FREE_SHIPPING}}',
      };

      form.setFieldsValue(formValues);
    }
  }, [rowData]);
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="points_to_claim"
        rules={[{ required: true, message: 'Please enter points to claim' }]}
      >
        <AitInputBox
          label="Points to claim"
          required
          placeholder="500"
          onKeyPress={enterOnlyNumericValue}
        />
      </Form.Item>

      <Form.Item
        name="reward_heading"
        // rules={[{ required: true, message: 'Please input reward title!' }]}
      >
        <AitInputBox
          label="Reward title"
          // required
          placeholder="Free Shipping"
        />
      </Form.Item>
      <Form.Item
        name="heading_bottom_statement"
        // rules={[{ required: true, message: 'Please input reward text!' }]}
      >
        <AitInputBox
          label="Reward text"
          // required
          placeholder="Redeem {{POINTS}} points"
        />
      </Form.Item>
      <Row gutter={[12, 12]} justify={'center'}>
        <Col xs={24} sm={8} md={8}>
          <AitButton
            type="primary"
            title={isEdit ? 'Update' : 'Save'}
            htmlType="submit"
            disabled={formLoading}
            loading={formLoading}
            block
          />
        </Col>
        <Col xs={24} sm={8} md={8}>
          <AitButton
            title="Cancel"
            variant="filled"
            color="default"
            onClick={handleCancel}
            disabled={formLoading}
            block
          />
        </Col>
      </Row>
    </Form>
  );
}

export default FreeShippingForm;
