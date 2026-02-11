import {
  getEmailDashboardStatsApi,
  getEmailDashboardCampaignListApi,
  copyWelcomeWorkflowApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  getDashboardStatsApiState: '',
  getDashboardStatsLoading: false,
  getDashboardStatsApiError: null,
  getDashboardStats: {},

  getDashboardCampainListApiState: '',
  getDashboardCampainListLoading: false,
  getDashboardCampainListApiError: null,
  getDashboardCampainList: {},

  copyWelcomeWorkflowState: '',
  copyWelcomeWorkflowLoading: false,
  copyWelcomeWorkflowError: null,
  copyWelcomeWorkflow: {},
};

const emailMarketingDashboardSlice = createSlice({
  name: 'emailMarketingDashboard',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getEmailDashboardStatsApi.pending, (state) => {
        state.getDashboardStatsApiState = 'pending';
        state.getDashboardStatsLoading = true;
        state.getDashboardStatsApiError = null;
      })
      .addCase(getEmailDashboardStatsApi.fulfilled, (state, action) => {
        state.getDashboardStatsApiState = 'fulfilled';
        state.getDashboardStatsLoading = false;
        if (action.payload) {
          state.getDashboardStats = action.payload;
        } else {
          state.getDashboardStats = {};
        }
      })
      .addCase(getEmailDashboardStatsApi.rejected, (state, action) => {
        state.getDashboardStatsApiState = 'rejected';
        state.getDashboardStatsLoading = false;
        state.getDashboardStatsApiError =
          action.payload?.message || 'Failed to fetch campaign list';
      })
      // campaign list
      .addCase(getEmailDashboardCampaignListApi.pending, (state) => {
        state.getDashboardCampainListApiState = 'pending';
        state.getDashboardCampainListLoading = true;
        state.getDashboardCampainListApiError = null;
      })
      .addCase(getEmailDashboardCampaignListApi.fulfilled, (state, action) => {
        state.getDashboardCampainListApiState = 'fulfilled';
        state.getDashboardCampainListLoading = false;
        if (action.payload) {
          state.getDashboardCampainList = action.payload;
        } else {
          state.getDashboardCampainList = {};
        }
      })
      .addCase(getEmailDashboardCampaignListApi.rejected, (state, action) => {
        state.getDashboardCampainListApiState = 'rejected';
        state.getDashboardCampainListLoading = false;
        state.getDashboardCampainListApiError =
          action.payload?.message || 'Failed to fetch campaign list';
      })
      // copy workflow
      .addCase(copyWelcomeWorkflowApi.pending, (state) => {
        state.copyWelcomeWorkflowState = 'pending';
        state.copyWelcomeWorkflowLoading = true;
        state.copyWelcomeWorkflowError = null;
      })
      .addCase(copyWelcomeWorkflowApi.fulfilled, (state, action) => {
        state.copyWelcomeWorkflowState = 'fulfilled';
        state.copyWelcomeWorkflowLoading = false;
        if (action.payload) {
          state.copyWelcomeWorkflow = action.payload;
        } else {
          state.copyWelcomeWorkflow = {};
        }
      })
      .addCase(copyWelcomeWorkflowApi.rejected, (state, action) => {
        state.copyWelcomeWorkflowState = 'rejected';
        state.copyWelcomeWorkflowLoading = false;
        state.copyWelcomeWorkflowError =
          action.payload?.message || 'Failed to copy workflow';
      });
  },
});

// export const {
//   clearEmailMarketingTemplate,
//   setFilters,
//   setCopyTemplateFilters,
//   clearCopyTemplateFilter,
// } = emailMarketingDashboardSlice.actions;

export default emailMarketingDashboardSlice.reducer;
