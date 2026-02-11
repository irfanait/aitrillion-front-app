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
import parse from 'html-react-parser';
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
  Tooltip,
  Space,
  ConfigProvider,
  App,
} from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { HelpDocSvgIcon, ModalAlertIcon } from '../../svg-icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitUpload from '@/components/atoms/ait-upload';
import logger from '@/utils/logger';
import { generateShortcodeService } from '../../api/displayOnStore';
import {
  convertToFormDataCustom,
  validateImageFile,
} from '@/utils/common.util';
import AitShortcode from '@/components/atoms/ait-shortcode/aitShortcode';
const { Title, Text } = Typography;

function PageTab({ rowPadding, setPageTabState, pageTabState, activeTab }) {
  const { notification } = App.useApp();
  const [shortcodeData, setShortCodeData] = useState();
  const [shortcodeFile, setShorcodeFile] = useState();
  const [loading, setLoading] = useState(false);
  const generateShortCode = async () => {
    setLoading(true);
    try {
      let obj = {
        loader_image: shortcodeFile,
      };
      const payload = convertToFormDataCustom(obj);
      const response = await generateShortcodeService(payload);
      if (response?.data?.status === 'success') {
        setShortCodeData(response?.data?.code);
      } else {
        notification.error({ message: response?.data?.msg });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row gutter={0} style={{ display: activeTab === 'page' ? '' : 'none' }}>
        <Col span={24}>
          <FormLeftWrapper padding="24px 0px 0px">
            <AitRowWrapper padding={rowPadding}>
              <Title level={4} style={{ marginBottom: 20 }}>
                Page
              </Title>
              <Row gutter={24}>
                <Col span={24}>
                  <Label>Enable page shortcode</Label>
                  <Form.Item name="panel_widget_status">
                    <AitSwitch
                      justify="space-between"
                      style={{ marginTop: 10 }}
                      value={pageTabState?.panel_widget_status}
                      onChange={(e) =>
                        setPageTabState((prev) => ({
                          ...prev,
                          panel_widget_status: e,
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              {pageTabState?.panel_widget_status && (
                <Row gutter={[24, 0]}>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      name=""
                      style={{ marginBottom: 0 }}
                      label={
                        <>
                          Upload your loader image{' '}
                          <span
                            style={{
                              fontWeight: 400,
                              fontSize: 12,
                              marginLeft: 2,
                              marginTop: 3,
                            }}
                          >
                            (Optional)
                          </span>
                        </>
                      }
                      rules={[{ validator: validateImageFile }]}
                    >
                      <Form.Item name="file">
                        <AitUpload
                          showImage={false}
                          onImageChange={(e) => setShorcodeFile(e)}
                        />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <AitButton
                      title={'Generate your shortcode'}
                      type="primary"
                      onClick={() => generateShortCode()}
                      loading={loading}
                    />
                  </Col>
                  {(shortcodeData || pageTabState?.panel_widget_shortcode) && (
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={16}
                      style={{ marginTop: 16 }}
                    >
                      <AitText type="secondary" size={13} bottommargin={10}>
                        Copy the shortcode and paste it in your text editer to
                        show the widget on page.
                      </AitText>

                      <AitShortcode
                        copybtn={true}
                        copybtnicon={true}
                        shortcode={parse(
                          shortcodeData ||
                            pageTabState?.panel_widget_shortcode ||
                            ''
                        )}
                      />
                    </Col>
                  )}
                </Row>
              )}
            </AitRowWrapper>
            <Divider />
            <AitRowWrapper padding={rowPadding}>
              <AitText strong type="primary" size={14} bottommargin={6}>
                Do you want a custom loyalty page on your store with your own
                design and linked with the AiTrillion loyalty popup,{' '}
                <AitLink
                  href="https://demo.aitrillion.com/pages/custom-loyalty-page"
                  target="_blank"
                >
                  like this
                </AitLink>
              </AitText>
              <AitText type="secondary" size={13} bottommargin={15}>
                The below CSS classes will help you to open the different
                sections of the popup. You can use these classes with an element
                to trigger the loyalty popup event.
              </AitText>
              <AitText type="secondary" size={13} bottommargin={10}>
                Example:
              </AitText>

              <AitText type="secondary" size={13} bottommargin={10}>
                To open <strong>Refer a friend</strong> section on an anchor tag
                click, add &nbsp;
                <AitShortcode
                  copybtn={true}
                  copybtnicon={true}
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`ait-trigger-refer-a-friend`}
                  gap={5}
                />
                &nbsp; class with that anchor tag. e.g{' '}
                <AitShortcode
                  style={{ width: 'auto', display: 'inline' }}
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`<a class="ait-trigger-refer-a-friend">Refer a friend</a>`}
                />
              </AitText>

              <AitText type="secondary" size={13} bottommargin={10}>
                To open <strong>Redeem points</strong> section on an anchor tag
                click, add &nbsp;
                <AitShortcode
                  copybtn={true}
                  copybtnicon={true}
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`ait-trigger-redeem-points`}
                  gap={5}
                />
                &nbsp; class with that anchor tag. e.g{' '}
                <AitShortcode
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`<a class="ait-trigger-redeem-points">Redeem points</a>`}
                />
              </AitText>

              <AitText type="secondary" size={13} bottommargin={10}>
                To open <strong>Earn points</strong> section on an anchor tag
                click, add &nbsp;
                <AitShortcode
                  copybtn={true}
                  copybtnicon={true}
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  gap={5}
                  shortcode={`ait-trigger-wayto-earn-points`}
                />
                &nbsp; class with that anchor tag. e.g{' '}
                <AitShortcode
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`<a class="ait-trigger-wayto-earn-points">Earn points</a>`}
                />
              </AitText>

              <AitText type="secondary" size={13} bottommargin={10}>
                To open <strong>Points report</strong> section on an anchor tag
                click, add &nbsp;
                <AitShortcode
                  copybtn={true}
                  copybtnicon={true}
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  gap={5}
                  shortcode={`ait-trigger-report-points`}
                />
                &nbsp;class with that anchor tag. e.g{' '}
                <AitShortcode
                  cardpadding={{ xs: '3px 5px', sm: '3px 5px', md: '3px 5px' }}
                  shortcode={`<a class="ait-trigger-report-points">Points report</a>`}
                />
              </AitText>
            </AitRowWrapper>
          </FormLeftWrapper>
        </Col>
      </Row>
    </>
  );
}

export default PageTab;
