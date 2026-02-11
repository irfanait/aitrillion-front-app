import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  convertToFormDataCustom,
  enterOnlyNumericValue,
} from '@/utils/common.util';
import logger from '@/utils/logger';
import { App, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { addPointService, removePointService } from '../../../api/giftCode';

function GivAndReturnPointForm({
  removePointModal,
  setGivPointModal,
  setRemovePointModal,
  getDetailsData,
  getHistoryData,
  getOrderData,
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    let obj = {};
    obj.point = values?.points;
    obj.reason = values?.reason;
    obj.customer_id = id;

    const converted = Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v === undefined || v === null
          ? ''
          : typeof v === 'boolean'
            ? Number(v)
            : v,
      ])
    );
    let payload = convertToFormDataCustom(converted);
    try {
      let response = removePointModal
        ? await removePointService(payload)
        : await addPointService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        getDetailsData(id);
        getHistoryData(id, 1, 10, 'tal.date_created', false);
        getOrderData(id, 1, 10, 'o.created_at', false);
        setGivPointModal(false);
        setRemovePointModal(false);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }

    // handleSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ marginTop: 10 }}
    >
      <Form.Item
        name="points"
        rules={[{ required: true, message: 'Please enter points' }]}
      >
        <AitInputBox
          required
          label="Points"
          placeholder="Enter points"
          onKeyPress={enterOnlyNumericValue}
        />
      </Form.Item>

      <Form.Item name="reason">
        <AitInputBox label="Reason" placeholder="Enter reason" />
      </Form.Item>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <AitButton
          type="primary"
          title={removePointModal ? 'Remove Points' : 'Give Points'}
          htmlType="submit"
          disabled={loading}
          loading={loading}
        />
        <AitButton
          title="Cancel"
          variant="filled"
          color="default"
          onClick={() => {
            setRemovePointModal(false);
            setGivPointModal(false);
          }}
          disabled={loading}
        />
      </div>
    </Form>
  );
}

export default GivAndReturnPointForm;
