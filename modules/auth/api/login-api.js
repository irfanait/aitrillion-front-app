// src/api/login-api.js
import authAxios from '@/utils/authAxios';

export default async function loginApi(payload) {
  try {
    const response = await authAxios.post('/login', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        message: error.response.data || 'Login failed',
      };
    } else {
      return {
        error: true,
        message: 'Network error',
      };
    }
  }
}
