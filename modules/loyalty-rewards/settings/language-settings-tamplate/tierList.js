import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Divider, Form, Row, Spin } from 'antd';
import { useState } from 'react';
// import { useEffect } from 'react';

function TierList({ apiData, loading }) {
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  // const [form] = Form.useForm();
  // useEffect(() => {
  //   if (apiData?.first_name) {
  //     form.setFieldsValue(apiData);
  //   }
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
        activeKey={activeKeys}
        onChange={setActiveKeys}
        panels={[
          {
            key: '1',
            title: 'Tier list (After login)',
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
                <Col xs={24} sm={12} md={12}>
                  <Form.Item name="tier_more_points">
                    <AitInputBox
                      label="Earn {{points}} more points to reach this tier"
                      placeholder="Earn {{points}} more points to reach this tier"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="tier_earned_points_for_activities">
                    <AitInputBox
                      label="Earn points for activities"
                      placeholder="Earn points for activities"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="tier_benefits_text">
                    <AitInputBox
                      label="Tier benefits"
                      placeholder="Tier benefits"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="tier_current_text">
                    <AitInputBox
                      label="Current tier"
                      placeholder="Current tier"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="next_tier_text">
                    <AitInputBox label="Next tier" placeholder="Next tier" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="bonous_points_reaching_tier_text">
                    <AitInputBox
                      label="Bonus points on reaching this tier"
                      placeholder="Bonus points on reaching this tier"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="point_value">
                    <AitInputBox
                      label="Point value ({{point_expression}})"
                      placeholder="Point value ({{point_expression}})"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="additional_birthday_points">
                    <AitInputBox
                      label="Additional birthday points"
                      placeholder="Additional birthday points"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="points_needed_to_unlocked_next_tier_text">
                    <AitInputBox
                      label="Points needed to unlock"
                      placeholder="Points needed to unlock"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="spent_amt_to_unlocked_next_tier_text">
                    <AitInputBox
                      label="Spent {spent} more to unlock"
                      placeholder="Spent {spent} more to unlock"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="spent_amt_needed_to_unlocked_next_tier_text">
                    <AitInputBox
                      label="Spent needed to unlock"
                      placeholder="Spent needed to unlock"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="tier_yearly_points">
                    <AitInputBox
                      label="Tier yearly point"
                      placeholder="Tier yearly point"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item name="tier_yearly_spent">
                    <AitInputBox
                      label="Tier yearly spent"
                      placeholder="Tier yearly spent"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '2',
            title: 'Customer account VIP program (After login)',
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
                <Col span={24} style={{ marginBottom: '10px' }}>
                  <label>For tag based</label>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_no_tier_achieved_tagbased">
                    <AitInputBox
                      label="Text when no tier achieved"
                      placeholder="Join the journey to our VIP program—shop more and unlock exclusive benefits!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} style={{ marginBottom: '10px' }}>
                  <label>For amount spent</label>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_no_tier_achieved_spend">
                    <AitInputBox
                      label="Text when no tier achieved (Spend)"
                      placeholder="Join the journey to our VIP program—shop more and unlock exclusive benefits!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_any_tier_achieved_spend">
                    <AitInputBox
                      label="Text when any tier achieved (Spend)"
                      placeholder="You're in {{tier_name}}! shop more to reach {{next_tier_name}} and unlock higher benefits!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_point_status_text_spent">
                    <AitInputBox
                      label="Points status message (Spent)"
                      placeholder="You've spent {{amount}} - only {{amount_needed}} more to {{next_tier_name}} tier! Keep it up!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_point_status_text_spent_calender_year">
                    <AitInputBox
                      label="Points status message (Spend – Calendar Year)"
                      placeholder="You've spent {{amount}} this year - only {{amount_needed}} more to {{next_tier_name}} tier! Keep it up!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} style={{ marginBottom: '10px' }}>
                  <label>For points earned</label>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_no_tier_achieved">
                    <AitInputBox
                      label="Text when no tier achieved (Points earned)"
                      placeholder="Join the journey to our VIP program—earn points and unlock exclusive benefits!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_any_tier_achieved">
                    <AitInputBox
                      label="Text when any tier achieved (Points earned)"
                      placeholder="You're in {{tier_name}}! Keep earning points to reach {{next_tier_name}} and unlock higher benefits!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_point_status_text">
                    <AitInputBox
                      label="Points status message (Points earned)"
                      placeholder="You're at {{available_points}} points - only {{points_needed}} more to {{next_tier_name}} tier! Keep it up!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_point_status_text_calender_year">
                    <AitInputBox
                      label="Points status message (Calendar year - Points earned)"
                      placeholder="You're at {{available_points}} points this year - only {{points_needed}} more to {{next_tier_name}} tier! Keep it up!"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="tier_text_when_last_tier_achieved">
                    <AitInputBox
                      label="Text when last tier achieved"
                      placeholder="Congratulations! You’re now in the {{last_tier_name}} tier!"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="my_acc_tier_current_text">
                    <AitInputBox
                      label="Current tier"
                      placeholder="Current tier"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item name="my_acc_points_text">
                    <AitInputBox label="Points" placeholder="Points" />
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

export default TierList;
