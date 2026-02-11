import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  earnPointsListData: {},
};

export const earnPointSlice = createSlice({
  name: 'earn-points',
  initialState,
  reducers: {
    addEarnPointsListDataAction: (state, action) => {
      return (state = {
        ...state,
        earnPointsListData: { ...action.payload },
      });
    },
    resetEarnPointsAction: () => initialState,
  },
});

export const { addEarnPointsListDataAction, resetEarnPointsAction } =
  earnPointSlice.actions;

export const addEarnPointsListData = (data) => async (dispatch) => {
  try {
    dispatch(addEarnPointsListDataAction(data));
  } catch (error) {
    console.log(error);
  }
};
export const resetEarnPointData = (data) => async (dispatch) => {
  try {
    dispatch(resetEarnPointsAction(data));
  } catch (error) {
    console.log(error);
  }
};

export const earnPointsData = (state) =>
  state?.loyaltyRewardsRootReducer?.earnPointsDataState?.earnPointsListData;

export default earnPointSlice.reducer;
