import { createSlice } from '@reduxjs/toolkit';
import {
  getActiveModulesApi,
  getInterestedModulesApi,
  getLoggedInUserDetailsApi,
  saveInterestedModulesApi,
} from '../apis/logged-in-user-apis/loggedInUserApis';

// Initial State
const initialState = {
  userDetails: {},
  apiState: '',
  loading: false,
  error: null,

  activeModules: [],
  activeModulesApiState: '',
  activeModulesLoading: false,
  activeModulesError: null,
  activeModulesSucess: null,

  interestedModules: [],
  interestedModulesApiState: '',
  interestedModulesLoading: false,
  interestedModulesError: null,
  interestedModulesSucess: null,

  saveInterestedModules: {},
  saveInterestedModulesApiState: '',
  saveInterestedModulesLoading: false,
  saveInterestedModulesError: null,
  saveInterestedModulesSucess: null,
};

// Slice
const loggedInUserSlice = createSlice({
  name: 'loggedInUserDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUserDetailsApi.pending, (state) => {
        state.apiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedInUserDetailsApi.fulfilled, (state, action) => {
        state.apiState = 'success';
        state.loading = false;
        state.userDetails = action?.payload?.data || {};
      })
      .addCase(getLoggedInUserDetailsApi.rejected, (state, action) => {
        state.apiState = 'error';
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //active modules
      .addCase(getActiveModulesApi.pending, (state) => {
        state.activeModulesApiState = 'pending';
        state.activeModulesLoading = true;
        state.activeModulesError = null;
      })
      .addCase(getActiveModulesApi.fulfilled, (state, action) => {
        state.activeModulesApiState = 'success';
        state.activeModulesLoading = false;
        if (action?.payload?.data && action.payload.data.length > 0) {
          // console.log('action?.payload.data', action?.payload?.data);
          let activeModuleIds = action?.payload?.data?.map(
            (item) => item.module_id
          );
          state.activeModules = activeModuleIds.map(String);
        } else {
          state.activeModules = [];
        }
      })
      .addCase(getActiveModulesApi.rejected, (state, action) => {
        state.activeModulesApiState = 'error';
        state.activeModulesLoading = false;
        state.activeModulesError = action.payload || action.error.message;
      })
      //get interested modules
      .addCase(getInterestedModulesApi.pending, (state) => {
        state.interestedModulesApiState = 'pending';
        state.interestedModulesLoading = true;
        state.interestedModulesError = null;
      })
      .addCase(getInterestedModulesApi.fulfilled, (state, action) => {
        state.interestedModulesApiState = 'success';
        state.interestedModulesLoading = false;
        // console.log(' action?.payload',  action?.payload);
        state.interestedModules = action?.payload?.interestedModules;
        //   state.interestedModules = interested_modules || [];
      })
      .addCase(getInterestedModulesApi.rejected, (state, action) => {
        state.interestedModulesApiState = 'error';
        state.interestedModulesLoading = false;
        state.interestedModulesError = action.payload || action.error.message;
      })
      //save interested modules
      .addCase(saveInterestedModulesApi.pending, (state) => {
        state.saveInterestedModulesApiState = 'pending';
        state.saveInterestedModulesLoading = true;
        state.saveInterestedModulesError = null;
      })
      .addCase(saveInterestedModulesApi.fulfilled, (state, action) => {
        state.saveInterestedModulesApiState = 'success';
        state.saveInterestedModulesLoading = false;
        state.saveInterestedModules = action?.payload?.data || {};
        // Update interestedModules with the saved values from the request payload
        if (action.meta?.arg?.intrested_module) {
          state.interestedModules = action.meta.arg.intrested_module;
          // console.log('✅ Updated interestedModules in Redux:', state.interestedModules);
        }
      })
      .addCase(saveInterestedModulesApi.rejected, (state, action) => {
        state.saveInterestedModulesApiState = 'error';
        state.saveInterestedModulesLoading = false;
        state.saveInterestedModulesError =
          action.payload || action.error.message;
      });
  },
});

export const {} = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;
