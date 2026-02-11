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
  Tooltip,
  Space,
  ConfigProvider,
} from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { HelpDocSvgIcon, ModalAlertIcon } from '../../svg-icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitShortcode from '@/components/atoms/ait-shortcode/aitShortcode';
const { Title, Text } = Typography;

function WidgetsTab({
  rowPadding,
  widgetsTabState,
  setWidgetsTabState,
  activeTab,
}) {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);

  return (
    <>
      <Row
        gutter={0}
        style={{ display: activeTab === 'widgets' ? '' : 'none' }}
      >
        <Col span={24}>
          <FormLeftWrapper padding="24px 0px 0px">
            <AitRowWrapper padding={rowPadding}>
              <Title level={4}>Shortcode for widgets</Title>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <AitText strong type="primary" size={15} bottommargin={10}>
                    Customer widget shortcode
                  </AitText>
                  <AitText type="secondary" size={13} bottommargin={16}>
                    Copy the shortcode and paste it in your customer account
                    template in your theme editor to show the widget on page.
                    This will basically show the button.{' '}
                    <AitButton
                      onClick={() => setOpen1(true)}
                      padding="0px"
                      type="link"
                      title="(learn how)"
                    />
                  </AitText>
                  <AitModal
                    open={open1}
                    handleModalClose={() => setOpen1(false)}
                    title={'Customer widget shortcode'}
                    width={900}
                    isHeaderAtCenter={true}
                    centered
                  >
                    <AitText
                      type="secondary"
                      size={14}
                      bottommargin={16}
                      style={{ textAlign: 'center' }}
                    >
                      Copy the shortcode and paste it in your customer account
                      template in your theme editor to show the widget on page.
                    </AitText>
                    <Image
                      preview={false}
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/coustemer.png`}
                      alt="shortcode"
                    />
                  </AitModal>
                  <AitShortcode
                    copybtn={true}
                    copybtnicon={true}
                    shortcode={`<div class="aaa-loyalty-customer-widget"> </div>`}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="shortcode_btn_text"
                    label="Button text"
                    initialValue="Show loyalty points"
                  >
                    <AitInputBox placeholder="Show loyalty points" />
                  </Form.Item>
                </Col>
              </Row>
            </AitRowWrapper>
            <Divider />
            <AitRowWrapper padding={rowPadding}>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Flex gap={5} align="center">
                    <AitText strong type="primary" size={15} bottommargin={10}>
                      Redeem on cart shortcode
                    </AitText>
                    <Tooltip placement="right" title="Help doc">
                      <AitLink
                        style={{ marginBottom: 10 }}
                        href="https://docs.aitrillion.com/portal/en/kb/articles/cart-widget-points#Introduction"
                        target="_blank"
                      >
                        <HelpDocSvgIcon />
                      </AitLink>
                    </Tooltip>
                  </Flex>

                  <AitText type="secondary" size={13} bottommargin={16}>
                    Copy the shortcode and paste it in cart-template in section
                    file.
                    <AitButton
                      onClick={() => setOpen2(true)}
                      padding="0px"
                      type="link"
                      title="(learn how)"
                    />
                  </AitText>
                  <AitModal
                    open={open2}
                    handleModalClose={() => setOpen2(false)}
                    title={'Redeem on Cart Shortcode'}
                    width={900}
                    isHeaderAtCenter={true}
                    centered
                  >
                    <AitText
                      type="secondary"
                      size={14}
                      bottommargin={16}
                      style={{ textAlign: 'center' }}
                    >
                      Copy the shortcode and paste it in cart-template in
                      section file.
                    </AitText>
                    <Image
                      preview={false}
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/cartshow.png`}
                      alt="shortcode"
                    />
                  </AitModal>

                  <AitShortcode
                    copybtn={true}
                    copybtnicon={true}
                    shortcode={`<div class="aaa-loyalty-cartredeem-widget"> </div>`}
                  />
                </Col>
              </Row>
            </AitRowWrapper>
            <Divider />
            <AitRowWrapper padding={rowPadding}>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Flex gap={5} align="center">
                    <AitText strong type="primary" size={15} bottommargin={10}>
                      Show earn points on product detail page
                    </AitText>
                    <Tooltip placement="right" title="Help doc">
                      <AitLink
                        style={{ marginBottom: 10 }}
                        href="https://docs.aitrillion.com/portal/en/kb/articles/display-and-customize-the-earn-points-widget"
                        target="_blank"
                      >
                        <HelpDocSvgIcon />
                      </AitLink>
                    </Tooltip>
                  </Flex>
                  <AitText type="secondary" size={13} bottommargin={16}>
                    Copy the shortcode and paste in product detail page where
                    you want to show earn points.
                  </AitText>

                  <AitShortcode
                    copybtn={true}
                    copybtnicon={true}
                    shortcode={`<div class="aaa-lyt-make-a-purchase-point-widget" data-product-price="{{ product.price }}"> </div>`}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12} style={{ marginTop: 24 }}>
                  <Form.Item
                    name="loyalty_earn_points_title"
                    initialValue="You will earn [[earn-pt]] points on this purchase."
                  >
                    <AitInputBox placeholder="You will earn [[earn-pt]] points on this purchase." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="loyalty_earn_points_learn_more_title"
                    label="Learn more text"
                    initialValue="Learn more"
                  >
                    <AitInputBox placeholder="Learn more" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="loyalty_earn_points_learn_more_url"
                    label="Learn more URL"
                    initialValue="Learn more URL"
                  >
                    <AitInputBox placeholder="Learn more URL" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="loyalty_earn_points_color_hidden"
                    label="Text color"
                  >
                    <ColorPicker
                      size="large"
                      showText
                      defaultValue={`#${widgetsTabState?.loyalty_earn_points_color_hidden}`}
                      onChange={(e) =>
                        setWidgetsTabState((prev) => ({
                          ...prev,
                          loyalty_earn_points_color_hidden: e
                            ?.toHexString()
                            ?.toLowerCase()
                            ?.replace('#', ''),
                        }))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </AitRowWrapper>
            <Divider style={{ marginTop: 0 }} />
            <AitRowWrapper padding={rowPadding}>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Flex gap={5} align="center">
                    <AitText strong type="primary" size={15} bottommargin={10}>
                      Show earn points on product collection page
                    </AitText>
                    <Tooltip placement="right" title="Help doc">
                      <AitLink
                        style={{ marginBottom: 10 }}
                        href="https://docs.aitrillion.com/portal/en/kb/articles/display-and-customize-the-earn-points-widget"
                        target="_blank"
                      >
                        <HelpDocSvgIcon />
                      </AitLink>
                    </Tooltip>
                  </Flex>
                  <AitText type="secondary" size={13} bottommargin={16}>
                    Copy the shortcode and paste in product collection page
                    where you want to show earn points.
                  </AitText>

                  <div style={{ marginBottom: 24 }}>
                    <AitShortcode
                      copybtn={true}
                      copybtnicon={true}
                      shortcode={`<div class="aaa-lyt-make-a-purchase-point-collection-widget" data-product-price="{{ card_product.price }}"> </div>`}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    name="loyalty_earn_points_coll_title"
                    initialValue="You will earn [[earn-pt]] points on this purchase."
                  >
                    <AitInputBox placeholder="You will earn [[earn-pt]] points on this purchase." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item name="" label="Text color">
                    <ColorPicker
                      defaultValue={`#${widgetsTabState?.loyalty_earn_points_coll_color}`}
                      onChange={(e) =>
                        setWidgetsTabState((prev) => ({
                          ...prev,
                          loyalty_earn_points_coll_color: e
                            ?.toHexString()
                            ?.toLowerCase()
                            ?.replace('#', ''),
                        }))
                      }
                      size="large"
                      showText
                    />
                  </Form.Item>
                </Col>
              </Row>
            </AitRowWrapper>
            <Divider style={{ marginTop: 0 }} />
            <AitRowWrapper padding={rowPadding}>
              <Flex gap={5} align="center">
                <Title level={4}>Simple points shortcode (Advanced) </Title>
                <Tooltip placement="right" title="Help doc">
                  <AitLink
                    style={{ marginBottom: 10 }}
                    href="https://docs.aitrillion.com/portal/en/kb/articles/loyalty-reward-widgets#Workflow"
                    target="_blank"
                  >
                    <HelpDocSvgIcon />
                  </AitLink>
                </Tooltip>
              </Flex>
              <Row>
                <Col xs={24} sm={18} md={18} lg={18}>
                  <AitText type="secondary" size={13} bottommargin={24}>
                    Copy the shortcode and paste it anywhere you want to show
                    the customer points description.
                  </AitText>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={24} sm={8} md={8} lg={8}>
                  <AitText strong type="primary" size={15} bottommargin={10}>
                    Show customer available points
                  </AitText>
                  <Row>
                    <Col xs={24} sm={18} md={18} lg={18}>
                      <AitText type="secondary" size={13} bottommargin={16}>
                        Copy the shortcode and paste where you want to show
                        available points.
                      </AitText>
                    </Col>
                  </Row>
                  <div style={{ marginBottom: 24 }}>
                    <AitShortcode
                      copybtn={true}
                      copybtnicon={true}
                      shortcode={`<span class="aaa-ly-cus-available-p"> </span>`}
                    />
                  </div>

                  <Form.Item
                    name="avail_points_text"
                    initialValue="You have [[avail-pt]] Available Reward Points"
                  >
                    <AitInputBox
                      textArea
                      placeholder="You have [[avail-pt]] Available Reward Points"
                    />
                  </Form.Item>
                  <Image
                    preview={false}
                    onClick={() => setOpen3(true)}
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/product-detail-points-v2.png`}
                    alt="product-detail-points"
                    style={{ cursor: 'pointer' }}
                  />
                  <AitModal
                    open={open3}
                    handleModalClose={() => setOpen3(false)}
                    title={'Show Customer Available Points'}
                    width={900}
                    isHeaderAtCenter={true}
                    centered
                  >
                    <AitText
                      type="secondary"
                      size={14}
                      bottommargin={16}
                      style={{ textAlign: 'center' }}
                    >
                      Copy the shortcode and paste where you want to show
                      available points.
                    </AitText>
                    <Image
                      preview={false}
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/product-detail-points-v2.png`}
                      alt="show available points"
                    />
                  </AitModal>
                </Col>

                <Col xs={24} sm={8} md={8} lg={8}>
                  <AitText strong type="primary" size={15} bottommargin={10}>
                    Show customer spent points
                  </AitText>
                  <Row>
                    <Col xs={24} sm={18} md={18} lg={18}>
                      <AitText type="secondary" size={13} bottommargin={16}>
                        Copy the shortcode and paste where you want to show
                        spent points.
                      </AitText>
                    </Col>
                  </Row>
                  <div style={{ marginBottom: 24 }}>
                    <AitShortcode
                      copybtn={true}
                      copybtnicon={true}
                      shortcode={`<span class="aaa-ly-cus-spent-p"> </span>`}
                    />
                  </div>

                  <Form.Item
                    name="spent_points_text"
                    initialValue="You have [[spent-pt]] Spent Reward Points"
                  >
                    <AitInputBox
                      textArea
                      placeholder="You have [[spent-pt]] Spent Reward Points"
                    />
                  </Form.Item>
                  <Image
                    preview={false}
                    onClick={() => setOpen4(true)}
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/account-page-points.png`}
                    alt="account-page-points"
                    style={{ cursor: 'pointer' }}
                  />
                  <AitModal
                    open={open4}
                    handleModalClose={() => setOpen4(false)}
                    title={'Show Customer Spent Points'}
                    width={900}
                    isHeaderAtCenter={true}
                    centered
                  >
                    <AitText
                      type="secondary"
                      size={14}
                      bottommargin={16}
                      style={{ textAlign: 'center' }}
                    >
                      Copy the shortcode and paste where you want to show spent
                      points.
                    </AitText>
                    <Image
                      preview={false}
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/account-page-points.png`}
                      alt="show spent points"
                    />
                  </AitModal>
                </Col>

                <Col xs={24} sm={8} md={8} lg={8}>
                  <AitText strong type="primary" size={15} bottommargin={10}>
                    Show customer lifetime points
                  </AitText>
                  <Row>
                    <Col xs={24} sm={18} md={18} lg={18}>
                      <AitText type="secondary" size={13} bottommargin={16}>
                        Copy the shortcode and paste where you want to show
                        lifetime points.
                      </AitText>
                    </Col>
                  </Row>
                  <div style={{ marginBottom: 24 }}>
                    <AitShortcode
                      copybtn={true}
                      copybtnicon={true}
                      shortcode={`<span class="aaa-ly-cus-lifetime-p"> </span>`}
                    />
                  </div>

                  <Form.Item
                    name="lifetime_points_text"
                    initialValue="You have [[lifetime-pt]] Lifetime Reward Points"
                  >
                    <AitInputBox placeholder="You have [[lifetime-pt]] Lifetime Reward Points" />
                  </Form.Item>
                  <Image
                    preview={false}
                    onClick={() => setOpen5(true)}
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/bar-points.png`}
                    alt="bar-points"
                    style={{ cursor: 'pointer' }}
                  />

                  <AitModal
                    open={open5}
                    handleModalClose={() => setOpen5(false)}
                    title={'Show Customer Lifetime Points'}
                    width={900}
                    isHeaderAtCenter={true}
                    centered
                  >
                    <AitText
                      type="secondary"
                      size={14}
                      bottommargin={16}
                      style={{ textAlign: 'center' }}
                    >
                      Copy the shortcode and paste where you want to show
                      lifetime points.
                    </AitText>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/loyalty/images/bar-points.png`}
                      alt="Show Customer Available Points image"
                    />
                  </AitModal>
                </Col>
              </Row>
            </AitRowWrapper>
          </FormLeftWrapper>
        </Col>
      </Row>
    </>
  );
}

export default WidgetsTab;
