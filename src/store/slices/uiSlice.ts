import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  loading: boolean;
  error: string | null;
};

const initialState: UiState = {
  loading: false,
  error: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setLoading, setError } = uiSlice.actions;
export default uiSlice.reducer;