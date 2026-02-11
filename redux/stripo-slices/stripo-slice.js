import { createSlice } from '@reduxjs/toolkit';
import {
  getDecodedUrlApi,
  getMergeTagsApi,
  getMessageByIdApi,
  getTemplateByIdApi,
  getTemplateDataByCampaignIdApi,
  saveNewTemplateDataApi,
} from '../apis/stripo-api/stripoApi';
import { DEFAULT_TEMPLATE } from '@/modules/email-marketing/utils/default-template';

// Initial State
const initialState = {
  // 🔹 Auth Token
  getAuthTokenState: '',
  getAuthTokenLoading: false,
  getAuthTokenError: null,
  authToken: null,

  getDecodedUrlState: '',
  getDecodedUrlLoading: false,
  getDecodedUrlData: {},

  // 🔹 Merge Tags
  getMergeTagsState: '',
  getMergeTagsLoading: false,
  getMergeTagsError: null,
  mergeTags: [],
  socialNetworks: [],

  // 🔹 Template by ID
  getTemplateByIdState: '',
  getTemplateByIdLoading: false,
  getTemplateByIdError: null,
  templateData: {},

  // 🔹 Message by ID
  getMessageByIdState: '',
  getMessageByIdLoading: false,
  getMessageByIdError: null,
  messageData: {},

  // 🔹 Template by Campaign ID
  getTemplateDataByCampaignIdState: '',
  getTemplateDataByCampaignIdLoading: false,
  getTemplateDataByCampaignIdError: null,
  templateDataByCampaignId: {},

  currentTemplate: {
    html: DEFAULT_TEMPLATE?.html,
    css: DEFAULT_TEMPLATE?.css,
  },

  // save email template

  saveEmailTemplateState: '',
  saveEmailTemplateLoading: false,
  saveEmailTemplateError: null,
  saveEmailTemplateMessage: '',
  savedEmailTemplateData: {},
};

