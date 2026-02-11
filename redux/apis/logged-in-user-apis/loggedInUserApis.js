import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';

// Fetch email marketing campaigns OR customer init data based on act
export const getLoggedInUserDetailsApi = createAsyncThunk(
  'loggedInUserDetails',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const res = await api.get(`/customers?act=${payload.act}`, {
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

export const getActiveModulesApi = createAsyncThunk(
  'activeModules',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const res = await api.get(
        `/startguide?act=${payload.act}&login_id=${payload.login_id}&shop_id=${payload.shop_id}`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getInterestedModulesApi = createAsyncThunk(
  'interestedModules',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const res = await api.post(`/startguide`, payload, {
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

export const saveInterestedModulesApi = createAsyncThunk(
  'saveInterestedModules',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const res = await api.post(`/startguide`, payload, {
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
