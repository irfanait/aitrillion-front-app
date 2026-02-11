import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

// 🔹 2. Get Merge Tags
export const getMergeTagsApi = createAsyncThunk(
  'stripo/getMergeTags',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(
        `/template?act=get_short_code_data&page=load_template_data&${queryParams}`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDecodedUrlApi = createAsyncThunk(
  'campaign/getDecodedUrlApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/email?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 3. Get Template by ID
export const getTemplateByIdApi = createAsyncThunk(
  'stripo/getTemplateById',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(
        `/template?act=gettemplatedata&${queryParams}`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 4. Get Message by ID
export const getMessageByIdApi = createAsyncThunk(
  'stripo/getMessageById',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(
        `/etemplate?act=get_message_detail&${queryParams}`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 5. Get Campaign by ID
export const getTemplateDataByCampaignIdApi = createAsyncThunk(
  'stripo/getCampaignById',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(
        `/message?act=decode_url_data&page=load_template_data&${queryParams}`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// save new templateData

export const saveNewTemplateDataApi = createAsyncThunk(
  'campaign/saveNewTemplateDataApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(
        `/etemplate?act=save_new_template_data`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
