import {
  deleteSegmentApi,
  exportCustomerFromSegmentApi,
  getSegmentListApi,
  saveSegmentApi,
} from '@/redux/apis/customers-api/customersApi';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  segmentList: [],
  totalCustomersCount: 0,
  totalPages: 0,
  segmentListLoading: false,
  error: null,

  filters: {
    act: 'get_filter_segments',
    countSync: 1,
    currentPage: 1,
    filter_list: 'all',
    limit: 10,
    messageFilter: 'all',
    order: 0, // 1 = ascend, 0 = descend (per your payload)

    sort: 'asfs.id',
    totalRecords: 0,
  },

  deleteSegmentApiState: ' ',
  deleteSegmentApiLoading: false,
  deleteSegmentApiError: null,
  deleteSegmentApiMessage: null,

  exportCustomerFromSegmentApiState: ' ',
  exportCustomerFromSegmentApiLoading: false,
  exportCustomerFromSegmentApiError: null,
  exportCustomerFromSegmentApiMessage: null,

  saveSegmentApiState: ' ',
  saveSegmentLoading: false,
  saveSegmentError: null,
  saveSegmentMessage: null,
  saveSegmentData: [],
  saveSegmentId: '',
};

// Slice
const segmentSlice = createSlice({
  name: 'segmentSlice',
  initialState,
  reducers: {
    setSegmentListFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage(state, action) {
      state.filters.currentPage = action.payload;
    },
    setSortOrder(state, action) {
      state.filters.sort = action.payload.sort;
      state.filters.order = action.payload.order;
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    deleteSegmentReset(state) {
      state.deleteSegmentApiState = ' ';
      state.deleteSegmentApiLoading = false;
      state.deleteSegmentApiError = null;
      state.deleteSegmentApiMessage = null;
    },

    resetExportCustomerfromSegment(state) {
      state.exportCustomerFromSegmentApiState = ' ';
      state.exportCustomerFromSegmentApiLoading = false;
      state.exportCustomerFromSegmentApiError = null;
      state.exportCustomerFromSegmentApiMessage = null;
    },
    resetSaveSegment(state) {
      state.saveSegmentApiState = '';
      state.saveSegmentLoading = false;
      state.saveSegmentMessage = '';
      state.saveSegmentError = '';
    },

    updateDefaultSegments: (state, action) => {
      const seg = action.payload;
      const list = state.getCustomerInItData?.defaultSegments || [];

      const exists = list.find((s) => String(s.id) === String(seg.id));

      if (!exists) {
        state.getCustomerInItData.defaultSegments = [...list, seg];
      } else {
        state.getCustomerInItData.defaultSegments = list.map((s) =>
          String(s.id) === String(seg.id) ? seg : s
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch customers list
    builder
      .addCase(getSegmentListApi.pending, (state) => {
        state.segmentListLoading = true;
        state.error = null;
      })
      .addCase(getSegmentListApi.fulfilled, (state, action) => {
        state.segmentListLoading = false;

        // const rows = action.payload?.segmentRows || [];
        const total = action.payload.totalrecord;

        // const isFirstPage = Number(state.filters.currentPage) === 1;

        state.segmentList = action.payload?.segmentRows || [];

        state.totalCustomersCount = total;
        state.totalPages = action.payload?.totalpages || 0;
        state.filters.totalRecords = total;
      })
      .addCase(getSegmentListApi.rejected, (state, action) => {
        state.segmentListLoading = false;
        state.error = action.payload?.msg || 'Failed to fetch customers list';
      })
      //delete Segment api
      .addCase(deleteSegmentApi.pending, (state) => {
        state.deleteSegmentApiState = 'pending';
        state.deleteSegmentApiLoading = true;
      })
      .addCase(deleteSegmentApi.fulfilled, (state, action) => {
        state.deleteSegmentApiState = action?.payload?.status || 'success';
        state.deleteSegmentApiLoading = false;
        const deletedSegId = action?.meta?.arg?.del_filter_id; // 👈 use segid from dispatched payload
        if (deletedSegId) {
          state.segmentList = state.segmentList.filter(
            (segment) => String(segment.id) !== String(deletedSegId)
          );
          // Adjust total count
          state.totalCustomersCount = Math.max(
            state.totalCustomersCount - 1,
            0
          );
        }
      })
      .addCase(deleteSegmentApi.rejected, (state, action) => {
        state.deleteSegmentApiState = action?.payload?.status || 'error';
        state.deleteSegmentApiLoading = false;
        state.deleteSegmentApiMessage =
          action?.payload?.msg || 'Failed to delete segment';
      })
      //exportSegment api
      .addCase(exportCustomerFromSegmentApi.pending, (state) => {
        state.exportCustomerFromSegmentApiState = 'pending';
        state.exportCustomerFromSegmentApiLoading = true;
      })
      .addCase(exportCustomerFromSegmentApi.fulfilled, (state, action) => {
        state.exportCustomerFromSegmentApiState =
          action?.payload?.status || 'success';
        state.exportCustomerFromSegmentApiLoading = false;
        state.exportCustomerFromSegmentApiMessage =
          action?.payload?.msg || 'customer exported successfully';
      })
      .addCase(exportCustomerFromSegmentApi.rejected, (state, action) => {
        state.exportCustomerFromSegmentApiState =
          action?.payload?.status || 'error';
        state.exportCustomerFromSegmentApiLoading = false;
        state.exportCustomerFromSegmentApiMessage =
          action?.payload?.msg || 'Failed to export customers';
      })
      //save segment API states
      .addCase(saveSegmentApi.pending, (state) => {
        state.saveSegmentApiState = 'pending';
        state.saveSegmentLoading = true;
      })
      .addCase(saveSegmentApi.fulfilled, (state, action) => {
        state.saveSegmentApiState = action?.payload?.status || 'success';
        state.saveSegmentId = action?.payload?.id || '';
        state.saveSegmentData = action?.payload?.defaultSegments || [];
        state.saveSegmentLoading = false;
        state.saveSegmentMessage =
          action?.payload?.msg || 'segment saved successfully';
      })
      .addCase(saveSegmentApi.rejected, (state, action) => {
        state.saveSegmentApiState = action?.payload?.status || 'error';
        state.saveSegmentLoading = false;
        state.saveSegmentMessage =
          action?.payload?.msg || 'Failed to Saved segment';
      });
  },
});

export const {
  setSegmentListFilters,
  setCurrentPage,
  setSortOrder,
  clearFilters,
  deleteSegmentReset,
  resetSaveSegment,
  resetExportCustomerfromSegment,
} = segmentSlice.actions;

export default segmentSlice.reducer;
