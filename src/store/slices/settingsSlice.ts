import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  notifications: boolean;
  messages: boolean;
  calls: boolean;
  videoCalls: boolean;
};

export const defaultSettings: SettingsState = {
  notifications: true,
  messages: false,
  calls: true,
  videoCalls: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettings,
  reducers: {
    setSettings: (_state, action: PayloadAction<SettingsState>) => action.payload,
    setSetting: (state, action: PayloadAction<{ key: keyof SettingsState; value: boolean }>) => {
      state[action.payload.key] = action.payload.value;
    }
  }
});

export const { setSettings, setSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
