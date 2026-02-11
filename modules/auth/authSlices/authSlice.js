import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginApi from '../api/login-api';
import saveTokenApi from '../api/saveTokenApi';
import { getPlanInfoApi } from '../api/getPlanInfoApi';
import { logoutApi } from '../api/logoutApi';

const initialState = {
  apiState: '',
  message: '',
  data: {},
  saveTokenData: {},
  loginPayload: {},
  loading: false,
  error: null,
  saveTokenState: '', // for tracking token save
  tokenSaveMessage: '',
  getPlanInfoApiState: '',
  planInfo: [],
  logOutApiState: '',
  logoutMessage: '',
  logoutLoading: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      if (response.error) {
        return rejectWithValue(response.message || 'Login failed');
      }
      return { ...response, loginPayload: payload };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.msg || 'Login failed');
    }
  }
);

export const saveToken = createAsyncThunk(
  'auth/saveToken',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await saveTokenApi(formData);

      // const data = await res.json();
      if (res.error) {
        return rejectWithValue(res?.message || 'Failed to save token');
      }

      return res;
    } catch (err) {
      return rejectWithValue(err?.message || 'Token save failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutReset: (state) => {
      state.logOutApiState = '';
      state.logoutMessage = '';
      state.logoutLoading = false;
    },
    loginReset: (state) => {
      state.apiState = '';
      state.message = '';
      state.data = {};
      state.loginPayload = {};
      state.saveTokenState = '';
      state.tokenSaveMessage = '';
    },
    setPlanInfo(state, action) {
      state.planInfo = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.apiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.apiState = 'success';
        state.loading = false;
        state.data = action?.payload?.data;
        state.loginPayload = action?.payload?.loginPayload;
        state.message = action?.payload?.msg;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.message =
          action.payload || action.error.msg || 'Something went wrong';
        state.apiState = 'error';
        state.loading = false;
        state.error = action.payload;
        state.message = action?.payload?.msg;
      })
      .addCase(saveToken.pending, (state) => {
        state.saveTokenState = 'pending';
      })
      .addCase(saveToken.fulfilled, (state, action) => {
        state.saveTokenState = 'success';
        state.saveTokenData = action?.payload;
        state.tokenSaveMessage = 'Token saved successfully';
      })
      .addCase(saveToken.rejected, (state, action) => {
        state.saveTokenState = 'error';
        state.tokenSaveMessage = action.payload || 'Token save failed';
      })
      .addCase(getPlanInfoApi.pending, (state) => {
        state.getPlanInfoApiState = 'pending';
      })
      .addCase(getPlanInfoApi.fulfilled, (state, action) => {
        state.getPlanInfoApiState = action?.payload?.status;
        state.planInfo = action?.payload?.data;
      })
      .addCase(getPlanInfoApi.rejected, (state, action) => {
        state.getPlanInfoApiState = 'error';
        // state.tokenSaveMessage = action.payload || 'Token save failed';
      })
      .addCase(logoutApi.pending, (state) => {
        state.logOutApiState = 'pending';
      })
      .addCase(logoutApi.fulfilled, (state, action) => {
        state.logOutApiState = action?.payload?.status;
        state.logoutMessage = action.payload.msg;
      })
      .addCase(logoutApi.rejected, (state, action) => {
        state.logOutApiState = 'error';
        state.logoutMessage = action.payload.msg;
      });
  },
});

export const { loginReset, logoutReset, setPlanInfo } = authSlice.actions;
export default authSlice.reducer;
