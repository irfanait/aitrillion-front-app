import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  redeemPointsListData: {},
};

export const redeemPointSlice = createSlice({
  name: 'redeem-points',
  initialState,
  reducers: {
    addRedeemPointsListDataAction: (state, action) => {
      return (state = {
        ...state,
        redeemPointsListData: { ...action.payload },
      });
    },
    resetRedeemPointsAction: () => initialState,
  },
});

export const { addRedeemPointsListDataAction, resetRedeemPointsAction } =
  redeemPointSlice.actions;

export const addRedeemPointsListData = (data) => async (dispatch) => {
  try {
    dispatch(addRedeemPointsListDataAction(data));
  } catch (error) {
    console.log(error);
  }
};
export const resetRedeemPointData = (data) => async (dispatch) => {
  try {
    dispatch(resetRedeemPointsAction(data));
  } catch (error) {
    console.log(error);
  }
};

export const redeemPointsData = (state) =>
  state?.loyaltyRewardsRootReducer?.redeemPointDataState?.redeemPointsListData;

export default redeemPointSlice.reducer;
