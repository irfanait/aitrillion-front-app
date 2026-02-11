import { fetchAudienceCount } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  fetchAudienceCounts: {},
  fetchAudienceCountApiState: '',
  fetchAudienceLoading: false,
  audienceCountFilter: {
    act: 'get_customers_count',
    act_module: 'email',
    currentPage: 1,
    gridOrMap: 'grid',
    limit: 20,
    list_segment_report: 1,
    masterFilter: [],
    include_lists: [],
    include_segments: [],
    exclude_lists: [],
    exclude_segments: [],
    order: false,
    returnType: 'count',
    selectedChennalType: 'Email',
    selectedCustomers: [],
    selectedOperatorType: 'and',
    selectedpeopleType: 'Customers',
    sort: 'c.last_seen_date',
  },
  error: null,
};

// Slice
const getAudienceCountSlice = createSlice({
  name: 'getAudienceCountSlice',
  initialState,
  reducers: {
    setAudienceCountFilter(state, action) {
      state.audienceCountFilter = {
        ...initialState.audienceCountFilter,
        ...action.payload,
      };
    },

    resetCustomerCount: (state) => {
      state.fetchAudienceCounts = initialState.fetchAudienceCounts;
      state.fetchAudienceCountApiState =
        initialState.fetchAudienceCountApiState;
      state.fetchAudienceLoading = initialState.fetchAudienceLoading;
      state.audienceCountFilter = initialState.audienceCountFilter;

      // state.audienceCountFilter = {
      //   ...initialState.audienceCountFilter,
      //   include_lists: [],
      //   include_segments: [],
      //   exclude_lists: [],
      //   exclude_segments: [],
      // };
    },
  },

  extraReducers: (builder) => {
    builder

      // fetchAudienceCount
      .addCase(fetchAudienceCount.pending, (state) => {
        state.fetchAudienceCountApiState = 'pending';
        state.fetchAudienceLoading = true;
        state.error = null;
      })
      .addCase(fetchAudienceCount.fulfilled, (state, action) => {
        state.fetchAudienceCountApiState = action?.payload?.status || 'success';
        state.fetchAudienceLoading = false;
        state.fetchAudienceCounts = action.payload || {};
      })
      .addCase(fetchAudienceCount.rejected, (state, action) => {
        state.fetchAudienceCountApiState = action?.payload?.status || 'error';
        state.fetchAudienceLoading = false;
        state.error =
          action.payload?.message || 'Failed to fetch audience list';
      });
  },
});

export const { setAudienceCountFilter, resetCustomerCount } =
  getAudienceCountSlice.actions;

export default getAudienceCountSlice.reducer;
