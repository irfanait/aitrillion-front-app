import React, { useEffect, useState } from 'react';
import { Drawer, Grid, Layout } from 'antd';
import { useRouter } from 'next/router';
import AppHeader from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import {
  decodeJWTToken,
  getToken,
  handleLogout,
  removeJWTToken,
  setJWTToken,
} from '@/utils/authHelpers';
import { getMenuList } from '../menuItems';
import { useDispatch, useSelector } from 'react-redux';
import {
  getActiveModulesApi,
  getInterestedModulesApi,
  getLoggedInUserDetailsApi,
} from '@/redux/apis/logged-in-user-apis/loggedInUserApis';
import { getJWTtokenApi } from '@/redux/apis/logged-in-user-apis/getJWTtokenApi';
import {
  jwtResetState,
  setAccessModuleWithMappingState,
  setDecodedUser,
} from '@/redux/logged-in-user-details-slice/jwtSlice';
import { setCollapsed } from '@/redux/layout-slice/layoutSlice';
import { getPlanInfoApi } from '@/modules/auth/api/getPlanInfoApi';
import { setPlanInfo } from '@/modules/auth/authSlices/authSlice';
//import { login_auth } from '../utils/constants';
import { checkActiveModules } from '../helper';
import useGlobalAnalyticsTracker from '@/hooks/useGlobalAnalyticsTracker';
import { SidebarWrapper } from './style';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = ({ children, noPadding = false }) => {
  const isProd = process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production';

  const router = useRouter();
  useGlobalAnalyticsTracker(); // will only “do things” once SDKs are present

  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const loggeInUserState = useSelector((state) => state?.loggeInUserState);
  const jwtState = useSelector((state) => state?.jwtState);
  const collapsed = useSelector((state) => state?.layoutState?.collapsed);
  const login_auth = jwtState?.login_auth || {};
  const accessModuleWithMapping = login_auth?.accessModuleWithMapping || null;

  const encodedShopId = login_auth?.encoded_shop_id || '';
  const is_bkac = login_auth?.is_bkac ? 1 : 0;
  const token = getToken();
  const encodedPartnerLoginId = login_auth?.encoded_partner_login_id || '';
  const isEditorRoute = router?.asPath?.startsWith(
    '/email-marketing/templates/editorv2'
  );

  const {
    userDetails,
    activeModulesLoading,
    activeModules,
    interestedModules,
    saveInterestedModulesApiState,
  } = useSelector((state) => state.loggedInUserDetailsState);

  const menuTabHideV2 = '1';

  const selectedKeys = [
    'is_enable_email_marketing_v2',
    'is_enable_customer_segmentation_v2',
    'is_enable_loyalty_v2',
  ];

  const is_V1_V2_object = {};

  selectedKeys.forEach((key) => {
    if (key in userDetails) {
      const val = userDetails[key];

      is_V1_V2_object[key] = val === true || val === '1';
    }
  });

  const menuList = getMenuList(
    encodedShopId,
    is_bkac,
    token,
    encodedPartnerLoginId,
    // menuTabHideV2
    userDetails?.is_enable_email_marketing_v2,
    is_V1_V2_object,
    jwtState
  );

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [mounted, setMounted] = useState(false);

  // const [aiPlanACL, setAiPlanACL] = useState(null);

  // 👇 Routes that should not have margin/padding
  const noPaddingRegex = [
    /^\/email-marketing\/campaign\/create$/,
    /^\/email-marketing\/campaign\/[^/]+\/edit$/,
    /^\/email-marketing\/campaign\/[^/]+\/createAB$/,
  ];

  const shouldHavePadding = !noPaddingRegex.some((regex) =>
    regex.test(router.asPath)
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (login_auth?.login_id && login_auth?.shop_id) {
      dispatch(
        getActiveModulesApi({
          act: 'getactivemodulelist',
          login_id: login_auth?.login_id,
          shop_id: login_auth?.shop_id,
        })
      );
      dispatch(getInterestedModulesApi({ act: 'getQuickSettingData' }));
      dispatch(getLoggedInUserDetailsApi({ act: 'get_profile_picture' }));
    }
  }, [login_auth?.login_id, login_auth?.shop_id]);

  useEffect(() => {
    if (saveInterestedModulesApiState === 'success') {
      dispatch(
        getActiveModulesApi({
          act: 'getactivemodulelist',
          login_id: login_auth?.login_id,
          shop_id: login_auth?.shop_id,
        })
      );
      dispatch(getInterestedModulesApi({ act: 'getQuickSettingData' }));
    }
  }, [saveInterestedModulesApiState]);

  // ------------------------------------------------------------------
  // 1️⃣ Handle JWT API success or error
  useEffect(() => {
    if (jwtState?.jwtApiState === 'success') {
      const newJwt = jwtState?.jwtToken?.data;

      if (newJwt) {
        // ✅ Save to localStorage for next reload
        setJWTToken(newJwt);

        // ✅ Decode directly from the token, not from storage
        const decoded = decodeJWTToken(newJwt);

        if (decoded) {
          dispatch(setDecodedUser(decoded));

          const storedPlanId = localStorage.getItem('plan_id');
          const storedRoleUserId = localStorage.getItem('user_role_id');

          const newPlanId = decoded?.plan_id?.toString();
          const newRoleUserId = decoded?.role_user_id?.toString();

          if (
            !storedPlanId ||
            storedPlanId !== newPlanId ||
            storedRoleUserId !== newRoleUserId
          ) {
            localStorage.setItem('plan_id', newPlanId);
            localStorage.setItem('user_role_id', newRoleUserId);

            // ✅ Now pass fresh role_user_id to API
            dispatch(
              getPlanInfoApi({
                act: 'get_plan_info',
                role_user_id: newRoleUserId,
              })
            );
          } else {
            // console.log(`🟩 Plan ID unchanged (${newPlanId})`);
          }
        }
      }

      dispatch(jwtResetState());
    }

    if (jwtState?.jwtApiState === 'error') {
      handleLogout();
      removeJWTToken();
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}`);
      dispatch(jwtResetState());
    }
  }, [jwtState?.jwtApiState, dispatch, router]);

  // ------------------------------------------------------------------
  // 🆕 Usertour.js - Identify user after authentication
  useEffect(() => {
    if (typeof window !== 'undefined' && window.usertour && login_auth) {
      // Only identify if we have a logged-in user
      if (login_auth?.login_id) {
        try {
          // Format signup date to ISO 8601
          const utcSignUpDate = login_auth.signup_date || '';
          const iso8601 = utcSignUpDate
            ? utcSignUpDate.replace(' ', 'T') + 'Z'
            : '';

          // ✅ Wait for Usertour SDK to fully load before identifying
          window.usertour.load().then(() => {
            window.usertour.identify(login_auth.login_id, {
              name: `${login_auth.first_name || ''} ${login_auth.last_name || ''}`.trim(),
              email: login_auth.email || '',
              signed_up_at: iso8601,
              shop_id: login_auth.shop_id || '',
              plan_id: login_auth.plan_id || '',
            });
          });
        } catch (error) {
          console.error('❌ Usertour identification failed:', error);
        }
      }
    }
  }, [login_auth]);

  // ------------------------------------------------------------------
  // 4️⃣ Save plan info when fetched successfully
  useEffect(() => {
    if (
      loggeInUserState?.getPlanInfoApiState === 'success' &&
      loggeInUserState?.planInfo?.length
    ) {
      localStorage?.setItem(
        'plan_info',
        JSON.stringify(loggeInUserState?.planInfo)
      );
      dispatch(setPlanInfo(loggeInUserState?.planInfo));
    }
  }, [loggeInUserState?.getPlanInfoApiState]);

  // ------------------------------------------------------------------
  // 3️⃣ Load saved plan info to redux
  useEffect(() => {
    const savedPlanInfo = localStorage.getItem('plan_info');
    if (savedPlanInfo) {
      dispatch(setPlanInfo(JSON.parse(savedPlanInfo)));
    }
  }, []);

  // 4️⃣ get profile pic
  useEffect(() => {
    if (token) {
      dispatch(getLoggedInUserDetailsApi({ act: 'get_profile_picture' }));
    }
  }, [token]);

  // ------------------------------------------------------------------
  // 6️⃣ Authentication guard
  useEffect(() => {
    if (!mounted) return;
    // const publicRoutes = ['/auth/login', '/auth/signup'];
    // if (publicRoutes.includes(router.pathname)) return;

    const authToken = getToken();
    // if (!authToken) {
    //   router.replace(`${process.env.NEXT_PUBLIC_APP_URL}`);
    // } else {
    setIsAuthenticated(!!authToken);
    // }
  }, [mounted]);

  // ------------------------------------------------------------------
  // 7️⃣ Responsive sidebar
  useEffect(() => {
    // Force collapse on editor

    if (isEditorRoute) {
      dispatch(setCollapsed(true));
      return;
    }

    // // Otherwise follow screen size
    if (!screens.xl) {
      dispatch(setCollapsed(true));
    } else {
      dispatch(setCollapsed(false));
    }
  }, [screens.xl, isEditorRoute]);

  if (isAuthenticated === null) return null;

  const isMobile = !screens.xl;

  return (
    <>
      <Layout>
        <div className="demo-logo-vertical" />
        {!isMobile && (
          <Sidebar
            trigger={null}
            collapsible
            toggleSidebar={() => {
              if (isMobile) {
                setDrawerVisible(!drawerVisible); // toggle drawer
              } else {
                dispatch(setCollapsed(!collapsed));
              }
            }}
            collapsed={collapsed}
            isDrawerOpen={drawerVisible}
            menuList={menuList || []}
            onMenuItemClick={() => setDrawerVisible(false)} // close drawer on selection
            is_V1_V2_object={is_V1_V2_object}
          />
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            closable={false}
            width={280}
            zIndex={999}
            style={{ top: 0 }}
            bodyStyle={{
              padding: 0,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <SidebarWrapper>
              <Sidebar
                isDrawerOpen={drawerVisible}
                collapsed={false}
                menuList={menuList || []}
                onMenuItemClick={() => setDrawerVisible(false)}
                onCloseDrawer={() => setDrawerVisible(false)}
                is_V1_V2_object={is_V1_V2_object}
              />
            </SidebarWrapper>
          </Drawer>
        )}
        <Layout style={{ display: 'flex', height: '100vh' }}>
          <AppHeader
            toggleSidebar={() => {
              if (isMobile) {
                setDrawerVisible(!drawerVisible); // toggle drawer
              } else {
                dispatch(setCollapsed(!collapsed));
              }
            }}
            collapsed={collapsed}
            isDrawerOpen={drawerVisible}
            onCloseDrawer={() => setDrawerVisible(false)}
            is_V1_V2_object={is_V1_V2_object}
          />

          <Content
            style={{
              padding: shouldHavePadding ? '0px' : 0,
              margin: shouldHavePadding ? '0px' : 0,
              //background: '#f6f6f6',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {children}
            <div
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
              }}
              id="zoho-chat-anchor"
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
