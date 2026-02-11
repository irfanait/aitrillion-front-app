// redux/slices/emailMarketingSettingsSlice.js

import {
  addDomainApi,
  confirmAsDoneDkimApi,
  deleteDomainApi,
  fetchEmailSettings,
  getDkimStatusApi,
  getDomainListApi,
  getEmailLanguageSettingApi,
  startGuideApi,
  updateEmailLanguageSettings,
  updateEmailSettingApi,
  updateModuleVersionApi,
  usageRestrictionApi,
  validateDomainInstructionApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: {
    accept_email_marketing: '0',
    email_marketing_shopify_consent: '0',
    is_open_bot_filter_enable: '0',
  },
  fetchEmailSettingsApiState: '',
  fetchEmailSettingsLoading: false,
  fetchEmailSettingsError: '',
  fetchEmailSettingsMessage: '',

  updateEmailSettingssApiState: '',
  updateEmailSettingssLoading: false,
  updateEmailSettingssError: '',
  updateEmailSettingssMessage: '',

  getDomainListApiState: '',
  getDomainListLoading: false,
  getDomainListError: '',
  getDomainListMessage: '',
  domainList: [],

  addDomainApiState: '',
  addDomainLoading: false,
  addDomainError: '',
  addDomainMessage: '',
  addDomainData: {},

  deleteApiState: '',
  deleteLoading: false,
  deleteError: '',
  deleteMessage: '',
  deleteData: {},

  getDkimStatusApiState: '',
  getDkimStatusLoading: false,
  getDkimStatusError: '',
  getDkimStatusMessage: '',
  getDkimStatusData: {},

  usageRestirictionApiState: '',
  usageRestirictionLoading: false,
  usageRestirictionError: '',
  usageRestirictionMessage: '',
  usageRestirictionData: {},

  startGuideApiState: '',
  startGuideLoading: false,
  startGuideError: '',
  startGuideMessage: '',
  startGuideData: {},

  validateDomainInstructionApiState: '',
  validateDomainInstructionLoading: false,
  validateDomainInstructionError: '',
  validateDomainInstructionMessage: '',
  validateDomainInstructionData: {},

  confirmAsDoneDkimApiState: '',
  confirmAsDoneDkimLoading: false,
  confirmAsDoneDkimError: '',
  confirmAsDoneDkimMessage: '',
  confirmAsDoneDkimData: {},

  getEmailLanguageSettingApiState: '',
  getEmailLanguageSettingLoading: false,
  getEmailLanguageSettingError: '',
  getEmailLanguageSettingMessage: '',
  getEmailLanguageSettingData: {},

  updateEmailSettingApiState: '',
  updateEmailSettingLoading: false,
  updateEmailSettingError: '',
  updateEmailSettingMessage: '',
  updateEmailSettingData: {},

  updateModuleVersionApiState: '',
  updateModuleVersionLoading: false,
  updateModuleVersionError: '',
  updateModuleVersionMessage: '',
  updateModuleVersionData: {},

  domainListFilters: {
    act: 'get_suppress_domains',
    countSync: 1,
    currentPage: 1,
    filter_list: 'all',
    limit: 10,
    messageFilter: 'all',
    order: 0,
    sort: 'tsd.id',
    totalRecords: 0,
  },

  loadingMap: {}, // ✅ for per-toggle loading states
};

