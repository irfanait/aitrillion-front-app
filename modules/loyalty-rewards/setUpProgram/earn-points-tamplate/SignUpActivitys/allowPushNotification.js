import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { AlertBox, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
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

function AllowPushNotificationForm({
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

  const handleActivityUpdate = async (value) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('rule_id', activityId);
    formData.append('points', value?.points);
    formData.append('allow_push', value?.language);
    formData.append('panel_msg', value?.panel_msg);
    formData.append('display_notification', value?.display_notification);
    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          points: value?.points,
          allow_push: value?.language,
          panel_msg: value?.panel_msg,
          display_notification: value?.display_notification,
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
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowData !== null) {
      form.setFieldsValue({
        points: rowData.points || '',
        language: rowData.language || 'Allow a push',
        panel_msg:
          rowData?.panel_msg ||
          'Earn {{points}} reward points when you allow web push notifications.',
        display_notification:
          rowData?.display_notification ||
          'You earned {{points}} reward points for allowing web push notifications.',
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
      <Form form={form} layout="vertical" onFinish={handleActivityUpdate}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="points"
              rules={[
                { required: true, message: 'Please enter campaign name' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === '') {
                      return Promise.resolve();
                    }
                    if (!/^\d+$/.test(value)) {
                      return Promise.reject('Points must be an integer');
                    }
                    if (isNaN(value) || Number(value) <= 0) {
                      return Promise.reject('Points must be greater than 0');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox label="Points awarded" required placeholder="100" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="language"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                label="Campaign name"
                required
                placeholder="Allow a push"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Label>Description</Label>
            <Form.Item name="panel_msg">
              <Input.TextArea
                rows={3}
                placeholder="Earn {{points}} reward points when you allow web push notifications."
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Label>Reward text</Label>
            <Form.Item name="display_notification">
              <Input.TextArea
                rows={3}
                placeholder="You earned {{points}} reward points for allowing web push notifications."
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={rowData.hasOwnProperty('id') ? 'Update' : 'Save'}
              htmlType="submit"
              disabled={loading}
              loading={loading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
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

export default AllowPushNotificationForm;
