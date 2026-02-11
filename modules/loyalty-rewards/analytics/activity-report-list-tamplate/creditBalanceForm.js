import AitButton from '@/components/atoms/ait-button/aitButton';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { convertToFormDataCustom } from '@/utils/common.util';
import logger from '@/utils/logger';
import { App, Form } from 'antd';
import { useState } from 'react';
import { saveExportReportPendingService } from '../../api/analytics';

function CredtiBalanceForm({ getListData, setCreditBalanceModal }) {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [formLoading, setFormLoading] = useState(false);

  function getLastThreeMonths() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let result = [];
    let date = new Date();

    for (let i = 0; i < 3; i++) {
      let year = date.getFullYear();
      let month = date.getMonth();

      result.push(`${year}-${months[month]}`);

      // move to previous month
      date.setMonth(date.getMonth() - 1);
    }

    return result;
  }

  const arr = getLastThreeMonths()?.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  const onFinish = async (value) => {
    setFormLoading(true);
    try {
      let payload = { ...value };

      const response = await saveExportReportPendingService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setCreditBalanceModal(false);
        getListData(1, 20);
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      // requiredMark={(label) => (
      //   <>
      //     <label>
      //       {label}
      //       <span
      //         style={{ color: 'var(--ant-color-text-error)', marginLeft: 3 }}
      //       >
      //         *
      //       </span>
      //     </label>
      //   </>
      // )}
      onFinish={onFinish}
    >
      <Form.Item
        label="Select month"
        name="report_date"
        rules={[{ required: true, message: 'Please select report month.' }]}
      >
        <AitSelectBox placeholder="Select month" options={arr} />
      </Form.Item>

      <Form.Item
        name="receiver_email"
        rules={[{ required: true, message: 'Email required' }]}
      >
        <AitInputBox label="Email" required placeholder="Enter your email" />
      </Form.Item>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <AitButton
          type="primary"
          title="Save"
          htmlType="submit"
          //   disabled={formLoading}
        />
        <AitButton
          title="Cancel"
          variant="filled"
          color="default"
          onClick={() => setCreditBalanceModal(false)}
          //   disabled={formLoading}
        />
      </div>
    </Form>
  );
}

export default CredtiBalanceForm;
