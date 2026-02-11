import { createSlice } from '@reduxjs/toolkit';
import { getLoggedInUserDetailsApi } from '../apis/logged-in-user-apis/loggedInUserApis';
import { getJWTtokenApi } from '../apis/logged-in-user-apis/getJWTtokenApi';

// Initial State
const initialState = {
  jwtToken: {},
  login_auth: {},
  accessModuleWithMappingState: null,
  jwtApiState: '',
  loading: false,
  error: null,
};

// Slice
const jwtSlice = createSlice({
  name: 'jwtSlice',
  initialState,
  reducers: {
    setDecodedUser: (state, action) => {
      state.login_auth = action.payload;
    },
    jwtResetState: (state) => {
      state.jwtApiState = state.jwtApiState;
    },
    setAccessModuleWithMappingState: (state, action) => {
      const { mapping, dkimStatus, loyaltyModuleStatus } = action.payload || {};

      //console.log('loyaltyModuleStatus', loyaltyModuleStatus);

      // Merge the new mapping with the existing state
      let updated = {
        ...(state.accessModuleWithMappingState || {}),
        ...(mapping ? mapping : {}),
      };

      if (dkimStatus == 1) {
        updated['8'] = 1;
        state.accessModuleWithMappingState = updated;
      } else if (loyaltyModuleStatus === 1) {
        updated['2'] = 1;
        state.accessModuleWithMappingState = updated;
      } else {
        state.accessModuleWithMappingState = updated;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJWTtokenApi.pending, (state) => {
        state.jwtApiState = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(getJWTtokenApi.fulfilled, (state, action) => {
        state.jwtApiState = action?.payload?.status || 'success';
        state.loading = false;
        state.jwtToken = action?.payload || {};
      })
      .addCase(getJWTtokenApi.rejected, (state, action) => {
        state.jwtApiState = action?.payload?.status || 'error';
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setDecodedUser,
  jwtResetState,
  setAccessModuleWithMappingState,
} = jwtSlice.actions;

export default jwtSlice.reducer;
