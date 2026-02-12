import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultSettings, SettingsState } from '../../store/slices/settingsSlice';

export const SETTING_STORAGE_KEYS = {
  notifications: 'miciba_settings_notifications',
  messages: 'miciba_settings_messages',
  calls: 'miciba_settings_calls',
  videoCalls: 'miciba_settings_videoCalls'
} as const;

type SettingStorageKey = keyof SettingsState;

export const loadSettings = async (): Promise<SettingsState> => {
  const entries = await Promise.all(
    (Object.keys(SETTING_STORAGE_KEYS) as SettingStorageKey[]).map(async (key) => {
      const value = await AsyncStorage.getItem(SETTING_STORAGE_KEYS[key]);
      if (value == null) {
        return [key, defaultSettings[key]] as const;
      }
      return [key, value === 'true'] as const;
    })
  );

  return entries.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value
    }),
    { ...defaultSettings }
  );
};

export const saveSetting = async (key: SettingStorageKey, value: boolean) => {
  await AsyncStorage.setItem(SETTING_STORAGE_KEYS[key], value ? 'true' : 'false');
};
