import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
import {
  App,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Switch,
  Tooltip,
  Divider,
  Grid,
} from 'antd';
import { AlertBox, HelperText, Label } from '../style';
import { FileDoneOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/atoms/Button';
import logger from '@/utils/logger';
import { addUpdateCartWidgetService } from '../../../api/redeemPoints';
import Paragraph from 'antd/es/typography/Paragraph';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { useSelector } from 'react-redux';
import {
  HelpDocSvgIcon,
  ModalAlertIcon,
} from '@/modules/loyalty-rewards/svg-icons';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';
import AitShortcode from '@/components/atoms/ait-shortcode/aitShortcode';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
const { useBreakpoint } = Grid;

function CartWidgetPointForm({
  handleCancel,
  rowData,
  setIsModalOpen,
  isEdit = true,
  getViewRewardsList,
  setActiveTab,
  setFormLoading,
  formLoading,
}) {
  const screens = useBreakpoint();
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const codeRef = useRef(null);
  const [displayOnStoreFront, setDisplayOnStoreFront] = useState(false);
  const [displayOnCart, setDisplayOnCart] = useState(false);
  const [unusedRewardCoupons, setUnusedRewardCoupons] = useState(false);

  const handleCopy = () => {
    if (codeRef.current) {
      const textToCopy = codeRef.current.innerText;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notification.success({
            message: 'copied !!!',
          });
        })
        .catch((err) => {
          notification.success({
            message: 'Failed to copy shortcode.',
          });
        });
    }
  };

  const convertToFormDataCustom = (obj, formData = new FormData()) => {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const value = obj[key];
      if (key === 'applied_to_json' && Array.isArray(value)) {
        value.forEach((item) => {
          formData.append('applied_to_json[]', item);
        });
      } else {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      }
    }

    return formData;
  };

  const onFinish = async (values) => {
    setFormLoading(true);
    values.display_on_popup = values?.display_on_popup === true ? '1' : '0';
    values.enable_widget_rule = values?.enable_widget_rule === true ? '1' : '0';
    values.show_unused_reward_coupons =
      values?.show_unused_reward_coupons === true ? '1' : '0';
    if (values?.display_on_popup === '0') {
      delete values.display_on_popup;
    }
    if (values?.enable_widget_rule === '0') {
      delete values.enable_widget_rule;
    }
    if (values?.show_unused_reward_coupons === '0') {
      delete values.show_unused_reward_coupons;
    }
    const formData = convertToFormDataCustom(values);
    try {
      const response = await addUpdateCartWidgetService(formData);
      console.log('res', response);

      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.message,
        });
        setIsModalOpen(false);
        setActiveTab('viewReward');
        getViewRewardsList();
      }
    } catch (error) {
      logger(error?.response?.msg);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (rowData && rowData !== null) {
      setDisplayOnStoreFront(
        parseFloat(rowData?.display_on_lyt_popup) > 0 ? true : false
      );
      setDisplayOnCart(
        parseFloat(rowData?.cart_widget_status) > 0 ? true : false
      );
      setUnusedRewardCoupons(
        parseFloat(rowData?.show_unused_reward_coupons) > 0 ? true : false
      );

      const formValues = {
        cart_widget_points: rowData?.cart_widget_points || '',
        minimum_cart_value: rowData?.minimum_cart_amount || '',
        minimum_point_limit: rowData?.minimum_point_limit || '',
        maximum_point_limit: rowData?.maximum_point_limit || '',
        cart_widget_heading:
          rowData?.cart_widget_heading ||
          'You have {{remaining-points}} Reward points.',
        cart_widget_content: rowData?.cart_widget_content || '',
        reward_title: rowData?.reward_title || 'Discount against orders',
        reward_text:
          rowData?.reward_text || 'Redeem {points} points to save {amount}',
        minimum_cart_amt_text:
          rowData?.minimum_cart_amt_text || 'With minimum purchase of {amount}',
        enable_widget_rule:
          parseFloat(rowData?.cart_widget_status) > 0 ? true : false,
        display_on_popup:
          parseFloat(rowData?.display_on_lyt_popup) > 0 ? true : false,
        show_unused_reward_coupons:
          parseFloat(rowData?.show_unused_reward_coupons) > 0 ? true : false,
      };

      form.setFieldsValue(formValues);
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
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Flex wrap={screens?.md ? false : true}>
          <Flex
            flex={screens?.md ? '0 0 calc(50% - 20px)' : '0 0 100%'}
            align="start"
            wrap={true}
          >
            <div style={{ width: '100%' }}>
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="enable_widget_rule"
                    valuePropName="checked"
                    style={{ width: '100%' }}
                  >
                    <AitSwitch
                      justify="space-between"
                      label="Display on cart"
                      onChange={(checked) => setDisplayOnCart(checked)}
                      checked={displayOnCart}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={24} sm={12} md={24}>
                  {/* <Label>
                      Enter Points{' '}
                      <Tooltip
                        placement="right"
                        title="Add points as value to 1 unit of your currency. For example 20 loyalty points = $1 or €1."
                      >
                        <InfoCircleOutlined
                          style={{
                            marginLeft: '2px',
                            position: 'relative',
                            //   top: '1px',
                          }}
                        />
                      </Tooltip>
                    </Label> */}
                  <Form.Item
                    name="cart_widget_points"
                    rules={[
                      { required: true, message: 'Please enter the points' },
                    ]}
                  >
                    <AitInputBox
                      required
                      label={
                        <>
                          Enter points
                          <Tooltip
                            title={`Add points as value to 1 unit of your currency. For example 20 loyalty points = ${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}1 or €1.`}
                          >
                            <InfoCircleOutlined
                              style={{
                                marginLeft: '2px',
                                position: 'relative',
                                top: '1px',
                              }}
                            />
                          </Tooltip>
                        </>
                      }
                      tooltipText={`Add points as value to 1 unit of your currency. For example 20 loyalty points = ${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}1 or €1.`}
                      placeholder="10"
                      onKeyPress={enterOnlyNumericValue}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="minimum_cart_value"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter minimum cart amount',
                      },
                      {
                        validator: (_, value) => {
                          if (value === undefined || value === '') {
                            return Promise.resolve();
                          }
                          if (!/^\d+$/.test(value)) {
                            return Promise.reject('Points must be an integer');
                          }
                          if (isNaN(value) || Number(value) <= 0) {
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
                      required
                      label={`Minimum cart amount (${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)})`}
                      placeholder="100"
                      onKeyPress={enterOnlyNumericValue}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="minimum_point_limit"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value === undefined || value === '') {
                            return Promise.resolve();
                          }
                          if (!/^\d+$/.test(value)) {
                            return Promise.reject('Points must be an integer');
                          }
                          if (isNaN(value) || Number(value) <= 0) {
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
                      label="Minimum points to claim"
                      // required
                      placeholder="100"
                      onKeyPress={enterOnlyNumericValue}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="maximum_point_limit"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value === undefined || value === '') {
                            return Promise.resolve();
                          }
                          if (!/^\d+$/.test(value)) {
                            return Promise.reject('Points must be an integer');
                          }
                          if (isNaN(value) || Number(value) <= 0) {
                            return Promise.reject(
                              'Points must be greater than 0'
                            );
                          }
                          const minvalue = form.getFieldValue(
                            'minimum_point_limit'
                          );
                          if (minvalue && Number(minvalue) >= Number(value)) {
                            return Promise.reject(
                              new Error(
                                'Maximum points must be greater than minimum points'
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AitInputBox
                      label="Maximum points to claim"
                      placeholder="100"
                      onKeyPress={enterOnlyNumericValue}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Cart widget title"
                    name="cart_widget_heading"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter cart widget title',
                      },
                    ]}
                  >
                    <AitInputBox
                      rows={3}
                      placeholder="You have {{remaining-points}} Reward points."
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Cart widget text"
                    name="cart_widget_content"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please enter cart widget text',
                    //   },
                    // ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Flex>
          {screens?.md && (
            <Flex flex={'1 1 auto'}>
              <Divider
                type="vertical"
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  height: 'calc(100% - 24px)',
                }}
              />
            </Flex>
          )}
          <Flex
            flex={screens?.md ? '0 0 calc(50% - 20px)' : '0 0 100%'}
            align="start"
            wrap={true}
          >
            <div style={{ width: '100%' }}>
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item name="display_on_popup" valuePropName="checked">
                    <AitSwitch
                      justify="space-between"
                      label={
                        <>
                          Display on storefront popup
                          <Tooltip
                            placement="top"
                            title="If enabled, the Cart widget will appear as a reward within the loyalty popup on the storefront."
                          >
                            -
                            <InfoCircleOutlined
                              style={{
                                marginLeft: '2px',
                                position: 'relative',
                                top: '1px',
                              }}
                            />
                          </Tooltip>
                        </>
                      }
                      onChange={(checked) => setDisplayOnStoreFront(checked)}
                      checked={displayOnStoreFront}
                    />
                  </Form.Item>
                </Col>
                {displayOnStoreFront && (
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Reward title"
                      name="reward_title"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter reward title',
                        },
                      ]}
                    >
                      <AitInputBox
                        rows={3}
                        placeholder="Discount against orders"
                      />
                    </Form.Item>
                  </Col>
                )}
                {displayOnStoreFront && (
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Reward text"
                      name="reward_text"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter reward text',
                      //   },
                      // ]}
                    >
                      <AitInputBox
                        rows={3}
                        placeholder="Redeem {points} points to save {amount}"
                      />
                    </Form.Item>
                  </Col>
                )}
                {displayOnStoreFront && (
                  <Col xs={24} sm={24}>
                    <Form.Item
                      name="minimum_cart_amt_text"
                      label="Minimum cart amount text"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter minimum cart amount text',
                      //   },
                      // ]}
                    >
                      <AitInputBox
                        rows={3}
                        placeholder="With minimum purchase of {amount}"
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} sm={24}>
                  <Form.Item
                    //   label=""
                    name="show_unused_reward_coupons"
                    valuePropName="checked"
                  >
                    <AitSwitch
                      justify="space-between"
                      onChange={(checked) => setUnusedRewardCoupons(checked)}
                      checked={unusedRewardCoupons}
                      label={
                        <>
                          Show unused reward coupons
                          <Tooltip
                            placement="top"
                            title="Enable or disable the display of unused reward coupons."
                          >
                            <InfoCircleOutlined
                              style={{
                                marginLeft: '2px',
                                position: 'relative',
                                top: '1px',
                              }}
                            />
                          </Tooltip>
                        </>
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Flex>
        </Flex>
        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={isEdit ? 'Update' : 'Save'}
              htmlType="submit"
              disabled={formLoading}
              loading={formLoading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              disabled={formLoading}
              block
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: '12px' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Flex align="center" gap={3} style={{ marginBottom: '2px' }}>
              <AitText
                strong
                size={14}
                lineheight={16}
                style={{ marginBottom: 'auto', marginTop: 'auto' }}
              >
                Shortcode
              </AitText>
              <Tooltip placement="top" title="Help doc">
                <AitLink
                  target="_blank"
                  href="https://docs.aitrillion.com/portal/en/kb/articles/cart-widget-points#Introduction"
                >
                  <HelpDocSvgIcon />
                </AitLink>
              </Tooltip>
            </Flex>
            <AitText size={12} lineheight={16} type="secondary">
              Copy the shortcode and paste it in cart-template in section file.
            </AitText>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: 5 }}>
            <AitShortcode
              copybtn={true}
              block
              shortcode={`<div class="aaa-loyalty-cartredeem-widget"> </div>`}
            />
          </Col>
        </Row>
      </Form>
      {/* <div>
        <br />
        <Paragraph
          style={{ marginBottom: 8 }}
          ai-mp-plan-remove="loyalty_pannel_access"
        >
          For cart widget shortcode you need to upgrade your plan.
        </Paragraph>
        <Button
          ai-mp-plan-remove="loyalty_pannel_access"
          type="primary"
          className="btn btn-primary lato-semibold-15-ffffff"
          // onClick={handleUpgradePlan}
        >
          Upgrade Your Plan
        </Button>
      </div> */}
    </>
  );
}

export default CartWidgetPointForm;
