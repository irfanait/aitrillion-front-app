import {
  deleteSegmentApi,
  getCampaignList,
  getCustomerCustomFieldsApi,
  getCustomerInItDataApi,
  getCustomersList,
  getGroupList,
  getTierList,
  processBulkCustomerStatusApi,
  updateColumnFields,
  updateCustomerBulkStatusApi,
} from '@/redux/apis/customers-api/customersApi';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  allCustomersList: [],
  customersColumns: [],
  totalCustomersCount: 0,
  totalPages: 0,
  filters: {
    currentPage: 1,
    limit: 20,
    sort: 'c.last_seen_date',
    order: false,
    selectedpeopleType: 'Customers',
    selectedOperatorType: 'and',
    gridOrMap: 'grid',
    act: 'list_customer',
    masterFilter: '[]',
    isFirstRequest: true,
    just_seen: '',
    shop_id: '',
    isRequestForActiveCustomers: 0,
    refreshKey: 0,
  },

  getCampaignListApiState: '',
  campaignList: [],
  getCampaignListLoading: false,

  getCustomerCustomFieldsApiState: '',
  getCustomerCustomFields: [],
  getCustomerCustomFieldsLoading: false,
  getCustomerCustomFieldOptions: {},

  getCustomerInItDataApiState: '',
  getCustomerInItData: {},
  getCustomerInItDataLoading: false,
  getCustomerInItDataError: '',
  getCustomerInItDataMessage: '',

  updateCustomerBulkStatusApiState: '',
  updateCustomerBulkStatus: {},
  updateCustomerBulkStatusLoading: false,
  updateCustomerBulkStatusError: '',
  updateCustomerBulkStatusMessage: '',

  processBulkCustomerStatusApiState: '',
  processBulkCustomerStatusData: {},
  processBulkCustomerStatusLoading: false,
  processBulkCustomerStatusError: '',
  processBulkCustomerStatusMessage: '',

  deleteSegmentApiState: '',
  deleteSegmentData: {},
  deleteSegmentLoading: false,
  deleteSegmentError: '',
  deleteSegmentMessage: '',

  getCustomerInitDataFilters: {
    act: 'load_customer_init_data',
    currentPage: 1,
    gridOrMap: 'grid',
    isFirstRequest: true,
    isRequestForActiveCustomers: 0,
    just_seen: '',
    limit: 20,
    order: false,
    selectedOperatorType: 'and',
    selectedpeopleType: 'Customers',
    shop_id: '',
    sort: 'c.last_seen_date',
    is_api_request: '1',
  },

  updateGridFilters: {
    act: 'updateGridFields',
  },
  selectedColumnIds: [],
  allCustomersListLoading: false,
  error: null,
};

