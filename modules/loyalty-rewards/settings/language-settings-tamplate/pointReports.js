import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Form, Row, Spin } from 'antd';
// import { useEffect } from 'react';

function PointReports({ apiData, loading }) {
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
            title: 'Point reports',
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
                <Col xs={24} md={12}>
                  <Form.Item name="your_points_are_expired">
                    <AitInputBox
                      label="Your Points Are Expired"
                      placeholder="Your Points Are Expired"
                    />
                  </Form.Item>

                  <Form.Item name="referral_code_generated">
                    <AitInputBox
                      label="Referral Code Generated"
                      placeholder="Referral Code Generated"
                    />
                  </Form.Item>

                  <Form.Item name="partial_refund">
                    <AitInputBox
                      label="Partial Refund"
                      placeholder="Partial Refund"
                    />
                  </Form.Item>

                  <Form.Item name="reverted_redeemed_point">
                    <AitInputBox
                      label="Reverted Redeemed Point/Order canceled"
                      placeholder="Reverted redeemed point/Order canceled"
                    />
                  </Form.Item>

                  <Form.Item name="claimed">
                    <AitInputBox label="Claimed" placeholder="Claimed" />
                  </Form.Item>

                  <Form.Item name="approved">
                    <AitInputBox label="Approved" placeholder="Approved" />
                  </Form.Item>

                  <Form.Item name="void">
                    <AitInputBox label="Void" placeholder="Void" />
                  </Form.Item>

                  <Form.Item name="added_by_admin">
                    <AitInputBox
                      label="Added By Admin"
                      placeholder="Added By Admin"
                    />
                  </Form.Item>

                  <Form.Item name="free_product">
                    <AitInputBox
                      label="Free Product"
                      placeholder="Free Product"
                    />
                  </Form.Item>

                  <Form.Item name="tier_upgrade_enter_with_bonus_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier upgrade (Enter with bonus into the {{tier_name}} tier.)"
                      placeholder="Tier upgrade (Enter with bonus into the {{tier_name}} tier.)"
                    />
                  </Form.Item>

                  <Form.Item name="tier_downgrade_re_enter_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier downgrade (Re-enter into the {{tier_name}} tier.)"
                      placeholder="Tier downgrade (Re-enter into the {{tier_name}} tier.)"
                    />
                  </Form.Item>

                  <Form.Item name="tier_downgrade_enter_without_bonus_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier downgrade (Enter without bonus into the {{tier_name}} tier.)"
                      placeholder="Tier downgrade (Enter without bonus into the {{tier_name}} tier.)"
                    />
                  </Form.Item>
                </Col>

                {/* ====== COLUMN 2 ====== */}
                <Col xs={24} md={12}>
                  <Form.Item name="tier_upgrade_bonus">
                    <AitInputBox
                      label="Tier Upgrade Bonus"
                      placeholder="Tier Upgrade Bonus"
                    />
                  </Form.Item>

                  <Form.Item name="tier_downgraded">
                    <AitInputBox
                      label="Tier Downgraded"
                      placeholder="Tier Downgraded"
                    />
                  </Form.Item>

                  <Form.Item name="order_canceled">
                    <AitInputBox
                      label="Order Canceled"
                      placeholder="Order Canceled"
                    />
                  </Form.Item>

                  <Form.Item name="loyalty_activity">
                    <AitInputBox
                      label="Loyalty Activity"
                      placeholder="Loyalty Activity"
                    />
                  </Form.Item>

                  <Form.Item name="in_progress">
                    <AitInputBox
                      label="In Progress"
                      placeholder="In Progress"
                    />
                  </Form.Item>

                  <Form.Item name="unapproved">
                    <AitInputBox label="Unapproved" placeholder="Unapproved" />
                  </Form.Item>

                  <Form.Item name="cancelled_refund">
                    <AitInputBox
                      label="Cancelled/Refund"
                      placeholder="Cancelled/Refund"
                    />
                  </Form.Item>

                  <Form.Item name="deducted_by_admin">
                    <AitInputBox
                      label="Deducted by admin"
                      placeholder="Deducted by admin"
                    />
                  </Form.Item>

                  <Form.Item name="tier_upgrade_re_enter_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier upgrade (Re-enter into the {{tier_name}} tier.)"
                      placeholder="Tier upgrade (Re-enter into the {{tier_name}} tier.)"
                    />
                  </Form.Item>

                  <Form.Item name="tier_upgrade_enter_without_bonus_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier upgrade (Enter without bonus into the {{tier_name}} tier.)"
                      placeholder="Tier upgrade (Enter without bonus into the {{tier_name}} tier.)"
                    />
                  </Form.Item>

                  <Form.Item name="tier_removed">
                    <AitInputBox
                      label="Tier removed"
                      placeholder="Tier removed"
                    />
                  </Form.Item>

                  <Form.Item name="tier_downgrade_enter_without_bonus_into_the_tier_name_tier">
                    <AitInputBox
                      label="Tier downgrade (Enter without bonus into the {{tier_name}} tier.)"
                      placeholder="Tier downgrade (Enter without bonus into the {{tier_name}} tier.)"
                    />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
        ]}
      />
      {/* <Col xs={24} md={24} style={{ marginTop: 20 }}>
        <Form.Item>
          <AitButton type="primary" title="Save" htmlType="submit" />
        </Form.Item>
      </Col> */}
    </>
  );
}

export default PointReports;
