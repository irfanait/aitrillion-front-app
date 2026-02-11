import {
  checkActiveUserLimitSubscription,
  checkEmailSendLimit,
  chooseAsWinnerApi,
  createAbGetDecodedDataApi,
  deleteCampaignApi,
  endTrialApi,
  ExportCasmpaignCsvData,
  fetchAudienceList,
  fetchCampaignDetailsById,
  fetchCampaignList,
  // fetchEmailMarketingCampaignList,
  fetchInitCustomerData,
  fetchSegmentList,
  fetchTemplateList,
  getAiShopSetting,
  getAudienceMessageList,
  getCampaignDetailsApi,
  getCampaignDetailsReport,
  getClickedMessageList,
  getEmailCampaginApi,
  getLinkActivityMessageList,
  getOpenedmessageListApi,
  getOrderMessageList,
  getTemplateDetailsById,
  getTemplatePreviewData,
  sendEmailCampaignApi,
  sendTestEmailApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  campaignList: [],
  audienceList: [],
  segmentList: [],
  templateList: [],
  templateDetailsById: {},
  aiShopSettingData: {},
  checkEmailSendLimitData: {},
  checkActiveUserLimitSubscriptionData: {},
  sendEmailData: {},
  apiState: '',

  initCustomerApiState: '',
  audienceListApiState: '',
  segmentListApiState: '',
  templateListApiState: '',

  sendEmailApiState: '',
  sendEmailLoading: false,
  sendEmailError: null,
  sendEmailMessage: '',

  sendTestEmailApiState: '',
  sendTestEmailLoading: false,
  sendTestEmailError: '',
  sendTestEmailMessage: '',

  templateDetailsApiState: '',
  aiShopSettingApiState: '',
  aiShopSettingError: '',

  getTemplatePreviewDataApiState: '',
  getTemplatePreviewDataLoading: false,
  getTemplatePreviewDataError: '',
  getTemplatePreviewDataMessage: '',
  getTemplatePreviewData: {},

  checkActiveUserLimitSubscriptionApiState: '',
  checkActiveUserLimitSubscriptionLoading: false,
  checkActiveUserLimitSubscriptionerror: null,

  checkEmailSendLimitApiState: '',
  checkEmailSendLimitLoading: false,
  checkEmailSendLimiterror: null,
  aiShopSettingLoading: false,
  templateDetailsByIdLoading: false,

  campaignDetailsApiState: '',
  campaignDetailsLoading: false,
  campaignDetailsError: '',
  campaignDetailsMessage: '',
  campaignDetailsData: {},

  openMessageListApiState: '',
  openMessageListLoading: false,
  openMessageListError: '',
  openMessageListMessage: '',
  openmessagedetails: {},

  clickedMessageListApiState: '',
  clickedMessageListLoading: false,
  clickedMessageListError: '',
  clickedMessageListMessage: '',
  clickedMessagedetails: {},

  audienceMessageListApiState: '',
  audienceMessageListLoading: false,
  audienceMessageListError: '',
  audienceMessageListMessage: '',
  audienceMessagedetails: {},

  orderMessageListApiState: '',
  orderMessageListLoading: false,
  orderMessageListError: '',
  orderMessageListMessage: '',
  orderMessagedetails: {},

  linkActivityMessageListApiState: '',
  linkActivityMessageListLoading: false,
  linkActivityMessageListError: '',
  linkActivityMessageListMessage: '',
  linkActivityMessagedetails: {},

  campaignDetailsReportApiState: '',
  campaignDetailsReportLoading: false,
  campaignDetailsReportError: '',
  campaignDetailsReportMessage: '',
  campaignDetailsReportData: {},

  createAbDecodedDataApiState: '',
  createAbDecodedDataLoading: false,
  createAbDecodedDataError: '',
  createAbDecodedDataMessage: '',
  createAbDecodedData: {},

  deleteCampaignApiState: '',
  deleteCampaignLoading: false,
  deleteCampaignError: '',
  deleteCampaignMessage: '',
  deleteCampaignData: {},

  endTrialApiState: '',
  endTrialLoading: false,
  endTrialError: '',
  endTrialMessage: '',
  endTrialData: {},

  exportCampaignCsvDataApiState: '',
  exportCampaignCsvDataLoading: false,
  exportCampaignCsvDataError: '',
  exportCampaignCsvDataMessage: '',
  exportCampaignCsvDataData: {},

  chooseAsWinnerApiState: '',
  chooseAsWinnerLoading: false,
  chooseAsWinnerError: '',
  chooseAsWinnerMessage: '',
  chooseAsWinnerData: {},

  getEmailCampaignApiState: '',
  createCampaignLists: {},
  emailCampaignData: {},
  selected: null,
  filters: {
    act: 'load_message_list',
    campaignEmailErr: '0',
    campaignEmailErrTxt: 'Please enter campaign name',
    currentPage: '1',
    filter_list: '0',
    keyword: '',
    limit: '10',
    messageFilter: 'email',
    messageType: 'all',
    order: 'false',
    sentDate: '',
    sentDateTo: '',
    sort: 'mr.id',
    tab_list: '1',
  },

  campaignDetailsByIdFilter: {
    act: 'decode_url_data',
    message_id: '',
    page: 'edit',
    paramsFromCustomerSection: 'email',
  },

  createCampaignFilter: {
    act: 'load_customer_init_data',
    currentPage: '1',
    gridOrMap: 'grid',
    limit: '20',
    order: 'false',
    selectedOperatorType: 'and',
    selectedpeopleType: 'Customers',
    sort: 'c.last_seen_date',
  },
  audienceListFilter: {
    act: 'mrkt_list',
    shop_id: '',
  },
  segmentListFilter: {
    act: 'segment_list',
    shop_id: '',
  },
  checkEmailSendLimitFilter: {
    act: 'check_email_send_limit',
    messageId: '',
    selectedTimeZone: '',
    sentDate: '',
    totalEmailSubscribers: '',
    whenToSend: '',
  },
  checkActiveUserLimitSubscriptionFilters: {
    act: 'check_active_user_limit',
    act_module: 'email',
    currentPage: 1,
    gridOrMap: 'grid',
    include_lists: [],
    include_segments: [],
    exclude_lists: [],
    exclude_segments: [],
    limit: 20,
    list_segment_report: 1,
    masterFilter: [],
    order: false,
    returnType: 'count',
    selectedChennalType: 'Email',
    selectedCustomers: [],
    selectedOperatorType: 'and',
    selectedpeopleType: 'customer',
    sort: 'c.last_seen_date',
  },
  templateListFilter: {
    act: 'get_message_template_list_all',
    is_old: '0',
    is_new: '1',
    is_skip_order_block: '1',
  },
  templateDetailsByIdFilter: {
    act: 'get_message_template',
    tid: '',
    // is_skip_order_block: '1',
  },
  templatePreviewDataByIdFilter: {
    act: 'gettemplatedata',
    page: 'load_template_html_data',
    shop_id: '',
    etid: '',
    // is_skip_order_block: '1',
  },
  aiShopSettingFilter: {
    act: 'get_ai_shop_setting',
    shop_id: '',
  },
  getEmailCampaignFilter: {
    EmailNotificationToEmail: '',
    EmailNotificationfromEmail: '',
    EmailNotificationfromMsg: 'Hi {{first_name}} {{last_name}}',
    EmailNotificationfromName: '',
    EmailNotificationfromReplyTo: '',
    EmailNotificationfromSubject: '',
    act: 'get_decoded_data',
    customUtm: '0',
    encodedData: '',
    is_ab_testing: '0',
    is_html_code: '0',
    utm_campaign: '',
    utm_content: '',
    utm_medium: '',
    utm_source: '',
    utm_term: '',
  },

  getCampaignDetailsFilter: {
    act: 'message_detail',
    clickpage: 1,
    currentPage: 1,
    messageType: 'email',
    message_type: 'email',
    message_id: '',
    module_id: '',
    opencurrentPage: 1,
    openpage: 1,
    sentpage: 1,
    // scrollpage: 'sent',
    shop_domain: '',
  },

  getOpenMessageDetailsFilter: {
    act: 'open_message_detail',
    currentPage: '1',
    messageType: 'email',
    message_type: 'email',
    message_id: '',
    module_id: '',
    openpage: '1',
  },

  getClickedMessageDetailsFilter: {
    act: 'click_message_detail',
    clickpage: '1',
    currentPage: '1',
    messageType: 'email',
    message_type: 'email',
    message_id: '',
    module_id: '',
  },

  getAudienceMessageDetailsFilter: {
    act: 'audience_message_detail',
    messageType: 'email',
    message_id: '',
  },

  getOrdersMessageDetailsFilter: {
    act: 'order_message_detail',
    messageType: 'email',
    clickpage: '1',
    currentPage: '1',
    messageType: 'email',
    message_type: 'email',
    message_id: '',
    module_id: '',
  },

  getLinkActivityMessageDetailsFilter: {
    act: 'click_url_list',
    messageType: 'email',
    clickpage: '1',
    currentPage: '1',
    messageType: 'email',
    message_type: 'email',
    message_id: '',
    module_id: '',
  },

  getCampaignDetailsReportFilter: {
    act: 'get_email_report',
    message_id: '',
    shop_id: '',
  },

  createAbDecodedDataFilter: {
    act: 'get_decoded_data',
    act_type: 'ab_testing',
    encodedData: '',
    is_ab_testing: '0',
    messageId: '',
    //for live it will be 20 and for dev it will be 10
    minimum_audiance: '10',
    variant_a: {},
    variant_b: {},
  },

  exportCampaignCsvDataFilter: {
    act: 'export_csv_message_list',
    campaignEmailErr: 0,
    campaignEmailErrTxt: 'Please enter campaign name',
    currentPage: 1,
    limit: 10,
    messageFilter: 'email',
    messageType: 'all',
    order: false,
    sort: 'mr.id',
  },

  tabCountsLoaded: false,
  tabCounts: {},
  loading: false,
  error: null,
  currentEmailAct: '',
};