const stripoSlice = createSlice({
  name: 'stripo',
  initialState,
  reducers: {
    clearStripoState: () => initialState,

    resetTemplateState: (state) => {
      state.templateData = {};
      state.messageData = {};
      state.templateDataByCampaignId = {};
      state.currentTemplate = {
        html: DEFAULT_TEMPLATE.html,
        css: DEFAULT_TEMPLATE.css,
      };

      state.getTemplateByIdState = '';
      state.getMessageByIdState = '';
      state.getTemplateDataByCampaignIdState = '';
    },
    resetMergeTagsState: (state) => {
      state.mergeTags = [];
      state.socialNetworks = [];
      state.getMergeTagsState = '';
    },
    saveEmailTemplateReset: (state) => {
      state.savedEmailTemplateData = {};
      state.saveEmailTemplateState = '';
      state.saveEmailTemplateLoading = false;
      state.saveEmailTemplateError = null;
      state.saveEmailTemplateMessage = '';
    },

    setFallbackTemplate: (state, action) => {
      state.currentTemplate = {
        html: action.payload?.html || DEFAULT_TEMPLATE.html,
        css: action.payload?.css || DEFAULT_TEMPLATE.css,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // ===================== 🔹 Merge Tags =====================
      .addCase(getMergeTagsApi.pending, (state) => {
        state.getMergeTagsState = 'pending';
        state.getMergeTagsLoading = true;
        state.getMergeTagsError = null;
      })
      .addCase(getMergeTagsApi.fulfilled, (state, action) => {
        state.getMergeTagsState = 'success';
        state.getMergeTagsLoading = false;
        if (action.payload) {
          state.mergeTags = action.payload.mergeTags || [];
          state.socialNetworks = action.payload.socialNetworks || [];
        } else {
          state.mergeTags = [];
          state.socialNetworks = [];
        }
      })
      .addCase(getMergeTagsApi.rejected, (state, action) => {
        state.getMergeTagsState = 'error';
        state.getMergeTagsLoading = false;
        state.getMergeTagsError =
          action.payload?.message || 'Failed to fetch merge tags';
      })

      // ===================== 🔹 Merge Tags =====================
      .addCase(getDecodedUrlApi.pending, (state) => {
        state.getDecodedUrlState = 'pending';
        state.getDecodedUrlLoading = true;
        state.getDecodedUrlError = null;
      })
      .addCase(getDecodedUrlApi.fulfilled, (state, action) => {
        state.getDecodedUrlState = 'success';
        state.getDecodedUrlLoading = false;
        state.getDecodedUrlData = action.payload || {};
      })
      .addCase(getDecodedUrlApi.rejected, (state, action) => {
        state.getDecodedUrlState = 'error';
        state.getDecodedUrlLoading = false;
        state.getDecodedUrlError =
          action.payload?.message || 'Failed to fetch decoded URL';
      })

      // ===================== 🔹 Template by ID =====================
      .addCase(getTemplateByIdApi.pending, (state) => {
        state.getTemplateByIdState = 'pending';
        state.getTemplateByIdLoading = true;
        state.getTemplateByIdError = null;
      })
      .addCase(getTemplateByIdApi.fulfilled, (state, action) => {
        state.getTemplateByIdState = 'success';
        state.getTemplateByIdLoading = false;
        state.templateData = action.payload || {};

        const r =
          action.payload?.templateRow ||
          action.payload?.templateData ||
          action.payload; // fallback directly

        state.currentTemplate = {
          html: r?.template_html || DEFAULT_TEMPLATE.html,
          css: r?.template_css || DEFAULT_TEMPLATE.css,
        };
      })
      .addCase(getTemplateByIdApi.rejected, (state, action) => {
        state.getTemplateByIdState = 'error';
        state.getTemplateByIdLoading = false;
        state.getTemplateByIdError =
          action.payload?.message || 'Failed to fetch template data';
      })

      // ===================== 🔹 Message by ID =====================
      .addCase(getMessageByIdApi.pending, (state) => {
        state.getMessageByIdState = 'pending';
        state.getMessageByIdLoading = true;
        state.getMessageByIdError = null;
      })
      .addCase(getMessageByIdApi.fulfilled, (state, action) => {
        state.getMessageByIdState = 'success';
        state.getMessageByIdLoading = false;
        // state.messageData = action?.payload?.templateRow || {};
            state.templateData = action?.payload?.templateData || {};
console.log(action.payload?.templateData,'templateData');

        const r =
          action.payload?.templateRow ||
          action.payload?.templateData ||
          action.payload; 
// console.log(r,'wwwwwwwwwwwwwwwwwwwwwwwwwwlllll');

        state.currentTemplate = {
          html: action.payload?.templateData?.template_html || DEFAULT_TEMPLATE.html,
          css: action.payload?.templateData?.template_css || DEFAULT_TEMPLATE.css,
          title: action.payload?.templateData?.campaignName || '',
          subject: action.payload?.templateData?.EmailNotificationfromSubject || '',
        };
      })
      .addCase(getMessageByIdApi.rejected, (state, action) => {
        state.getMessageByIdState = 'error';
        state.getMessageByIdLoading = false;
        state.getMessageByIdError =
          action.payload?.message || 'Failed to fetch message data';
      })

      // ===================== 🔹 Template by Campaign ID =====================
      .addCase(getTemplateDataByCampaignIdApi.pending, (state) => {
        state.getTemplateDataByCampaignIdState = 'pending';
        state.getTemplateDataByCampaignIdLoading = true;
        state.getTemplateDataByCampaignIdError = null;
      })
      .addCase(getTemplateDataByCampaignIdApi.fulfilled, (state, action) => {
        state.getTemplateDataByCampaignIdState = 'success';
        state.getTemplateDataByCampaignIdLoading = false;
        state.templateDataByCampaignId = action.payload || {};
        // 🔹 Normalize currentTemplate
        const t = action.payload?.templateData;

        if (t) {
          state.currentTemplate = {
            html: t.html || DEFAULT_TEMPLATE.html,
            css: t.css || t.template_css || DEFAULT_TEMPLATE.css,
          };
        }
      })
      .addCase(getTemplateDataByCampaignIdApi.rejected, (state, action) => {
        state.getTemplateDataByCampaignIdState = 'error';
        state.getTemplateDataByCampaignIdLoading = false;
        state.getTemplateDataByCampaignIdError =
          action.payload?.message || 'Failed to fetch campaign data';
      })

      //save template data
      .addCase(saveNewTemplateDataApi.pending, (state) => {
        state.saveEmailTemplateState = 'pending';
        state.saveEmailTemplateLoading = true;
        state.saveEmailTemplateError = null;
      })
      .addCase(saveNewTemplateDataApi.fulfilled, (state, action) => {
        state.saveEmailTemplateState = 'success';
        state.saveEmailTemplateLoading = false;
        state.saveEmailTemplateMessage =
          action.payload?.msg || 'Template saved successfully';
        state.savedEmailTemplateData = action.payload || {};
      })
      .addCase(saveNewTemplateDataApi.rejected, (state, action) => {
        state.saveEmailTemplateState = 'error';
        state.saveEmailTemplateLoading = false;
        state.saveEmailTemplateError =
          action.payload?.msg || 'Failed to save email template';
      });
  },
});

export const {
  clearStripoState,
  resetTemplateState,
  resetMergeTagsState,
  saveEmailTemplateReset,
  setFallbackTemplate,
} = stripoSlice.actions;
export default stripoSlice.reducer;
