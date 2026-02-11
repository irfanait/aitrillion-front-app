/* eslint-disable react-hooks/exhaustive-deps */
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
import AitCard from '@/components/atoms/ait-card/aitCard';
import { enterOnlyNumericValue } from '@/utils/common.util';

function OnCustomerTagForm({
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

  const convertToFormDataCustom = (obj, formData = new FormData()) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      let formKey = key;
      if (key === 'tag') formKey = 'customertags';
      else if (key === 'points') formKey = 'customertagspoints';
      const value = obj[key];
      if (Array.isArray(value)) {
        if (
          value.length > 0 &&
          typeof value[0] === 'object' &&
          value[0] !== null
        ) {
          const keysInObjects = Object.keys(value[0]);
          keysInObjects.forEach((innerKey) => {
            value.forEach((item) => {
              let innerFormKey = innerKey;
              if (innerKey === 'tag') innerFormKey = 'customertags';
              else if (innerKey === 'points')
                innerFormKey = 'customertagspoints';
              formData.append(`${innerFormKey}[]`, item[innerKey]);
            });
          });
        } else {
          value.forEach((item) => formData.append(`${formKey}[]`, item));
        }
      } else {
        formData.append(formKey, value);
      }
    }
    return formData;
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    values.special_account = values.language;
    delete values.language;
    const formData = convertToFormDataCustom(values);
    formData.append('rule_id', activityId);

    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        const pointsArray = values?.tags?.map((item) => item?.points);

        let updatedFields = {
          points: JSON.stringify(pointsArray),
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
        language: rowData?.language || 'On customer tag',
        customer_page_url: rowData?.customer_page_url || '',
        front_panel_msg:
          rowData?.front_panel_msg ||
          'You will get reward points on earning different tags',
        tags:
          rowData?.activity_details?.map((item) => ({
            tag: item?.tag || '',
            points: item?.points || '',
            display_notification: item?.display_notification || '',
            panel_msg: item?.panel_msg || '',
          })) || [],
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
        message="This activity allows you to assign points to customers based on tags. This facilitates the integration of various modules and third-party apps (which add tags on customers) with the AiTrillion loyalty program."
        style={{ marginBottom: 24 }}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        initialValues={{
          language: rowData?.language || 'On customer tag',
          customer_page_url: rowData?.customer_page_url || '',
          front_panel_msg:
            rowData?.front_panel_msg ||
            'You will get reward points on earning different tags',
          tags:
            rowData?.activity_details?.map((item) => ({
              tag: item?.tag || '',
              points: item?.points || '',
              display_notification: item?.display_notification || '',
              panel_msg: item?.panel_msg || '',
            })) || [], // Default to an empty array if no tags available
        }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Label>
              Campaign name{' '}
              <span
                className="field-required"
                style={{ position: 'relative', top: '-2px' }}
              >
                *
              </span>
            </Label>
            <HelperText>The name as it will appear on your store.</HelperText>
            <Form.Item
              name="language"
              rules={[
                { required: true, message: 'Please enter campaign name' },
              ]}
            >
              <AitInputBox placeholder="On customer tag" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Label>Description </Label>
            <HelperText>
              Your customers will see this description on your store.
            </HelperText>
            <Form.Item
              name="front_panel_msg"
              // rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="You will get reward points on earning different tags"
              />
            </Form.Item>
          </Col>
        </Row>

        <Label>Tags</Label>
        <Form.List
          name="tags"
          initialValue={[
            {
              display_notification:
                'You earned {{points}} reward points on customer tag activity.',
              panel_msg:
                'Earn {{points}} reward points on customer tag activity.',
              tag: '',
              points: '',
            },
          ]}
        >
          {(fields, { add, remove }) => {
            if (fields?.length === 0) {
              add({
                display_notification:
                  'You earned {{points}} reward points on customer tag activity.',
                panel_msg:
                  'Earn {{points}} reward points on customer tag activity.',
                tag: '',
                points: '',
              });
            }
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <>
                    <AitCard
                      key={key}
                      bodypadding={{
                        xs: '16px 16px 0px 16px',
                        md: '16px 16px 0px 16px',
                      }}
                      style={{ marginBottom: 16 }}
                      token={{
                        colorBgContainer: '#F6F7F8',
                        colorBorderSecondary: '#ddd',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <Row gutter={24}>
                          {/* Tag Input */}
                          <Col xs={24} sm={12} md={12} lg={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'tag']}
                              fieldKey={[fieldKey, 'tag']}
                              rules={[
                                { required: true, message: 'Please enter tag' },
                              ]}
                            >
                              <AitInputBox
                                label="Enter tag"
                                placeholder="Enter tag"
                                required
                              />
                            </Form.Item>
                          </Col>

                          {/* Points Input */}
                          <Col xs={24} sm={12} md={12} lg={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'points']}
                              fieldKey={[fieldKey, 'points']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter points',
                                },
                                {
                                  validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    if (!/^\d+$/.test(value)) {
                                      return Promise.reject(
                                        'Points must be an integer'
                                      );
                                    }
                                    if (Number(value) <= 0) {
                                      return Promise.reject(
                                        'Points must be greater than 0'
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <AitInputBox
                                label="Tag points"
                                placeholder="Enter points"
                                required
                                onKeyPress={enterOnlyNumericValue}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={24}>
                          {/* Reward Text Input */}
                          <Col xs={24} sm={12} md={12} lg={12}>
                            <Label>Reward text </Label>
                            <Form.Item
                              {...restField}
                              name={[name, 'display_notification']}
                              fieldKey={[fieldKey, 'display_notification']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter reward text',
                                },
                              ]}
                            >
                              <AitInputBox
                                textArea
                                placeholder="You earned {{points}} reward points on customer tag activity."
                              />
                            </Form.Item>
                          </Col>

                          {/* Description Input */}
                          <Col xs={24} sm={12} md={12} lg={12}>
                            <Label>Description </Label>
                            <Form.Item
                              {...restField}
                              name={[name, 'panel_msg']}
                              fieldKey={[fieldKey, 'panel_msg']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter description',
                                },
                              ]}
                            >
                              <AitInputBox
                                textArea
                                placeholder="Earn {{points}} reward points on customer tag activity."
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <CloseOutlined
                          onClick={() => remove(name)}
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            right: 0,
                            fontSize: 16,
                            color: fields.length > 1 ? '#ccc' : '#ccc',
                            cursor:
                              fields.length > 1 ? 'pointer' : 'not-allowed',
                            pointerEvents: fields.length > 1 ? 'auto' : 'none',
                          }}
                        />
                      </div>
                    </AitCard>
                  </>
                ))}

                <Form.Item style={{ marginBottom: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({
                          display_notification:
                            'You earned {{points}} reward points on customer tag activity.',
                          panel_msg:
                            'Earn {{points}} reward points on customer tag activity.',
                          tag: '',
                          points: '',
                        })
                      }
                      style={{
                        padding: 0,
                        fontWeight: 500,
                      }}
                    >
                      Add new tag
                    </Button>
                  </div>
                </Form.Item>
              </>
            );
          }}
        </Form.List>

        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Label>Customer page url </Label>
            <Form.Item name="customer_page_url">
              <AitInputBox placeholder="(Ex:- /pages/customer)" />
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

export default OnCustomerTagForm;
