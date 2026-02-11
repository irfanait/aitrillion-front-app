import axios from 'axios';
import { getJWTToken, getToken, handleLogout } from './authHelpers';
import { jwtDecode } from 'jwt-decode';
import { notification } from 'antd';

// ✅ initialize flag if it doesn't exist
if (
  typeof window !== 'undefined' &&
  window.__AITRILLION_FETCHING_JWT__ === undefined
) {
  window.__AITRILLION_FETCHING_JWT__ = false;
}

const awsListApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LIST_SERVICE_AWS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🧠 Helper — detect expired messages (for PHP APIs returning 200)
const isTokenExpiredResponse = (data) => {
  if (!data) return false;
  const text = JSON.stringify(data).toLowerCase();
  return (
    text.includes('expired') ||
    text.includes('invalid auth') ||
    text.includes('authorization failed') ||
    text.includes('session timeout') ||
    text.includes('unauthorized') ||
    text.includes('not authorized') ||
    text.includes('token invalid') ||
    text.includes('please login')
  );
};

// 🔐 Request interceptor
awsListApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authToken = getToken(); // auth token token
    const jwt = getJWTToken(); // contains exp

    // 🚧 Skip JWT check if we’re fetching a new one right now
    if (window.__AITRILLION_FETCHING_JWT__) {
      if (authToken) config.headers.Authorization = authToken;
      return config;
    }

    if (jwt) {
      try {
        const decoded = jwtDecode(jwt);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          notification.error({ message: 'Session expired', placement: 'top' });
          handleLogout();
          return Promise.reject('JWT expired');
        }
      } catch (err) {
        handleLogout();
        notification.error({
          message: 'Invalid session token',
          placement: 'top',
        });
        return Promise.reject('Invalid JWT');
      }
    }

    // Attach the auth token (used by backend)
    if (authToken) {
      config.headers.Authorization = authToken;
    }
  }
  return config;
});

// 🛑 Response interceptorawsListApi.interceptors.response.use(
awsListApi.interceptors.response.use(
  (response) => {
    if (
      isTokenExpiredResponse(response.data) &&
      response.data.status !== 'success'
    ) {
      console.warn(
        '⚠️ Backend response indicates expired session',
        response.data
      );
      notification.warning({
        message: 'Your session has expired',
        description: 'Please log in again to continue.',
        placement: 'top',
      });
      handleLogout();
      return Promise.reject('Session expired');
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🚫 Unauthorized — forcing logout');
      notification.error({
        message: 'Unauthorized — please login again',
        placement: 'top',
      });
      handleLogout();
      window.location.replace(process.env.NEXT_PUBLIC_APP_URL);
    }
    return Promise.reject(error);
  }
);

export default awsListApi;
