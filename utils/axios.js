import axios from 'axios';
import { getJWTToken, getToken, handleLogout } from './authHelpers';
import { jwtDecode } from 'jwt-decode';
import { notification } from 'antd';

const client = axios.create({});

// const BASEURL = 'https://ai-dev-nitin.aitrillion.com';
// const BASEURL = 'https://ai-dev-naresh.aitrillion.com';
// const BASEURL = 'https://ai-dev-jaydeep.aitrillion.com';

const BASEURL = process.env.NEXT_PUBLIC_APP_URL;

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

// 🔐 Request interceptor for handling JWT expiration
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authToken = getToken(); // PHP-side API token
    const jwt = getJWTToken(); // contains exp

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

// 🛑 Response interceptor for handling expired session messages
client.interceptors.response.use(
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
    }
    return Promise.reject(error);
  }
);

// Axios client function for making API requests
const axiosClient = (
  endpoint,
  payload = {},
  method = 'get',
  header,
  otherBaseUrl = false
) => {
  const token = getToken();
  let axiosConfig = {
    method: method.toLowerCase(),
  };

  let headers = {
    ...header,
    Authorization: token,
  };

  if (method.toLowerCase() === 'get') {
    axiosConfig.params = {
      ...payload,
      is_api_request: 1,
    };
  } else {
    if (payload instanceof FormData) {
      payload.append('is_api_request', 1);
    } else {
      payload = { ...payload, is_api_request: 1 };
    }
    axiosConfig.data = payload;
  }

  axiosConfig.headers = headers;
  return client(`${otherBaseUrl || BASEURL}${endpoint}`, axiosConfig);
};

export default axiosClient;
