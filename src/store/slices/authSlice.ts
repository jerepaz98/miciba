import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../../types';

type AuthState = {
  token: string | null;
  localId: string | null;
  email: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  token: null,
  localId: null,
  email: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Session>) => {
      state.token = action.payload.token;
      state.localId = action.payload.localId;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.localId = null;
      state.email = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;