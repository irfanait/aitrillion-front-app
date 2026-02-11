import {
  activateDesctivateCouponCodesApi,
  addDiscountCodesApi,
  createCouponApi,
  deleteCouponApi,
  fetchCouponList,
  fetchProductCollectionsForDiscount,
  fetchProductList,
  getCouponCustomerList,
  getCouponInfoApi,
  getReatTimeCouponCodes,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  couponListApiState: '',
  couponListLoading: false,
  couponListError: '',
  couponListMessage: '',
  couponList: [],
  totalCount: 0,

  productListApiState: '',
  productListLoading: false,
  productListError: '',
  productListMessage: '',
  productList: [],

  collectionListApiState: '',
  collectionListLoading: false,
  collectionListError: '',
  collectionListMessage: '',
  collectionList: [],

  createCouponApiState: '',
  createCouponLoading: false,
  createCouponError: '',
  createCouponMessage: '',
  createCouponData: {},

  getCouponInfoApiState: '',
  getCouponInfoLoading: false,
  getCouponInfoError: '',
  getCouponInfoMessage: '',
  getCouponInfoData: {},

  deleteCouponApiState: '',
  deleteCouponLoading: false,
  deleteCouponError: '',
  deleteCouponMessage: '',
  deleteCouponData: {},

  addDiscountCodesApiState: '',
  addDiscountCodesLoading: false,
  addDiscountCodesError: '',
  addDiscountCodesMessage: '',
  addDiscountCodesData: {},

  activateDesctivateCouponCodesApiState: '',
  activateDesctivateCouponCodesLoading: false,
  activateDesctivateCouponCodesError: '',
  activateDesctivateCouponCodesMessage: '',
  activateDesctivateCouponCodesData: {},

  getReatTimeCouponCodesApiState: '',
  getReatTimeCouponCodesLoading: false,
  getReatTimeCouponCodesError: '',
  getReatTimeCouponCodesMessage: '',
  getReatTimeCouponCodesList: [],

  getCoponsCustomerListApiState: '',
  getCoponsCustomerListLoading: true,
  getCoponsCustomerListError: '',
  getCoponsCustomerListMessage: '',
  getCoponsCustomerListArr: [],

  filters: {
    act: 'get_coupon_list',
    countSync: 1,
    countSync: 1,
    currentPage: 1,
    limit: 10,
    order: 0,
    shop_id: '',
    totalRecords: 0,
  },

  getCouponCustomerListFilter: {
    act: 'get_coupon_customer_list',
    countSync: 1,
    currentPage: 1,
    day_filter: '',
    discount_code_id: '',
    keyword: '',

    limit: 10,
    order: 0,
    shop_name: '',
    sort: 'cc.created_date',
    totalRecords: 0,
  },

  getProductListFilters: {
    act: 'get_product_list',
    shop_id: '',
  },

  getCouponInfoFilters: {
    act: 'get_coupon_info',
    shop_id: '',
    coupon_code_id: '',
  },
};

