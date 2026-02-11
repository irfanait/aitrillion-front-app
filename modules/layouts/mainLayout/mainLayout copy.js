import React, { useEffect, useState } from 'react';
import { Drawer, Grid, Layout } from 'antd';
import { useRouter } from 'next/router';
import AppHeader from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import {
  decodeJWTToken,
  getJWTToken,
  getToken,
  setJWTToken,
  setUserLogin,
} from '@/utils/authHelpers';
import { menuList } from '../menuItems';
import { useDispatch, useSelector } from 'react-redux';
import {
  getActiveModulesApi,
  getLoggedInUserDetailsApi,
} from '@/redux/apis/logged-in-user-apis/loggedInUserApis';
import { getJWTtokenApi } from '@/redux/apis/logged-in-user-apis/getJWTtokenApi';
import {
  jwtResetState,
  setDecodedUser,
} from '@/redux/logged-in-user-details-slice/jwtSlice';
import { getPlanInfoApi } from '@/modules/auth/api/getPlanInfoApi';
import { setPlanInfo } from '@/modules/auth/authSlices/authSlice';
const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = ({ children, noPadding = false }) => {
  const router = useRouter();
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const jwtState = useSelector((state) => state?.jwtState);
  const loggeInUserState = useSelector((state) => state?.loggeInUserState);
  const { activeModulesLoading, activeModules } = useSelector(
    (state) => state?.loggedInUserDetailsState
  );

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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

  // Initial Load: Fetch user profile & init campaign list
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    dispatch(getLoggedInUserDetailsApi({ act: 'get_profile_picture' }));
    dispatch(getActiveModulesApi({ act: 'getactivemodulelist' }));
  }, []);

  // useEffect(() => {
  //   const url = new URL(window?.location?.href);
  //   const authTokenFromUrl = url?.searchParams.get('ai_v1');

  //   if (!authTokenFromUrl) return; // only do this if ai_v1 is present

  //   setUserLogin(authTokenFromUrl);
  //   window.history.replaceState({}, '', window.location.pathname);

  //   dispatch(getJWTtokenApi());
  // }, []);

  // 🔹 Decode JWT from local storage & get plan info
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const jwtToken = getJWTToken();
    if (jwtToken) {
      const decoded = decodeJWTToken();
      if (decoded) {
        dispatch(setDecodedUser(decoded));

        // ✅ Save plan_id in localStorage for instant feature access
        if (decoded.plan_id) {
          const localPlanId = localStorage.getItem('plan_id');
          if (!localPlanId || localPlanId !== decoded.plan_id.toString()) {
            localStorage.setItem('plan_id', decoded.plan_id);
            // 👇 Optionally call getPlanInfoApi if you want full feature ACL data
            dispatch(getPlanInfoApi({ act: 'get_plan_info' }));
          }
        }
      }
    } else {
      dispatch(getJWTtokenApi());
    }
  }, []);

  // 🔹 If JWT API fetch succeeded
  useEffect(() => {
    if (jwtState?.jwtApiState === 'success') {
      const jwt = jwtState?.jwtToken?.data;
      if (jwt) {
        setJWTToken(jwt);
        const decoded = decodeJWTToken();
        dispatch(setDecodedUser(decoded));

        // ✅ Handle plan_id update from fresh JWT
        if (decoded?.plan_id) {
          const currentPlan = localStorage.getItem('plan_id');
          if (!currentPlan || currentPlan !== decoded.plan_id.toString()) {
            localStorage.setItem('plan_id', decoded.plan_id);
            dispatch(getPlanInfoApi({ act: 'get_plan_info' }));
          }
        }
      }
      dispatch(jwtResetState());
    }
  }, [jwtState?.jwtApiState]);

  useEffect(() => {
    if (
      loggeInUserState?.getPlanInfoApiState === 'success' &&
      loggeInUserState?.planInfo?.length
    ) {
      localStorage.setItem(
        'plan_info',
        JSON.stringify(loggeInUserState?.planInfo)
      );
      dispatch(setPlanInfo(loggeInUserState?.planInfo));
    }
  }, [loggeInUserState?.getPlanInfoApiState]);

  useEffect(() => {
    const savedPlanInfo = localStorage.getItem('plan_info');
    if (savedPlanInfo) {
      dispatch(setPlanInfo(JSON.parse(savedPlanInfo)));
    } else {
      // dispatch(getPlanInfoApi({ act: 'get_plan_info' }));
    }
  }, []);

  useEffect(() => {
    if (!screens.xl) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screens.xl]);

  // 🔹 Check authentication before rendering
  useEffect(() => {
    const publicRoutes = ['/auth/login', '/auth/signup'];
    if (publicRoutes.includes(router.pathname)) return; // Do nothing on public routes
    const token = getToken();
    if (!token) {
      router.replace(`${process.env.NEXT_PUBLIC_APP_URL}`);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, router.pathname]);

  if (isAuthenticated === null) return null; // Prevents rendering until authentication is checked

  const isMobile = !screens.xl;

  return (
    <Layout style={{ paddingTop: 60 }}>
      <AppHeader
        toggleSidebar={() => {
          if (isMobile) {
            setDrawerVisible(!drawerVisible); // toggle drawer
          } else {
            setCollapsed(!collapsed);
          }
        }}
        collapsed={collapsed}
        isDrawerOpen={drawerVisible}
        onCloseDrawer={() => setDrawerVisible(false)}
      />
      <Layout style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {!isMobile && (
          <Sidebar
            toggleSidebar={() => {
              if (isMobile) {
                setDrawerVisible(!drawerVisible); // toggle drawer
              } else {
                setCollapsed(!collapsed);
              }
            }}
            collapsed={collapsed}
            isDrawerOpen={drawerVisible}
            menuList={menuList || []}
            onMenuItemClick={() => setDrawerVisible(false)} // close drawer on selection
          />
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            closable={false}
            width={250}
            zIndex={999}
            style={{ top: 0 }}
            bodyStyle={{
              padding: 0,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                paddingTop: 60,
                overflow: 'auto',
                height: '100vh',
                scrollbarWidth: 'none',
              }}
            >
              <Sidebar
                collapsed={false}
                menuList={menuList || []}
                onMenuItemClick={() => setDrawerVisible(false)}
              />
            </div>
          </Drawer>
        )}

        <Layout style={{ flex: 1, overflow: 'hidden' }}>
          <Content
            style={{
              padding: shouldHavePadding ? '0px' : 0,
              margin: shouldHavePadding ? '0px' : 0,
              background: '#f6f6f6',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
