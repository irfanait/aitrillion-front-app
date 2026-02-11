import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Internal base thunk
const fetchEmailMarketingCampaignList = async (
  { act, params = {} },
  getState
) => {
  const token = getToken();
  const {
    filters,
    createCampaignFilter,
    audienceListFilter,
    segmentListFilter,
    checkEmailSendLimitFilter,
    audienceCountFilter,
    campaignDetailsByIdFilter,
    getCampaignDetailsFilter,
    getOpenMessageDetailsFilter,
    getClickedMessageDetailsFilter,
    getAudienceMessageDetailsFilter,
    getOrdersMessageDetailsFilter,
    getLinkActivityMessageDetailsFilter,
    getCampaignDetailsReportFilter,
    exportCampaignCsvDataFilter,
  } = getState().emailMarketingCampaignState;

  let queryParams = new URLSearchParams();

  switch (act) {
    case 'load_message_list':
      queryParams = new URLSearchParams({
        ...filters,
        act,
      });
      break;

    case 'load_customer_init_data':
      queryParams = new URLSearchParams({
        ...createCampaignFilter,
        act,
      });
      break;

    case 'mrkt_list':
      queryParams = new URLSearchParams({
        ...audienceListFilter,
        act,
      });
      break;

    case 'segment_list':
      queryParams = new URLSearchParams({
        ...segmentListFilter,
        act,
      });
      break;

    case 'check_email_send_limit':
      queryParams = new URLSearchParams({
        ...checkEmailSendLimitFilter,
        act,
      });
      break;

    case 'get_customers_count':
      queryParams = new URLSearchParams({
        ...audienceCountFilter,
        act,
      });
      break;

    case 'decode_url_data':
      queryParams = new URLSearchParams({
        ...campaignDetailsByIdFilter,
        act,
      });
      break;

    case 'message_detail':
      queryParams = new URLSearchParams({
        ...getCampaignDetailsFilter,
        act,
      });
      break;

    case 'open_message_detail':
      queryParams = new URLSearchParams({
        ...getOpenMessageDetailsFilter,
        act,
      });
      break;

    case 'click_message_detail':
      queryParams = new URLSearchParams({
        ...getClickedMessageDetailsFilter,
        act,
      });
      break;

    case 'audience_message_detail':
      queryParams = new URLSearchParams({
        ...getAudienceMessageDetailsFilter,
        act,
      });
      break;

    case 'order_message_detail':
      queryParams = new URLSearchParams({
        ...getOrdersMessageDetailsFilter,
        act,
      });
      break;

    case 'click_url_list':
      queryParams = new URLSearchParams({
        ...getLinkActivityMessageDetailsFilter,
        act,
      });
      break;

    case 'get_email_report':
      queryParams = new URLSearchParams({
        ...getCampaignDetailsReportFilter,
        act,
      });
      break;
    case 'export_csv_message_list':
      queryParams = new URLSearchParams({
        ...exportCampaignCsvDataFilter,
        act,
      });
      break;

    default:
      queryParams = new URLSearchParams({ act });
      break;
  }

  const res = await api.get(`/message?${queryParams}`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    withCredentials: true,
  });

  return res.data;
};

