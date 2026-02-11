import api from '@/utils/apiAxios';
import { getToken } from '@/utils/authHelpers';
import awsListApi from '@/utils/awsListService';
import cndServiceApi from '@/utils/cnd-service-axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// export const getCustomersList = createAsyncThunk(
//   'customers/getCustomersList',
//   async (_, { getState, rejectWithValue }) => {
//     const token = getToken();
//     try {
//       const store = getState();
//       const filters = store.allCustomersState.filters;
//       // const queryParams = new URLSearchParams(params).toString();
//       const response = await api.post(`/customers`, filters, {
//         headers: {
//           Accept: 'application/json, text/plain, */*',
//           'Content-Type': 'application/json',
//           Authorization: token,
//         },
//         withCredentials: true,
//       });

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const getCustomersList = createAsyncThunk(
  'customers/getCustomersList',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();

    try {
      const store = getState();
      const rawFilters = store.allCustomersState.filters;
      //  REMOVE UI-ONLY KEYS HERE
      const { refreshKey, isFirstRequest, ...restFilters } = rawFilters;

      // ✅ NORMALIZE PAYLOAD HERE
      const filters = {
        ...restFilters,
        masterFilter:
          rawFilters.isFirstRequest === true
            ? '[]'
            : Array.isArray(rawFilters.masterFilter)
              ? rawFilters.masterFilter
              : rawFilters.masterFilter || [],
      };

      const response = await api.post(`/customers`, filters, {
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

export const updateCustomerBulkStatusApi = createAsyncThunk(
  'customers/updateCustomerBulkStatusApi',
  async (payload, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(
        `/customers?act=blk_chng_cst_status`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// customersApi.js
export const processBulkCustomerStatusApi = createAsyncThunk(
  'customers/processBulkCustomerStatus',
  async (payload, { rejectWithValue }) => {
    const token = getToken();
    try {
      const res = await api.post(
        '/customers?act=blk_chng_cst_status_process_data',
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

//get customer init data

const getCustomerInItData = async ({ act, params = {} }, getState) => {
  const token = getToken();
  const { getCustomerInitDataFilters, filters, updateGridFilters } =
    getState().allCustomersState;

  let queryParams = new URLSearchParams();

  switch (act) {
    case 'load_customer_init_data':
      queryParams = new URLSearchParams({
        ...getCustomerInitDataFilters,
        act,
      });
      break;

    case 'updateGridFields':
      const { id, checked_status } = updateGridFilters || {};
      if (!id || checked_status === undefined) {
        throw new Error('updateGridFields requires id and checked_status');
      }

      // 🔑 Build exactly what BE expects
      const updatedGridFieldsJson = JSON.stringify({
        id: String(id),
        checked_status: Number(checked_status),
      });

      queryParams = new URLSearchParams({
        act, // "updateGridFields"
        updatedGridFieldsJson, // '{"id":"26","checked_status":0}'
      });
      break;

    default:
      queryParams = new URLSearchParams({ act });
      break;
  }

  const res = await api.get(`/customers?${queryParams}`, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    withCredentials: true,
  });

  return res.data;
};

export const getCustomerInItDataApi = createAsyncThunk(
  'customers/getCustomerInItDataApi',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await getCustomerInItData(
        { act: 'load_customer_init_data' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateColumnFields = createAsyncThunk(
  'customers/updateColumnFields',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await getCustomerInItData(
        { act: 'updateGridFields' },
        getState
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteSegmentApi = createAsyncThunk(
  'customers/deleteSegmentApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/customers`, payload, {
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

//campaign list API

export const getCampaignList = createAsyncThunk(
  'template/getCampaignList',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

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
export const getCustomerCustomFieldsApi = createAsyncThunk(
  'customer/getCustomerCustomFieldsApi',
  async (params, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customfields?${queryParams}`, {
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

export const getTierList = createAsyncThunk(
  'template/getTierList',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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
export const getGroupList = createAsyncThunk(
  'template/getGroupList',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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
export const getMemberList = createAsyncThunk(
  'template/getMemberList',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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

export const getSmartPopupList = createAsyncThunk(
  'template/getSmartPopupList',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/signupforms?${queryParams}`, {
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

//----------------------------**----------------------------------//
//segment Api's

export const getSegmentListApi = createAsyncThunk(
  'customers/getSegmentListApi',
  async (_, { getState, rejectWithValue }) => {
    const token = getToken();
    try {
      const store = getState();
      const filters = store.segmentState.filters;
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/customers?${queryParams}`, {
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

export const exportCustomerFromSegmentApi = createAsyncThunk(
  'customers/exportCustomerFromSegmentApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/customers`, payload, {
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

export const saveSegmentApi = createAsyncThunk(
  'customers/saveSegmentApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/customers`, payload, {
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

// ===============customer details api==================//

export const getCustomerDetailsApi = createAsyncThunk(
  'customers/getCustomerDetailsApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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

export const getCustomerDetailsCustomFieldsApi = createAsyncThunk(
  'customers/getCustomerDetailsCustomFieldsApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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

export const updateCustomFieldApi = createAsyncThunk(
  'customers/updateCustomFieldApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const rawJsonString = JSON.stringify(payload);

      const response = await api.post(
        `/customfields`,
        rawJsonString, // IMPORTANT: Send raw string
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const customerDetailsEmailUpdateApi = createAsyncThunk(
  'customers/customerDetailsEmailUpdateApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(
        `/email?act=saveUnsubscibedInfo`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCustomerStatusApi = createAsyncThunk(
  'customers/updateCustomerStatusApi',
  async ({ customer_id, status }, { rejectWithValue }) => {
    const token = getToken();

    const payload = {
      act: 'update_customer_status',
      customer_id,
      status, // true / false
    };
    const queryParams = new URLSearchParams(payload).toString();

    try {
      const response = await api.get(`/customers?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCustomerDetailsTimelineApi = createAsyncThunk(
  'customers/getCustomerDetailsTimelineApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();

    const queryParams = new URLSearchParams(params).toString();

    try {
      const response = await api.get(`/customers?${queryParams}`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: token,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const customerDetailsOrdersApi = createAsyncThunk(
  'customers/customerDetailsOrdersApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      // const queryParams = new URLSearchParams(params).toString();
      const response = await api.post(`/customers`, payload, {
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
export const customerDetailsOrdersDetailsApi = createAsyncThunk(
  'customers/customerDetailsOrdersDetailsApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();
      const response = await api.get(`/customers?${queryParams}`, {
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

export const customerDetailsMembershipListApi = createAsyncThunk(
  'customers/customerDetailsMembershipListApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();
      const response = await api.get(`/membership?${queryParams}`, {
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

export const customerDetailsMembershipPlanListApi = createAsyncThunk(
  'customers/customerDetailsMembershipPlanListApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();
      const response = await api.get(`/membership?${queryParams}`, {
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

export const customerDetailsAddMembershipPlanApi = createAsyncThunk(
  'customers/customerDetailsAddMembershipPlanApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/membership`, payload, {
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

export const customerDetailsgetListsApi = createAsyncThunk(
  'customers/customerDetailsgetListsApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.get(`/customers?${queryParams}`, payload, {
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
export const customerDetailsaddToList = createAsyncThunk(
  'customers/customerDetailsaddToList',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.get(
        `/customers/ListForAddList?${queryParams}`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCustomerDetailsaddToList = createAsyncThunk(
  'customers/createCustomerDetailsaddToList',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const { act, customer_id, id } = payload;

      // Build query params
      const params = new URLSearchParams();

      params.append('act', act);
      params.append('customer_id', customer_id);

      // Repeat id params for each selected list ID
      id.forEach((id) => {
        params.append('id', id);
      });

      const response = await api.post(
        `/customers?${params.toString()}`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const customerDetailsRemoveListApi = createAsyncThunk(
  'customers/customerDetailsRemoveListApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/customers`, payload, {
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

export const customerDetailsAffiliateListApi = createAsyncThunk(
  'customers/customerDetailsAffiliateListApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.get(`/affiliate?${queryParams}`, payload, {
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

export const customerDetailsGetAffiliateGroupListApi = createAsyncThunk(
  'customers/customerDetailsGetAffiliateGroupListApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.get(`/affiliate?${queryParams}`, payload, {
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

export const customerDetailsUpdateAffiliateGroupApi = createAsyncThunk(
  'customers/customerDetailsUpdateAffiliateGroupApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.post(`/customers?${queryParams}`, payload, {
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

export const customerDetailsAssignGroupApi = createAsyncThunk(
  'customers/customerDetailsAssignGroupApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.post(`/affiliate?${queryParams}`, payload, {
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

export const customerDetailsExcludeFromAutoAssignedGroupApi = createAsyncThunk(
  'customers/customerDetailsExcludeFromAutoAssignedGroupApi',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.post(`/customers?${queryParams}`, payload, {
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

export const customerDetailsRemoveGroupCustomer = createAsyncThunk(
  'customers/customerDetailsRemoveGroupCustomer',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.post(
        `/affiliate/group?${queryParams}`,
        payload,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getVisitedProductList = createAsyncThunk(
  'customers/getVisitedProductList',
  async (payload, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(payload).toString();

      const response = await api.get(`/customers?${queryParams}`, {
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

// ==================List API's=======================//

export const getListApi = createAsyncThunk(
  'list/getListApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/list/list', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createListApi = createAsyncThunk(
  'list/createListApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/list/save', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteListApi = createAsyncThunk(
  'list/deleteListApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/list/remove', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ==================Custom Fields API's =======================//

export const getCustomFieldReport = createAsyncThunk(
  'template/getCustomFieldReport',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customfields?${queryParams}`, {
        headers: {
          // Accept: 'application/json, text/plain, */*',
          // 'Content-Type': 'application/json',
          Authorization: token,
        },
        // withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkShopCustomFields = createAsyncThunk(
  'customers/checkShopCustomFields',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customfields?${queryParams}`, {
        headers: {
          Authorization: token,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCustomFieldApi = createAsyncThunk(
  'customers/createCustomField',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const response = await api.post(`/customfields`, params, {
        headers: {
          // Accept: 'application/json, text/plain, */*',
          // 'Content-Type': 'application/json',
          Authorization: token,
        },
        // withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCustomFieldApi = createAsyncThunk(
  'list/deleteListApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/customField/remove', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getCustomFieldOptionsApi = createAsyncThunk(
  'customers/getCustomFieldOptionsApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customfields?${queryParams}`, {
        headers: {
          // Accept: 'application/json, text/plain, */*',
          // 'Content-Type': 'application/json',
          Authorization: token,
        },
        // withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFieldOptionApi = createAsyncThunk(
  'list/deleteFieldOptionApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post('/customfields', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createCustomFieldOptionApi = createAsyncThunk(
  'customers/createCustomFieldOptionApi',
  async (params, { _, rejectWithValue }) => {
    const token = getToken();
    try {
      const queryParams = new URLSearchParams(params).toString();

      const response = await api.get(`/customfields?${queryParams}`, {
        headers: {
          // Accept: 'application/json, text/plain, */*',
          // 'Content-Type': 'application/json',
          Authorization: token,
        },
        // withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//========================import Api's=======================================//

export const getImportCsvList = createAsyncThunk(
  'list/getImportCsvList',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/list/listcsv', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadCsvApi = createAsyncThunk(
  'list/uploadCsvApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/contact/uploadcsv', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCsvMappingApi = createAsyncThunk(
  'csv/updateCsvMappingApi',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/contact/updatecsv', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateListImportStep3Api = createAsyncThunk(
  'csv/updateListImportStep3Api',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/contact/updatecsv', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateListImportStep4Api = createAsyncThunk(
  'csv/updateListImportStep4Api',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await awsListApi.post('/contact/updatecsv', payload, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAiShopSettingApi = createAsyncThunk(
  'customers/getAiShopSettingApi',
  async (params, { _, rejectWithValue }) => {
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

export const contactSupportApi = createAsyncThunk(
  'contact/support',
  async (payload, { rejectWithValue }) => {
    const token = getToken();

    try {
      const response = await api.post(
        '/contactus?act=billing_contact_us&is_save=1',
        payload,
        {
          headers: {
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
