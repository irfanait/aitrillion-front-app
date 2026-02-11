import { createSlice } from '@reduxjs/toolkit';
import { getWorkflowDashboardStatsApi, getRecentWorkflowsApi } from '@/redux/apis/workflow-automation-apis/workflowAutomationApis';

// initial stats shape (safe defaults so UI never crashes)
const initialStats = {
  activeWorkflows: 0,
  totalEmailSent: 0,
  totalSmsSent: 0,
  totalWhatsappSent: 0,
  totalPushSent: 0,
  totalOrders: 0,
  totalRevenue: '$0',
  totalCashback: '$0',
};

const initialState = {
  stats: initialStats,
  workflows: [],        // new
  loading: false,
  workflowsLoading: false, // separate loading for workflows
  error: null,
  workflowsError: null,
};

const dashboardSlice = createSlice({
  name: 'workflowAutomation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Stats API
    builder
      .addCase(getWorkflowDashboardStatsApi.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getWorkflowDashboardStatsApi.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload || {};
        state.stats = {
          activeWorkflows: data.active_campaigns ?? 0,
          totalEmailSent: data.total_email_sent ?? 0,
          totalSmsSent: data.total_sms_sent ?? 0,
          totalWhatsappSent: data.total_whatsapp_sent ?? 0,
          totalPushSent: data.total_push_sent ?? 0,
          totalOrders: data.total_orders_count ?? 0,
          totalRevenue: data.total_revenue ?? '$0',
          totalCashback: data.total_cashback ?? '$0',
        };
      })
      .addCase(getWorkflowDashboardStatsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to load stats';
      });

    // Workflows API
    builder
      .addCase(getRecentWorkflowsApi.pending, (state) => { state.workflowsLoading = true; state.workflowsError = null; })
      .addCase(getRecentWorkflowsApi.fulfilled, (state, action) => {
        state.workflowsLoading = false;
        state.workflows = action.payload || [];
      })
      .addCase(getRecentWorkflowsApi.rejected, (state, action) => {
        state.workflowsLoading = false;
        state.workflowsError = action.payload || action.error?.message || 'Failed to load workflows';
      });
  },
});

export default dashboardSlice.reducer;
