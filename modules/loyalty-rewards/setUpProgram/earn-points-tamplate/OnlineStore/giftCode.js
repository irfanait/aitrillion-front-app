import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Button, Col, Form, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { AlertBox, HelperText, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import {
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import logger from '@/utils/logger';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';

function GiftCodeForm({
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
}) {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (value) => {
    setLoading(true);
    value.rule_id = activityId;
    const formData = new FormData();
    for (const key in value) {
      if (value[key] !== undefined) {
        formData.append(key, value[key]);
      }
    }
    try {
      // const response = await updateActivitiesService(formData);
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          status: rowData.hasOwnProperty('id') ? rowData?.status : '1',
        };
        const updated = updateActivityData(
          activitiesData,
          activityId,
          updatedFields
        );
        dispatch(addEarnPointsListData(updated));
        notification.success({
          message: 'Activity updated successfully',
        });
        setIsModalOpen(false);
      } else {
        notification.success({
          message: response?.msg,
        });
      }
    } catch (error) {
      logger(error);
      notification.error({
        message: error?.response?.msg,
      });
      setIsModalOpen(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowData !== null) {
      form.setFieldsValue({
        panel_msg: rowData?.panel_msg || 'Earn: reward points for gift code',
        display_notification:
          rowData?.display_notification ||
          'You got {{points}} reward points for gift Code',
      });
    }
  }, [rowData]);

  return (
    <>
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
        message="You can change text in different languages."
        style={{ marginBottom: 24 }}
      />
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Col>
          <Form.Item
            name="panel_msg"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <AitInputBox
              textArea
              label="Description"
              labelSubText="Your customers will see this description on your store."
              required={true}
              rows={3}
              placeholder="Earn: reward points for gift code"
            />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name="display_notification"
            rules={[{ required: true, message: 'Please enter reward text' }]}
          >
            <AitInputBox
              textArea
              label="Reward text"
              labelSubText="Your customers will see this when they receive points."
              required={true}
              rows={3}
              placeholder="You got {{points}} reward points for gift Code"
            />
          </Form.Item>
        </Col>

        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={8}>
            <AitButton
              type="primary"
              title={rowData.hasOwnProperty('id') ? 'Update' : 'Save'}
              htmlType="submit"
              disabled={loading}
              loading={loading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={8}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              disabled={loading}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default GiftCodeForm;
