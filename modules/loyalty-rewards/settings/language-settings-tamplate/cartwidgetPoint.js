import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Divider, Form, Row, Spin } from 'antd';
import { useState } from 'react';
// import { useEffect } from 'react';

function CartWidgetPoint({ apiData, loading }) {
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  // const [form] = Form.useForm();
  // useEffect(() => {
  //   form.setFieldsValue(apiData);
  // }, [apiData]);
  return (
    <>
      <AitCollapse
        activeKey={activeKeys}
        onChange={setActiveKeys}
        bodyBorderTop="none"
        borderTop="none"
        borderBottom="none"
        firstitemtopborder="none"
        itemborderedandround={true}
        maxHeight="fit-content"
        firstItemTopspacing="0px"
        firstItemBottomspacing="0px"
        itemSpacing="24px 0px"
        borderRadius="8"
        itembordered={true}
        panels={[
          {
            key: '1',
            title: 'Create cart widget point (Before login)',
            children: loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '10vh',
                }}
              >
                <Spin />
              </div>
            ) : (
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="widget_text">
                    <AitInputBox
                      label="To redeem your points please text"
                      placeholder="To redeem your points please text"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            title: 'After login popup sidebar',
            children: loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50vh',
                }}
              >
                <Spin />
              </div>
            ) : (
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item name="widget_error_text">
                    <AitInputBox
                      style={{ marginTop: '20px' }}
                      label="Error message text"
                      placeholder="Please enter valid points"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item name="widget_error_fourth_text">
                    <AitInputBox
                      label="Please enter more than '0' points or points cannot be blank"
                      placeholder="Please enter more than '0' points or points cannot be blank"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item name="widget_input_placeholder_text">
                    <AitInputBox
                      style={{ marginTop: '20px' }}
                      label="Widget input box placeholder text"
                      placeholder="Enter points to redeem"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item name="widget_use_now_btn_text">
                    <AitInputBox
                      style={{ marginTop: '20px' }}
                      label="Widget use now button text"
                      placeholder="Use points"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_error_three_text">
                    <AitInputBox
                      label="The points you are using cannot be greater than your total cart value"
                      placeholder="The points you are using cannot be greater than your total cart value"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_error_fifth_text">
                    <AitInputBox
                      label="The points you are using cannot be greater than your total available points"
                      placeholder="The points you are using cannot be greater than your total available points"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_error_one_text">
                    <AitInputBox
                      label="To redeem your points your cart amount must be greater than minimum cart amount"
                      placeholder="To redeem your points your cart amount must be greater than minimum cart amount"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_error_two_text">
                    <AitInputBox
                      label="Your entered points must be greater than or equal to minimum points limit"
                      placeholder="Your entered points must be greater than or equal to {{minimum_point_limit}} points"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_error_maximum_point_limit">
                    <AitInputBox
                      label="Your entered points must be less than or equal to maximum points limit"
                      placeholder="Your entered points must be less than or equal to maximum points limit"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_success_msg_text">
                    <AitInputBox
                      label="Widget success message text"
                      placeholder="Points redeemed successfully. Please proceed to checkout."
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="widget_lastcode_msg_text">
                    <AitInputBox
                      label="Widget last code message text"
                      placeholder="Your last code was {{aaa_cart_discount_code}} Worth {{aaa_cart_discount_points}} point(s)"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="discount_coupon_for_you">
                    <AitInputBox
                      label="Discount coupon for you"
                      placeholder="Discount coupon for you"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="reward_coupons">
                    <AitInputBox
                      label="Reward coupons"
                      placeholder="Reward coupons"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="create_reward_coupon">
                    <AitInputBox
                      label="Create reward coupon"
                      placeholder="Create reward coupon"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="flat_discount">
                    <AitInputBox
                      label="{{aaa_cart_discount_amount_with_currency}} Flat discount"
                      placeholder="{{aaa_cart_discount_amount_with_currency}} Flat discount"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="free_shiping">
                    <AitInputBox
                      label="Free shipping"
                      placeholder="Free shipping"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="gift_card">
                    <AitInputBox label="Gift card" placeholder="Gift card" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="discount_in_dropdown">
                    <AitInputBox label="Discount" placeholder="Discount" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="per_flat_discount">
                    <AitInputBox
                      label="% flat discount"
                      placeholder="% flat discount"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="processing">
                    <AitInputBox label="Processing" placeholder="Processing" />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
        ]}
      />
      {/* <Col span={24} style={{ marginTop: 20 }}>
        <Form.Item>
          <AitButton type="primary" title="Save" htmlType="submit" />
        </Form.Item>
      </Col> */}
    </>
  );
}

export default CartWidgetPoint;
