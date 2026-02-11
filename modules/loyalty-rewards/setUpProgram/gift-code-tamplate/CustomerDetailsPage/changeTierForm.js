import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  checkValidData,
  convertToFormDataCustom,
  enterOnlyNumericValue,
} from '@/utils/common.util';
import logger from '@/utils/logger';
import { App, Checkbox, Form, Select, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { assignedTierService } from '../../../api/giftCode';
import { Label } from '../style';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Option } = Select;
const { Text } = Typography;

function ChangeTierForm({
  setChangeTierModal,
  getDetailsData,
  detailsData,
  getHistoryData,
  getOrderData,
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [isForever, setIsForever] = useState(false);
  const [months, setMonths] = useState(12);

  const onFinish = async (values) => {
    setLoading(true);
    let obj = { ...values };
    obj.current_tier_id = detailsData?.lyt_customer_tier_id;
    obj.is_tier_assign_forever = isForever;
    obj.no_of_mnths = months;
    obj.customer_id = id;
    let payload = convertToFormDataCustom(obj);
    try {
      let response = await assignedTierService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        getDetailsData(id);
        getHistoryData(id, 1, 10, 'tal.date_created', false);
        getOrderData(id, 1, 10, 'o.created_at', false);
        setChangeTierModal(false);
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
  };

  useEffect(() => {
    if (detailsData?.lyt_customer_tier_id) {
      let formValues = {
        current_tier_id: detailsData?.lyt_customer_tier_id,
        new_tier_id:
          parseFloat(detailsData?.lyt_customer_tier_id) > 0
            ? detailsData?.lyt_customer_tier_id
            : undefined,
        is_tier_assign_forever:
          parseFloat(detailsData?.is_lifetime_assigned) > 0 ? true : false,
      };
      form.setFieldsValue(formValues);
      setIsForever(
        parseFloat(detailsData?.is_lifetime_assigned) > 0 ? true : false
      );
    }
  }, [detailsData]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ marginTop: 10 }}
    >
      <Form.Item
        style={{ marginTop: 8 }}
        name="new_tier_id"
        rules={[{ required: true, message: 'Please select a tier' }]}
      >
        <AitSelectBox
          required={true}
          label="Select tier"
          placeholder="Select tier"
          name="new_tier_id"
          notFoundContent="No tier found"
          options={
            detailsData?.activeTierList?.length > 0
              ? detailsData?.activeTierList?.map((opt) => ({
                  label: opt.tier_name,
                  value: opt.id,
                }))
              : []
          }
          labelSubText="The customer will be immediately moved into this tier."
        />
        {/* <Select>
          {detailsData?.activeTierList?.length > 0 &&
            detailsData?.activeTierList?.map((item, index) => (
              <Option value={item?.id} key={index}>
                {checkValidData(item?.tier_name)}
              </Option>
            ))}
        </Select> */}
      </Form.Item>

      <Label>Duration</Label>
      <Form.Item style={{ marginTop: 8 }} name="is_tier_assign_forever">
        <Checkbox
          checked={isForever}
          onChange={(e) => setIsForever(e.target.checked)}
        >
          Forever
        </Checkbox>

        {!isForever && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              <Form.Item
                name="tierduration"
                style={{ width: 500, marginBottom: 8 }}
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <AitInputBox
                  min={1}
                  value={months}
                  onChange={(e) => setMonths(e?.target?.value)}
                  placeholder="12"
                  onKeyPress={enterOnlyNumericValue}
                />
              </Form.Item>
              <span style={{ marginBottom: 8 }}>
                <AitButton disabled type="default" title="Month" />
              </span>
            </div>
            <AitAlert
              type="warning"
              justify="start"
              //hascustomicon={false}
              barfontsize="13"
              barpadding="8px 10px"
              alignicon="start"
              textAlign="left"
              icontopspacing="2"
              border
              borderradius
              showIcon
              color="var(--ant-color-text-default)"
              message="The customer will remain in this tier for the duration you choose
              or for the specified number of months. When this duration expires,
              they’ll move to another tier based on your VIP settings."
            />
          </>
        )}
      </Form.Item>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <AitButton
          type="primary"
          title="Change tier"
          htmlType="submit"
          disabled={loading}
          loading={loading}
        />
        <AitButton
          title="Cancel"
          variant="filled"
          color="default"
          onClick={() => {
            setChangeTierModal(false);
          }}
          disabled={loading}
        />
      </div>
    </Form>
  );
}

export default ChangeTierForm;
