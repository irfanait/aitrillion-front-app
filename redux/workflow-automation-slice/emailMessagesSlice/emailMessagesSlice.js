import { createSlice } from "@reduxjs/toolkit";
import { getEmailMessageListApi, deleteMessageApi } from "@/redux/apis/workflow-automation-apis/workflowAutomationApis";

const initialState = {
  messages: [],
  loading: false,
  error: null,
  filters: {
    currentPage: 1,
    limit: 10,
    keyword: "",
  },
  totalRecords: 0,
};

const emailMessagesSlice = createSlice({
  name: "emailMessages",
  initialState,
  reducers: {
    setEmailMessageFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmailMessageListApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailMessageListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload?.data || [];
        state.totalRecords = action.payload?.totalrecord || 0;
      })
      .addCase(getEmailMessageListApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })
      // Handling the deleteWorkflowApi action
      .addCase(deleteMessageApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessageApi.fulfilled, (state, action) => {
        state.loading = false;
        const { mid } = action.payload || {};
        if (mid) {
          // messages items appear to have id as string, ensure comparable type
          state.messages = state.messages.filter((m) => String(m.id) !== String(mid));
          state.totalRecords = Math.max(0, (Number(state.totalRecords) || 0) - 1);
        }
      })
      .addCase(deleteMessageApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { setEmailMessageFilters } = emailMessagesSlice.actions;
export default emailMessagesSlice.reducer;
