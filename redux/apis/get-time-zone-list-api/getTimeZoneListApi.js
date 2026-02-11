import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getTimeZoneListApi = createAsyncThunk(
  'getTimeZoneListApi',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    try {
      const res = await api.get(`/index?act=get_time_zone_list`, {
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
