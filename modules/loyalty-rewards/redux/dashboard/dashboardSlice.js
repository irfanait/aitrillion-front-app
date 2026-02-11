import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboardData: {},
};

export const loyaltyDashboardSlice = createSlice({
  name: 'loyalty-dashboard',
  initialState,
  reducers: {
    addDashboardDataAction: (state, action) => {
      return (state = {
        ...state,
        dashboardData: { ...action.payload },
      });
    },
    resetDashboardAction: () => initialState,
  },
});

export const { addDashboardDataAction, resetDashboardAction } =
  loyaltyDashboardSlice.actions;

export const addDashboardData = (data) => async (dispatch) => {
  try {
    dispatch(addDashboardDataAction(data));
  } catch (error) {
    console.log(error);
  }
};
export const resetDashboardData = (data) => async (dispatch) => {
  try {
    dispatch(resetDashboardAction(data));
  } catch (error) {
    console.log(error);
  }
};

export const loyaltyDashboardData = (state) =>
  state?.loyaltyRewardsRootReducer?.loyaltyDashboardState?.dashboardData;
export default loyaltyDashboardSlice.reducer;
