import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Divider, Form, Row, Spin } from 'antd';
import { useEffect } from 'react';

function LoyaltyAIBox({ apiData, loading }) {
  // const [form] = Form.useForm();
  // useEffect(() => {
  //   form.setFieldsValue(apiData);
  // }, [apiData]);
  return (
    <>
      <AitCollapse
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
        defaultActiveKey={'1'}
        panels={[
          {
            key: '1',
            title: 'Loyalty (AI box)',
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
                  <Form.Item name="your_loyalty_points">
                    <AitInputBox
                      label="Your loyalty points"
                      placeholder="Your loyalty points"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="your_loyalty_points_after_login">
                    <AitInputBox
                      label="Your loyalty points ( after login)"
                      placeholder="Your loyalty points"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="sign_up_text">
                    <AitInputBox label="Sign up" placeholder="Sign up" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="login_text">
                    <AitInputBox label="Login link" placeholder="Login" />
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

export default LoyaltyAIBox;
