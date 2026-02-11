import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPlanInfoApi = createAsyncThunk(
  'auth/getPlanInfo',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/auth?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          ...(token && { Authorization: token }),
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
