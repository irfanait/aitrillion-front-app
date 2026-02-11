import { combineReducers } from '@reduxjs/toolkit';
import loyaltyDashboardSlice from './redux/dashboard/dashboardSlice';
import earnPointSlice from './redux/earnPoints/earnPointsSlice';
import redeemPointSlice from './redux/redeemPoints/redeemPointsSlice';

const loyaltyRewardsRootReducer = combineReducers({
  loyaltyDashboardState: loyaltyDashboardSlice,
  earnPointsDataState: earnPointSlice,
  redeemPointDataState: redeemPointSlice,
});

export default loyaltyRewardsRootReducer;
