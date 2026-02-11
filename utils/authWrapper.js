import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { getToken, removeJWTToken, setUserLogin } from '@/utils/authHelpers';
import { getJWTtokenApi } from '@/redux/apis/logged-in-user-apis/getJWTtokenApi';
import { Spin } from 'antd';

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const didRun = useRef(false); // ✅ Prevent duplicate execution
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (didRun.current) return;
      didRun.current = true;

      if (typeof window === 'undefined') return; //  SSR guard

      const url = new URL(window.location.href);
      const authTokenFromUrl = url.searchParams.get('ai_v1');
      const existingToken = getToken();

      if (authTokenFromUrl) {
        console.log('🟢 Found ai_v1 token — setting new auth token');

        // Mark we're fetching JWT
        window.__AITRILLION_FETCHING_JWT__ = true;

        removeJWTToken(); // Clear existing JWT if any

        // ✅ Step 1: store token first
        setUserLogin(authTokenFromUrl);

        // Fetch JWT
        try {
          await dispatch(getJWTtokenApi());
          console.log('✅ JWT token fetched successfully');
        } catch (err) {
          console.error('❌ Failed to fetch JWT token:', err);
        }

        window.__AITRILLION_FETCHING_JWT__ = false;

        // ✅ Step 3: Clean the URL (remove ai_v1 only)
        const params = new URLSearchParams(window.location.search);
        params.delete('ai_v1');
        const cleanUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : '');
        console.log('cleanUrl', cleanUrl);

        window.history.replaceState({}, '', cleanUrl);

        // // ✅ Step 4: Fetch JWT token from backend
        // try {
        //   await dispatch(getJWTtokenApi());
        //   console.log('✅ JWT token fetched successfully');
        // } catch (err) {
        //   console.error('❌ Failed to fetch JWT token:', err);
        // }

        setCheckingAuth(false);
        return;
      }

      if (existingToken) {
        window.__AITRILLION_FETCHING_JWT__ = true;
        try {
          await dispatch(getJWTtokenApi());
        } catch (err) {
          console.error('❌ JWT refresh failed', err);
        }
        window.__AITRILLION_FETCHING_JWT__ = false;
        setCheckingAuth(false);
        return;
      }
      window.__AITRILLION_FETCHING_JWT__ = false;
      // ✅ No token — redirect to login
      setCheckingAuth(false);
      console.log('NEXT_PUBLIC_APP_URL', `${process.env.NEXT_PUBLIC_APP_URL}`);
      router.replace(`${process.env.NEXT_PUBLIC_APP_URL}`);
    };

    initAuth();
  }, [dispatch, router]);

  useEffect(() => {
    if (!checkingAuth) {
      const existingToken = getToken();
      if (!existingToken) {
        router.replace(`${process.env.NEXT_PUBLIC_APP_URL}`);
      }
    }
  }, [checkingAuth, router]);

  // While checking initial auth (incl. parsing URL), show nothing
  if (checkingAuth) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Spin size="large" tip="Checking authentication..." />
      </div>
    );
  }

  // After checked, if no token, we already alerted / redirected
  if (!getToken()) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Spin size="large" tip="Redirecting you to login..." />
        <p style={{ marginTop: 20, color: '#555', fontSize: 16 }}>
          Please hold on while we take you to the login page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
