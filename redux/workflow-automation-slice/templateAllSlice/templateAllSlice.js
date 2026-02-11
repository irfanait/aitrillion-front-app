import { createSlice } from "@reduxjs/toolkit";
import { getWorkflowTemplateListApi } from "@/redux/apis/workflow-automation-apis/workflowAutomationApis";

const initialState = {
  templateList: [],
  loading: false,
  error: null,
};

const templateAllSlice = createSlice({
  name: "workflowTemplateAll",
  initialState,
  reducers: {
    clearTemplates: (state) => {
      state.templateList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkflowTemplateListApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkflowTemplateListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.templateList = action.payload || [];
      })
      .addCase(getWorkflowTemplateListApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearTemplates } = templateAllSlice.actions;
export default templateAllSlice.reducer;
