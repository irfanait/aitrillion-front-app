/* eslint-disable react/no-unescaped-entities */
import AitDrawer from '@/components/atoms/ait-drawer/aitDrawer';
import React, { useEffect, useState } from 'react';
import { CaretRightOutlined, RightOutlined } from '@ant-design/icons';
import {
  StyleProfileBotSec,
  StyleProfileMenu,
  StyleProfileWrapper,
  StyleEarnBonus,
  StyleEarnBonusText,
} from './style';
import { useDispatch, useSelector } from 'react-redux';
import { App, Col, Divider, Row, Typography } from 'antd';
const { Text } = Typography;
import { useRouter } from 'next/router';
import Link from 'next/link';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  AitIntegrationIcon,
  ApiAccessIcon,
  ApiKeyIcon,
  BillingIcon,
  DollarIcon,
  LockIcon,
  ModuleSettingsIcon,
  PencilIcon,
  ResourceIcon,
  WebhooksIcon,
  WnatsnewIcon,
} from '@/modules/layouts/svg-icons';
import { getToken, handleLogout, removeJWTToken } from '@/utils/authHelpers';
import { logoutApi } from '@/modules/auth/api/logoutApi';
import { logoutReset } from '@/modules/auth/authSlices/authSlice';

const ProfileDrawer = ({ drawerVisible, setDrawerVisible }) => {
  const token = getToken();
  const { notification } = App.useApp();

  const dispatch = useDispatch();
  const {
    role,
    shop_owner,
    first_name,
    last_name,
    email,
    shop_id,
    domain,
    is_allow_rest_api,
    role_user_id,
    shop_type,
    login_id,
    is_back,
  } = useSelector((state) => state.jwtState?.login_auth);

  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const router = useRouter();
  const [twostepauth, setTwostepauth] = useState(false);
  const [apiaccess, setApiaccess] = useState(false);
  const hideTwoStepAuthModal = () => setTwostepauth(false);
  const showApiAccessModal = () => setApiaccess(true);
  const hideApiAccessModal = () => setApiaccess(false);

  const shopOwner = (shop_owner && shop_owner) || '';
  const shopOwnerArr = shopOwner.split(' ');

  let userInitials = '';
  if (shopOwnerArr.length > 0) {
    const firstInitial = shopOwnerArr[0]?.[0]?.toUpperCase() || 'F';
    const secondInitial = shopOwnerArr[1]?.[0]?.toUpperCase() || 'L';
    userInitials = `${firstInitial}${secondInitial}`;
  }
  // this will be work when login page is in the same domain v2
  useEffect(() => {
    if (loggeInUserState?.logOutApiState === 'success') {
      handleLogout();
      removeJWTToken();
      dispatch(logoutReset());
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}`);
    }
    if (loggeInUserState?.logOutApiState === 'error') {
      notification.error({
        message: loggeInUserState.logoutMessage,
      });
    }
  }, [loggeInUserState?.logOutApiState]);

  const shopMFAdata = {
    login_id: login_id,
  };

  const showTwoStepAuthModal = () => {
    setTwostepauth(true);
    //  dispatch(getShopMfaData(shopMFAdata))
  };

  const logoutAndRedirect = async () => {
    try {
      const isSafeLogout =
        window.aiAuth?.logout && typeof window.aiAuth.logout === 'function';

      if (isSafeLogout) {
        try {
          await window.aiAuth.logout(); // still fails due to internal broken "e"
        } catch (err) {
          console.warn('aiAuth.logout failed internally:', err);
        }
      } else {
        console.warn('aiAuth.logout not available');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }

    // Your app logout flow
    handleLogout();
  };

  return (
    <AitDrawer
      // onMouseEnter={() => setDrawerVisible(true)}
      onMouseLeave={() => setDrawerVisible(false)}
      mask={false}
      headerVisible={false}
      open={drawerVisible}
      closable={false}
      setVisible={setDrawerVisible}
      width={296}
      showBackArrow={true}
      forMobileResponsive={true}
      padding={'60px 0px 0px 0px !important'}
      bodyStyle={{
        padding: 0,
      }}
      // bodyStyle={0}
      zIndex={998}
    >
      <StyleProfileWrapper>
        <Row className="user_profile text-center">
          <Col span={24} className="user_profile_image text-center">
            <span className="fir-las-alphanew me-auto ms-auto text-uppercase">
              {userInitials}
            </span>
          </Col>
          <Col span={24} className="user_profile_name text-capitalize">
            {role === 'all' ? shop_owner : first_name + ' ' + last_name}
          </Col>
          <Col span={24} className="user_profile_email">
            {email}
          </Col>
          {domain && shop_id > 1 && (
            <Col span={24} className="visit_store">
              <Link
                target="_blank"
                rel="noreferrer"
                href={`https://${domain}`}
                className=""
              >
                Visit store <CaretRightOutlined className="caret_right" />
              </Link>
            </Col>
          )}
        </Row>
        <Row className="btn-wrapper">
          <Col
            span={12}
            flex="fill"
            className="text-center"
            ai-user-feature="general_settings"
          >
            {shop_id > 1 ? (
              <AitButton
                type="link"
                title="My account"
                block={true}
                bordercolor="transparent  #DAEAF3 transparent transparent"
                hoverbgcolor="#E8F1FD"
                hovertextcolor="#1A73E8"
                squareshape="0px"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/customers/setting?ai_v2=${token}`}
              />
            ) : (
              <AitButton
                type="link"
                title="My account"
                block={true}
                bordercolor="transparent #DAEAF3 transparent transparent"
                hoverbgcolor="#E8F1FD"
                hovertextcolor="#1A73E8"
                squareshape="0px"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/quicksettings#/firststep?ai_v2=${token}`}
              />
            )}
          </Col>
          <Col
            span={12}
            flex="fill"
            className={`text-center ${(role && role == 'review') || role == 'all' ? '' : 'permission-granted'}`}
          >
            <AitButton
              type="link"
              title="Logout"
              block={true}
              hoverbgcolor="#E8F1FD"
              hovertextcolor="#1A73E8"
              squareshape="0px"
              loading={loggeInUserState?.logOutApiState === 'pending'}
              onClick={() => logoutAndRedirect()}
              // onClick={()=>{
              //   handleLogout()
              //   router.replace(`${process.env.NEXT_PUBLIC_APP_URL}?act=adminlogout`);

              // }}
            />
          </Col>
        </Row>
        <StyleProfileBotSec>
          {shop_id > 1 && (
            <>
              <AitButton
                type="link"
                variant="outlined"
                color="primary"
                title="User management"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/quicksettings#/firststep?ai_v2=${token}`}
                block={true}
                hoverBgColor="#E8F1FD"
                hovertextcolor="#1A73E8"
                bordercolor="transparent #c transparent transparent"
              />

              <StyleProfileMenu>
                <ul>
                  <li>
                    <Link
                      data-amp-event-name="top_menu_user_change_password"
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/customers/changepassword?ai_v2=${token}`}
                      className="text_13_400_576F7C"
                    >
                      <span className="icon_svg">
                        <LockIcon />
                      </span>
                      <Text type="secondary">Change password</Text>
                    </Link>
                  </li>
                  <li ai-user-feature="module_setting">
                    <Link
                      data-amp-event-name="top_menu_user_module_settings"
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/modulesetting?ai_v2=${token}`}
                      className="text_13_400_576F7C"
                    >
                      <span className="icon_svg">
                        <ModuleSettingsIcon />
                      </span>
                      <Text type="secondary">Module settings</Text>
                    </Link>
                  </li>

                  <li ai-user-feature="billing">
                    <Link
                      data-amp-event-name="top_menu_user_billing_information"
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/billing#/activePlan?ai_v2=${token}`}
                      className="text_13_400_576F7C"
                    >
                      <span className="icon_svg">
                        <BillingIcon />
                      </span>
                      <Text type="secondary">Billing information</Text>
                    </Link>
                  </li>
                  {!role_user_id && (
                    <>
                      {/* <li className={`${role && role === 'review' || role === 'all' ? 'permission-granted' : ''}`}>
                                    <Link data-amp-event-name="top_menu_user_two_step_authentication" href={''} onClick={showTwoStepAuthModal} className="text_13_400_576F7C"><span className="icon_svg"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><defs><clipPath id="h"><rect width="18" height="18" transform="translate(11187 15547)" fill="#fff" stroke="#707070" strokeWidth="1" opacity="0.5"></rect></clipPath></defs><g transform="translate(-11187 -15547)" clipPath="url(#h)"><path d="M5.006,16A5,5,0,0,1,3.649,6.189a4.912,4.912,0,0,1,2.587-.032L11.508.886A3,3,0,0,1,13.646,0h0A2.359,2.359,0,0,1,16,2.357,3.005,3.005,0,0,1,15.118,4.5l-.448.448a1.343,1.343,0,0,1-.943.39H12.67V6a1.333,1.333,0,0,1-1.333,1.333H10.67V8.391a1.324,1.324,0,0,1-.391.943l-.433.433a4.889,4.889,0,0,1-.031,2.587,5.019,5.019,0,0,1-4.285,3.619A5.1,5.1,0,0,1,5.006,16Zm0-8.667a3.667,3.667,0,1,0,3.526,4.66,3.6,3.6,0,0,0-.067-2.2.667.667,0,0,1,.159-.69l.712-.713V7.333A1.333,1.333,0,0,1,10.67,6h.667V5.333A1.333,1.333,0,0,1,12.67,4h1.057l.448-.448a1.679,1.679,0,0,0,.495-1.195,1.025,1.025,0,0,0-1.023-1.024,1.68,1.68,0,0,0-1.2.5L6.9,7.382a.667.667,0,0,1-.691.158A3.641,3.641,0,0,0,5,7.333ZM3.336,12A.667.667,0,1,0,4,11.333.667.667,0,0,0,3.336,12Z" transform="translate(11187.991 15548)" fill="#B8C2CA"></path></g></svg></span>
                                    <Text type="secondary">Two-step authentication</Text>
                                    </Link>
                                </li> */}
                      {/* <TwoStepAuthenticationModal showTwoStepAuthModal={showTwoStepAuthModal} twostepauth={twostepauth} setTwostepauth={setTwostepauth} hideTwoStepAuthModal={hideTwoStepAuthModal}/> */}
                    </>
                  )}
                  {shop_id > 1 && shop_type === 'magento' && (
                    <li>
                      <Link
                        data-amp-event-name="top_menu_user_connector_api_key"
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/manage/apikey?ai_v2=${token}`}
                        className="text_13_400_576F7C"
                      >
                        <span className="icon_svg">
                          <ApiKeyIcon />
                        </span>
                        <Text type="secondary">Connector API key</Text>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      data-amp-event-name="top_menu_aiTrillion_integrations"
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/index/aitrillionintegration?ai_v2=${token}`}
                      className="text_13_400_576F7C"
                    >
                      <span className="icon_svg">
                        <AitIntegrationIcon />
                      </span>
                      <Text type="secondary">AiTrillion integrations</Text>
                    </Link>
                  </li>
                  <li ai-user-feature="rest_api">
                    {is_allow_rest_api !== '' ? (
                      <Link
                        data-amp-event-name="top_menu_user_api_success_freeplan"
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/manage/apiaccess?ai_v2=${token}`}
                        className="text_13_400_576F7C"
                      >
                        <span className="icon_svg">
                          <ApiAccessIcon />
                        </span>{' '}
                        <Text type="secondary">API access</Text>
                      </Link>
                    ) : (
                      <>
                        {/* <Link data-amp-event-name="top_menu_user_api_success" onClick={showApiAccessModal} className="text_13_400_576F7C"><span className="icon_svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none"><path d="M17.4587 1.24C17.1387 0.92 16.6587 0.92 16.3387 1.24L14.8187 2.76C12.9787 1.56 10.7387 2.44 9.93873 3.24L8.73873 4.44C8.41873 4.76 8.41873 5.24 8.73873 5.56L13.1387 9.96C13.2987 10.12 13.5387 10.2 13.6987 10.2C13.8587 10.2 14.0987 10.12 14.2587 9.96L15.4587 8.76C16.2587 7.96 17.1387 5.72 15.9387 3.88L17.4587 2.36C17.7787 2.04 17.7787 1.56 17.4587 1.24ZM14.3387 7.64L13.6987 8.28L10.4187 5L11.0587 4.36C11.3787 4.04 13.1387 3.16 14.3387 4.36C15.5387 5.56 14.6587 7.32 14.3387 7.64ZM10.3387 10.04L9.29873 11.08L7.61873 9.4L8.65873 8.36C8.97873 8.04 8.97873 7.56 8.65873 7.24C8.33873 6.92 7.85873 6.92 7.53873 7.24L6.49873 8.28L6.25873 8.04C5.93873 7.72 5.45873 7.72 5.13873 8.04L3.93873 9.24C3.13873 10.04 2.25873 12.28 3.45873 14.12L1.93873 15.64C1.61873 15.96 1.61873 16.44 1.93873 16.76C2.09873 16.92 2.25873 17 2.49873 17C2.73873 17 2.89873 16.92 3.05873 16.76L4.57873 15.24C5.21873 15.64 5.93873 15.8 6.57873 15.8C7.77873 15.8 8.89873 15.24 9.45873 14.68L10.6587 13.48C10.9787 13.16 10.9787 12.68 10.6587 12.36L10.4187 12.2L11.4587 11.16C11.7787 10.84 11.7787 10.36 11.4587 10.04C11.1387 9.72 10.6587 9.72 10.3387 10.04ZM8.33873 13.64C8.01873 13.96 6.25873 14.84 5.05873 13.64C3.85873 12.44 4.73873 10.68 5.05873 10.36L5.69873 9.72L8.97873 13L8.33873 13.64Z" fill="#B8C2CA"/></svg>
                                </span>API access 
                                </Link> */}
                        {/* <ApiAccessModal showApiAccessModal={showApiAccessModal} setApiaccess={setApiaccess} apiaccess={apiaccess} hideApiAccessModal={hideApiAccessModal}/> */}
                      </>
                    )}
                  </li>
                  <li ai-user-feature="billing">
                    <Link
                      data-amp-event-name="top_menu_user_billing_information"
                      href={`/webhooks`}
                      className="text_13_400_576F7C"
                    >
                      <span className="icon_svg">
                        <WebhooksIcon />
                      </span>
                      <Text type="secondary">Webhooks</Text>
                    </Link>
                  </li>
                </ul>
                <Divider size="large" />
                <ul className="p-0 icon_ul">
                  <li>
                    <Link
                      data-amp-event-name="top_menu_user_write_to_us"
                      href={'mailto:support@aitrillion.com'}
                    >
                      <span className="icon_svg">
                        <PencilIcon />
                      </span>
                      <Text type="secondary">Write to us</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-amp-event-name="top_menu_user_resources"
                      href={'https://www.aitrillion.com/knowledgebase'}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="icon_svg">
                        <ResourceIcon />
                      </span>
                      <Text type="secondary">Resources</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      data-amp-event-name="top_menu_user_resources"
                      href={
                        'https://www.aitrillion.com/whats-new-on-aitrillion'
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="icon_svg">
                        <WnatsnewIcon />
                      </span>
                      <Text type="secondary">What's new</Text>
                    </Link>
                  </li>
                </ul>
              </StyleProfileMenu>

              <StyleEarnBonus
                data-amp-event-name="top_menu_user_earn_bonus"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/index/askreview?ai_v2=${token}`}
              >
                <Row align="middle">
                  <span className="icon_dollar">
                    <DollarIcon />
                  </span>
                  <StyleEarnBonusText type="primary">
                    Earn bonus
                  </StyleEarnBonusText>
                  <span className="arrow-icon">
                    <RightOutlined
                      style={{ fontSize: '11px', color: '#AFBFCD' }}
                    />
                  </span>
                </Row>
              </StyleEarnBonus>
            </>
          )}
        </StyleProfileBotSec>
      </StyleProfileWrapper>
    </AitDrawer>
  );
};

export default ProfileDrawer;
