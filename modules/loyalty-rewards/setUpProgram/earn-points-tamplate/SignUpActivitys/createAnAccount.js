import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { AlertBox, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { enterOnlyNumericValue } from '@/utils/common.util';
import logger from '@/utils/logger';
import {
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';

function CreateAnAccountForm({
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
    formData.append('create_an_account', value?.campaignName);
    formData.append('panel_msg', value?.description);
    formData.append('display_notification', value?.rewardText);
    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          points: value?.points,
          create_an_account: value?.campaignName,
          panel_msg: value?.description,
          display_notification: value?.rewardText,
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
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowData !== null) {
      form.setFieldsValue({
        points: rowData.points || '',
        campaignName: rowData.language || 'Create an account',
        description:
          rowData?.panel_msg ||
          'Earn {{points}} reward points for creating an account',
        rewardText:
          rowData?.display_notification ||
          'You earned {{points}} reward points for creating an account',
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
                { required: true, message: 'Please enter points' },
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
              <AitInputBox
                required
                label="Points awarded"
                placeholder="100"
                onKeyPress={(e) => {
                  // onCheckValue(e);
                  enterOnlyNumericValue(e);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="campaignName"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                required
                label="Campaign name"
                placeholder="Create an account"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Label>Description </Label>
            <Form.Item name="description">
              <Input.TextArea
                rows={3}
                placeholder="Earn {{points}} reward points for creating an account"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Label>Reward text </Label>
            <Form.Item name="rewardText">
              <Input.TextArea
                rows={3}
                placeholder="You earned {{points}} reward points for creating an account"
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

export default CreateAnAccountForm;
