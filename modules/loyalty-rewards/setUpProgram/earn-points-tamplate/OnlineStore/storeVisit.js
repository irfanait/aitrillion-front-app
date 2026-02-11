import AitButton from '@/components/atoms/ait-button/aitButton';
import { App, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { AlertBox, HelperText, Label, StyledSelect } from '../style';
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

const { Option } = Select;

function StoreVisitForm({
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
    const formData = new FormData();
    formData.append('rule_id', activityId);
    formData.append('points', value?.points);
    formData.append('visit_store', value?.campaignName);
    formData.append('panel_msg', value?.description);
    formData.append('notification', value?.rewardText);
    formData.append('redirection_url', value?.redirection_url);
    formData.append('limit_point', value?.timeLimitValue);
    formData.append('limit_interval', value?.timeLimitUnit);
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
        campaignName: rowData.language || 'Visit store',
        description:
          rowData?.panel_msg ||
          'You will get {{points}} reward points for visiting the store. ',
        // rewardText: rowData?.display_notification || '',
        redirection_url:
          rowData?.redirection_url || jwtState?.login_auth?.domain,
        timeLimitUnit: rowData?.limit_interval || '1 day',
        timeLimitValue: rowData?.limit_point || '1',
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
        onFinish={handleActivityUpdate}
        // initialValues={{
        //   points: '',
        //   campaignName: '',
        //   description: '',
        //   rewardText: '',
        //   pageURL: '',
        //   timeLimitValue: 1,
        //   timeLimitUnit: 'Day',
        // }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
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
                labelSubText="Enter the reward points for this activity."
                required={true}
                placeholder="10"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="campaignName"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox
                label="Campaign name"
                labelSubText="The name as it will appear on your store."
                required={true}
                placeholder="Visit store"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={12}>
            <Label>Page URL</Label>
            <HelperText>
              The URL of the page related to this activity.
            </HelperText>
            <Form.Item name="redirection_url">
              <AitInputBox placeholder="Add redirection URL" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={24}>
              <Col xs={24} sm={24}>
                <Label>
                  Time limit <span className="field-required">*</span>
                </Label>
                <HelperText>
                  Controls how often store visit points are awarded.
                </HelperText>
              </Col>
              <Col xs={12} sm={12}>
                <Form.Item
                  name="timeLimitValue"
                  rules={[
                    { required: true, message: 'Please enter time limit' },
                    {
                      validator: (_, value) => {
                        if (value === undefined || value === '') {
                          return Promise.resolve();
                        }
                        if (isNaN(value) || Number(value) <= 0) {
                          return Promise.reject(
                            'Time limit must be greater than 0'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <AitInputBox
                    // type="number"
                    min={1}
                    placeholder="1"
                    onKeyPress={enterOnlyNumericValue}
                  />
                </Form.Item>
              </Col>
              <Col xs={12} sm={12}>
                <Form.Item
                  name="timeLimitUnit"
                  rules={[
                    { required: true, message: 'Please select time unit' },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <StyledSelect width="100%" style={{ height: 39 }}>
                    <Option value="1 day">Day</Option>
                    <Option value="1 week">Week</Option>
                    <Option value="1 month">Month</Option>
                  </StyledSelect>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24}>
            <Form.Item
              name="description"
              // rules={[{ required: true, message: 'Please enter description' }]}
            >
              <AitInputBox
                textArea
                label="Description"
                labelSubText=" Your customers will see this description on your store."
                // required={true}
                rows={3}
                placeholder="You will get {{points}} reward points for visiting the store."
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={12}>
            <Label>Reward text</Label>
            <HelperText>
              Text shown to customers when they earn points.
            </HelperText>
            <Form.Item name="rewardText">
              <AitInputBox
                textArea
                rows={3}
                placeholder="You earned {{points}} reward points for visiting the store."
              />
            </Form.Item>
          </Col> */}
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

export default StoreVisitForm;
