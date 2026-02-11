import {
  getImportCsvList,
  getListApi,
  updateCsvMappingApi,
  updateListImportStep3Api,
  uploadCsvApi,
} from '@/redux/apis/customers-api/customersApi';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  importCsvList: [],
  importCsvListLoading: false,
  importCsvListApiState: '',
  importCsvListMessage: null,

  filters: {
    keyword: '',
    listType: 'all',
    customType: 0,
    groupType: 0,

    limit: 10,
    currentPage: 1,
    order: 0,
    sort: 'id',

    reset: false,
  },
  totalRecords: 0,

  list: [],
  listApiState: '',
  listLoading: false,

  //uploadcsv
  uploadCsvData: {},
  uploadCsvLoading: false,
  uploadCsvApiState: '',
  uploadCsvMessage: null,

  getAiShopSettingData: {},
  getAiShopSettingLoading: false,
  getAiShopSettingApiState: '',
  getAiShopSettingMessage: null,

  step2Response: null,
  step3Response: null,
};

// Slice
const importCsvSlice = createSlice({
  name: 'importCsvSlice',
  initialState,
  reducers: {
    setKeyword(state, action) {
      state.filters.keyword = action.payload;
      state.filters.currentPage = 1;
      state.filters.reset = true;
    },

    resetCustomFieldsFilters(state) {
      state.filters = {
        ...initialState.filters,
        reset: true,
      };
    },
    setIMportCsvLoading(state, action) {
      state.uploadCsvLoading = action?.payload;
    },
    imporCsvPartiallyReset(state) {
      state.uploadCsvLoading = false;
      state.uploadCsvApiState = '';
      state.uploadCsvMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch customers list
    builder
      .addCase(getImportCsvList.pending, (state) => {
        state.importCsvListApiState = 'pending';
        state.importCsvListLoading = true;
        state.importCsvListMessage = null;
      })
      .addCase(getImportCsvList.fulfilled, (state, action) => {
        state.importCsvListApiState = action?.payload?.status || 'success';
        state.importCsvListLoading = false;
        state.importCsvList = action.payload?.data || [];
        state.totalRecords = action.payload?.totalrecord || 0;
      })
      .addCase(getImportCsvList.rejected, (state, action) => {
        state.importCsvListApiState = action?.payload?.status || 'Error';
        state.importCsvListLoading = false;
        state.importCsvListMessage =
          action.payload?.msg || 'Something went wrong';
      })
      .addCase(getListApi.pending, (state) => {
        state.listApiState = 'pending';
        state.listLoading = true;
      })
      .addCase(getListApi.fulfilled, (state, action) => {
        state.listApiState = action?.payload?.status || 'success';
        state.listLoading = false;
        state.list = action.payload?.data || [];
      })
      .addCase(getListApi.rejected, (state, action) => {
        state.listApiState = action?.payload?.status || 'Error';
        state.listLoading = false;
      })
      .addCase(uploadCsvApi.pending, (state) => {
        state.uploadCsvApiState = 'pending';
        state.uploadCsvLoading = true;
        state.uploadCsvMessage = null;
      })
      .addCase(uploadCsvApi.fulfilled, (state, action) => {
        state.uploadCsvApiState = action?.payload?.status || 'success';
        state.uploadCsvLoading = false;
        state.uploadCsvData = action.payload?.data || {};
        state.uploadCsvMessage = action.payload?.msg || 0;
      })
      .addCase(uploadCsvApi.rejected, (state, action) => {
        state.uploadCsvApiState = action?.payload?.status || 'Error';
        state.uploadCsvLoading = false;
        state.uploadCsvMessage = action.payload?.msg || 'Something went wrong';
      })

      .addCase(updateCsvMappingApi.pending, (state) => {
        state.uploadCsvApiState = 'pending';
        state.uploadCsvLoading = true;
        state.uploadCsvMessage = null;
      })

      .addCase(updateCsvMappingApi.fulfilled, (state, action) => {
        state.uploadCsvApiState = 'success';
        state.uploadCsvLoading = false;
        state.uploadCsvMessage = action.payload?.msg || 'Mapping saved';
      })

      .addCase(updateCsvMappingApi.rejected, (state, action) => {
        state.uploadCsvApiState = 'error';
        state.uploadCsvLoading = false;
        state.uploadCsvMessage = action.payload?.msg || 'Something went wrong';
        state.step2Response =
          action.payload?.data || action.payload?.Items || null;
      })

      .addCase(updateListImportStep3Api.pending, (state) => {
        state.uploadCsvApiState = 'pending';
        state.uploadCsvLoading = true;
        state.uploadCsvMessage = null;
      })

      .addCase(updateListImportStep3Api.fulfilled, (state, action) => {
        state.uploadCsvApiState = 'success';
        state.uploadCsvLoading = false;
        state.uploadCsvMessage = action.payload?.msg || 'details saved';
        state.step3Response =
          action.payload?.data || action.payload?.Items || null;
      })

      .addCase(updateListImportStep3Api.rejected, (state, action) => {
        state.uploadCsvApiState = 'error';
        state.uploadCsvLoading = false;
        state.uploadCsvMessage = action.payload?.msg || 'Something went wrong';
      });
  },
});

export const { setKeyword, setIMportCsvLoading, imporCsvPartiallyReset } =
  importCsvSlice.actions;

export default importCsvSlice.reducer;
