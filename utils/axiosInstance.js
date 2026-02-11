// utils/axiosInstance.js
import axios from 'axios';
import router from 'next/router';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      router.push('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