// Slice
const allCustomersSlice = createSlice({
  name: 'allCustomers',
  initialState,
  reducers: {
    setAllCustomerFilters: (state, action) => {
      const prevPage = state.filters.currentPage;

      state.filters = {
        ...state.filters,
        ...action.payload,
      };

      // 🔥 If page is reset, clear list
      if (action.payload.currentPage === 1 && prevPage !== 1) {
        state.allCustomersList = [];
      }
    },
    setCustomerInitDataFilters(state, action) {
      state.getCustomerInitDataFilters = {
        ...state.getCustomerInitDataFilters,
        ...action.payload,
      };
    },
    setCustomerColumns(state, action) {
      state.selectedColumnIds = action.payload;
    },
    setUpdateGridFilters(state, action) {
      state.updateGridFilters = {
        ...state.updateGridFilters,
        ...action.payload,
      };
    },
    setCurrentPage(state, action) {
      state.filters.currentPage = action.payload;
    },
    setSortOrder(state, action) {
      state.filters.sort = action.payload.sort;
      state.filters.order = action.payload.order;
    },
    processBulkStatusReset(state, action) {
      state.processBulkCustomerStatusApiState = '';
      state.processBulkCustomerStatusData = {};
      state.processBulkCustomerStatusLoading = false;
      state.processBulkCustomerStatusError = '';
      state.processBulkCustomerStatusMessage = '';
    },

    updateBulkStatusReset(state, action) {
      state.updateCustomerBulkStatusApiState = '';
      state.updateCustomerBulkStatus = {};
      state.updateCustomerBulkStatusLoading = false;
      state.updateCustomerBulkStatusError = '';
      state.updateCustomerBulkStatusMessage = '';
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },

    // ✅ reset only list + counters + filters; keep selectedColumnIds intact
    resetListAndFilters(state) {
      state.allCustomersList = [];
      state.totalCustomersCount = 0;
      state.totalPages = 0;
      state.allCustomersListLoading = false;
      state.error = null;

      state.filters = {
        ...initialState.filters,
        // if you need to preserve current shop_id, do it here:
        shop_id: state.filters.shop_id || '',
      };
    },
    resetAllCustomerList(state, action) {
      state.filters = initialState?.filters;
      state.allCustomersList = [];
      state.totalCustomersCount = 0;
      state.totalPages = 0;
      state.allCustomersListLoading = false;
      state.error = null;
    },
    deleteSegmentResetCustomerList(state, action) {
      state.deleteSegmentApiState = '';
      state.deleteSegmentData = {};
      state.deleteSegmentLoading = false;
      state.deleteSegmentError = '';
      state.deleteSegmentMessage = '';
    },
  },
  extraReducers: (builder) => {
    // Fetch customers list
    builder
      .addCase(getCustomersList.pending, (state) => {
        state.allCustomersListLoading = true;
        state.error = null;
      })
      .addCase(getCustomersList.fulfilled, (state, action) => {
        state.allCustomersListLoading = false;

        const rows = action?.payload?.rows;
        const total = action?.payload?.totalrecord;
        const totalPages = action?.payload?.totalpages;

        const currentPage = Number(state.filters.currentPage) || 1;

        if (currentPage === 1) {
          // 🔁 Fresh load (filter / sort / refresh)
          state.allCustomersList = rows;
        } else {
          // ➕ Append for next pages
          state.allCustomersList = [...state.allCustomersList, ...rows];
        }

        state.totalCustomersCount = total;
        state.totalPages = totalPages;
      })
      .addCase(getCustomersList.rejected, (state, action) => {
        state.allCustomersListLoading = false;
        state.error = action.payload?.msg || 'Failed to fetch customers list';
      })
      //campaign list api state
      .addCase(getCampaignList.pending, (state) => {
        state.getCampaignListApiState = 'pending';
        state.getCampaignListLoading = true;
      })
      .addCase(getCampaignList.fulfilled, (state, action) => {
        state.getCampaignListApiState = action?.payload?.status;
        state.campaignList = action?.payload?.rows || {};
        state.getCampaignListLoading = false;
      })
      .addCase(getCampaignList.rejected, (state, action) => {
        state.getCampaignListApiState = action?.payload?.status;
        state.getCampaignListLoading = false;
      })
      //get customer custom fields
      .addCase(getCustomerCustomFieldsApi.pending, (state) => {
        state.getCustomerCustomFieldsApiState = 'pending';
        state.getCustomerCustomFieldsLoading = true;
      })
      .addCase(getCustomerCustomFieldsApi.fulfilled, (state, action) => {
        state.getCustomerCustomFieldsApiState = 'success';

        state.getCustomerCustomFields =
          action?.payload?.data && typeof action.payload.data === 'object'
            ? action.payload.data
            : {};

        state.getCustomerCustomFieldOptions =
          action?.payload?.customFieldFilterData &&
          typeof action.payload.customFieldFilterData === 'object'
            ? action.payload.customFieldFilterData
            : {};

        state.getCustomerCustomFieldsLoading = false;
      })
      .addCase(getCustomerCustomFieldsApi.rejected, (state, action) => {
        state.getCustomerCustomFieldsApiState = action?.payload?.status;
        state.getCustomerCustomFieldsLoading = false;
      })

      // Update customer status active/in-active
      .addCase(updateCustomerBulkStatusApi.pending, (state) => {
        state.updateCustomerBulkStatusApiState = 'pending';
        state.updateCustomerBulkStatusLoading = true;
        state.updateCustomerBulkStatusError = '';
        state.updateCustomerBulkStatusMessage = '';
      })
      .addCase(updateCustomerBulkStatusApi.fulfilled, (state, action) => {
        state.updateCustomerBulkStatusApiState = action?.payload?.status;
        state.updateCustomerBulkStatusData = action?.payload?.rows || {};
        state.updateCustomerBulkStatusLoading = false;
        state.updateCustomerBulkStatusMessage = action?.payload?.msg;
      })
      .addCase(updateCustomerBulkStatusApi.rejected, (state, action) => {
        state.updateCustomerBulkStatusApiState = action?.payload?.status;
        state.updateCustomerBulkStatusLoading = false;
        state.updateCustomerBulkStatusMessage = action?.payload?.msg;
        state.updateCustomerBulkStatusError = action?.payload?.msg;
      })

      // Update customer bulk status active/in-active
      .addCase(processBulkCustomerStatusApi.pending, (state, action) => {
        state.processBulkCustomerStatusApiState = 'pending';
        state.processBulkCustomerStatusLoading = true;
        state.processBulkCustomerStatusError = '';
        state.processBulkCustomerStatusMessage = '';
      })
      .addCase(processBulkCustomerStatusApi.fulfilled, (state, action) => {
        state.processBulkCustomerStatusApiState = action?.payload?.status;
        state.processBulkCustomerStatusData = action?.payload?.rows || {};
        state.processBulkCustomerStatusLoading = false;
        state.processBulkCustomerStatusMessage = action?.payload?.msg;
      })
      .addCase(processBulkCustomerStatusApi.rejected, (state, action) => {
        state.processBulkCustomerStatusApiState = action?.payload?.status;
        state.processBulkCustomerStatusLoading = false;
        state.processBulkCustomerStatusMessage = action?.payload?.msg;
        state.processBulkCustomerStatusError = action?.payload?.msg;
      })
      // get CustomerInitData
      .addCase(getCustomerInItDataApi.pending, (state) => {
        state.getCustomerInItDataApiState = 'pending';
        state.getCustomerInItDataLoading = true;
        state.getCustomerInItDataError = '';
        state.getCustomerInItDataMessage = '';
      })
      .addCase(getCustomerInItDataApi.fulfilled, (state, action) => {
        state.getCustomerInItDataApiState = action?.payload?.status;
        state.getCustomerInItData = action?.payload?.rows || {};
        state.getCustomerInItDataLoading = false;
        state.getCustomerInItDataMessage = action?.payload?.msg;
      })
      .addCase(getCustomerInItDataApi.rejected, (state, action) => {
        state.getCustomerInItDataApiState = action?.payload?.status;
        state.getCustomerInItDataLoading = false;
        state.getCustomerInItDataMessage = action?.payload?.msg;
        state.getCustomerInItDataError = action?.payload?.msg;
      })
      // Update column grid
      .addCase(updateColumnFields.pending, (state) => {
        // state.getCustomerInItDataApiState = 'pending';
        // state.getCustomerInItDataLoading = true;
        // state.getCustomerInItDataError = '';
        // state.getCustomerInItDataMessage = '';
      })
      .addCase(updateColumnFields.fulfilled, (state, action) => {
        // state.getCustomerInItDataApiState = action?.payload?.status;
        // state.getCustomerInItData = action?.payload?.rows || {};
        // state.getCustomerInItDataLoading = false;
        // state.getCustomerInItDataMessage = action?.payload?.msg;
      })
      .addCase(updateColumnFields.rejected, (state, action) => {
        // state.getCustomerInItDataApiState = action?.payload?.status;
        // state.getCustomerInItDataLoading = false;
        // state.getCustomerInItDataMessage = action?.payload?.msg;
        // state.getCustomerInItDataError = action?.payload?.msg;
      })

      // delete segment list
      .addCase(deleteSegmentApi.pending, (state) => {
        state.deleteSegmentApiState = 'pending';
        state.deleteSegmentLoading = true;
        state.deleteSegmentError = '';
        state.deleteSegmentMessage = '';
      })
      .addCase(deleteSegmentApi.fulfilled, (state, action) => {
        state.deleteSegmentApiState = action?.payload?.status || 'success';
        state.deleteSegmentLoading = false;
        state.deleteSegmentMessage = action?.payload?.msg;

        const deletedId = action.meta.arg?.del_filter_id; // assuming you pass id when dispatching
        if (state.getCustomerInItData?.defaultSegments) {
          state.getCustomerInItData.defaultSegments =
            state.getCustomerInItData.defaultSegments.filter(
              (seg) => seg.id !== deletedId
            );
        }
      })
      .addCase(deleteSegmentApi.rejected, (state, action) => {
        state.deleteSegmentApiState = action?.payload?.status || 'error';
        state.deleteSegmentLoading = false;
        state.deleteSegmentMessage = action?.payload?.msg;
        state.deleteSegmentError = action?.payload?.msg;
      });
  },
});

export const {
  setAllCustomerFilters,
  setCustomerInitDataFilters,
  setUpdateGridFilters,
  setCustomerColumns,
  resetListAndFilters,
  setCurrentPage,
  setSortOrder,
  clearFilters,
  updateBulkStatusReset,
  processBulkStatusReset,
  resetAllCustomerList,
  deleteSegmentResetCustomerList,
} = allCustomersSlice.actions;

export default allCustomersSlice.reducer;
