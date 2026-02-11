import { createSlice } from '@reduxjs/toolkit';
import { getTimeZoneListApi } from '../apis/get-time-zone-list-api/getTimeZoneListApi';

// Initial State
const initialState = {
  timeZoneList: [],
  timeZoneListApiState: '',
  loading: false,
  error: null,
};

// Slice
const getTimeZoneListSlice = createSlice({
  name: 'getTimeZoneListSlice',
  initialState,
  reducers: {
    setDecodedUser: (state, action) => {
      state.login_auth = action.payload;
    },
    jwtResetState: (state) => {
      state.timeZoneListApiState = state.timeZoneListApiState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimeZoneListApi.pending, (state) => {
        state.timeZoneListApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(getTimeZoneListApi.fulfilled, (state, action) => {
        state.timeZoneListApiState = 'success';
        state.loading = false;
        state.timeZoneList = action?.payload?.data || [];
      })
      .addCase(getTimeZoneListApi.rejected, (state, action) => {
        state.timeZoneListApiState = 'error';
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setDecodedUser, jwtResetState } = getTimeZoneListSlice.actions;

export default getTimeZoneListSlice.reducer;
