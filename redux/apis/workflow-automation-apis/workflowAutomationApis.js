import api from '@/utils/apiAxios'; // ✅ uses NEXT_PUBLIC_API_URL base
import workflowApi from "@/utils/workflowApiAxios";
import awsListApi from '@/utils/awsListService';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, decodeJWTToken } from "@/utils/authHelpers";

const BASE_URL = process.env.NEXT_PUBLIC_WORKFLOW_API_URL;

/**
 * Internal base thunk for all workflow API calls
 */
const fetchWorkflowApi = async ({ act, params = {} }, getState) => {
  const token = getToken();
  const decoded = decodeJWTToken?.() || {};
  const shopFromState = getState()?.jwtState?.login_auth?.shop_id;
  const shop_id = params.shop_id ?? decoded?.shop_id ?? shopFromState ?? "";

  let payload = { shop_id };

  switch (act) {
    case "statics":
      payload = {
        ...payload,
        statics: true,
        active_campaigns: true,
        ...params,
      };
      break;

    case "list":
  if (params.recent) {
    payload = {
      ...payload,
      currentPage: 1,
      limit: 5,
      order: 0,
      custom_match: { status: 1 },
      ...params,
    };
  } else {
    payload = {
      ...payload,
      countSync: params.countSync ?? 1,
      currentPage: params.currentPage ?? 1,
      limit: params.limit ?? 10,
      order: params.order ?? 0,
      status: params.status ?? "",
      trigger: params.trigger ?? "",
      keyword: params.keyword ?? "",
    };
  }
  break;

    case "remove":
      payload = {
        ...payload,
        workflow_id: params.workflow_id,
      };
      break;

    default:
      payload = { ...payload, ...params };
      break;
  }

const response = await awsListApi.post(`/workflow/${act}`, payload);

  return response?.data ?? {};
};

/**
 * Dashboard stats API
 */
export const getWorkflowDashboardStatsApi = createAsyncThunk(
  "workflowAutomation/getWorkflowDashboardStatsApi",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const result = await fetchWorkflowApi({ act: "statics", params }, getState);

      // Ensure only data is returned
      if (result?.status !== "success" || !result?.data) {
        throw new Error(result?.msg || "Failed to fetch dashboard stats");
      }

      return result.data;  // 🔥 This is the key change
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);


/**
 * Recent workflows API
 */
export const getRecentWorkflowsApi = createAsyncThunk(
  "workflowAutomation/getRecentWorkflowsApi",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const result = await fetchWorkflowApi(
        { act: "list", params: { ...params, recent: true } },  // ✅ added recent flag
        getState
      );
      return result?.data ?? [];
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

/**
 * Workflow list API
 */
export const getWorkflowsListApi = createAsyncThunk(
  "workflowsList/getWorkflowsListApi",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const result = await fetchWorkflowApi(
        { act: "list", params },   // ✅ no recent flag
        getState
      );
      return result ?? { data: [], totalrecord: 0 };
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);


/**
 * Delete workflow API
 */
export const deleteWorkflowApi = createAsyncThunk(
  "workflowsList/deleteWorkflowApi",
  async ({ shop_id, workflow_id }, { getState, rejectWithValue }) => {
    try {
      const result = await fetchWorkflowApi(
        { act: "remove", params: { shop_id, workflow_id } },
        getState
      );

      if (result?.status !== "success") {
        throw new Error(result?.msg || "Failed to delete workflow");
      }

      return result ?? {};
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);

// Fetch workflow template list
export const getWorkflowTemplateListApi = createAsyncThunk(
  "workflowTemplateAll/getWorkflowTemplateListApi",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/template", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Full Response:", response.data);
      
      // ✅ FIX: The API returns { status: 'success', rows: [...] }
      // Extract rows from response.data
      const templateData = response?.data?.rows || response?.data?.data || [];
      
      console.log("Extracted Templates:", templateData);
      console.log("Templates Count:", templateData.length);

      return templateData;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

export const copyWorkflowTemplateApi = createAsyncThunk(
  "workflowTemplate/copyTemplate",
  async ({ workflow_id }, { rejectWithValue }) => {
    try {
      const response = await workflowApi.post("/workflow/copyWorkflowTemplate", { workflow_id });
      if (response.status === 200 && response.data.status === "success") {
        return response.data;
      }
      throw new Error(response.data.msg || "Failed to copy workflow template");
            
    } catch (error) {
      return rejectWithValue(error.message || "Failed to copy template");
    }
  }
);

/**
 * Workflow Email Message List API
 * act: "get_message_template_list"
 */
export const getEmailMessageListApi = createAsyncThunk(
  "emailMessages/getEmailMessageListApi",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const token = getToken();
      const decoded = decodeJWTToken?.() || {};
      const shopFromState = getState()?.jwtState?.login_auth?.shop_id;

      const shop_id =
        params.shop_id ?? decoded?.shop_id ?? shopFromState ?? "";

      const payload = {
        act: "get_message_template_list",
        shop_id,
      };

      // uses /message endpoint
      const response = await api.post("/message", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // API returns: { status:'success', rows:[...] }
      if (response?.data?.status === "success") {
        const list = response?.data?.list || response?.data?.rows || response?.data?.data || [];

        return {
          data: list,
          totalrecord: list.length,
        };
      }

      throw new Error(response?.data?.msg || "Failed to fetch email messages");
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);


/**
 * Delete messages API
 */
export const deleteMessageApi = createAsyncThunk(
  "emailMessages/deleteMessageApi",
  async ({ shop_id, mid }, { getState, rejectWithValue }) => {
    try {
      const payload = { act: "delete_message", mid, shop_id };
      const response = await api.post("/message", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // backend returns { status: 1, msg: "Message has been deleted successfully." }
      if (response?.data?.status === 1 || response?.data?.status === "1") {
        // return mid so reducer or component knows which one removed
        return { mid };
      }

      return rejectWithValue(response?.data || "Failed to delete message");
    } catch (error) {
      return rejectWithValue(error?.response?.data ?? error.message);
    }
  }
);


