import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,
};

const layoutSlice = createSlice({
  name: 'layoutSlice',
  initialState,
  reducers: {
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { setCollapsed, toggleCollapsed } = layoutSlice.actions;

export default layoutSlice.reducer;
