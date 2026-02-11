import {
  createListApi,
  deleteListApi,
  getListApi,
} from '@/redux/apis/customers-api/customersApi';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  list: [],
  loading: false,
  error: null,

  filters: {
    keyword: '',
    listType: 'all',
    order: 0, // 0 = DESC, 1 = ASC
    sort: 'id', // default sort column
    limit: 10,
    currentPage: 1,
    reset: false,
  },

  createListApiState: ' ',
  createListLoading: false,
  createListError: null,
  createListMessage: null,
  createListData: {},

  // UPDATE
  updateListApiState: ' ',
  updateListLoading: false,
  updateListError: null,
  updateListMessage: null,
  updateListData: {},

  deleteListApiState: ' ',
  deleteListLoading: false,
  deleteListError: null,
  deleteListMessage: null,

  totalRecords: 0,
};

// Slice
const listSlice = createSlice({
  name: 'listSlice',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filters.keyword = action.payload;
      state.filters.currentPage = 1;
      state.filters.reset = true;
    },
    setPage(state, action) {
      state.filters.currentPage = action.payload;
    },

    setLimit(state, action) {
      state.filters.limit = action.payload;
      state.filters.currentPage = 1;
    },

    setSort(state, action) {
      state.filters.sort = action.payload.field; // column to sort
      state.filters.order = action.payload.order; // 1 or 0
      state.filters.currentPage = 1; // reset page
    },

    resetFilters(state) {
      state.filters = {
        ...initialState.filters,
        reset: true,
      };
    },
    createListReset(state) {
      state.createListLoading = false;
      state.createListError = null;
      state.createListMessage = null;
      state.createListData = {};
      state.createListApiState = ' ';
    },
    // RESET UPDATE
    updateListReset(state) {
      state.updateListApiState = ' ';
      state.updateListLoading = false;
      state.updateListError = null;
      state.updateListMessage = null;
      state.updateListData = {};
    },

    deleteListReset(state) {
      state.deleteListApiState = ' ';
      state.deleteListLoading = false;
      state.deleteListError = null;
      state.deleteListMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch customers list
    builder
      .addCase(getListApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListApi.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.totalRecords = action.payload?.totalrecord || 0;
        state.filters.reset = false; // ← important
      })
      .addCase(getListApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(createListApi.pending, (state) => {
        state.createListApiState = 'pending';
        state.createListLoading = true;
        state.createListError = null;
        state.createListMessage = null;
      })
      .addCase(createListApi.fulfilled, (state, action) => {
        state.createListLoading = false;

        const returned = action.payload?.data;
        const message = action.payload?.msg || 'Success';

        // CREATE or UPDATE ?
        if (returned?.id && action.meta.arg.id) {
          // ⭐ UPDATE MODE
          state.updateListApiState = 'success';
          state.updateListMessage = message;
          state.updateListData = returned;

          // update local list
          state.list = state.list.map((item) =>
            item.id === returned.id ? { ...item, ...returned } : item
          );
        } else {
          // ⭐ CREATE MODE
          state.createListApiState = 'success';
          state.createListMessage = message;
          state.createListData = returned;
        }
      })
      .addCase(createListApi.rejected, (state, action) => {
        state.createListLoading = false;
        const msg = action.payload?.msg || 'Something went wrong';

        // If id was sent → UPDATE error
        if (action.meta.arg.id) {
          state.updateListApiState = 'error';
          state.updateListError = msg;
          state.updateListMessage = msg;
        } else {
          state.createListApiState = 'error';
          state.createListError = msg;
          state.createListMessage = msg;
        }
      });
    // DELETE LIST
    builder
      .addCase(deleteListApi.pending, (state) => {
        state.deleteListApiState = 'pending';
        state.deleteListLoading = true;
        state.deleteListError = null;
        state.deleteListMessage = null;
      })
      .addCase(deleteListApi.fulfilled, (state, action) => {
        state.deleteListApiState = 'success';
        state.deleteListLoading = false;
        state.deleteListMessage = action.payload?.msg || 'List deleted';

        const deletedId = action.meta.arg.id;

        if (deletedId) {
          // Remove deleted row from UI without reloading
          state.list = state.list.filter(
            (item) => Number(item.id) !== Number(deletedId)
          );

          // update total count
          state.totalRecords = Math.max(state.totalRecords - 1, 0);
        }
      })
      .addCase(deleteListApi.rejected, (state, action) => {
        state.deleteListApiState = 'error';
        state.deleteListLoading = false;
        state.deleteListError = action.payload?.msg || 'Failed to delete list';
      });
  },
});

export const {
  setSearch,
  setPage,
  setLimit,
  setSort,
  resetFilters,
  createListReset,
  updateListReset,
  deleteListReset,
} = listSlice.actions;

export default listSlice.reducer;
