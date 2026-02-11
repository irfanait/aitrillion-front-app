import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { HelperText, Label } from '../style';
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
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import { InfoCircleOutlined } from '@ant-design/icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Option } = Select;

function BuyXOrderGetYPointsForm({
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

    value.on_x_orders_get_y_points = value?.language;
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
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowData !== null) {
      form.setFieldsValue({
        goal_purchases: rowData?.goal_purchases || '',
        points: rowData.points || '',
        language: rowData.language || 'On X orders get Y points',
        min_spend_per_purchase: rowData?.min_spend_per_purchase || '0',
        redirection_url:
          rowData?.redirection_url || jwtState?.login_auth?.domain || '',
        x_order_get_y_points_order_status:
          rowData?.x_order_get_y_points_order_status || 'markaspaid',
        panel_msg:
          rowData?.panel_msg ||
          'Earn: {{points}} reward points for completing a X Orders get Y points activity.',
        display_notification:
          rowData?.display_notification ||
          'You got {{points}} reward points for completing a X Orders get Y points activity.',
        points_per_text: rowData?.points_per_text || 'Points per',
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
          goal_purchases: '',
          points: '',
          x_order_get_y_points_order_status: '',
          pointsPerHeading: '',
          language: '',
          panel_msg: '',
          display_notification: '',
          redirection_url: '',
          min_spend_per_purchase: '',
          points_per_text: '',
        }}
        onFinish={handleActivityUpdate}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="goal_purchases"
              rules={[
                { required: true, message: 'Please enter goal purchases' },
              ]}
            >
              <AitInputBox
                required
                label="Goal purchases"
                labelIcon={<InfoCircleOutlined />}
                tooltipText="The number of purchases a customer must make at your store to
              receive the reward."
                placeholder="1"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="language"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                label="Campaign name"
                labelIcon={<InfoCircleOutlined />}
                tooltipText="The name as it will appear on your store."
                required={true}
                placeholder="On X orders get Y points"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="min_spend_per_purchase">
              <AitInputBox
                label={`Minimum spend per purchase(${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)})`}
                labelIcon={<InfoCircleOutlined />}
                tooltipText="The minimum amount a customer has to spend in order for their transaction to count towards the promotion. This prevents customers from making extremely small purchases to earn the reward."
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Label>Earn point rule </Label>
            <Form.Item name="x_order_get_y_points_order_status">
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
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="points"
              rules={[
                { required: true, message: 'Please enter points' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === '') {
                      return Promise.resolve(); // skip if empty, let "required" handle it
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
                onKeyPress={enterOnlyNumericValue}
                placeholder="1"
                required={true}
                label="Points awarded"
                // style={{ marginTop: '10px' }}
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} md={12}>
            <Form.Item name="points_per_text">
              <AitInputBox
                label="Points per heading"
                labelIcon={<InfoCircleOutlined />}
                tooltipText="Change heading in different languages in shop loyalty tier list."
                placeholder="Points per"
              />
            </Form.Item>
          </Col> */}
          <Col xs={24} md={12}>
            <Label>Page URL </Label>
            <Form.Item
              name="redirection_url"
              // rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
            >
              <AitInputBox placeholder="Add redirection URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="panel_msg"
              // rules={[{ required: true, message: 'Please enter description' }]}
            >
              <AitInputBox
                textArea
                // required={true}
                label="Description"
                labelSubText="Your customers will see this description on your store."
                rows={3}
                placeholder="Earn: {{points}} reward points for completing a X Orders get Y points activity."
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="display_notification"
              // rules={[{ required: true, message: 'Please enter reward text' }]}
            >
              <AitInputBox
                textArea
                // required={true}
                label="Reward text"
                labelSubText=" Your customers will see this when they receive points."
                rows={3}
                placeholder="You got {{points}} reward points for completing a X Orders get Y points activity."
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

export default BuyXOrderGetYPointsForm;
