import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { App, Col, Flex, Form, Row, Tooltip, Typography } from 'antd';
import {
  ColorNote,
  CustomColorPicker,
  GreyBox,
  Label,
  RewardFlex,
  RewardItem,
  RewardSign,
  Wrapper,
} from './style';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { enterOnlyNumericValue } from '@/utils/common.util';
import logger from '@/utils/logger';
import {
  getRewardDataService,
  saveAndUpdateRewardSettingService,
  updateRewardSettingStatusService,
} from '../../api/freeProductRewardSetting';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitText from '@/components/atoms/ait-text/aitText';
import AitShortcode from '@/components/atoms/ait-shortcode/aitShortcode';
import AitLink from '@/components/atoms/ait-link/aitLink';
import { HelpDocSvgIcon } from '../../svg-icons';

const { Title, Text } = Typography;

function FreeProductRewardSetting() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [bgColor, setBgColor] = useState('#033DA7');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(false);
  const rewards = cols * rows;
  const [detailsData, setDetailsData] = useState();
  const [formLoading, setFormLoading] = useState(false);

  const getRewardData = async () => {
    setLoading(true);
    try {
      let payload = {};
      const response = await getRewardDataService(payload);
      if (response?.status === 'success') {
        setDetailsData(response?.data);
        form.setFieldsValue({
          reward_title: response?.data?.reward_title || 'Free Product Reward',
          column_count: response?.data?.column_count || '',
          row_count: response?.data?.row_count || '',
          buy_btn_txt_color: response?.data?.buy_btn_txt_color,
          buy_btn_color: response?.data?.buy_btn_color,
        });
        setRows(parseFloat(response?.data?.row_count) || 0);
        setCols(parseFloat(response?.data?.column_count) || 0);
        setBgColor(response?.data?.buy_btn_color || '033DA7');
        setTextColor(response?.data?.buy_btn_txt_color || 'FFFFFF');
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (value) => {
    setFormLoading(true);

    try {
      let payload = {
        ...value,
        buy_btn_txt_color: textColor?.replace('#', ''),
        buy_btn_color: bgColor?.replace('#', ''),
        buy_btn_lang: detailsData?.buy_btn_lang || '',
        id: detailsData?.id || '',
        no_reward: detailsData?.no_reward || '',
        status: detailsData?.status === '1' ? true : false,
      };
      const response = await saveAndUpdateRewardSettingService(payload);
      if (response?.status === 'success') {
        notification.success({
          message: response?.msg,
        });
        getRewardData();
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFormLoading(false);
    }
  };

  const onChangeStatus = async () => {
    setLoading(true);
    try {
      let payload = {
        status: detailsData?.status === '1' ? '0' : '1',
      };
      const res = await updateRewardSettingStatusService(payload);
      if (res?.status === 'success') {
        notification.success({
          message: res?.msg,
        });
        getRewardData();
      }
    } catch (error) {
      logger(error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRewardData();
  }, []);

  return (
    <>
      <AitPageHeader
        title="Free product reward settings"
        subtitle="Setup free products section for your store"
        hideButton
        isSwitchButton
        // isSwitchButton={detailsData?.status === '1'}
        checked={detailsData?.status === '1'}
        onButtonClick={onChangeStatus}
        buttonLabel="Enable"
        subtitleRightText="View changes"
        subtitleRightTooltipTitle="New changes take up to 15 minutes to appear on your site, use this link to view them now."
      />
      <Wrapper>
        <Title level={4} style={{ marginBottom: 24 }}>
          Free product reward settings
        </Title>
        <FullPageLoader loading={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[24, 30]}>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={24}>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      name="reward_title"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter title',
                        },
                      ]}
                    >
                      <AitInputBox
                        label="Title"
                        required
                        placeholder="Enter title"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24}>
                    <RewardFlex justify="flex-start" align="start">
                      <RewardItem>
                        {/* <Label>Number of columns</Label> */}
                        <Form.Item
                          name="column_count"
                          rules={[
                            {
                              required: true,
                              message: 'This field is requierd',
                            },
                            {
                              validator: (_, value) => {
                                if (value === undefined || value === '') {
                                  return Promise.resolve();
                                }
                                if (isNaN(value) || Number(value) > 6) {
                                  return Promise.reject(
                                    'Please enter a column value in 1-6 range.'
                                  );
                                }
                                if (value === undefined || value === '') {
                                  return Promise.resolve();
                                }
                                if (isNaN(value) || Number(value) <= 0) {
                                  return Promise.reject(
                                    'Columns count must be greater than 0'
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <AitInputBox
                            label="Number of columns"
                            onKeyPress={enterOnlyNumericValue}
                            value={cols}
                            onChange={(e) =>
                              setCols(
                                Number(e.target.value) > 6
                                  ? 6
                                  : Number(e.target.value)
                              )
                            }
                            placeholder="1"
                          />
                        </Form.Item>
                      </RewardItem>

                      <RewardSign>×</RewardSign>

                      <RewardItem>
                        {/* <Label>Number of rows</Label> */}
                        <Form.Item
                          name="row_count"
                          rules={[
                            {
                              required: true,
                              message: 'This field is requierd',
                            },
                            {
                              validator: (_, value) => {
                                if (value === undefined || value === '') {
                                  return Promise.resolve();
                                }
                                if (isNaN(value) || Number(value) > 8) {
                                  return Promise.reject(
                                    'Please enter a row value in 1-8 range.'
                                  );
                                }
                                if (value === undefined || value === '') {
                                  return Promise.resolve();
                                }
                                if (isNaN(value) || Number(value) <= 0) {
                                  return Promise.reject(
                                    'Row count must be greater than 0'
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <AitInputBox
                            label="Number of rows"
                            onKeyPress={enterOnlyNumericValue}
                            value={rows}
                            onChange={(e) => setRows(Number(e.target.value))}
                            placeholder="1"
                          />
                        </Form.Item>
                      </RewardItem>

                      <RewardSign>=</RewardSign>

                      <RewardItem>
                        {/* <Label>Number of rewards</Label> */}
                        <Form.Item>
                          <AitInputBox
                            label="Number of rewards"
                            value={rewards}
                            disabled
                          />
                        </Form.Item>
                      </RewardItem>
                    </RewardFlex>
                  </Col>
                </Row>

                {/* {gridError && (
                <div style={{ color: 'red', marginTop: 10 }}>
                  Calculation of rows and columns should be less or equal to 48
                </div>
              )} */}

                <RewardFlex justify="flex-start" align="start">
                  <RewardItem>
                    <Form.Item
                      name="buy_btn_color"
                      // rules={[
                      //   { required: true, message: 'This field is requierd' },
                      // ]}
                    >
                      <Label>Background color</Label>

                      <CustomColorPicker
                        value={bgColor}
                        onChange={(color) =>
                          setBgColor(color?.toHexString()?.toUpperCase())
                        }
                        showText={(color) =>
                          color.toHexString().replace('#', '')?.toUpperCase()
                        }
                        size="large"
                        style={{ width: '100%', color: 'red' }}
                      />
                      <ColorNote>(Use color code without #)</ColorNote>
                    </Form.Item>
                  </RewardItem>

                  <RewardItem>
                    <Form.Item
                      name="buy_btn_txt_color"
                      // rules={[
                      //   { required: true, message: 'This field is requierd' },
                      // ]}
                    >
                      <Label>Text color</Label>
                      <CustomColorPicker
                        value={textColor}
                        onChange={(color) =>
                          setTextColor(color?.toHexString()?.toUpperCase())
                        }
                        showText={(color) =>
                          color.toHexString().replace('#', '')?.toUpperCase()
                        }
                        size="large"
                        style={{ width: '100%' }}
                      />
                      <ColorNote>(Use color code without #)</ColorNote>
                    </Form.Item>
                  </RewardItem>
                </RewardFlex>

                <AitButton
                  style={{ width: 120 }}
                  type="primary"
                  title={detailsData?.id ? 'Update' : 'Save'}
                  // title="Save"
                  htmlType="submit"
                  disabled={formLoading}
                  loading={formLoading}
                />
              </Col>

              {/* RIGHT SIDE */}
              {parseFloat(detailsData?.id) > 0 && (
                <Col xs={24} sm={24} md={12}>
                  <div style={{ marginBottom: '10px' }}>
                    <Flex
                      align="center"
                      gap={3}
                      style={{ marginBottom: '2px' }}
                    >
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
                          href="https://docs.aitrillion.com/portal/en/kb/articles/create-a-free-product-reward#Introduction"
                        >
                          <HelpDocSvgIcon />
                        </AitLink>
                      </Tooltip>
                    </Flex>
                    <AitText size={12} lineheight={16} type="secondary">
                      Copy this code and paste it where you want show
                      freeproduct reward section
                    </AitText>
                  </div>
                  <AitShortcode
                    copybtn={true}
                    block
                    shortcode={`<div id="aio_reward_shortcode"></div>`}
                  />
                </Col>
              )}
            </Row>
          </Form>
        </FullPageLoader>
      </Wrapper>
    </>
  );
}

export default FreeProductRewardSetting;
