import {
  copyTemplateApi,
  deleteTemplateApi,
  getTemplateListApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

// Initial State
const initialState = {
  templateList: [],
  getTemplateListApiState: '',
  getTemplateListLoading: false,
  getTemplateListApiError: null,
  hasMoreTemplates: true,

  copyTemplateApiState: '',
  copyTemplateLoading: false,
  copyTemplateMessage: '',
  copyTemplateError: '',
  copyTemplateData: {},

  deleteTemplateApiState: '',
  deleteTemplateLoading: false,
  deleteTemplateMessage: '',
  deleteTemplateError: '',
  deleteTemplateData: {},

  initialFilters: {
    act: 'get_template_list',
    currentPage: 1,
    limit: 20,
    keyword: '',
    pcid: '0',
    type: 'aiTemplate',
    is_new_template: '1',
  },

  copyTemplateFilters: {
    act: 'copy_template',
    // campaign_id: '',
    id: '',
    is_update: 1,
    template_title: '',
  },
};

const emailMarketingTemplateSlice = createSlice({
  name: 'emailMarketingTemplate',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.initialFilters = {
        ...state.initialFilters,
        ...action.payload,
      };
      // Reset list if page is 1 (e.g., new filter or tab)
      if (action.payload.currentPage === 1) {
        state.templateList = [];
        state.hasMoreTemplates = true;
      }
    },

    setCopyTemplateFilters(state, action) {
      state.copyTemplateFilters = {
        ...state.copyTemplateFilters,
        ...action.payload,
      };
    },

    resetTemplateFilters(state) {
      state.initialFilters = { ...initialState.initialFilters };
      state.templateList = [];
      state.hasMoreTemplates = true;
    },

    clearEmailMarketingTemplate(state) {
      state.getTemplateListApiState = initialState.getTemplateListApiState;
      state.getTemplateListLoading = initialState.getTemplateListLoading;
      state.getTemplateListApiError = initialState.getTemplateListApiError;
      state.templateList = [];
      state.hasMoreTemplates = true;
    },

    clearCopyTemplateFilter(state, action) {
      state.copyTemplateApiState = initialState.copyTemplateApiState;
      state.copyTemplateLoading = initialState.copyTemplateLoading;
      state.copyTemplateMessage = initialState.copyTemplateMessage;
      state.copyTemplateError = initialState.copyTemplateError;
      state.copyTemplateData = initialState.copyTemplateData;
    },

    deleteTemplateReset(state, action) {
      state.deleteTemplateApiState = initialState?.deleteTemplateApiState;
      state.deleteTemplateLoading = initialState?.deleteTemplateLoading;
      state.deleteTemplateMessage = initialState?.deleteTemplateMessage;
      state.deleteTemplateError = initialState?.deleteTemplateError;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getTemplateListApi.pending, (state) => {
        state.getTemplateListApiState = 'pending';
        state.getTemplateListLoading = true;
        state.getTemplateListApiError = null;
      })
      .addCase(getTemplateListApi.fulfilled, (state, action) => {
        const { rows = [], totalrecord = 0 } = action.payload;
        state.getTemplateListApiState = 'fulfilled';
        state.getTemplateListLoading = false;

        const isFirstPage = state.initialFilters.currentPage === 1;
        state.templateList = isFirstPage
          ? rows
          : [...state.templateList, ...rows];

        const totalFetched = state.templateList.length;

        // ✅ Handle when totalrecord is 0 (no templates at all)
        if (totalrecord === 0 || rows.length === 0) {
          state.hasMoreTemplates = false;
        } else {
          state.hasMoreTemplates = totalFetched < totalrecord;
        }
      })
      .addCase(getTemplateListApi.rejected, (state, action) => {
        state.getTemplateListApiState = 'rejected';
        state.getTemplateListLoading = false;
        state.getTemplateListApiError =
          action.payload?.message || 'Failed to fetch template list';
      })

      .addCase(copyTemplateApi.pending, (state) => {
        state.copyTemplateApiState = 'pending';
        state.copyTemplateLoading = true;
        state.copyTemplateError = null;
      })
      .addCase(copyTemplateApi.fulfilled, (state, action) => {
        state.copyTemplateApiState = action.payload.status;
        state.copyTemplateLoading = false;
        state.copyTemplateData = action?.payload || {};
        state.copyTemplateError = action.payload.msg || 'error';
        state.copyTemplateMessage = action.payload.msg || 'success';
      })
      .addCase(copyTemplateApi.rejected, (state, action) => {
        state.copyTemplateApiState = action.payload.status;
        state.copyTemplateLoading = false;
        state.copyTemplateError = action.payload?.msg || 'error';
        state.copyTemplateMessage = action.payload.msg || 'error';
      })

      .addCase(deleteTemplateApi.pending, (state) => {
        state.deleteTemplateApiState = 'pending';
        state.deleteTemplateLoading = true;
        state.deleteTemplateMessage = '';
        state.deleteTemplateError = '';
      })
      .addCase(deleteTemplateApi.fulfilled, (state, action) => {
        state.deleteTemplateApiState = action.payload.status;
        state.deleteTemplateLoading = false;
        state.deleteTemplateData = action?.payload || {};
        state.deleteTemplateError = action.payload.msg || 'error';
        state.deleteTemplateMessage = action.payload.msg || 'success';
        // ✅ Remove deleted template from list
        const deletedId = action.meta?.arg?.id; // since you pass { id: ... } in payload
        if (deletedId) {
          state.templateList = state.templateList.filter(
            (template) => template.id !== deletedId
          );
        }
      })
      .addCase(deleteTemplateApi.rejected, (state, action) => {
        state.deleteTemplateApiState = action.payload.status;
        state.deleteTemplateLoading = false;
        state.deleteTemplateMessage = action.payload.msg || 'error';
      });
  },
});

export const {
  clearEmailMarketingTemplate,
  setFilters,
  setCopyTemplateFilters,
  clearCopyTemplateFilter,
  deleteTemplateReset,
  resetTemplateFilters,
} = emailMarketingTemplateSlice.actions;

export default emailMarketingTemplateSlice.reducer;
