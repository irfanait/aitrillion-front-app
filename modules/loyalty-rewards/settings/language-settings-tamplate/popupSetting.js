import AitButton from '@/components/atoms/ait-button/aitButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import { Col, Divider, Form, Row, Spin } from 'antd';
import { useState } from 'react';
// import { useEffect, useState } from 'react';

function PopUpSetting({ apiData, loading }) {
  const [activeKeys, setActiveKeys] = useState(['1', '2']);
  // const [form] = Form.useForm();
  // useEffect(() => {
  //   if (apiData?.first_name) {
  //     form.setFieldsValue(apiData);
  //   }
  // }, [apiData]);

  return (
    <div>
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
            title: 'Before login popup sidebar',
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
                  <Form.Item label="First name" name="first_name">
                    <AitInputBox placeholder="First name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Last name" name="last_name">
                    <AitInputBox placeholder="Last name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Email" name="email">
                    <AitInputBox placeholder="Email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Password" name="password">
                    <AitInputBox placeholder="Password" />
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
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Hi" name="hi_text_lang">
                    <AitInputBox placeholder="Hi" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Earn points" name="earnpoint_lang">
                    <AitInputBox placeholder="Earn points" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Redeem points" name="getreward_lang">
                    <AitInputBox placeholder="Redeem points" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Redeemed points" name="redeemed_points">
                    <AitInputBox placeholder="Redeemed points" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="More points needed"
                    name="getmore_points_needed_lang"
                  >
                    <AitInputBox placeholder="More points needed" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Refer a friend" name="referfriend_lang">
                    <AitInputBox placeholder="Refer a friend" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Help" name="help_lang">
                    <AitInputBox placeholder="Help" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="VIP program" name="tier_system_lang">
                    <AitInputBox placeholder="VIP program" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Available" name="current_balance_lang">
                    <AitInputBox placeholder="Available" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Pending" name="pending_lang">
                    <AitInputBox placeholder="Pending" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Equates to" name="equates_to">
                    <AitInputBox placeholder="Equates to" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Lifetime" name="lifetime_balance_lang">
                    <AitInputBox placeholder="Lifetime" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Claimed rewards" name="claimed_rewards">
                    <AitInputBox placeholder="Claimed rewards" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Points" name="point_lang">
                    <AitInputBox placeholder="Points" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Refer Now" name="refer_now_lang">
                    <AitInputBox placeholder="Refer now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Review Now" name="review_now_lang">
                    <AitInputBox placeholder="Review now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Visit Now" name="visit_now">
                    <AitInputBox placeholder="Visit Now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Select your birthdate"
                    name="select_your_birthdate"
                  >
                    <AitInputBox placeholder="Select your birthdate" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Enter Purchase Code"
                    name="enter_purchase_code"
                  >
                    <AitInputBox placeholder="Enter Purchase Code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Applied successfully"
                    name="applied_successfully"
                  >
                    <AitInputBox placeholder="Applied successfully" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Wrong purchase code"
                    name="wrong_purchase_code"
                  >
                    <AitInputBox placeholder="Wrong purchase code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Code already used" name="code_already_used">
                    <AitInputBox placeholder="Code already used" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="following" name="following">
                    <AitInputBox placeholder="following" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Join Now" name="join_now">
                    <AitInputBox placeholder="Join Now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Are you sure you want to add {birth_date} as your birthday?"
                    name="are_you_sure_you_want_to_add_birth_date_as_your_birthday"
                  >
                    <AitInputBox placeholder="Are you sure you want to add {birth_date} as your birthday?" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Saved! You'll get {points} points on your next birthday"
                    name="you_will_get_points_on_your_next_birthday"
                  >
                    <AitInputBox placeholder="Saved! You'll get {points} points on your next birthday" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Enter Code" name="enter_code">
                    <AitInputBox placeholder="Enter Code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Gift code" name="gift_code">
                    <AitInputBox placeholder="Gift Code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Add" name="add">
                    <AitInputBox placeholder="Add" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="refer_a_friend_wait_one_min_message"
                    label="Your account is currently being set up after your recent sign up. Please wait 1 min and then attempt again."
                  >
                    <AitInputBox
                      textArea
                      placeholder="Your account is currently being set up after your recent sign up. Please wait 1 min and then attempt again."
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="please_click_here_to_generate_refer_a_friend_code"
                    label="Please {click_here} to generate refer a friend code."
                  >
                    <AitInputBox
                      style={{ marginTop: '20px' }}
                      textArea
                      placeholder="Please {click_here} to generate refer a friend code."
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="off" name="off">
                    <AitInputBox placeholder="off" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="on" name="on">
                    <AitInputBox placeholder="on" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Discount" name="discount">
                    <AitInputBox placeholder="Discount" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="year" name="year">
                    <AitInputBox placeholder="year" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="month" name="month">
                    <AitInputBox placeholder="month" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="week" name="week">
                    <AitInputBox placeholder="week" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="day" name="day">
                    <AitInputBox placeholder="day" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="hour" name="hour">
                    <AitInputBox placeholder="hour" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="minute" name="minute">
                    <AitInputBox placeholder="minute" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="second" name="second">
                    <AitInputBox placeholder="second" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="ago" name="ago">
                    <AitInputBox placeholder="ago" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="just now" name="just_now">
                    <AitInputBox placeholder="just now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Copied" name="copied">
                    <AitInputBox placeholder="Copied" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="FREESHIPPING" name="freeshipping">
                    <AitInputBox placeholder="FREESHIPPING" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="WELCOME" name="welcome">
                    <AitInputBox placeholder="WELCOME" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="FREE" name="free">
                    <AitInputBox placeholder="FREE" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="View Product" name="view_product">
                    <AitInputBox placeholder="View Product" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="to continue with Refer a friend"
                    name="before_login_refer_frnd_cont_txt"
                  >
                    <AitInputBox placeholder="to continue with Refer a friend" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Name" name="name">
                    <AitInputBox placeholder="Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Message" name="message">
                    <AitInputBox placeholder="Message" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Send" name="send">
                    <AitInputBox placeholder="Send" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="(we'll add link for you)"
                    name="we_will_add_link_for_you"
                  >
                    <AitInputBox placeholder="(we'll add link for you)" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Invite them by sending email"
                    name="invite_them_by_sending_email"
                  >
                    <AitInputBox placeholder="Invite them by sending email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Mail Sent Successfully"
                    name="mail_sent_successfully"
                  >
                    <AitInputBox placeholder="Mail Sent Successfully" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Please enter a valid email address."
                    name="error_message_for_invalid_email"
                  >
                    <AitInputBox placeholder="Please enter a valid email address." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Ok" name="ok">
                    <AitInputBox placeholder="Ok" />
                  </Form.Item>
                </Col>
                <Divider /> {/* Button labels */}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Save (Button)" name="save">
                    <AitInputBox placeholder="Save" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Shop now (Button)" name="shop_now">
                    <AitInputBox placeholder="Shop now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Achieved (Button)" name="achieved">
                    <AitInputBox placeholder="Achieved" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Allow (Button)" name="allow">
                    <AitInputBox placeholder="Allow" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Allowed (Button)" name="allowed">
                    <AitInputBox placeholder="Allowed" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Follow (Button)" name="follow">
                    <AitInputBox placeholder="Follow" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Followed (Button)" name="followed">
                    <AitInputBox placeholder="Followed" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Get reward (Button)" name="get_reward">
                    <AitInputBox placeholder="Get reward" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Share (Button)" name="share">
                    <AitInputBox placeholder="Share" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Shared (Button)" name="shared">
                    <AitInputBox placeholder="Shared" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Buy now (Button)" name="buy_now">
                    <AitInputBox placeholder="Buy Now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Redeem reward" name="redeem_reward">
                    <AitInputBox placeholder="Redeem Reward" />
                  </Form.Item>
                </Col>
                {/* NEXT BLOCK */}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Please wait..." name="please_wait">
                    <AitInputBox placeholder="Please Wait..." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Added" name="added">
                    <AitInputBox placeholder="Added" />
                  </Form.Item>
                </Col>
                <Divider />
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Your claimed rewards"
                    name="your_claimed_rewards"
                  >
                    <AitInputBox placeholder="Your claimed rewards" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="No claimed reward(s) to show."
                    name="no_claimed_rewards_to_show"
                  >
                    <AitInputBox placeholder="No claimed reward(s) to show" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Points report" name="reward_history">
                    <AitInputBox placeholder="Points report" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Copy your code" name="copy_your_code">
                    <AitInputBox placeholder="Copy your code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Copy your link and share"
                    name="copy_your_link_and_share"
                  >
                    <AitInputBox placeholder="Or copy your link and share it anywhere" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="How do I use this voucher?"
                    name="how_do_use_voucher"
                  >
                    <AitInputBox placeholder="How do I use this voucher?" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Refer friends. Get rewards."
                    name="refer_friends_get_rewards"
                  >
                    <AitInputBox placeholder="Refer friends. Get rewards." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Copy referral link"
                    name="copy_referral_link"
                  >
                    <AitInputBox placeholder="Copy referral link" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Refer a friend discount heading"
                    name="reffer_friend_dicount_code_heading"
                  >
                    <AitInputBox
                      textArea
                      placeholder="Get a {{Discount_amount}} discount on your order when you spend over {{Minimum_discount_amount}}"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Copy the code above, use it during checkout"
                    name="copy_code_using_checkout"
                  >
                    <AitInputBox
                      textArea
                      placeholder="Copy the code above, use it during checkout"
                    />
                  </Form.Item>
                </Col>
                <Divider /> {/* NEXT */}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Share on social media"
                    name="share_on_social_media"
                  >
                    <AitInputBox placeholder="Share on social media" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Add discount code here"
                    name="add_discount_code_here"
                  >
                    <AitInputBox placeholder="Add discount code here" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Save code (Button)" name="save_code">
                    <AitInputBox placeholder="Save code" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Date" name="date_lang">
                    <AitInputBox placeholder="Date" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Point activity" name="point_activity">
                    <AitInputBox placeholder="Point activity" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Status" name="activity_status">
                    <AitInputBox placeholder="Status" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Description" name="description">
                    <AitInputBox placeholder="Description" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Off your order" name="off_your_order">
                    <AitInputBox placeholder="Off your order" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Free shipping on your order"
                    name="free_shipping_on_your_order"
                  >
                    <AitInputBox placeholder="Free shipping on your order" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Type code here" name="type_code_here">
                    <AitInputBox placeholder="Type code here" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="No reward available" name="no_reward_text">
                    <AitInputBox placeholder="No rewards available" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Yes button" name="yes_buton_text">
                    <AitInputBox placeholder="Yes" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Not now button" name="notnow_buton_text">
                    <AitInputBox placeholder="Not now" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="Getting reward button"
                    name="get_reward_button_text"
                  >
                    <AitInputBox placeholder="Getting reward..." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item
                    label="View reward button"
                    name="viewreward_buton_text"
                  >
                    <AitInputBox placeholder="View reward" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
                  <Form.Item label="Revert" name="revert">
                    <AitInputBox placeholder="Revert" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Viewing reward button"
                    name="viewing_reward_buton_text"
                  >
                    <AitInputBox placeholder="Viewing..." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Confirm redeem reward text"
                    name="redeem_reward_text"
                  >
                    <AitInputBox placeholder="Redeem {{points}} points for this reward?" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Use the below discount code on the checkout page."
                    name="reward_used_text"
                  >
                    <AitInputBox placeholder="Use the below discount code on the checkout page." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label="Give your friends % off on their first purchase and get rewards points for each referral."
                    name="get_rewards_points_for_each_referral"
                  >
                    <AitInputBox placeholder="Give your friends % off on their first purchase and get rewards points for each referral" />
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
    </div>
  );
}

export default PopUpSetting;