// Slice
const emailMarketingCampaignSlice = createSlice({
  name: 'emailMarketingCampaign',
  initialState,
  reducers: {
    setEmailMarketingCampaignFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCampaignDetailsByIdFilters(state, action) {
      state.campaignDetailsByIdFilter = {
        ...state.campaignDetailsByIdFilter,
        ...action.payload,
      };
    },
    setCreateCampaignFilters(state, action) {
      state.createCampaignFilter = {
        ...state.createCampaignFilter,
        ...action.payload,
      };
    },
    setAudienceFilters(state, action) {
      state.audienceListFilter = {
        ...state.audienceListFilter,
        ...action.payload,
      };
    },
    setSegmentFilters(state, action) {
      state.segmentListFilter = {
        ...state.segmentListFilter,
        ...action.payload,
      };
    },
    setCheckEmailSendLimitFilters(state, action) {
      state.checkEmailSendLimitFilter = {
        ...state.checkEmailSendLimitFilter,
        ...action.payload,
      };
    },
    setCheckActiveUserLimitSubscriptionFilters(state, action) {
      state.checkActiveUserLimitSubscriptionFilters = {
        ...state.checkActiveUserLimitSubscriptionFilters,
        ...action.payload,
      };
    },
    setTemplateListFilters(state, action) {
      state.templateListFilter = {
        ...state.templateListFilter,
        ...action.payload,
      };
    },
    setTemplateDetailsByIdFilters(state, action) {
      state.templateDetailsByIdFilter = {
        ...state.templateDetailsByIdFilter,
        ...action.payload,
      };
    },
    setTemplatePreviewDataByIdFilters(state, action) {
      state.templatePreviewDataByIdFilter = {
        ...state.templatePreviewDataByIdFilter,
        ...action.payload,
      };
    },
    setEmailCampaignFilters(state, action) {
      state.getEmailCampaignFilter = {
        ...state.getEmailCampaignFilter,
        ...action.payload,
      };
    },
    setAiShopSettingFilters(state, action) {
      state.aiShopSettingFilter = {
        ...state.aiShopSettingFilter,
        ...action.payload,
      };
    },
    setCampaignDetailsFilters(state, action) {
      state.getCampaignDetailsFilter = action.payload;
    },
    setOpenMessageDetailsFilters(state, action) {
      state.getOpenMessageDetailsFilter = action.payload;
    },
    setClickMessageDetailsFilters(state, action) {
      state.getClickedMessageDetailsFilter = action.payload;
    },
    setAudienceMessageDetailsFilters(state, action) {
      state.getAudienceMessageDetailsFilter = {
        ...state.getAudienceMessageDetailsFilter,
        ...action.payload,
      };
    },
    setOrdersMessageDetailsFilters(state, action) {
      state.getOrdersMessageDetailsFilter = {
        ...state.getOrdersMessageDetailsFilter,
        ...action.payload,
      };
    },
    setLinkActivityMessageDetailsFilters(state, action) {
      state.getLinkActivityMessageDetailsFilter = {
        ...state.getLinkActivityMessageDetailsFilter,
        ...action.payload,
      };
    },
    setCampaignDetailsReportsFilters(state, action) {
      state.getCampaignDetailsReportFilter = action.payload;
    },
    setCreateAbDecodedDataFilters(state, action) {
      state.createAbDecodedDataFilter = {
        ...state.createAbDecodedDataFilter,
        ...action.payload,
      };
    },
    setCampaignCsvDataFilters(state, action) {
      state.exportCampaignCsvDataFilter = {
        ...state.exportCampaignCsvDataFilter,
        ...action.payload,
      };
    },
    setCurrentEmailAct(state, action) {
      state.currentEmailAct = action.payload;
    },

    clearEmailMarketingCampaigns(state) {
      state.apiState = '';
      state.initCustomerApiState = '';
      state.audienceListApiState = '';
      state.segmentListApiState = '';
      state.templateListApiState = '';
      state.sendEmailApiState = '';
      state.templateDetailsApiState = '';
      state.aiShopSettingApiState = '';
      state.aiShopSettingError = '';
      state.campaignList = [];
      state.selected = null;
      state.error = null;
      state.checkActiveUserLimitSubscriptionApiState = '';
      state.checkActiveUserLimitSubscriptionLoading = false;
      state.checkActiveUserLimitSubscriptionerror = null;
      state.checkEmailSendLimitApiState = '';
      state.checkEmailSendLimitLoading = false;
      state.checkEmailSendLimiterror = null;
      state.aiShopSettingLoading = false;
      state.templateDetailsByIdLoading = false;
      state.sendEmailLoading = false;
      state.sendEmailError = null;
      state.getEmailCampaignApiState = '';
      state.createCampaignLists = {};
      state.emailCampaignData = {};
      state.filters = initialState.filters;
      state.createCampaignFilter = initialState.createCampaignFilter;
      state.audienceListFilter = initialState.audienceListFilter;
      state.segmentListFilter = initialState.segmentListFilter;
      state.templateListFilter = initialState.templateListFilter;
      state.templateDetailsByIdFilter = initialState.templateDetailsByIdFilter;
      state.getEmailCampaignFilter = initialState.getEmailCampaignFilter;
      state.aiShopSettingFilter = initialState.aiShopSettingFilter;
      state.checkActiveUserLimitSubscriptionFilters =
        initialState.checkActiveUserLimitSubscriptionApiState;
      state.checkEmailSendLimitData = initialState.checkEmailSendLimitData;
      state.templateDetailsById = initialState.templateDetailsById;

      state.tabCounts = {};
      state.tabCountsLoaded = false;
      state.createCampaignLists = {};
    },
    sendTestEmailReset(state) {
      state.sendEmailApiState = '';
      state.sendEmailError = '';
      state.sendEmailMessage = '';
      state.sendEmailLoading = false;
    },
    sendTestEmailPreviewMessageReset(state) {
      state.sendTestEmailApiState = '';
      state.sendTestEmailLoading = false;
      state.sendTestEmailError = '';
      state.sendTestEmailMessage = '';
    },

    sendEmailCreateAbReset(state) {
      state.sendEmailApiState = '';
      state.sendEmailError = '';
      state.sendEmailMessage = '';
      state.sendEmailData = {};
      state.sendEmailLoading = false;
    },
    sendEmailDataReset(state) {
      state.sendEmailApiState = '';
      state.sendEmailError = '';
      state.sendEmailMessage = '';
      state.sendEmailData = {};
      state.sendEmailLoading = false;
    },

    templateDetailsByIdReset(state) {
      state.templateDetailsApiState = '';
      state.templateDetailsById = {};
      state.templateDetailsByIdLoading = false;
    },
    getPreviewTemplateDataReset(state) {
      state.getTemplatePreviewDataApiState = '';
      state.getTemplatePreviewDataLoading = false;
      state.error = null;
    },
    campaignDetailsFilterReset(state) {
      state.getCampaignDetailsFilter = initialState?.getCampaignDetailsFilter;
    },
    deleteCampaignReset(state) {
      state.deleteCampaignApiState = '';
      state.deleteCampaignLoading = false;
      state.deleteCampaignError = '';
      state.campaignDetailsMessage = '';
    },
    currentEmailActReset(state) {
      state.currentEmailAct = '';
    },
    endTrialReset(state) {
      state.endTrialApiState = '';
      state.endTrialLoading = false;
      state.endTrialError = '';
      state.endTrialMessage = '';
    },
    chooseAsWinnerReset(state) {
      state.chooseAsWinnerApiState = initialState?.chooseAsWinnerApiState;
      state.chooseAsWinnerData = initialState?.chooseAsWinnerData;
      state.chooseAsWinnerLoading = false;
      state.chooseAsWinnerError = '';
      state.chooseAsWinnerMessage = '';
    },
  },

  extraReducers: (builder) => {
    builder

      // fetchCampaignList
      .addCase(fetchCampaignList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignList.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignList = action.payload?.rows || [];
        state.totalRecords = action.payload?.totalrecordcount || 0;
        // //  Set tab counts once
        if (
          !state.tabCountsLoaded &&
          action?.payload?.totalrecordcount !== undefined
        ) {
          state.tabCounts = {
            Pending: action?.payload?.pendingCount,
            Failed: action?.payload?.totalFailed,
            Sent: action?.payload?.totalSent,
            Draft: action?.payload?.totaldraft,
            Scheduled: action?.payload?.totalschedule,
            All: action?.payload?.totalrecordcount,
          };
          state.tabCountsLoaded = true;
        }

        // if (action?.payload) {
        //   const newCounts = { ...state.tabCounts };
        //   const activeType =
        //     state.filters?.messageType?.toLowerCase?.() || 'all';

        //   // Map backend type to UI tab key
        //   const typeToTabMap = {
        //     all: 'All',
        //     sent: 'Sent',
        //     draft: 'Draft',
        //     scheduled: 'Scheduled',
        //     failed: 'Failed',
        //     pending: 'Pending',
        //   };

        //   const currentTab = typeToTabMap[activeType] || 'All';

        //   // 🧩 Case 1: First load (All tab or no tabCounts yet)
        //   if (
        //     currentTab === 'All' &&
        //     Object.keys(state.tabCounts || {}).length === 0
        //   ) {
        //     newCounts.All = action.payload?.totalrecordcount ?? 0;
        //     newCounts.Sent = action.payload?.totalSent ?? 0;
        //     newCounts.Draft = action.payload?.totaldraft ?? 0;
        //     newCounts.Scheduled = action.payload?.totalschedule ?? 0;
        //     newCounts.Pending = action.payload?.pendingCount ?? 0;
        //     newCounts.Failed = action.payload?.totalFailed ?? 0;
        //   }
        //   // 🧩 Case 2: Any tab (All, Sent, Draft, etc.) — update only that tab
        //   else {
        //     const total = action.payload?.totalrecordcount ?? 0;
        //     newCounts[currentTab] = total;
        //   }

        //   // ✅ Never reset other tabs — just update current one
        //   state.tabCounts = { ...state.tabCounts, ...newCounts };
        // }
      })
      .addCase(fetchCampaignList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch campaign list';
      })

      // campaignDetails by Id

      .addCase(fetchCampaignDetailsById.pending, (state) => {
        state.campaignDetailsApiState = 'pending';
        state.campaignDetailsLoading = true;
        state.campaignDetailsError = null;
      })
      .addCase(fetchCampaignDetailsById.fulfilled, (state, action) => {
        state.campaignDetailsApiState = action?.payload?.status;
        state.campaignDetailsLoading = false;
        state.campaignDetailsData = action?.payload || {};
        state.campaignDetailsError = action?.payload.msg || 'error';
      })
      .addCase(fetchCampaignDetailsById.rejected, (state, action) => {
        state.campaignDetailsApiState = 'error';
        state.campaignDetailsLoading = false;
        state.campaignDetailsError =
          action?.payload?.message || 'Failed to fetch initial customer data';
      })

      // delete campaign  by Id

      .addCase(deleteCampaignApi.pending, (state) => {
        state.deleteCampaignApiState = 'pending';
        state.deleteCampaignLoading = true;
        state.deleteCampaignError = '';
        state.campaignDetailsMessage = '';
      })
      .addCase(deleteCampaignApi.fulfilled, (state, action) => {
        state.deleteCampaignApiState = action?.payload?.status;
        state.deleteCampaignLoading = false;
        // delete selected element from the list
        state.campaignList = state.campaignList.filter(
          (item) => item.message_id !== action?.meta.arg.id
        );
        state.deleteCampaignError = action?.payload.msg || 'error';
        state.deleteCampaignMessage = action?.payload.msg || 'error';
      })
      .addCase(deleteCampaignApi.rejected, (state, action) => {
        state.deleteCampaignApiState = 'error';
        state.deleteCampaignLoading = false;
        state.deleteCampaignError =
          action?.payload?.message || 'Failed to fetch initial customer data';
        state.deleteCampaignMessage = action?.payload.msg || 'error';
      })

      // fetchInitCustomerData
      .addCase(fetchInitCustomerData.pending, (state) => {
        state.initCustomerApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitCustomerData.fulfilled, (state, action) => {
        state.initCustomerApiState = 'success';
        state.loading = false;
        state.createCampaignLists = action.payload?.rows || {};
      })
      .addCase(fetchInitCustomerData.rejected, (state, action) => {
        state.initCustomerApiState = 'error';
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch initial customer data';
      })

      // fetchAudienceList
      .addCase(fetchAudienceList.pending, (state) => {
        state.audienceListApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudienceList.fulfilled, (state, action) => {
        state.audienceListApiState = 'success';
        state.loading = false;
        state.audienceList = action.payload?.data || [];
      })
      .addCase(fetchAudienceList.rejected, (state, action) => {
        state.audienceListApiState = 'error';
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch audience list';
      })

      // fetchSegmentList
      .addCase(fetchSegmentList.pending, (state) => {
        state.segmentListApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSegmentList.fulfilled, (state, action) => {
        state.segmentListApiState = 'success';
        state.loading = false;
        state.segmentList = action.payload?.data || [];
      })
      .addCase(fetchSegmentList.rejected, (state, action) => {
        state.segmentListApiState = 'error';
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch audience list';
      })

      // checkEmailSendLimit
      .addCase(checkEmailSendLimit.pending, (state) => {
        state.checkEmailSendLimitApiState = 'pending';
        state.checkEmailSendLimitLoading = true;
        state.checkEmailSendLimiterror = null;
      })
      .addCase(checkEmailSendLimit.fulfilled, (state, action) => {
        state.checkEmailSendLimitApiState = action.payload.status;
        state.checkEmailSendLimitLoading = false;
        state.checkEmailSendLimitData = action.payload || [];
      })
      .addCase(checkEmailSendLimit.rejected, (state, action) => {
        state.checkEmailSendLimitApiState = action.payload.status;
        state.checkEmailSendLimitLoading = false;
        state.checkEmailSendLimiterror =
          action.payload?.message || 'Failed to fetch audience list';
      })
      // checheck subscription
      .addCase(checkActiveUserLimitSubscription.pending, (state) => {
        state.checkActiveUserLimitSubscriptionApiState = 'pending';
        state.checkActiveUserLimitSubscriptionLoading = true;
        state.checkActiveUserLimitSubscriptionerror = null;
      })
      .addCase(checkActiveUserLimitSubscription.fulfilled, (state, action) => {
        state.checkActiveUserLimitSubscriptionApiState =
          action?.payload?.status;
        state.checkActiveUserLimitSubscriptionLoading = false;
        state.checkActiveUserLimitSubscriptionData = action?.payload || {};
        state.checkActiveUserLimitSubscriptionerror =
          action.payload?.msg || 'Failed to fetch audience list';
      })
      .addCase(checkActiveUserLimitSubscription.rejected, (state, action) => {
        state.checkActiveUserLimitSubscriptionApiState =
          action?.payload?.status;
        state.checkActiveUserLimitSubscriptionLoading = false;
        state.checkActiveUserLimitSubscriptionerror =
          action.payload?.msg || 'Failed to fetch audience list';
      })

      // fetchTemplateList
      .addCase(fetchTemplateList.pending, (state) => {
        state.templateListApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateList.fulfilled, (state, action) => {
        state.templateListApiState = action?.payload?.status;
        state.loading = false;
        state.templateList = action.payload?.list || [];
      })
      .addCase(fetchTemplateList.rejected, (state, action) => {
        state.templateListApiState = action?.payload?.status;
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch template list';
      })

      // getTemplateDetailsById
      .addCase(getTemplatePreviewData.pending, (state) => {
        state.getTemplatePreviewDataApiState = 'pending';
        state.getTemplatePreviewDataLoading = true;
        state.error = null;
      })
      .addCase(getTemplatePreviewData.fulfilled, (state, action) => {
        state.getTemplatePreviewDataApiState = action?.payload?.status;
        state.getTemplatePreviewDataLoading = false;
        state.getTemplatePreviewData = action.payload?.templateRow || {};
      })
      .addCase(getTemplatePreviewData.rejected, (state, action) => {
        state.getTemplatePreviewDataApiState = action?.payload?.status;
        state.getTemplatePreviewDataLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.msg ||
          'Failed to fetch template list';
      })

      // gettemplate preview data
      .addCase(getTemplateDetailsById.pending, (state) => {
        state.templateDetailsApiState = 'pending';
        state.templateDetailsByIdLoading = true;
        state.error = null;
      })
      .addCase(getTemplateDetailsById.fulfilled, (state, action) => {
        state.templateDetailsApiState = action?.payload?.status;
        state.templateDetailsByIdLoading = false;
        state.templateDetailsById = action.payload?.list || {};
      })
      .addCase(getTemplateDetailsById.rejected, (state, action) => {
        state.templateDetailsApiState = action?.payload?.status;
        state.templateDetailsByIdLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.msg ||
          'Failed to fetch template list';
      })

      // get create Email Campaign InitialData
      .addCase(getEmailCampaginApi.pending, (state) => {
        state.getEmailCampaignApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailCampaginApi.fulfilled, (state, action) => {
        state.getEmailCampaignApiState = 'success';
        state.loading = false;
        state.emailCampaignData = action.payload || {};
      })
      .addCase(getEmailCampaginApi.rejected, (state, action) => {
        state.getEmailCampaignApiState = 'error';
        state.loading = false;
        state.error =
          action.payload?.message || 'Failed to fetch audience list';
      })

      //send Email campaign
      .addCase(sendEmailCampaignApi.pending, (state) => {
        state.sendEmailApiState = 'pending';
        state.sendEmailLoading = true;
        state.sendEmailError = '';
        state.sendEmailMessage = '';
      })
      .addCase(sendEmailCampaignApi.fulfilled, (state, action) => {
        state.sendEmailApiState = action.payload.status;
        state.sendEmailLoading = false;
        state.sendEmailData = action.payload || {};
        state.sendEmailMessage =
          action.payload.msg || 'Campaign created successfully';
        state.sendEmailError =
          action.payload?.msg || 'Campaign created successfully';
      })
      .addCase(sendEmailCampaignApi.rejected, (state, action) => {
        state.sendEmailApiState = action.payload.status || 'couponError';
        state.sendEmailLoading = false;
        state.sendEmailError = action.payload.msg || 'Error';
        state.sendEmailMessage = action.payload.msg || 'Error';
      })
      //send test Email campaign
      .addCase(sendTestEmailApi.pending, (state) => {
        state.sendTestEmailApiState = 'pending';
        state.sendTestEmailLoading = true;
        state.sendTestEmailError = '';
        state.sendTestEmailMessage = '';
      })
      .addCase(sendTestEmailApi.fulfilled, (state, action) => {
        state.sendTestEmailApiState = action.payload.status;
        state.sendTestEmailLoading = false;
        state.sendTestEmailError =
          action.payload.msg || 'Campaign Send successfully';
        state.sendTestEmailMessage =
          action.payload.msg || 'Campaign Send successfully';
      })
      .addCase(sendTestEmailApi.rejected, (state, action) => {
        state.sendTestEmailApiState = action.payload.status;
        state.sendTestEmailLoading = false;
        state.sendTestEmailError = action.payload.msg || 'Error';
        state.sendTestEmailMessage = action.payload.msg || 'Error';
      })

      //get Ai shop setting API
      .addCase(getAiShopSetting.pending, (state) => {
        state.aiShopSettingApiState = 'pending';
        state.aiShopSettingLoading = true;
        state.aiShopSettingError = '';
      })
      .addCase(getAiShopSetting.fulfilled, (state, action) => {
        state.aiShopSettingApiState = action.payload.status;
        state.aiShopSettingData = action?.payload?.data;
        state.aiShopSettingLoading = false;
        state.aiShopSettingError = action.payload.msg || '';
      })
      .addCase(getAiShopSetting.rejected, (state, action) => {
        state.aiShopSettingApiState = action.payload.status;
        state.aiShopSettingLoading = false;
        state.aiShopSettingError = action.payload.msg || '';
      })

      //getcampaign details
      .addCase(getCampaignDetailsApi.pending, (state) => {
        state.campaignDetailsApiState = 'pending';
        state.campaignDetailsLoading = true;
        state.campaignDetailsError = '';
        state.campaignDetailsMessage = '';
      })
      .addCase(getCampaignDetailsApi.fulfilled, (state, action) => {
        state.campaignDetailsApiState = action?.payload?.status;
        state.campaignDetailsLoading = false;
        state.campaignDetailsError = '';
        state.campaignDetailsMessage = action.payload.msg || '';

        const isPagination = state.getCampaignDetailsFilter?.sentpage > 1;
        const newData = action?.payload?.sentmessagedetail || [];

        if (isPagination) {
          // ✅ append to existing
          state.campaignDetailsData.sentmessagedetail = [
            ...(state.campaignDetailsData?.sentmessagedetail || []),
            ...newData,
          ];
        } else {
          // ✅ fresh load
          state.campaignDetailsData = {
            ...action.payload,
            sentmessagedetail: newData,
          };
        }

        state.campaignDetailsData.totalrecord = action.payload.totalrecord;
        state.campaignDetailsData.totalpages = action.payload.totalpages;
      })
      .addCase(getCampaignDetailsApi.rejected, (state, action) => {
        state.campaignDetailsApiState = action?.payload?.status;
        state.campaignDetailsLoading = false;
        state.campaignDetailsError = action?.payload?.msg || '';
        state.campaignDetailsMessage = action?.payload?.msg || '';
      })

      //end trial Thunk
      .addCase(endTrialApi.pending, (state) => {
        state.endTrialApiState = 'pending';
        state.endTrialLoading = true;
        state.endTrialError = '';
        state.endTrialMessage = '';
      })
      .addCase(endTrialApi.fulfilled, (state, action) => {
        state.endTrialApiState = action?.payload?.status;
        state.endTrialData = action?.payload || {};
        state.endTrialLoading = false;
        state.endTrialError = action.payload.msg || '';
        state.endTrialMessage = action.payload.msg || '';
      })
      .addCase(endTrialApi.rejected, (state, action) => {
        state.endTrialApiState = action?.payload?.status;
        state.endTrialLoading = false;
        state.endTrialError = action?.payload?.msg || '';
        state.endTrialMessage = action?.payload?.msg || '';
      })
      //getOpenMessageList
      .addCase(getOpenedmessageListApi.pending, (state) => {
        state.openMessageListApiState = 'pending';
        state.openMessageListLoading = true;
        state.openMessageListError = '';
        state.openMessageListMessage = '';
      })
      .addCase(getOpenedmessageListApi.fulfilled, (state, action) => {
        state.openMessageListApiState = action?.payload?.status;
        state.openmessagedetails = action?.payload || {};
        state.openMessageListLoading = false;
        state.openMessageListError = action.payload.msg || '';
        state.openMessageListMessage = action.payload.msg || '';
      })
      .addCase(getOpenedmessageListApi.rejected, (state, action) => {
        state.openMessageListApiState = action?.payload?.status;
        state.openMessageListLoading = false;
        state.openMessageListError = action?.payload?.msg || '';
        state.openMessageListMessage = action?.payload?.msg || '';
      })

      //get clicked message details
      .addCase(getClickedMessageList.pending, (state) => {
        state.clickedMessageListApiState = 'pending';
        state.clickedMessageListLoading = true;
        state.clickedMessageListError = '';
        state.clickedMessageListMessage = '';
      })
      .addCase(getClickedMessageList.fulfilled, (state, action) => {
        state.clickedMessageListApiState = action?.payload?.status;
        state.clickedMessagedetails = action?.payload || {};
        state.clickedMessageListLoading = false;
        state.clickedMessageListError = action.payload.msg || '';
        state.clickedMessageListMessage = action.payload.msg || '';
      })
      .addCase(getClickedMessageList.rejected, (state, action) => {
        state.clickedMessageListApiState = action?.payload?.status;
        state.clickedMessageListLoading = false;
        state.clickedMessageListError = action?.payload?.msg || '';
        state.clickedMessageListMessage = action?.payload?.msg || '';
      })

      //get audience message details
      .addCase(getAudienceMessageList.pending, (state) => {
        state.audienceMessageListApiState = 'pending';
        state.audienceMessageListLoading = true;
        state.audienceMessageListError = '';
        state.audienceMessageListMessage = '';
      })
      .addCase(getAudienceMessageList.fulfilled, (state, action) => {
        state.audienceMessageListApiState = action?.payload?.status;
        state.audienceMessagedetails = action?.payload || {};
        state.audienceMessageListLoading = false;
        state.audienceMessageListError = action.payload.msg || '';
        state.audienceMessageListMessage = action.payload.msg || '';
      })
      .addCase(getAudienceMessageList.rejected, (state, action) => {
        state.audienceMessageListApiState = action?.payload?.status;
        state.audienceMessageListLoading = false;
        state.audienceMessageListError = action?.payload?.msg || '';
        state.audienceMessageListMessage = action?.payload?.msg || '';
      })

      //get Orders message details
      .addCase(getOrderMessageList.pending, (state) => {
        state.orderMessageListApiState = 'pending';
        state.orderMessageListLoading = true;
        state.orderMessageListError = '';
        state.orderMessageListMessage = '';
      })
      .addCase(getOrderMessageList.fulfilled, (state, action) => {
        state.orderMessageListApiState = action?.payload?.status;
        state.orderMessagedetails = action?.payload || {};
        state.orderMessageListLoading = false;
        state.orderMessageListError = action.payload.msg || '';
        state.orderMessageListMessage = action.payload.msg || '';
      })
      .addCase(getOrderMessageList.rejected, (state, action) => {
        state.orderMessageListApiState = action?.payload?.status;
        state.orderMessageListLoading = false;
        state.orderMessageListError = action?.payload?.msg || '';
        state.orderMessageListMessage = action?.payload?.msg || '';
      })
      //get Link activity message details
      .addCase(getLinkActivityMessageList.pending, (state) => {
        state.linkActivityMessageListApiState = 'pending';
        state.linkActivityMessageListLoading = true;
        state.linkActivityMessageListError = '';
        state.linkActivityMessageListMessage = '';
      })
      .addCase(getLinkActivityMessageList.fulfilled, (state, action) => {
        state.linkActivityMessageListApiState = action?.payload?.status;
        state.linkActivityMessagedetails = action?.payload || {};
        state.linkActivityMessageListLoading = false;
        state.linkActivityMessageListError = action.payload.msg || '';
        state.linkActivityMessageListMessage = action.payload.msg || '';
      })
      .addCase(getLinkActivityMessageList.rejected, (state, action) => {
        state.linkActivityMessageListApiState = action?.payload?.status;
        state.linkActivityMessageListLoading = false;
        state.linkActivityMessageListError = action?.payload?.msg || '';
        state.linkActivityMessageListMessage = action?.payload?.msg || '';
      })

      //getcampaign details reports
      .addCase(getCampaignDetailsReport.pending, (state) => {
        state.campaignDetailsReportApiState = 'pending';
        state.campaignDetailsReportLoading = true;
        state.campaignDetailsReportError = '';
        state.campaignDetailsReportMessage = '';
      })
      .addCase(getCampaignDetailsReport.fulfilled, (state, action) => {
        state.campaignDetailsReportApiState = action?.payload?.status;
        state.campaignDetailsReportData = action?.payload || {};
        state.campaignDetailsReportLoading = false;
        state.campaignDetailsReportError = action.payload.msg || '';
        state.campaignDetailsReportMessage = action.payload.msg || '';
      })
      .addCase(getCampaignDetailsReport.rejected, (state, action) => {
        state.campaignDetailsReportApiState = action?.payload?.status;
        state.campaignDetailsReportLoading = false;
        state.campaignDetailsReportError = action?.payload?.msg || '';
        state.campaignDetailsReportMessage = action?.payload?.msg || '';
      })

      //exportCsvData
      .addCase(ExportCasmpaignCsvData.pending, (state) => {
        state.exportCampaignCsvDataApiState = 'pending';
        state.exportCampaignCsvDataLoading = true;
        state.exportCampaignCsvDataError = '';
        state.exportCampaignCsvDataMessage = '';
      })
      .addCase(ExportCasmpaignCsvData.fulfilled, (state, action) => {
        state.exportCampaignCsvDataApiState = action?.payload?.status;
        state.exportCampaignCsvDataData = action?.payload || {};
        state.exportCampaignCsvDataLoading = false;
        state.exportCampaignCsvDataError = action.payload.msg || '';
        state.exportCampaignCsvDataMessage = action.payload.msg || '';
      })
      .addCase(ExportCasmpaignCsvData.rejected, (state, action) => {
        state.exportCampaignCsvDataApiState = action?.payload?.status;
        state.exportCampaignCsvDataLoading = false;
        state.exportCampaignCsvDataError = action?.payload?.msg || '';
        state.exportCampaignCsvDataMessage = action?.payload?.msg || '';
      })
      //chooseAs winnr
      .addCase(chooseAsWinnerApi.pending, (state) => {
        state.chooseAsWinnerApiState = 'pending';
        state.chooseAsWinnerLoading = true;
        state.chooseAsWinnerError = '';
        state.chooseAsWinnerMessage = '';
      })
      .addCase(chooseAsWinnerApi.fulfilled, (state, action) => {
        state.chooseAsWinnerApiState = action?.payload?.status;
        state.chooseAsWinnerData = action?.payload || {};
        state.chooseAsWinnerLoading = false;
        state.chooseAsWinnerError = action.payload.msg || '';
        state.chooseAsWinnerMessage = action.payload.msg || '';
      })
      .addCase(chooseAsWinnerApi.rejected, (state, action) => {
        state.chooseAsWinnerApiState = action?.payload?.status;
        state.chooseAsWinnerLoading = false;
        state.chooseAsWinnerError = action?.payload?.msg || '';
        state.chooseAsWinnerMessage = action?.payload?.msg || '';
      })

      //create AB getDecoded  details
      .addCase(createAbGetDecodedDataApi.pending, (state) => {
        state.createAbDecodedDataApiState = 'pending';
        state.createAbDecodedDataLoading = true;
        state.createAbDecodedDataError = '';
        state.createAbDecodedDataMessage = '';
      })
      .addCase(createAbGetDecodedDataApi.fulfilled, (state, action) => {
        state.createAbDecodedDataApiState = action?.payload?.status;
        state.createAbDecodedData = action?.payload || {};
        state.createAbDecodedDataLoading = false;
        state.createAbDecodedDataError = action.payload.msg || '';
        state.createAbDecodedDataMessage = action.payload.msg || '';
      })
      .addCase(createAbGetDecodedDataApi.rejected, (state, action) => {
        state.createAbDecodedDataApiState = action?.payload?.status;
        state.createAbDecodedDataLoading = false;
        state.createAbDecodedDataError = action?.payload?.msg || '';
        state.createAbDecodedDataMessage = action?.payload?.msg || '';
      });
  },
});

export const {
  setEmailMarketingCampaignFilters,
  setCampaignDetailsByIdFilters,
  setCreateCampaignFilters,
  clearEmailMarketingCampaigns,
  setAudienceFilters,
  setSegmentFilters,
  setTemplateListFilters,
  setEmailCampaignFilters,
  sendTestEmailReset,
  sendEmailCreateAbReset,
  setCurrentEmailAct,
  setTemplateDetailsByIdFilters,
  templateDetailsByIdReset,
  setAiShopSettingFilters,
  setCheckEmailSendLimitFilters,
  setCheckActiveUserLimitSubscriptionFilters,
  setCampaignDetailsFilters,
  setCampaignDetailsReportsFilters,
  setOpenMessageDetailsFilters,
  setClickMessageDetailsFilters,
  setAudienceMessageDetailsFilters,
  setOrdersMessageDetailsFilters,
  setLinkActivityMessageDetailsFilters,
  campaignDetailsFilterReset,
  setCreateAbDecodedDataFilters,
  deleteCampaignReset,
  currentEmailActReset,
  endTrialReset,
  setTemplatePreviewDataByIdFilters,
  getPreviewTemplateDataReset,
  sendTestEmailPreviewMessageReset,
  setCampaignCsvDataFilters,
  chooseAsWinnerReset,
  sendEmailDataReset,
} = emailMarketingCampaignSlice.actions;

export default emailMarketingCampaignSlice.reducer;
