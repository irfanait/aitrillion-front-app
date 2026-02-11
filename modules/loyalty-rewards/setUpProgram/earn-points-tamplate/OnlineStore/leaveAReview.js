import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Switch,
  Checkbox,
  App,
  Tooltip,
  Flex,
  Grid,
} from 'antd';
import { AlertBox, HelperText, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import AitButton from '@/components/atoms/ait-button/aitButton';
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
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { InfoCircleOutlined } from '@ant-design/icons';
import { enterOnlyNumericValue } from '@/utils/common.util';

const { useBreakpoint } = Grid;

const LeaveAReviewForm = ({
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
}) => {
  const jwtState = useSelector((state) => state?.jwtState);
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [switchstate, setSwitchState] = useState({
    photoUpload: false,
    videoUpload: false,
  });
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);

  const handleActivityUpdate = async (value) => {
    setLoading(true);

    value.rule_id = activityId;
    value.review_a_product = value?.language;
    value.eggdisplay_notification = value?.display_notification;
    value.points_on_imgupload = value?.points_on_imgupload === true ? '1' : '0';
    value.points_on_vidupload = value?.points_on_vidupload === true ? '1' : '0';
    value.show_reward = value?.show_reward === true ? '1' : '0';
    value.eggviews_point = value?.points;
    value.imgupload_points = value?.imgupload_points
      ? value?.imgupload_points
      : '';
    value.vidupload_points = value?.vidupload_points || '';

    delete value.points;
    delete value.display_notification;
    delete value.language;

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
          points: value?.eggviews_point,
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
        language: rowData.language || 'Leave a review for us!',
        min_spend_per_purchase: rowData?.min_spend_per_purchase || '',
        redirection_url:
          rowData?.redirection_url || jwtState?.login_auth?.domain,
        x_order_get_y_points_order_status:
          rowData?.x_order_get_y_points_order_status || '',
        panel_msg:
          rowData?.panel_msg ||
          'Earn {{points}} reward points for giving a review.',
        display_notification:
          rowData?.display_notification ||
          'You earned {{points}}  reward for giving a review.',
        imgupload_points: rowData?.imgupload_points || '',
        vidupload_points: rowData?.vidupload_points || '',
        show_reward: parseFloat(rowData?.show_reward) > 0 ? true : false,
        points_on_vidupload:
          parseFloat(rowData?.points_on_vidupload) > 0 ? true : false,
        points_on_imgupload:
          parseFloat(rowData?.points_on_imgupload) > 0 ? true : false,
      });

      setSwitchState({
        ...switchstate,
        photoUpload:
          parseFloat(rowData?.points_on_imgupload) > 0 ? true : false,
        videoUpload:
          parseFloat(rowData?.points_on_vidupload) > 0 ? true : false,
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
          points: '',
          language: '',
          panel_msg: '',
          rewardText: '',
          imgupload_points: 10,
          vidupload_points: 80,
          givePhotoPoints: true,
          giveVideoPoints: true,
          show_reward: true,
        }}
        onFinish={handleActivityUpdate}
      >
        {/* Points per Review */}
        <Row gutter={24}>
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
                label="Points per review"
                required={true}
                placeholder="20"
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
                required={true}
                tooltipText="The name as it will appear on your store."
                labelIcon={<InfoCircleOutlined />}
                placeholder="Leave a review for us!"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="panel_msg"
              // rules={[{ required: true, message: 'Please enter description' }]}
            >
              <AitInputBox
                textArea
                label="Description"
                // required={true}
                labelSubText="Your customers will see this description on your store."
                rows={2}
                placeholder="Earn {{points}} reward points for giving a review."
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
                label="Reward text"
                // required={true}
                labelSubText="Your customers will see this when they receive points."
                rows={2}
                placeholder="You earned {{points}}  reward for giving a review."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Give points on photo upload */}
        <Row gutter={24}>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <Form.Item
              name="points_on_imgupload"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <AitSwitch
                defaultChecked={
                  parseFloat(rowData?.points_on_imgupload) > 0 ? true : false
                }
                onChange={(e) =>
                  setSwitchState({
                    ...switchstate,
                    photoUpload: e,
                  })
                }
                label="Give points on photo upload"
                helpertext="Reward your shoppers for uploading a photo with their review."
                justify="space-between"
                align="start"
              />
            </Form.Item>

            {switchstate?.photoUpload && (
              <Form.Item
                name="imgupload_points"
                // noStyle
                // label=""
                rules={[
                  {
                    required: true,
                    message: 'Please enter photo upload points',
                  },
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === '') {
                        return Promise.resolve();
                      }
                      if (isNaN(value) || Number(value) <= 0) {
                        return Promise.reject(
                          'photo upload points must be greater than 0'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <AitInputBox
                  required
                  // type="number"
                  onKeyPress={enterOnlyNumericValue}
                  placeholder="10"
                  style={{ width: '100%', marginTop: 10 }}
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} md={12} style={{ marginBottom: 24 }}>
            <Form.Item
              name="points_on_vidupload"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <AitSwitch
                defaultChecked={
                  parseFloat(rowData?.points_on_vidupload) > 0 ? true : false
                }
                onChange={(e) =>
                  setSwitchState({
                    ...switchstate,
                    videoUpload: e,
                  })
                }
                label="Give points on video upload"
                helpertext="Reward your shoppers for uploading a video with their review."
                justify="space-between"
                align="start"
              />
            </Form.Item>

            {switchstate?.videoUpload && (
              <Form.Item
                name="vidupload_points"
                // noStyle
                rules={[
                  {
                    required: true,
                    message: 'Please enter video upload points',
                  },
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === '') {
                        return Promise.resolve();
                      }
                      if (isNaN(value) || Number(value) <= 0) {
                        return Promise.reject(
                          'video upload points must be greater than 0'
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
                  onKeyPress={enterOnlyNumericValue}
                  placeholder="10"
                  style={{ width: '100%', marginTop: 10 }}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        {/* Give points on video upload */}

        {/* Show reward info checkbox */}
        <Row gutter={24}>
          <Col>
            <Form.Item
              name="show_reward"
              valuePropName="checked"
              // style={{ marginTop: 20 }}
            >
              <Checkbox
                defaultChecked={
                  parseFloat(rowData?.show_reward) > 0 ? true : false
                }
              >
                <span style={{ color: 'var(--ant-color-text-label-primary)' }}>
                  {' '}
                  Show reward information on front store review form
                </span>
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}

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
};

export default LeaveAReviewForm;
