import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import authSliceReducer from '@/modules/auth/authSlices/authSlice';
import emailMarketingCampaignSlice from './email-marketing-slices/campaignSlice/email-marketing-campaign-slice';
import loggedInUserSlice from './logged-in-user-details-slice/loggedInUserDetailsSlice';
import getAudienceCountSlice from './email-marketing-slices/campaignSlice/fetchAudienceCountSlice';
import emailMarketingTemplateSlice from './email-marketing-slices/templateSlice/email-marketing-template-slice';
import emailMarketingDashboardSlice from './email-marketing-slices/dashboardSlice/dashboard-slice';
import emailMarketingCouponSlice from './email-marketing-slices/couponsSlice/coupon-slice';
import emailMarketingSettingsSlice from './email-marketing-slices/settingsSlice/settingsSlice';
import getTimeZoneListSlice from './get-time-zone-list-slice/getTimeZoneLIstSlice';
import jwtSlice from './logged-in-user-details-slice/jwtSlice';
import allCustomersSlice from './customers-slice/all-customers-slices/all-customers-slice';
import segmentSlice from './customers-slice/segment-slices/segment-slice';
import stripoSlice from './stripo-slices/stripo-slice';
import workflowAutomationReducer from './workflow-automation-slice/dashboardSlice/dashboardSlice';
import workflowsListReducer from '@/redux/workflow-automation-slice/workflowsListSlice/workflowsListSlice';
import workflowTemplateAllReducer from '@/redux/workflow-automation-slice/templateAllSlice/templateAllSlice';
import emailMessagesReducer from '@/redux/workflow-automation-slice/emailMessagesSlice/emailMessagesSlice';
import loyaltyRewardsRootReducer from '../modules/loyalty-rewards/combineReducer';
import listSlice from './customers-slice/list-slices/listSlice';
import customFieldsSlice from './customers-slice/custom-fields-slices/customFieldsSlices';
import importCsvSlice from './customers-slice/import-csv-slices/importCsvSlices';
import customerDetailsSlice from './customers-slice/customer-details-slices/customerDetailsSlice';
import layoutSlice from './layout-slice/layoutSlice';

export const store = configureStore({
  reducer: {
    loyaltyRewardsRootReducer,
    loggeInUserState: authSliceReducer,
    loggedInUserDetailsState: loggedInUserSlice,
    emailMarketingCampaignState: emailMarketingCampaignSlice,
    emailMarketingTemplateState: emailMarketingTemplateSlice,
    getAudienceCountState: getAudienceCountSlice,
    emailMarketingDashboardState: emailMarketingDashboardSlice,
    emailMarketingCouponState: emailMarketingCouponSlice,
    emailMarketingSettingsState: emailMarketingSettingsSlice,
    getTimeZoneListState: getTimeZoneListSlice,
    jwtState: jwtSlice,
    //customer slices
    allCustomersState: allCustomersSlice,
    customerDetailsState: customerDetailsSlice,
    segmentState: segmentSlice,
    stripoState: stripoSlice,
    workflowAutomation: workflowAutomationReducer,
    workflowsList: workflowsListReducer, // list page
    workflowTemplateAll: workflowTemplateAllReducer, // template all page
    emailMessages: emailMessagesReducer, // message all page
    listState: listSlice,
    customFieldsState: customFieldsSlice,
    importCsvState: importCsvSlice,
    layoutState: layoutSlice,
  },
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore, { debug: false });

// const makeStore = () =>
//   configureStore({
//     reducer: {
//       loggeInUserState: authSliceReducer,
//       loggedInUserDetailsState: loggedInUserSlice,
//       users: userReducer,
//       emailMarketingCampaignState: emailMarketingCampaignSlice,
//       emailMarketingTemplateState: emailMarketingTemplateSlice,
//       getAudienceCountState: getAudienceCountSlice,
//     },
//   });

// export const wrapper = createWrapper(makeStore, { debug: false });
