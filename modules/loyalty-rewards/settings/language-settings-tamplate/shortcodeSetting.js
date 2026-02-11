import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Divider, Form, Row, Spin } from 'antd';
import { useState } from 'react';
// import { useEffect } from 'react';

function ShortcodeSetting({ apiData, loading }) {
  const [activeKeys, setActiveKeys] = useState(['1', '2', '3']);
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
            title:
              'Shortcode setting for show customer available point (Before login)',
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
                  <Form.Item name="cust_availablePt_widget_text">
                    <AitInputBox
                      label="To view your available points text"
                      placeholder="To view your available points."
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            title: 'Show customer spent points (Before login)',
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
                {/* ====== COLUMN 1 ====== */}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="cust_spentPt_widget_text">
                    <AitInputBox
                      label="To view your spent points text"
                      placeholder="To view your spent points."
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            title: 'Show customer lifetime points (Before login)',
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
                {/* ====== COLUMN 1 ====== */}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item name="cust_lifetimePt_login_text">
                    <AitInputBox
                      label="To view your lifetime points text"
                      placeholder="To view your lifetime points."
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </>
  );
}

export default ShortcodeSetting;
