import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialAppState = {
  loading: false,
  currentLocation: '/',
};

const app = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    toggleLoading(state) {
      state.loading = !state.loading;
    },
    updateCurrentLocation(state, { payload }: PayloadAction<{ path: string }>) {
      if (payload.path) {
        state.currentLocation = payload.path;
      }
    },
  },
});

export const { toggleLoading, updateCurrentLocation } = app.actions;

export default app.reducer;
