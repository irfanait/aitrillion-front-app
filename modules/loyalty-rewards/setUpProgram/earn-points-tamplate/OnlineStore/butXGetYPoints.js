import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Form, Input, Radio, Row, Select, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { AlertBox, HelperText, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
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
import { InfoCircleOutlined } from '@ant-design/icons';
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Option } = Select;

function BuyXGetYPointsForm({
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);

  const handleActivityUpdate = async (value) => {
    setLoading(true);

    value.buy_x_get_y_points = value?.language;
    value.rule_id = activityId;

    const formData = new FormData();
    for (const key in value) {
      if (value[key] !== undefined) {
        formData.append(key, value[key]);
      }
    }
    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          points: value?.points,
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
        goal_spend: rowData?.goal_spend || '',
        points: rowData.points || '',
        d_x_get_y_points_order_status:
          rowData.d_x_get_y_points_order_status || 'markaspaid',
        language: rowData?.language || 'Buy $X get Y points',
        panel_msg:
          rowData?.panel_msg ||
          'Earn: {{points}} reward points for completing a purchase goal.',
        display_notification:
          rowData?.display_notification ||
          'You got {{points}} reward points for completing a purchase goal.',
        redirection_url:
          rowData?.redirection_url || jwtState?.login_auth?.domain || '',
        points_per_text: rowData?.points_per_text || 'points per',
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

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          goal_spend: '',
          points: '',
          d_x_get_y_points_order_status: '',
          language: '',
          panel_msg: '',
          display_notification: '',
          redirection_url: '',
          points_per_text: '',
        }}
        onFinish={handleActivityUpdate}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="goal_spend"
              rules={[
                { required: true, message: 'Please enter goal spend' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === '') {
                      return Promise.resolve();
                    }
                    if (isNaN(value) || Number(value) <= 0) {
                      return Promise.reject(
                        'Goal spend must be greater than 0'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox
                label={`Goal spend(${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)})`}
                labelIcon={<InfoCircleOutlined />}
                required={true}
                tooltipText="The amount a customer must spend at your store during the campaign
              to receive the reward."
                placeholder="1"
                // style={{ marginTop: 25 }}
              />
            </Form.Item>
          </Col>

          {/* <Col xs={24} md={12}>
            <Form.Item
              name="points_per_text"
              rules={[{ required: true, message: 'Please enter points' }]}
            >
              <AitInputBox
                tooltipText="Change heading in different languages in shop loyalty tier list."
                required={true}
                labelIcon={<InfoCircleOutlined />}
                label="Points per heading"
                placeholder="Points per"
              />
            </Form.Item>
          </Col> */}
          <Col xs={24} md={12}>
            <Form.Item
              name="points"
              rules={[
                { required: true, message: 'Please enter points' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === '') {
                      return Promise.resolve();
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
                label="Points awarded"
                onKeyPress={enterOnlyNumericValue}
                placeholder="1"
                required
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              // label=""
              name="language"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                label="Campaign name"
                tooltipText="The name as it will appear on your store."
                required={true}
                labelIcon={<InfoCircleOutlined />}
                placeholder="Buy $X get Y points"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="redirection_url"
              // rules={[{ required, message: 'Please enter a valid URL' }]}
            >
              <AitInputBox
                label="Page URL"
                placeholder="Add redirection URL"
                // style={{ marginTop: 21 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Earn point rule"
              name="d_x_get_y_points_order_status"
              rules={[{ required: true, message: 'Please select a rule' }]}
            >
              <Radio.Group>
                <StyledRadio value="markaspaid">
                  Order status is paid
                </StyledRadio>
                <StyledRadio value="onfulfilled">
                  Order status is fulfilled
                </StyledRadio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {/* <Col xs={24} md={12}>
            <Form.Item
              name="points"
              rules={[
                { required: true, message: 'Please enter points awarded' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === '') {
                      return Promise.resolve();
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
                label="Points awarded"
                onKeyPress={enterOnlyNumericValue}
                placeholder="1"
              />
            </Form.Item>
          </Col> */}
          <Col xs={24} md={12}>
            <Form.Item
              name="points_per_text"
              rules={[{ required: true, message: 'Please enter points' }]}
            >
              <AitInputBox
                tooltipText="Change heading in different languages in shop loyalty tier list."
                required={true}
                labelIcon={<InfoCircleOutlined />}
                label="Points per heading"
                placeholder="Points per"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Label>Reward text </Label>
            <HelperText>
              Your customers will see this when they receive points.
            </HelperText>
            <Form.Item
              name="display_notification"
              rules={[{ required: true, message: 'Please enter reward text' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="You got {{points}} reward points for completing a purchase goal."
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Label>Description </Label>
            <HelperText>
              Your customers will see this description on your store.
            </HelperText>
            <Form.Item
              name="panel_msg"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Earn: {{points}} reward points for completing a purchase goal."
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
              loading={loading}
              disabled={loading}
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

export default BuyXGetYPointsForm;
