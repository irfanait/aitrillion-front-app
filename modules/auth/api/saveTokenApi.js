// src/api/login-api.js
import api from '@/utils/apiAxios';

export default async function saveTokenApi(payload) {
  try {
    const urlEncodedPayload = new URLSearchParams(payload).toString();
    const response = await api.post('/auth', urlEncodedPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

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
