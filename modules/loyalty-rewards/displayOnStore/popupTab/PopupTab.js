import AitCard from '@/components/atoms/ait-card/aitCard';
import AitColorSwitch from '@/components/atoms/ait-color-switch/aitColorSwitch';
import FormLeftWrapper from '@/components/atoms/ait-form-left-wrapper/FormLeftWrapper';
import AitRowWrapper from '@/components/atoms/ait-row-wrapper/aitRowWrapper';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { Label } from '@/components/atoms/AitInputBox/style';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Row,
  Table,
  Tag,
  Grid,
  Col,
  Form,
  Divider,
  ColorPicker,
  Flex,
  Select,
  Image,
  Slider,
  Typography,
  Tooltip,
  Segmented,
  ConfigProvider,
} from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { ModalAlertIcon } from '../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitLink from '@/components/atoms/ait-link/aitLink';
import { LoyaltyButtonText, PreviewLoyaltySiteBtn } from './style';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import TextEditor from '@/components/atoms/ait-text-editer';
const { Title, Text } = Typography;
//const { useBreakpoint } = Grid;

function PopupTab({ rowPadding, popupTabState, setPopupTabState, activeTabs }) {
  // const screens = useBreakpoint();
  const [activeTab, setActiveTab] = useState('1');
  const [buttonColor, setButtonColor] = useState('#1E73BE');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('left');
  const [percent, setPercent] = useState(30);
  const [form] = Form.useForm();
  const colorOptions = ['#00C4FF', '#3a4f62ff', 'custom'];
  const textColorOptions = ['light', 'dark', 'custom'];

  return (
    <>
      <Row
        gutter={0}
        wrap={true}
        style={{ display: activeTabs === 'popup' ? '' : 'none' }}
      >
        <Col xs={{ order: 2, span: 24 }} md={{ order: 1, span: 8 }}>
          <FormLeftWrapper padding="0px 0px 0px">
            <AitCollapse
              accordion
              defaultActiveKey={['1']}
              firstitemtopborder="none"
              borderBottom="none"
              firstItemBottomspacing="0px"
              firstItemTopspacing="0px"
              itemSpacing="0px"
              bodyBorderTop="none"
              maxHeight="fit-content"
              bordered={false}
              panels={[
                {
                  key: '1',
                  title: 'Appearance',
                  children: (
                    <Row gutter={24}>
                      {/* Button Color */}
                      <Col span={24}>
                        <Form.Item name="btn_color1" label="Popup color">
                          <AitColorSwitch
                            round={true}
                            defaultValue={popupTabState?.btn_color}
                            onChange={(e) =>
                              setPopupTabState((prev) => ({
                                ...prev,
                                btn_color: e,
                              }))
                            }
                            colorOptions={[
                              { value: '15C0F5', label: 'Lightblue' },
                              { value: '1A73E8', label: 'darkblue' },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item name="btn_color1" label="Text color">
                          <AitColorSwitch
                            defaultValue={popupTabState?.btn_text_color}
                            onChange={(e) =>
                              setPopupTabState((prev) => ({
                                ...prev,
                                btn_text_color: e,
                              }))
                            }
                            colorOptions={[
                              { value: 'FFFFFF', label: 'Light' },
                              { value: '000000', label: 'Dark' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '2',
                  title: 'Panel text',
                  children: (
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="intro_header_text"
                          label="Header text (before login)"
                          initialValue="Loyalty rewards program"
                        >
                          <AitInputBox
                            placeholder="Loyalty rewards program"
                            // value={popupTabState?.intro_header_text}
                            // onChange={(e) =>
                            //   setPopupTabState((prev) => ({
                            //     ...prev,
                            //     intro_header_text: e?.target?.value,
                            //   }))
                            // }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="left_title"
                          label="Header text (after login)"
                          initialValue="Loyalty program"
                        >
                          <AitInputBox
                            placeholder="Loyalty program"
                            // value={popupTabState?.left_title}
                            // onChange={(e) =>
                            //   setPopupTabState((prev) => ({
                            //     ...prev,
                            //     left_title: e?.target?.value,
                            //   }))
                            // }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_header_activity_heading"
                          label="Earn points tab text"
                          initialValue="Earn points when you complete activities"
                        >
                          <AitInputBox
                            placeholder="Earn points when you complete activities"
                            // value={popupTabState?.intro_header_activity_heading}
                            // onChange={(e) =>
                            //   setPopupTabState((prev) => ({
                            //     ...prev,
                            //     intro_header_activity_heading: e?.target?.value,
                            //   }))
                            // }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_header_reward_heading"
                          label="Redeem points tab text"
                          initialValue="Redeem points on the store to get rewards"
                        >
                          <AitInputBox
                            placeholder="Redeem points on the store to get rewards"
                            // value={popupTabState?.intro_header_activity_heading}
                            // onChange={(e) =>
                            //   setPopupTabState((prev) => ({
                            //     ...prev,
                            //     intro_header_activity_heading: e?.target?.value,
                            //   }))
                            // }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_footer_heading"
                          label="Footer description"
                          initialValue="Log in or sign up to {shop_name} to earn rewards today"
                        >
                          <AitInputBox
                            placeholder="Log in or sign up to {shop_name} to earn rewards today"
                            // value={popupTabState?.intro_footer_heading}
                            // onChange={(e) =>
                            //   setPopupTabState((prev) => ({
                            //     ...prev,
                            //     intro_footer_heading: e?.target?.value,
                            //   }))
                            // }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '3',
                  title: 'Button text',
                  children: (
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item
                          name="intro_footer_loginbtn_txt"
                          label="Login button"
                          initialValue="Login"
                        >
                          <AitInputBox placeholder="Login" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_footer_registerbtn_txt"
                          label="Register button"
                          initialValue="Register"
                        >
                          <AitInputBox placeholder="Register" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
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
                          // color="var(--ant-color-primary)"
                          message="Below fields will appear on clicking register button."
                          style={{ marginTop: 0, marginBottom: 16 }}
                        />
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_registration_heading"
                          label="Header text"
                          initialValue="Create account"
                        >
                          <AitInputBox placeholder="Create account" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_registration_btn_txt"
                          label="Create account button text"
                          initialValue="Create"
                        >
                          <AitInputBox placeholder="Create" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="intro_registration_cancel_btn_txt"
                          label="Cancel account button text"
                          initialValue="Cancel"
                        >
                          <AitInputBox placeholder="Cancel" />
                        </Form.Item>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '4',
                  title: 'Help text (Visible after login)',
                  children: (
                    <Row gutter={24}>
                      <Col span={24}>
                        {' '}
                        <TextEditor
                          initialValue={
                            popupTabState?.help_text === ''
                              ? false
                              : decodeURIComponent(popupTabState?.help_text)
                          }
                          onChange={(e) => {
                            setPopupTabState((prev) => ({
                              ...prev,
                              help_text: e,
                            }));
                            form.setFieldValue('help_text', e);
                          }}
                          style={{ position: 'relative', zIndex: 0 }}
                        />
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          </FormLeftWrapper>
        </Col>
        <Col xs={{ order: 1, span: 24 }} md={{ order: 2, span: 16 }}>
          <FormLeftWrapper
            style={{ height: 'calc(100vh - 200px)' }}
            padding="0px"
            background={`url(${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/loyalty-popoup-bg.svg)`}
          >
            <>
              <Flex justify="center">
                <ConfigProvider
                  theme={{
                    components: {
                      Segmented: {
                        itemSelectedBg: '#4A566B',
                        itemSelectedColor: '#fff',
                      },
                    },
                  }}
                >
                  <Segmented
                    style={{ width: '200px', marginTop: 20 }}
                    block
                    centered
                    options={[
                      { label: 'Visitor', value: '1' },
                      { label: 'Member', value: '2' },
                    ]}
                    value={activeTab}
                    onChange={setActiveTab}
                  />
                </ConfigProvider>
              </Flex>

              {/* --- Render dependent content just like Tabs --- */}
              {activeTab === '1' && (
                <Flex justify="center" style={{ marginTop: 20 }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/loyalty-rewards-preview-aa.svg`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    alt="visitor-preview"
                    preview={false}
                  />
                </Flex>
              )}

              {activeTab === '2' && (
                <Flex justify="center" style={{ marginTop: 20 }}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/loyalty-rewards-member-preview.svg`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    alt="member-preview"
                    preview={false}
                  />
                </Flex>
              )}
            </>
          </FormLeftWrapper>
        </Col>
      </Row>
    </>
  );
}

export default PopupTab;