const emailMarketingSettingsSlice = createSlice({
  name: 'emailMarketingSettings',
  initialState,
  reducers: {
    setDomainListFilters(state, action) {
      state.domainListFilters = {
        ...state.domainListFilters,
        ...action.payload,
      };
    },
    addDomainReset(state, action) {
      state.addDomainApiState = '';
      state.addDomainLoading = false;
      state.addDomainError = '';
      state.addDomainMessage = '';
      state.addDomainData = {};
    },
    deleteDomainReset(state, action) {
      state.deleteApiState = '';
      state.deleteLoading = false;
      state.deleteError = '';
      state.deleteMessage = '';
      state.deleteData = {};
    },
    updateEmailSettingsReset(state) {
      state.updateEmailSettingssApiState = '';
      state.updateEmailSettingssLoading = false;
      state.updateEmailSettingssError = '';
      state.updateEmailSettingssMessage = '';
    },
    startGuideReset(state) {
      state.startGuideApiState = '';
      state.startGuideLoading = false;
      state.startGuideError = '';
      state.startGuideMessage = '';
    },
    usageEmailSettingReset(state) {
      state.usageRestirictionApiState = '';
      state.usageRestirictionLoading = false;
      state.usageRestirictionError = '';
      state.usageRestirictionMessage = '';
    },
    validateDomainInstructionReset(state) {
      state.validateDomainInstructionApiState = '';
      state.validateDomainInstructionLoading = false;
      state.validateDomainInstructionError = '';
      state.validateDomainInstructionMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // ===============================
      // ✅ Fetch Initial Settings
      // ===============================
      .addCase(fetchEmailSettings.pending, (state) => {
        state.fetchEmailSettingsApiState = 'pending';
        state.fetchEmailSettingsLoading = true;
        state.fetchEmailSettingsError = '';
        state.fetchEmailSettingsMessage = '';
      })
      .addCase(fetchEmailSettings.fulfilled, (state, action) => {
        state.fetchEmailSettingsApiState = action.payload.status;
        state.fetchEmailSettingsLoading = false;
        state.fetchEmailSettingsError = '';
        state.fetchEmailSettingsMessage = action.payload.msg || '';
        state.settings = { ...state.settings, ...action.payload }; // ✅ merge settings
      })
      .addCase(fetchEmailSettings.rejected, (state, action) => {
        state.fetchEmailSettingsApiState = action?.payload?.status || 'error';
        state.fetchEmailSettingsLoading = false;
        state.fetchEmailSettingsError = action.payload?.msg || 'Error';
        state.fetchEmailSettingsMessage = action.payload?.msg || '';
      })

      // ===============================
      // ✅ Update Setting Toggle
      // ===============================
      .addCase(updateEmailSettingApi.pending, (state, action) => {
        const key = Object.keys(action.meta.arg).find(
          (k) => k !== 'act' && k !== 'shop_id'
        );
        if (key) {
          state.loadingMap[key] = true;
        }
        state.updateEmailSettingssApiState = 'pending';
        state.updateEmailSettingssLoading = true;
        state.updateEmailSettingssError = '';
        state.updateEmailSettingssMessage = '';
      })
      .addCase(updateEmailSettingApi.fulfilled, (state, action) => {
        const key = Object.keys(action.meta.arg).find(
          (k) => k !== 'act' && k !== 'shop_id'
        );

        if (key) {
          state.settings[key] = action.meta.arg[key]; // ✅ update immediately from payload
          state.loadingMap[key] = false;
        }

        state.updateEmailSettingssApiState = action.payload?.status;
        state.updateEmailSettingssLoading = false;
        state.updateEmailSettingssError = '';
        state.updateEmailSettingssMessage = action.payload?.msg || '';
      })

      .addCase(updateEmailSettingApi.rejected, (state, action) => {
        const key = Object.keys(action.meta.arg).find(
          (k) => k !== 'act' && k !== 'shop_id'
        );
        if (key) {
          state.loadingMap[key] = false;
        }
        state.updateEmailSettingssApiState = action?.payload?.status || 'error';
        state.updateEmailSettingssLoading = false;
        state.updateEmailSettingssError =
          action.payload?.msg || 'Something went wrong';
        state.updateEmailSettingssMessage = action.payload?.msg || '';
      })

      //getDomainList
      .addCase(getDomainListApi.pending, (state, action) => {
        state.getDomainListApiState = 'pending';
        state.getDomainListLoading = true;
        state.getDomainListError = '';
        state.getDomainListMessage = '';
      })
      .addCase(getDomainListApi.fulfilled, (state, action) => {
        state.getDomainListApiState = action.payload?.status;
        state.getDomainListLoading = false;
        state.getDomainListError = '';
        state.domainList = action.payload.domainList || [];
        state.getDomainListMessage = action.payload?.msg || '';
      })

      .addCase(getDomainListApi.rejected, (state, action) => {
        state.getDomainListApiState = action?.payload?.status || 'error';
        state.getDomainListLoading = false;
        state.getDomainListError =
          action.payload?.msg || 'Something went wrong';
        state.getDomainListMessage = action.payload?.msg || '';
      })

      //addDomain
      .addCase(addDomainApi.pending, (state, action) => {
        state.addDomainApiState = 'pending';
        state.addDomainLoading = true;
        state.addDomainError = '';
        state.addDomainMessage = '';
      })
      .addCase(addDomainApi.fulfilled, (state, action) => {
        state.addDomainApiState = action.payload?.status;
        state.addDomainLoading = false;
        state.addDomainError = '';
        state.addDomainData = action.payload || {};
        state.addDomainMessage = action.payload?.msg || '';
      })

      .addCase(addDomainApi.rejected, (state, action) => {
        state.addDomainApiState = action?.payload?.status || 'error';
        state.addDomainLoading = false;
        state.addDomainError = action.payload?.msg || 'Something went wrong';
        state.addDomainMessage = action.payload?.msg || '';
      })

      //delete Domain
      .addCase(deleteDomainApi.pending, (state, action) => {
        state.deleteApiState = 'pending';
        state.deleteLoading = true;
        state.deleteError = '';
        state.deleteMessage = '';
      })
      .addCase(deleteDomainApi.fulfilled, (state, action) => {
        state.deleteApiState = action.payload?.status;
        state.deleteLoading = false;
        state.deleteError = '';
        state.deleteData = action.payload || {};

        // ✅ Update status in the list
        const index = state.domainList.findIndex(
          (item) => item.id === action.meta.arg.del_domain_id
        );
        if (index !== -1) {
          state.domainList[index].status = '3'; // or whatever your "deleted" status is
        }

        state.deleteMessage = action.payload?.msg || '';
      })

      .addCase(deleteDomainApi.rejected, (state, action) => {
        state.deleteApiState = action?.payload?.status || 'error';
        state.deleteLoading = false;
        state.deleteError = action.payload?.msg || 'Something went wrong';
        state.deleteMessage = action.payload?.msg || '';
      })

      //getDkimStatus
      .addCase(getDkimStatusApi.pending, (state, action) => {
        state.getDkimStatusApiState = 'pending';
        state.getDkimStatusLoading = true;
        state.getDkimStatusError = '';
        state.getDkimStatusMessage = '';
      })
      .addCase(getDkimStatusApi.fulfilled, (state, action) => {
        state.getDkimStatusApiState = action.payload?.status === 1 && 'success';
        state.getDkimStatusLoading = false;
        state.getDkimStatusError = '';
        state.getDkimStatusData = action.payload || {};
        state.getDkimStatusMessage = action.payload?.msg || '';
      })

      .addCase(getDkimStatusApi.rejected, (state, action) => {
        state.getDkimStatusApiState = action?.payload?.status || 'error';
        state.getDkimStatusLoading = false;
        state.getDkimStatusError =
          action.payload?.msg || 'Something went wrong';
        state.getDkimStatusMessage = action.payload?.msg || '';
      })

      //usageRestrictionApi
      .addCase(usageRestrictionApi.pending, (state, action) => {
        state.getDkimStatusApiState = 'pending';
        state.getDkimStatusLoading = true;
        state.usageRestirictionError = '';
        state.usageRestirictionMessage = '';
      })
      .addCase(usageRestrictionApi.fulfilled, (state, action) => {
        state.usageRestirictionApiState = action.payload?.status;
        state.usageRestirictionLoading = false;
        state.usageRestirictionError = '';
        state.usageRestirictionData = action.payload || {};
        state.usageRestirictionMessage = action.payload?.msg || '';
      })

      .addCase(usageRestrictionApi.rejected, (state, action) => {
        state.usageRestirictionApiState = action?.payload?.status || 'error';
        state.usageRestirictionLoading = false;
        state.usageRestirictionError =
          action.payload?.msg || 'Something went wrong';
        state.usageRestirictionMessage = action.payload?.msg || '';
      })

      //startGuideApi
      .addCase(startGuideApi.pending, (state, action) => {
        state.startGuideApiState = 'pending';
        state.startGuideLoading = true;
        state.startGuideError = '';
        state.startGuideMessage = '';
      })
      .addCase(startGuideApi.fulfilled, (state, action) => {
        state.startGuideApiState = action.payload?.status === 1 && 'success';
        state.startGuideLoading = false;
        state.startGuideError = '';
        state.startGuideData = action.payload || {};
        state.startGuideMessage = action.payload?.msg || '';
      })

      .addCase(startGuideApi.rejected, (state, action) => {
        state.startGuideApiState = action?.payload?.status || 'error';
        state.startGuideLoading = false;
        state.startGuideError = action.payload?.msg || 'Something went wrong';
        state.startGuideMessage = action.payload?.msg || '';
      })

      //validateDomainInstructionApi
      .addCase(validateDomainInstructionApi.pending, (state, action) => {
        state.validateDomainInstructionApiState = 'pending';
        state.validateDomainInstructionLoading = true;
        state.validateDomainInstructionError = '';
        state.validateDomainInstructionMessage = '';
      })
      .addCase(validateDomainInstructionApi.fulfilled, (state, action) => {
        state.validateDomainInstructionApiState =
          action.payload?.status === 1 && 'success';
        state.validateDomainInstructionLoading = false;
        state.validateDomainInstructionError = '';
        state.validateDomainInstructionData = action.payload || {};
        state.validateDomainInstructionMessage = action.payload?.msg || '';
      })

      .addCase(validateDomainInstructionApi.rejected, (state, action) => {
        state.validateDomainInstructionApiState =
          action?.payload?.status || 'error';
        state.validateDomainInstructionLoading = false;
        state.validateDomainInstructionError =
          action.payload?.msg || 'Something went wrong';
        state.validateDomainInstructionMessage = action.payload?.msg || '';
      })

      //confirm as done api
      .addCase(confirmAsDoneDkimApi.pending, (state, action) => {
        state.confirmAsDoneDkimApiState = 'pending';
        state.confirmAsDoneDkimLoading = true;
        state.confirmAsDoneDkimError = '';
        state.confirmAsDoneDkimMessage = '';
      })
      .addCase(confirmAsDoneDkimApi.fulfilled, (state, action) => {
        state.confirmAsDoneDkimApiState = 'success';
        state.confirmAsDoneDkimLoading = false;
        state.confirmAsDoneDkimError = '';
        state.confirmAsDoneDkimData = action.payload || {};
        state.confirmAsDoneDkimMessage = action.payload?.msg || '';
      })

      .addCase(confirmAsDoneDkimApi.rejected, (state, action) => {
        state.confirmAsDoneDkimApiState = action?.payload?.status || 'error';
        state.confirmAsDoneDkimLoading = false;
        state.confirmAsDoneDkimError =
          action.payload?.msg || 'Something went wrong';
        state.confirmAsDoneDkimMessage = action.payload?.msg || '';
      })

      //languageSettingApi
      .addCase(getEmailLanguageSettingApi.pending, (state, action) => {
        state.getEmailLanguageSettingApiState = 'pending';
        state.getEmailLanguageSettingLoading = true;
        state.getEmailLanguageSettingError = '';
        state.getEmailLanguageSettingMessage = '';
      })
      .addCase(getEmailLanguageSettingApi.fulfilled, (state, action) => {
        state.getEmailLanguageSettingApiState =
          action.payload?.status || (action.payload?.status === 1 && 'success');
        state.getEmailLanguageSettingLoading = false;
        state.getEmailLanguageSettingError = '';
        state.getEmailLanguageSettingData = action.payload?.data || {};
        state.getEmailLanguageSettingMessage = action.payload?.msg || '';
      })
      .addCase(getEmailLanguageSettingApi.rejected, (state, action) => {
        state.getEmailLanguageSettingApiState =
          action?.payload?.status || 'error';
        state.getEmailLanguageSettingLoading = false;
        state.getEmailLanguageSettingError =
          action.payload?.msg || 'Something went wrong';
        state.getEmailLanguageSettingMessage = action.payload?.msg || '';
      })
      .addCase(updateEmailLanguageSettings.pending, (state, action) => {
        state.updateEmailSettingApiState = 'pending';
        state.updateEmailSettingLoading = true;
        state.updateEmailSettingError = '';
        state.updateEmailSettingMessage = '';
      })
      .addCase(updateEmailLanguageSettings.fulfilled, (state, action) => {
        state.updateEmailSettingApiState =
          action.payload?.status || (action.payload?.status === 1 && 'success');
        state.updateEmailSettingLoading = false;
        state.updateEmailSettingError = '';
        state.updateEmailSettingData = action.payload?.data || {};
        state.updateEmailSettingMessage = action.payload?.msg || '';
      })
      .addCase(updateEmailLanguageSettings.rejected, (state, action) => {
        state.updateEmailSettingApiState = action?.payload?.status || 'error';
        state.updateEmailSettingLoading = false;
        state.updateEmailSettingError =
          action.payload?.msg || 'Something went wrong';
        state.updateEmailSettingMessage = action.payload?.msg || '';
      })
      //updateModuleVersionApi
      .addCase(updateModuleVersionApi.pending, (state, action) => {
        state.updateModuleVersionApiState = 'pending';
        state.updateModuleVersionLoading = true;
        state.updateModuleVersionError = '';
        state.updateModuleVersionMessage = '';
      })
      .addCase(updateModuleVersionApi.fulfilled, (state, action) => {
        state.updateModuleVersionApiState = action.payload?.status;
        state.updateModuleVersionLoading = false;
        state.updateModuleVersionError = '';
        state.updateModuleVersionData = action.payload?.data || {};
        state.updateModuleVersionMessage = action.payload?.msg || '';
      })
      .addCase(updateModuleVersionApi.rejected, (state, action) => {
        state.updateModuleVersionApiState = action?.payload?.status || 'error';
        state.updateModuleVersionLoading = false;
        state.updateModuleVersionError =
          action.payload?.msg || 'Something went wrong';
        state.updateModuleVersionMessage = action.payload?.msg || '';
      });
  },
});

export const {
  updateEmailSettingsReset,
  setDomainListFilters,
  addDomainReset,
  usageEmailSettingReset,
  startGuideReset,
  validateDomainInstructionReset,
} = emailMarketingSettingsSlice.actions;

export default emailMarketingSettingsSlice.reducer;
