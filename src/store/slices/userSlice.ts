import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';

type UserState = {
  profile: UserProfile | null;
};

const initialState: UserState = {
  profile: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    }
  }
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;