// Slice
const emailMarketingCouponSlice = createSlice({
  name: 'emailMarketingCoupon',
  initialState,
  reducers: {
    setCouponListFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setProductListFilter(state, action) {
      state.getProductListFilters = {
        ...state.getProductListFilters,
        ...action.payload,
      };
    },
    setCouponInfoFilter(state, action) {
      state.getCouponInfoFilters = {
        ...state.getCouponInfoFilters,
        ...action.payload,
      };
    },
    setCouponCustomerListFilter(state, action) {
      state.getCouponCustomerListFilter = {
        ...state.getCouponCustomerListFilter,
        ...action.payload,
      };
    },

    createCouponReset(state) {
      state.createCouponApiState = '';
      state.createCouponLoading = false;
      state.createCouponError = '';
      state.createCouponMessage = '';
      // state.createCouponData = {};
    },

    clearCouponCustomerList: (state) => {
      state.getCoponsCustomerListArr = [];
      state.getCouponCustomerListFilter.totalRecords = 0;
    },

    deleteCouponReset(state) {
      state.deleteCouponApiState = '';
      state.deleteCouponLoading = false;
      state.deleteCouponError = '';
      state.deleteCouponMessage = '';
    },

    addDiscountcodesReset(state) {
      state.addDiscountCodesApiState = '';
      state.addDiscountCodesLoading = false;
      state.addDiscountCodesError = '';
      state.addDiscountCodesMessage = '';
      state.addDiscountCodesData = {};
    },

    activateDeactivateCouponCodesReset(state) {
      state.activateDesctivateCouponCodesApiState = '';
      state.activateDesctivateCouponCodesLoading = false;
      state.activateDesctivateCouponCodesError = '';
      state.activateDesctivateCouponCodesMessage = '';
      state.activateDesctivateCouponCodesData = {};
    },

    clearEmailMarketingCoupons(state) {
      //   state.apiState = '';
      //   state.initCustomerApiState = '';
      //   state.audienceListApiState = '';
      //   state.segmentListApiState = '';
      //   state.templateListApiState = '';
      //   state.sendEmailApiState = '';
      //   state.templateDetailsApiState = '';
      //   state.aiShopSettingApiState = '';
      //   state.aiShopSettingError = '';
      //   state.campaignList = [];
      //   state.selected = null;
      //   state.error = null;
      //   state.checkActiveUserLimitSubscriptionApiState = '';
      //   state.checkActiveUserLimitSubscriptionLoading = false;
      //   state.checkActiveUserLimitSubscriptionerror = null;
      //   state.checkEmailSendLimitApiState = '';
      //   state.checkEmailSendLimitLoading = false;
      //   state.checkEmailSendLimiterror = null;
      //   state.aiShopSettingLoading = false;
      //   state.templateDetailsByIdLoading = false;
      //   state.sendEmailLoading = false;
      //   state.sendEmailError = null;
      //   state.getEmailCampaignApiState = '';
      //   state.createCampaignLists = {};
      //   state.emailCampaignData = {};
      //   state.filters = initialState.filters;
      //   state.createCampaignFilter = initialState.createCampaignFilter;
      //   state.audienceListFilter = initialState.audienceListFilter;
      //   state.segmentListFilter = initialState.segmentListFilter;
      //   state.templateListFilter = initialState.templateListFilter;
      //   state.templateDetailsByIdFilter = initialState.templateDetailsByIdFilter;
      //   state.getEmailCampaignFilter = initialState.getEmailCampaignFilter;
      //   state.aiShopSettingFilter = initialState.aiShopSettingFilter;
      //   state.checkActiveUserLimitSubscriptionFilters =
      //     initialState.checkActiveUserLimitSubscriptionApiState;
      //   state.checkEmailSendLimitData = initialState.checkEmailSendLimitData;
      //   state.templateDetailsById = initialState.templateDetailsById;
      //   state.tabCounts = {};
      //   state.tabCountsLoaded = false;
      //   state.createCampaignLists = {};
    },
  },

  extraReducers: (builder) => {
    builder

      // fetchCampaignList
      .addCase(fetchCouponList.pending, (state) => {
        state.couponListLoading = true;
        state.couponListError = null;
        state.couponListApiState = 'pending';
        state.couponListMessage = '';
      })
      .addCase(fetchCouponList.fulfilled, (state, action) => {
        state.couponListLoading = false;
        state.couponList = action?.payload?.rows || [];
        state.totalCount = action?.payload?.totalrecord;
        state.couponListApiState = action?.payload?.status || 'success';
        state.couponListMessage = action.payload.msg;
        state.couponListError = action.payload.error;
      })
      .addCase(fetchCouponList.rejected, (state, action) => {
        state.couponListLoading = false;
        state.couponListApiState = action?.payload?.status || 'error';
        state.couponListError =
          action.payload?.msg || 'Failed to fetch coupon list';
      })

      // fetchProductList
      .addCase(fetchProductList.pending, (state) => {
        state.productListLoading = true;
        state.productListError = null;
        state.productListApiState = 'pending';
        state.productListMessage = '';
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.productListLoading = false;
        state.productList = action?.payload || [];
        state.productListApiState = action?.payload?.status || 'success';
        state.productListMessage = action.payload.msg;
        state.productListError = action.payload.error;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.productListLoading = false;
        state.productListApiState = action?.payload?.status || 'error';
        state.productListError =
          action.payload?.msg || 'Failed to fetch product list';
      })

      // fetchProductCollectionsForDiscount
      .addCase(fetchProductCollectionsForDiscount.pending, (state) => {
        state.collectionListLoading = true;
        state.collectionListError = null;
        state.collectionListApiState = 'pending';
        state.collectionListMessage = '';
      })
      .addCase(
        fetchProductCollectionsForDiscount.fulfilled,
        (state, action) => {
          state.collectionListLoading = false;
          state.collectionList = action?.payload || [];
          state.collectionListApiState = action?.payload?.status || 'success';
          state.collectionListMessage = action.payload.msg;
          state.collectionListError = action.payload.error;
        }
      )
      .addCase(fetchProductCollectionsForDiscount.rejected, (state, action) => {
        state.collectionListLoading = false;
        state.collectionListApiState = action?.payload?.status || 'error';
        state.collectionListError =
          action.payload?.msg || 'Failed to fetch product list';
      })

      // createCouponApi
      .addCase(createCouponApi.pending, (state) => {
        state.createCouponLoading = true;
        state.createCouponError = null;
        state.createCouponApiState = 'pending';
        state.createCouponMessage = '';
      })
      .addCase(createCouponApi.fulfilled, (state, action) => {
        state.createCouponLoading = false;
        state.createCouponData = action?.payload || {};
        state.createCouponApiState = action?.payload?.status || 'success';
        state.createCouponMessage = action.payload.msg;
        state.createCouponError = action.payload.error;
      })
      .addCase(createCouponApi.rejected, (state, action) => {
        state.createCouponLoading = false;
        state.createCouponApiState = action?.payload?.status || 'error';
        state.createCouponError =
          action.payload?.msg || 'Failed to fetch product list';
      })

      // getCouponInfoApi
      .addCase(getCouponInfoApi.pending, (state) => {
        state.getCouponInfoLoading = true;
        state.getCouponInfoError = null;
        state.getCouponInfoApiState = 'pending';
        state.getCouponInfoMessage = '';
      })
      .addCase(getCouponInfoApi.fulfilled, (state, action) => {
        state.getCouponInfoLoading = false;
        state.getCouponInfoData = action?.payload || {};
        state.getCouponInfoApiState = action?.payload?.status || 'success';
        state.getCouponInfoMessage = action.payload.msg;
        state.getCouponInfoError = action.payload.error;
      })
      .addCase(getCouponInfoApi.rejected, (state, action) => {
        state.getCouponInfoLoading = false;
        state.getCouponInfoApiState = action?.payload?.status || 'error';
        state.getCouponInfoError =
          action.payload?.msg || 'Failed to fetch product list';
      })
      //get real time coupon code list
      .addCase(getReatTimeCouponCodes.pending, (state) => {
        state.getReatTimeCouponCodesLoading = true;
        state.getReatTimeCouponCodesError = null;
        state.getReatTimeCouponCodesApiState = 'pending';
        state.getReatTimeCouponCodesMessage = '';
      })
      .addCase(getReatTimeCouponCodes.fulfilled, (state, action) => {
        state.getReatTimeCouponCodesLoading = false;
        state.getReatTimeCouponCodesList = action?.payload?.real_codes || [];
        state.getReatTimeCouponCodesApiState =
          action?.payload?.status || 'success';
        state.getReatTimeCouponCodesMessage = action.payload.msg;
        state.getReatTimeCouponCodesError = action.payload.error;
      })
      .addCase(getReatTimeCouponCodes.rejected, (state, action) => {
        state.getReatTimeCouponCodesLoading = false;
        state.getReatTimeCouponCodesApiState =
          action?.payload?.status || 'error';
        state.getReatTimeCouponCodesError =
          action.payload?.msg || 'Failed to fetch product list';
        state.getReatTimeCouponCodesMessage =
          action.payload?.msg || 'Failed to fetch product list';
      })
      //get coupon custoemers list
      .addCase(getCouponCustomerList.pending, (state) => {
        state.getCoponsCustomerListLoading = true;
        state.getCoponsCustomerListError = null;
        state.getCoponsCustomerListApiState = 'pending';
        state.getCoponsCustomerListMessage = '';
      })
      .addCase(getCouponCustomerList.fulfilled, (state, action) => {
        state.getCoponsCustomerListLoading = false;
        const { list, totalrecord } = action.payload || {};
        state.getCoponsCustomerListArr = Array.isArray(list)
          ? list
          : list
            ? [list] // if it’s a single object, wrap it
            : []; // if it’s "", null, undefined

        state.getCouponCustomerListFilter.totalRecords = totalrecord || 0;
        state.getCoponsCustomerListApiState =
          action?.payload?.status || 'success';
        state.getCoponsCustomerListMessage = action?.payload?.msg || 'success';

        state.getCoponsCustomerListError = action?.payload?.error || 'error';
      })
      .addCase(getCouponCustomerList.rejected, (state, action) => {
        state.getCoponsCustomerListLoading = false;
        state.getCoponsCustomerListApiState =
          action?.payload?.status || 'error';
        state.getCoponsCustomerListError =
          action.payload?.msg || 'Failed to fetch product list';
        state.getCoponsCustomerListMessage =
          action.payload?.msg || 'Failed to fetch product list';
      })

      // deleteCouponApi
      .addCase(deleteCouponApi.pending, (state) => {
        state.deleteCouponLoading = true;
        state.deleteCouponError = null;
        state.deleteCouponApiState = 'pending';
        state.deleteCouponMessage = '';
      })
      .addCase(deleteCouponApi.fulfilled, (state, action) => {
        state.deleteCouponLoading = false;
        state.deleteCouponApiState = action?.payload?.status || 'success';
        state.couponList = state.couponList.filter(
          (item) => item.id !== action?.meta.arg.coupon_code_id
        );
        state.deleteCouponMessage = action.payload.msg;
        state.deleteCouponError = action.payload.error;
      })
      .addCase(deleteCouponApi.rejected, (state, action) => {
        state.deleteCouponLoading = false;
        state.deleteCouponApiState = action?.payload?.status || 'error';
        state.deleteCouponError =
          action.payload?.msg || 'Failed to fetch product list';
      })
      // add discount code api
      .addCase(addDiscountCodesApi.pending, (state) => {
        state.addDiscountCodesLoading = true;
        state.addDiscountCodesError = null;
        state.addDiscountCodesApiState = 'pending';
        state.addDiscountCodesMessage = '';
      })
      .addCase(addDiscountCodesApi.fulfilled, (state, action) => {
        state.addDiscountCodesLoading = false;
        state.addDiscountCodesApiState = action?.payload?.status || 'success';
        state.addDiscountCodesData = action.payload;
        state.addDiscountCodesMessage = action.payload.msg;
        state.addDiscountCodesError = action.payload.msg;
      })
      .addCase(addDiscountCodesApi.rejected, (state, action) => {
        state.addDiscountCodesLoading = false;
        state.addDiscountCodesApiState = action?.payload?.status || 'error';
        state.addDiscountCodesError = action.payload?.msg || 'error';
        state.addDiscountCodesMessage = action.payload?.msg || 'error';
      })

      // activateDesctivateCouponCodesApi
      .addCase(activateDesctivateCouponCodesApi.pending, (state) => {
        state.activateDesctivateCouponCodesLoading = true;
        state.activateDesctivateCouponCodesError = null;
        state.activateDesctivateCouponCodesApiState = 'pending';
        state.activateDesctivateCouponCodesMessage = '';
      })
      .addCase(activateDesctivateCouponCodesApi.fulfilled, (state, action) => {
        state.activateDesctivateCouponCodesLoading = false;
        state.activateDesctivateCouponCodesApiState =
          action?.payload?.status || 'success';

        // Get info from dispatched payload
        const { coupon_code_id, act } = action.meta.arg;
        const index = state.couponList.findIndex(
          (item) => item.id === coupon_code_id
        );

        if (index !== -1) {
          // Manually toggle is_temporary_deactivated and discountCodeStatus
          const isDeactivated = act === 'deactive_popup';

          state.couponList[index] = {
            ...state.couponList[index],
            is_temporary_deactivated: isDeactivated ? '1' : '0',
          };
        }
        state.activateDesctivateCouponCodesData = action.payload;
        state.activateDesctivateCouponCodesMessage = action.payload.msg;
        state.activateDesctivateCouponCodesError = action.payload.msg;
      })
      .addCase(activateDesctivateCouponCodesApi.rejected, (state, action) => {
        state.activateDesctivateCouponCodesLoading = false;
        state.activateDesctivateCouponCodesApiState =
          action?.payload?.status || 'error';
        state.activateDesctivateCouponCodesError =
          action.payload?.msg || 'error';
        state.activateDesctivateCouponCodesMessage =
          action.payload?.msg || 'error';
      });
  },
});

export const {
  setCouponListFilter,
  setCouponCustomerListFilter,
  clearCouponCustomerList,
  setProductListFilter,
  setProductListForDiscountFilter,
  createCouponReset,
  deleteCouponReset,
  setCouponInfoFilter,
  addDiscountcodesReset,
  activateDeactivateCouponCodesReset,
} = emailMarketingCouponSlice.actions;

export default emailMarketingCouponSlice.reducer;
