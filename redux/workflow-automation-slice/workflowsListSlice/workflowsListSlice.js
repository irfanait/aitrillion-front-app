import { createSlice } from "@reduxjs/toolkit";
import { getWorkflowsListApi, deleteWorkflowApi } from "@/redux/apis/workflow-automation-apis/workflowAutomationApis";

const initialState = {
  workflows: [],
  loading: false,
  error: null,
  filters: {
    currentPage: 1,
    limit: 10,
    status: "",
    trigger: "",
    keyword: "",
  },
  totalRecords: 0,
};

const workflowsListSlice = createSlice({
  name: "workflowsList",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkflowsListApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkflowsListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload?.data || [];
        state.totalRecords = action.payload?.totalrecord || 0;
      })
      .addCase(getWorkflowsListApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
       // Handling the deleteWorkflowApi action
      .addCase(deleteWorkflowApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkflowApi.fulfilled, (state, action) => {
        state.loading = false;
        // If the deletion was successful, remove the workflow from the list
        const { workflow_id } = action.meta.arg;
        state.workflows = state.workflows.filter(workflow => workflow.id !== workflow_id);
        state.totalRecords -= 1;  // Decrease the total number of records
      })
      .addCase(deleteWorkflowApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
      
  },
});

export const { setFilters } = workflowsListSlice.actions;
export default workflowsListSlice.reducer;
