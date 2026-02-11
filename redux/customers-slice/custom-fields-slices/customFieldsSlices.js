import {
  checkShopCustomFields,
  createCustomFieldApi,
  createCustomFieldOptionApi,
  deleteCustomFieldApi,
  deleteFieldOptionApi,
  getCustomFieldOptionsApi,
  getCustomFieldReport,
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
    customType: 0,
    groupType: 0,

    limit: 10,
    currentPage: 1,
    order: 0,
    sort: 'id',

    reset: false,
  },
  totalRecords: 0,

  fieldTypeOptions: [],
  groupTypeOptions: [],

  checkFieldLoading: false,
  checkFieldError: null,

  createCusTomFieldApiState: ' ',
  createCusTomFieldLoading: false,
  createCusTomFieldError: null,
  createCusTomFieldMessage: null,
  createCusTomFieldData: {},

  //   // UPDATE
  //   updateListApiState: ' ',
  //   updateListLoading: false,
  //   updateListError: null,
  //   updateListMessage: null,
  //   updateListData: {},

  deleteCustomListApiState: ' ',
  deleteCustomListLoading: false,
  deleteCustomListError: null,
  deleteCustomListMessage: null,

  getCustomFieldOptionsApiState: ' ',
  getCustomFieldOptionsLoading: false,
  getCustomFieldOptionsError: null,
  getCustomFieldOptionsMessage: null,
  getCustomFieldOptionsList: [],

  createCustomFieldOptionsApiState: ' ',
  createCustomFieldOptionsLoading: false,
  createCustomFieldOptionsError: null,
  createCustomFieldOptionsMessage: null,

  deleteCustomFieldOptionsApiState: ' ',
  deleteCustomFieldOptionsLoading: false,
  deleteCustomFieldOptionsError: null,
  deleteCustomFieldOptionsMessage: null,
};

