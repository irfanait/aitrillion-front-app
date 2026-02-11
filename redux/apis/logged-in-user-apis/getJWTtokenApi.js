import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getJWTtokenApi = createAsyncThunk(
  'getJWTtokenApi',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    try {
      const res = await api.get(`/index?act=jwt_auth_data`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
