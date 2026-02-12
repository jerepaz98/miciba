import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsRow } from '../../components/settings/SettingsRow';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import { setSetting, setSettings } from '../../store/slices/settingsSlice';
import { loadSettings, saveSetting } from '../../services/storage/settingsStorage';

export const SettingsScreen = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const [hydrated, setHydrated] = React.useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const saved = await loadSettings();
      dispatch(setSettings(saved));
      setHydrated(true);
    };

    hydrate();
  }, [dispatch]);

  const onToggle = async (key: keyof typeof settings, value: boolean) => {
    dispatch(setSetting({ key, value }));
    await saveSetting(key, value);
  };

  const rows = useMemo(
    () => [
      {
        key: 'notifications' as const,
        title: 'Notificaciones',
        iconName: 'notifications-outline' as const,
        iconBgColor: '#E2F2F8',
        iconColor: colors.primary
      },
      {
        key: 'messages' as const,
        title: 'Mensajes',
        iconName: 'chatbubble-ellipses-outline' as const,
        iconBgColor: '#DDF4EF',
        iconColor: colors.tealDeep
      },
      {
        key: 'calls' as const,
        title: 'Llamadas',
        iconName: 'call-outline' as const,
        iconBgColor: '#DFF1FA',
        iconColor: colors.primaryAlt
      },
      {
        key: 'videoCalls' as const,
        title: 'Videollamadas',
        iconName: 'videocam-outline' as const,
        iconBgColor: '#E5F3F6',
        iconColor: colors.teal
      }
    ],
    []
  );

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {rows.map((row) => (
          <SettingsRow
            key={row.key}
            iconName={row.iconName}
            iconBgColor={row.iconBgColor}
            iconColor={row.iconColor}
            title={row.title}
            value={settings[row.key]}
            onValueChange={(value) => onToggle(row.key, value)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