// Slice
const customFieldsSlice = createSlice({
  name: 'customFieldsSlice',
  initialState,
  reducers: {
    setKeyword(state, action) {
      state.filters.keyword = action.payload;
      state.filters.currentPage = 1;
      state.filters.reset = true;
    },

    setFieldType(state, action) {
      state.filters.customType = action.payload;
      state.filters.currentPage = 1;
      state.filters.reset = true;
    },

    setGroupType(state, action) {
      state.filters.groupType = action.payload;
      state.filters.currentPage = 1;
      state.filters.reset = true;
    },

    setCustomFieldPage(state, action) {
      state.filters.currentPage = action.payload;
    },

    setCustomFieldLimit(state, action) {
      state.filters.limit = action.payload;
      state.filters.currentPage = 1;
    },

    setCustomFieldSort(state, action) {
      state.filters.sort = action.payload.field;
      state.filters.order = action.payload.order;
      state.filters.currentPage = 1;
    },

    resetCustomFieldsFilters(state) {
      state.filters = {
        ...initialState.filters,
        reset: true,
      };
    },

    setFieldTypeOptions(state, action) {
      state.fieldTypeOptions = action.payload || [];
    },

    setGroupTypeOptions(state, action) {
      state.groupTypeOptions = action.payload || [];
    },

    createCustomFieldReset(state) {
      state.createCusTomFieldLoading = false;
      state.createCusTomFieldError = null;
      state.createCusTomFieldMessage = null;
      state.createCusTomFieldData = {};
      state.createCusTomFieldApiState = ' ';
    },

    createCustomFieldOptionReset(state) {
      state.createCustomFieldOptionsApiState = '';
      state.createCustomFieldOptionsLoading = false;
      state.createCustomFieldOptionsError = null;
      state.createCustomFieldOptionsMessage = null;
    },

    // // RESET UPDATE
    // updateListReset(state) {
    //   state.updateListApiState = ' ';
    //   state.updateListLoading = false;
    //   state.updateListError = null;
    //   state.updateListMessage = null;
    //   state.updateListData = {};
    // },

    deleteCustomListReset(state) {
      state.deleteCustomListApiState = ' ';
      state.deleteCustomListLoading = false;
      state.deleteCustomListError = null;
      state.deleteCustomListMessage = null;
    },
    deleteCustomFieldOptionsReset(state) {
      state.deleteCustomFieldOptionsApiState = ' ';
      state.deleteCustomFieldOptionsLoading = false;
      state.deleteCustomFieldOptionsMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch customers list
    builder
      .addCase(getCustomFieldReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomFieldReport.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.fieldRows || [];
        state.totalRecords = action.payload?.totalrecord || 0;

        //  Store dropdown options
        state.fieldTypeOptions = action.payload?.customeTypeArr || [];
        state.groupTypeOptions = action.payload?.customeGroupTypeArr || [];

        state.filters.reset = false; // ← important
      })
      .addCase(getCustomFieldReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // CREATE custom field
      .addCase(createCustomFieldApi.pending, (state) => {
        state.createCusTomFieldApiState = 'pending';
        state.createCusTomFieldLoading = true;
        state.createCusTomFieldError = null;
        state.createCusTomFieldMessage = null;
        state.createCusTomFieldData = {};
      })
      .addCase(createCustomFieldApi.fulfilled, (state, action) => {
        state.createCusTomFieldApiState = action?.payload?.status || 'success';
        state.createCusTomFieldLoading = false;
        state.createCusTomFieldError =
          action.payload?.msg || 'Something went wrong';
        state.createCusTomFieldMessage = action.payload?.msg;
      })
      .addCase(createCustomFieldApi.rejected, (state, action) => {
        state.createCusTomFieldApiState = action?.payload?.status || 'error';
        state.createCusTomFieldLoading = false;
        state.createCusTomFieldError =
          action.payload?.msg || 'Something went wrong';
        state.createCusTomFieldMessage = action.payload?.msg;
      })

      // DELETE custom field
      .addCase(deleteCustomFieldApi.pending, (state) => {
        state.deleteCustomListApiState = 'pending';
        state.deleteCustomListLoading = true;
        state.deleteCustomListError = null;
        state.deleteCustomListMessage = null;
      })
      .addCase(deleteCustomFieldApi.fulfilled, (state, action) => {
        state.deleteCustomListApiState = action?.payload?.status || 'success';
        state.deleteCustomListLoading = false;
        state.deleteCustomListMessage = action.payload?.msg || 'List deleted';

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
      .addCase(deleteCustomFieldApi.rejected, (state, action) => {
        state.deleteCustomListApiState = 'error';
        state.deleteCustomListLoading = false;
        state.deleteCustomListError =
          action.payload?.msg || 'Failed to delete list';
      })

      //getCustomFieldOptionsApi
      .addCase(getCustomFieldOptionsApi.pending, (state) => {
        state.getCustomFieldOptionsLoading = true;
        state.getCustomFieldOptionsError = null;
      })
      .addCase(getCustomFieldOptionsApi.fulfilled, (state, action) => {
        state.getCustomFieldOptionsLoading = false;
        state.getCustomFieldOptionsList = action.payload?.fieldRows?.rows || [];
      })
      .addCase(getCustomFieldOptionsApi.rejected, (state, action) => {
        state.getCustomFieldOptionsLoading = false;
        state.getCustomFieldOptionsError =
          action.payload || 'Something went wrong';
      })
      // create custom field option
      .addCase(createCustomFieldOptionApi.pending, (state) => {
        state.createCustomFieldOptionsLoading = true;
        state.createCustomFieldOptionsApiState = true;
        state.createCustomFieldOptionsError = null;
      })
      .addCase(createCustomFieldOptionApi.fulfilled, (state, action) => {
        console.log(action);

        state.createCustomFieldOptionsApiState =
          action?.payload?.status || 'success';
        state.createCustomFieldOptionsLoading = false;
        state.createCustomFieldOptionsMessage =
          action.payload?.msg || 'custom field option created successfully';
      })
      .addCase(createCustomFieldOptionApi.rejected, (state, action) => {
        state.createCustomFieldOptionsApiState =
          action?.payload?.status || 'error';
        state.createCustomFieldOptionsLoading = false;
        state.createCustomFieldOptionsMessage =
          action.payload || 'Something went wrong';
      })
      //delete custom field options

      .addCase(deleteFieldOptionApi.pending, (state) => {
        state.deleteCustomFieldOptionsApiState = 'pending';
        state.deleteCustomFieldOptionsLoading = true;
        state.deleteCustomFieldOptionsMessage = null;
      })
      .addCase(deleteFieldOptionApi.fulfilled, (state, action) => {
        state.deleteCustomFieldOptionsApiState =
          action?.payload?.status || 'success';
        state.deleteCustomFieldOptionsLoading = false;
        state.deleteCustomFieldOptionsMessage =
          action.payload?.msg || 'Option deleted';

        const deletedId = action.meta.arg.id;

        if (deletedId) {
          // Remove deleted row from UI without reloading
          state.getCustomFieldOptionsList =
            state.getCustomFieldOptionsList.filter(
              (item) => Number(item.id) !== Number(deletedId)
            );
        }
      })
      .addCase(deleteFieldOptionApi.rejected, (state, action) => {
        state.deleteCustomFieldOptionsApiState = 'error';
        state.deleteCustomFieldOptionsLoading = false;
        state.deleteCustomFieldOptionsMessage =
          action.payload?.msg || 'Failed to delete option';
      })

      .addCase(checkShopCustomFields.pending, (state) => {
        state.checkFieldLoading = true;
        state.checkFieldError = null;
      })
      .addCase(checkShopCustomFields.fulfilled, (state, action) => {
        state.checkFieldLoading = false;
        state.checkFieldError =
          action.payload?.status === 'error' ? action.payload.msg : null;
      })
      .addCase(checkShopCustomFields.rejected, (state, action) => {
        state.checkFieldLoading = false;
        state.checkFieldError =
          action.payload?.msg || 'Unable to validate field name';
      });
  },
});

export const {
  setKeyword,
  setCustomFieldPage,
  setCustomFieldLimit,
  setCustomFieldSort,
  setFieldType,
  setGroupType,
  resetCustomFieldsFilters,
  setFieldTypeOptions,
  deleteCustomListReset,
  setGroupTypeOptions,
  createCustomFieldReset,
  deleteCustomFieldOptionsReset,
  createCustomFieldOptionReset,
} = customFieldsSlice.actions;

export default customFieldsSlice.reducer;
