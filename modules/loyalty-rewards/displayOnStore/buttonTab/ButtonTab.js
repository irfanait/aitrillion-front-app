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
  Col,
  Form,
  Divider,
  ColorPicker,
  Flex,
  Select,
  Image,
  Slider,
  Typography,
} from 'antd';
import { LoyaltyButtonIcon, ModalAlertIcon } from '../../svg-icons';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';
import { PreviewLoyaltySiteBtn, LoyaltyButtonText } from './style';
const { Title } = Typography;

function ButtonTab({
  rowPadding,
  // storeAPIData,
  setButtonTabState,
  buttonTabState,
  activeTab,
  btnText,
}) {
  // const screens = useBreakpoint();
  // const [buttonColor, setButtonColor] = useState('#1E73BE');
  // const [textColor, setTextColor] = useState('#FFFFFF');
  // const [position, setPosition] = useState('left');
  // const [percent, setPercent] = useState(30);
  // const [form] = Form.useForm();
  // const colorOptions = ['#00C4FF', '#1E73BE', 'custom'];
  // const textColorOptions = ['light', 'dark', 'custom'];
  return (
    <>
      <Row gutter={0} style={{ display: activeTab === 'button' ? '' : 'none' }}>
        <Col xs={24} sm={24} md={8}>
          <FormLeftWrapper padding="0px">
            <AitRowWrapper padding={rowPadding} margin={'24px 0px 0px 0px'}>
              <Row gutter={[24, 0]}>
                <Col span={24}>
                  <Form.Item name="is_show_btn">
                    <AitSwitch
                      justify="space-between"
                      label="Enable to show button on front store"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="hide_btn_in_mobile">
                    <AitSwitch
                      justify="space-between"
                      label="Hide button in mobile"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </AitRowWrapper>

            <Divider style={{ marginTop: 0 }} />
            <AitRowWrapper padding={rowPadding}>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item
                    name="btn_text"
                    label="Button text"
                    initialValue="Rewards"
                  >
                    <AitInputBox placeholder="Button title" />
                  </Form.Item>
                </Col>
              </Row>
            </AitRowWrapper>
            <AitCollapse
              accordion
              defaultActiveKey={['1']}
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
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item name="lyt_btn_color" label="Button color">
                          <AitColorSwitch
                            round={true}
                            // defaultValue="15C0F5"
                            defaultValue={buttonTabState?.lyt_btn_color}
                            onChange={(e) =>
                              setButtonTabState((prev) => ({
                                ...prev,
                                lyt_btn_color: e,
                              }))
                            }
                            colorOptions={[
                              { value: '15C0F5', label: 'Lightblue' },
                              { value: '1A73E8', label: 'darkblue' },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="lyt_btn_text_color"
                          label="Text color"
                          // rules={[
                          //   { required: true, message: 'Please enter amount' },
                          // ]}
                        >
                          <AitColorSwitch
                            // defaultValue="FFFFFF"
                            defaultValue={buttonTabState?.lyt_btn_text_color}
                            onChange={(e) =>
                              setButtonTabState((prev) => ({
                                ...prev,
                                lyt_btn_text_color: e,
                              }))
                            }
                            colorOptions={[
                              { value: 'FFFFFF', label: 'Light' },
                              { value: '000000', label: 'Dark' },
                            ]}
                          ></AitColorSwitch>
                        </Form.Item>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: '2',
                  title: 'Position',
                  children: (
                    <Row gutter={24}>
                      {/* Button Color */}
                      <Col span={24}>
                        <Flex gap={10} style={{ width: '100%' }}>
                          <Form.Item
                            // label="Position"
                            // name="btn_position"
                            style={{ width: '100%' }}
                          >
                            <AitSelectBox
                              style={{ width: '100%' }}
                              value={buttonTabState?.position}
                              onChange={(value) =>
                                setButtonTabState((prev) => ({
                                  ...prev,
                                  position: value,
                                }))
                              }
                              options={[
                                { value: 'left', label: 'Left' },
                                { value: 'right', label: 'Right' },
                                {
                                  value: 'left-center',
                                  label: 'Left vertical',
                                },
                                {
                                  value: 'right-center',
                                  label: 'Right vertical',
                                },
                              ]}
                            />
                          </Form.Item>
                          <div
                            style={{
                              flex: '0 0 40px',
                              width: '40px',
                              height: '40px',
                            }}
                          >
                            <Image
                              width="100%"
                              preview={false}
                              src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/${
                                buttonTabState?.position === 'right'
                                  ? 'right'
                                  : buttonTabState?.position === 'left'
                                    ? 'left'
                                    : buttonTabState?.position === 'left-center'
                                      ? 'Left-Vertical'
                                      : buttonTabState?.position ===
                                          'right-center'
                                        ? 'Right-Vertical'
                                        : ''
                              }-position.png`}
                              alt="image"
                            />
                          </div>
                        </Flex>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Form.Item
                          name="btn_vertical_position"
                          label="Set button vertical position"
                        >
                          <Flex
                            style={{ height: 130, marginTop: 10 }}
                            align="flex-end"
                          >
                            <Slider
                              vertical
                              min={10}
                              max={100} // 👈 keep slider length 100
                              step={1}
                              reverse
                              value={Math.min(buttonTabState?.percent, 80)} // safety clamp
                              tooltip={{ open: false }}
                              onChange={(val) =>
                                setButtonTabState((prev) => ({
                                  ...prev,
                                  percent: val > 80 ? 80 : val, // 👈 restrict value
                                }))
                              }
                              style={{ height: 120 }}
                            />

                            <Title
                              level={5}
                              type="primary"
                              style={{
                                margin: 0,
                                lineHeight: 1,
                                position: 'relative',
                                top: '4px',
                              }}
                            >
                              {buttonTabState?.percent}%
                            </Title>
                          </Flex>
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
                          color="var(--ant-color-text-default)"
                          message="We cannot show the preview of the position. Please click save to check the position on your store’s website."
                          style={{ marginBottom: 16 }}
                        />
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          </FormLeftWrapper>
        </Col>
        <Col xs={24} sm={24} md={16} style={{ position: 'relative' }}>
          <FormLeftWrapper padding="0px">
            <PreviewLoyaltySiteBtn
              buttonTabState={buttonTabState}
              style={{
                color: `#${buttonTabState?.lyt_btn_text_color}` || '',
                backgroundColor: `#${buttonTabState?.lyt_btn_color}`,
              }}
              className={buttonTabState?.position}
            >
              <LoyaltyButtonIcon
                fill={`#${buttonTabState?.lyt_btn_text_color}` || '#fff'}
              />
              <LoyaltyButtonText>{btnText}</LoyaltyButtonText>
            </PreviewLoyaltySiteBtn>
            <Image
              src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/images/loyalty-rewards-preview-aa1.svg`}
              alt="button-preview"
              width="100%"
              preview={false}
            />
          </FormLeftWrapper>
        </Col>
      </Row>
    </>
  );
}

export default ButtonTab;
