import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
} from '@/utils/common.util';
import {
  App,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Tooltip,
  Typography,
  Flex,
} from 'antd';
import { AlertBox, HelperText, Label } from '../style';
import { FileDoneOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import logger from '@/utils/logger';
import { addUpdateStoreCreditService } from '../../../api/redeemPoints';
import { HelpDocSvgIcon, ModalAlertIcon } from '../../../svg-icons';
import Link from 'next/link';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import { useSelector } from 'react-redux';
import AitText from '@/components/atoms/ait-text/aitText';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitShortcode from '@/components/atoms/ait-shortcode/aitShortcode';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Text } = Typography;

function StoreCreditForm({
  handleCancel,
  rowData,
  setIsModalOpen,
  isEdit = true,
  getViewRewardsList,
  setActiveTab,
  setFormLoading,
  setListData,
  listData,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [expirationType, setExpirationType] = useState('0');

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

    const formData = convertToFormDataCustom(values);
    try {
      const response = await addUpdateStoreCreditService(formData);

      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.message,
        });

        let arr = listData?.map((item) => {
          let obj = { ...item };
          if (item?.id === 7) {
            obj.store_credit_created_status = 1;
            return obj;
          } else {
            return obj;
          }
        });
        setListData(arr);
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
      const formValues = {
        store_credit_points: rowData?.store_credit_points || '',
        minimum_point_limit: rowData?.minimum_point_limit || '',
        maximum_point_limit: rowData?.maximum_point_limit || '',
        expiration_days: rowData?.expiration_days || '',
        store_credit_heading:
          rowData?.store_credit_heading ||
          'You can redeem {{remaining-points}} loyalty points to store credit.',
        store_credit_description:
          rowData?.store_credit_description ||
          `Convert 10 points = ${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}1 store credit`,
        is_expiration: rowData?.is_expiration,
      };

      form.setFieldsValue(formValues);
      setExpirationType(rowData?.is_expiration);
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
        message={
          <>
            Customer need access to new customer accounts to see and spend store
            credit at checkout.{' '}
            <AitLink
              href="https://help.shopify.com/en/manual/customers/customer-accounts/new-customer-accounts"
              target="blank"
            >
              Learn more
            </AitLink>
          </>
        }
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* === Points per currency === */}
        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item
              name="store_credit_points"
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
                label="Enter points equivalent to 1 unit of your currency"
                tooltipText={`Ex. 10 points = ${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}1 store credit`}
                labelIcon={<InfoCircleOutlined />}
                placeholder="10"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="minimum_point_limit"
              rules={[
                { required: true, message: 'Please enter min points' },
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
                        'Max points must be greater than 0'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox
                label="Min points to redeem"
                required
                placeholder="100"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="maximum_point_limit"
              rules={[
                { required: true, message: 'Please enter max points' },
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
                        'Min points must be greater than 0'
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox
                label="Max points to redeem (in 1 day)"
                placeholder="100"
                required
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* === Min/Max points === */}
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="store_credit_heading"
              // rules={[{ required: true, message: 'Please enter title' }]}
            >
              <AitInputBox
                label="Shop credit title"
                textArea
                // required
                placeholder="You can redeem {{remaining-points}} loyalty points to store credit."
                rows={3}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="store_credit_description"
              // rules={[{ required: true, message: 'Please enter description' }]}
            >
              <AitInputBox
                labelIcon={<InfoCircleOutlined />}
                label="Description"
                tooltipText="Your customers will see this description on your store."
                textArea
                placeholder={`Convert 1 points = ${getCurrencyByMoneyFormat(jwtState?.login_auth?.money_format)}1 store credit`}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Label>
              <>
                Store credit expiration{' '}
                <Tooltip
                  title="Countries have different laws for store credit expiration days.
              Check the laws for your country before changing the day."
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </>
            </Label>
            <Form.Item
              style={{ marginBottom: 0 }}
              // label={
              //   <span>
              //     Store credit expiration{' '}
              //     <Tooltip
              //       title="   Countries have different laws for store credit expiration days.
              // Check the laws for your country before changing the day."
              //     >
              //       <InfoCircleOutlined />
              //     </Tooltip>
              //   </span>
              // }
              name="is_expiration"
            >
              <Radio.Group
                onChange={(e) => setExpirationType(e.target.value)}
                value={expirationType}
                defaultValue="0"
              >
                <StyledRadio value="0" fontweight="400">
                  No expiration
                </StyledRadio>
                <StyledRadio value="1" fontweight="400">
                  Set expiration duration (in days)
                </StyledRadio>
              </Radio.Group>
            </Form.Item>
            {expirationType === '1' && (
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    style={{ marginTop: 10, marginBottom: 0 }}
                    name="expiration_days"
                    rules={[
                      { required: true, message: 'Please enter days' },
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
                              'Days must be greater than 0'
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <AitInputBox
                      placeholder="0"
                      onKeyPress={enterOnlyNumericValue}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        {/* === Store credit expiration === */}

        {/* === Shop credit title === */}

        <Row
          gutter={[12, 12]}
          justify={'center'}
          style={{ marginBottom: '24px', marginTop: 24 }}
        >
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={isEdit ? 'Update' : 'Save'}
              htmlType="submit"
              // disabled={loading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              // disabled={loading}
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
                  href="https://docs.aitrillion.com/portal/en/kb/articles/enable-store-credit-on-your-store"
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
              shortcode={`<div class="aaa-loyalty-shopcredit-widget"></div>`}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default StoreCreditForm;