export const fetchCampaignList = createAsyncThunk(
  'campaigns/fetchCampaignList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'load_message_list' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCampaignDetailsById = createAsyncThunk(
  'campaigns/fetchCampaignDetailsById',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'decode_url_data' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchInitCustomerData = createAsyncThunk(
  'campaigns/fetchInitCustomerData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'load_customer_init_data' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAudienceList = createAsyncThunk(
  'campaigns/fetchAudienceList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'mrkt_list' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSegmentList = createAsyncThunk(
  'campaigns/fetchSegmentList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'segment_list' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkEmailSendLimit = createAsyncThunk(
  'campaigns/checkEmailSendLimit',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'check_email_send_limit' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCampaignDetailsApi = createAsyncThunk(
  'campaigns/getCampaignDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'message_detail' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getOpenedmessageListApi = createAsyncThunk(
  'campaigns/getOpenedmessageListApi',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'open_message_detail' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getClickedMessageList = createAsyncThunk(
  'campaigns/getClickedMessageList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'click_message_detail' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAudienceMessageList = createAsyncThunk(
  'campaigns/getAudienceMessageList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'audience_message_detail' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getOrderMessageList = createAsyncThunk(
  'campaigns/getOrderMessageList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'order_message_detail' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getLinkActivityMessageList = createAsyncThunk(
  'campaigns/getLinkActivityMessageList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'click_url_list' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCampaignDetailsReport = createAsyncThunk(
  'campaigns/getCampaignDetailsReport',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'get_email_report' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const ExportCasmpaignCsvData = createAsyncThunk(
  'campaigns/ExportCasmpaignCsvData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await fetchEmailMarketingCampaignList(
        { act: 'export_csv_message_list' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const sendTestEmailApi = createAsyncThunk(
  'campaign/sendTestEmailApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/email`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkActiveUserLimitSubscription = createAsyncThunk(
  'campaign/checkActiveUserLimitSubscription',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const rawParams =
        store.emailMarketingCampaignState
          .checkActiveUserLimitSubscriptionFilters;

      const cleanedParams = {};
      for (const key in rawParams) {
        const value = rawParams[key];
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanedParams[key] = JSON.stringify(value);
          }
        } else if (value !== undefined && value !== null) {
          cleanedParams[key] = value;
        }
      }

      const queryParams = new URLSearchParams(cleanedParams).toString();

      const response = await api.get(`/subscription?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTemplateList = createAsyncThunk(
  'campaign/fetchTemplateList',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const payload = store.emailMarketingCampaignState.templateListFilter;

      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/message`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const chooseAsWinnerApi = createAsyncThunk(
  'campaign/chooseAsWinnerApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/message`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTemplateDetailsById = createAsyncThunk(
  'campaign/getTemplateDetailsById',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const payload =
        store.emailMarketingCampaignState.templateDetailsByIdFilter;

      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/message`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTemplatePreviewData = createAsyncThunk(
  'campaign/getTemplatePreviewData',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const params =
        store.emailMarketingCampaignState.templatePreviewDataByIdFilter;

      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/template?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch data for create campaignForm

export const getEmailCampaginApi = createAsyncThunk(
  'campaign/getEmailCampaginApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const params = store.emailMarketingCampaignState.getEmailCampaignFilter;

      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/email?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAbGetDecodedDataApi = createAsyncThunk(
  'campaign/createAbGetDecodedDataApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const params =
        store.emailMarketingCampaignState.createAbDecodedDataFilter;

      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/email?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch customer count for create campaignForm
export const fetchAudienceCount = createAsyncThunk(
  'campaign/fetchAudienceCount',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const rawParams = store.getAudienceCountState.audienceCountFilter;

      const cleanedParams = {};
      for (const key in rawParams) {
        const value = rawParams[key];
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanedParams[key] = JSON.stringify(value);
          }
        } else {
          cleanedParams[key] = value;
        }
      }

      const queryParams = new URLSearchParams(cleanedParams).toString();

      const response = await api.get(`/message?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// send Email API

export const sendEmailCampaignApi = createAsyncThunk(
  'campaign/sendEmailCampaignApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/email`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCampaignApi = createAsyncThunk(
  'campaign/deleteCampaignApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/email`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAiShopSetting = createAsyncThunk(
  'campaign/getAiShopSetting',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const params = store.emailMarketingCampaignState.aiShopSettingFilter;

      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/index?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const endTrialApi = createAsyncThunk(
  'campaign/endTrialApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/subscription`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// =============================== template API's =====================================

export const getTemplateListApi = createAsyncThunk(
  'template/getTemplateListApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const payload = store.emailMarketingTemplateState.initialFilters;

      const response = await api.post(`/template`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const copyTemplateApi = createAsyncThunk(
  'template/copyTemplateApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const params = store.emailMarketingTemplateState.copyTemplateFilters;

      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/etemplate?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getEmailDashboardStatsApi = createAsyncThunk(
  'template/emailDashboardStatsApi',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/emailreport?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getEmailDashboardCampaignListApi = createAsyncThunk(
  'template/emailDashboardCampaignListApi',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/emailreport?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const copyWelcomeWorkflowApi = createAsyncThunk(
  'template/CopyWelcomeWorkflowApi',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      // const store = getState();
      //   const payload = store.emailMarketingCampaignState.templateListFilter;

      const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/message?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTemplateApi = createAsyncThunk(
  'template/deleteTemplateApi',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/etemplate?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===================== coupon/discounts API ===================================

const coupons = async ({ act, params = {} }, getState) => {
  const token = getToken();
  const { filters, getProductListFilters, getCouponInfoFilters } =
    getState().emailMarketingCouponState;

  let queryParams = new URLSearchParams();

  switch (act) {
    case 'get_coupon_list':
      queryParams = new URLSearchParams({
        ...filters,
        act,
      });
      break;

    case 'get_product_list':
      queryParams = new URLSearchParams({
        ...getProductListFilters,
        act,
      });
      break;

    case 'get_coupon_info':
      queryParams = new URLSearchParams({
        ...getCouponInfoFilters,
        act,
      });
      break;

    default:
      queryParams = new URLSearchParams({ act });
      break;
  }

  const res = await api.get(`/coupons?${queryParams}`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    withCredentials: true,
  });

  return res.data;
};

export const fetchCouponList = createAsyncThunk(
  'coupons/fetchCouponList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await coupons({ act: 'get_coupon_list' }, getState);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProductList = createAsyncThunk(
  'coupons/fetchProductList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await coupons({ act: 'get_product_list' }, getState);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCouponInfoApi = createAsyncThunk(
  'coupons/getCouponInfoApi',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await coupons({ act: 'get_coupon_info' }, getState);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getReatTimeCouponCodes = createAsyncThunk(
  'coupons/getReatTimeCouponCodes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await coupons(
        { act: 'get_realtime_coupon_codes' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCouponCustomerList = createAsyncThunk(
  'coupons/getCouponCustomerList',
  async (params, { _, rejectWithValue }) => {
    if (!params?.shop_name || params?.shop_name === '') {
      console.warn('Skipping API call — missing shop_name');
      return null; // skip
    }

    const token = getToken();

    const queryParams = new URLSearchParams(params).toString();
    try {
      const response = await api.get(`/coupons?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductCollectionsForDiscount = createAsyncThunk(
  'coupons/fetchProductCollectionsForDiscount',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/product?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCouponApi = createAsyncThunk(
  'coupon/createCouponApi',
  async ({ payload, query }, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/coupons`, payload, {
        params: query, // <-- this sends the query string
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addDiscountCodesApi = createAsyncThunk(
  'coupon/addDiscountCodes',
  async ({ payload, query }, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/coupons`, payload, {
        params: query, // <-- this sends the query string
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const activateDesctivateCouponCodesApi = createAsyncThunk(
  'coupon/activateDesctivateCouponCodesApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/coupons`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCouponApi = createAsyncThunk(
  'coupon/deleteCouponApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/coupons`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// =====================Settings API ===============================

export const fetchEmailSettings = createAsyncThunk(
  'settings/fetchEmailSettings',
  async (params, { rejectWithValue }) => {
    const token = getToken();
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/suppressiondomain?${queryString}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateEmailSettingApi = createAsyncThunk(
  'settings/updateEmailSettingApi',
  async (params, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post('/suppressiondomain', params, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      // ✅ Use `params` instead of undefined `payload`
      const updatedKey = Object.keys(params).find(
        (k) => k !== 'act' && k !== 'shop_id'
      );
      const updatedValue = params[updatedKey];

      return {
        ...response.data,
        updatedKey,
        updatedValue,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getDomainListApi = createAsyncThunk(
  'settings/getDomainListApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    const store = getState();
    const filters = store.emailMarketingSettingsState.domainListFilters;

    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await api.get(`/suppressiondomain?${queryString}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addDomainApi = createAsyncThunk(
  'settings/addDomainApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/suppressiondomain`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDomainApi = createAsyncThunk(
  'settings/deleteDomainApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/suppressiondomain`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===========================DKIM API's=====================================

export const getDkimStatusApi = createAsyncThunk(
  'settings/getDkimStatusApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/Startguide?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const usageRestrictionApi = createAsyncThunk(
  'settings/usageRestrictionApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/usagerestriction?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const startGuideApi = createAsyncThunk(
  'settings/startGuideApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/startguide`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const confirmAsDoneDkimApi = createAsyncThunk(
  'settings/confirmAsDoneDkimApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/startguide`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateDomainInstructionApi = createAsyncThunk(
  'settings/validateDomainInstructionApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/Startguide?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//--------------------------------

export const emailMarketingLanguageApi = createAsyncThunk(
  'settings/validateDomainInstructionApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/Startguide?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const languageStartGuideApi = createAsyncThunk(
  'settings/startGuideApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(`/startguide`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// ------- shubham
export const getEmailLanguageSettingApi = createAsyncThunk(
  'settings/getEmailLanguageSettingApi',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/index?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ------- update email language setting api

export const updateEmailLanguageSettings = createAsyncThunk(
  'campaign/updateEmailLanguageSettings',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/index`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateModuleVersionApi = createAsyncThunk(
  'campaign/updateModuleVersionApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/startguide`, payload, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
