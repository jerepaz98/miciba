import React, { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';
import { buildAppointmentNotifications, buildBaseNotifications } from '../../data/notifications';
import { AppNotification, NotificationKind } from '../../types/notification';
import { getDayBucket, getRelativeTimeLabel } from '../../utils/dateLabels';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';

const MIS_TURNOS_ROUTE: keyof AuthenticatedStackParamList = 'MyAppointments';

const iconByKind: Record<NotificationKind, { name: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  appointment_confirmed: { name: 'checkmark-done-circle', bg: '#D8F4E8', color: '#2F9E70' },
  appointment_reminder: { name: 'alarm-outline', bg: '#DCEBFF', color: '#2C79C9' },
  appointment_updated: { name: 'refresh-circle-outline', bg: '#E8E4FF', color: '#6B5BD2' },
  appointment_cancelled: { name: 'close-circle-outline', bg: '#FFE1E1', color: '#D34A4A' }
};

export const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  const sections = useMemo(() => {
    const now = Date.now();
    const fromAppointments = buildAppointmentNotifications(appointments, now);
    const fallback = fromAppointments.length ? [] : buildBaseNotifications(now);
    const merged = [...fromAppointments, ...fallback]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((item) => ({
        ...item,
        timeLabel: getRelativeTimeLabel(item.createdAt, now),
        isRead: readMap[item.id] ?? item.isRead ?? false
      }));

    const grouped: Record<'Hoy' | 'Ayer' | 'Anteriores', AppNotification[]> = {
      Hoy: [],
      Ayer: [],
      Anteriores: []
    };

    merged.forEach((item) => {
      grouped[getDayBucket(item.createdAt)].push(item);
    });

    return (Object.keys(grouped) as Array<keyof typeof grouped>)
      .filter((bucket) => grouped[bucket].length > 0)
      .map((bucket) => ({ title: bucket, data: grouped[bucket] }));
  }, [appointments, readMap]);

  const openMyAppointments = (item: AppNotification) => {
    setReadMap((prev) => ({ ...prev, [item.id]: true }));

    const parentNavigator = navigation.getParent?.();
    if (parentNavigator) {
      parentNavigator.navigate(MIS_TURNOS_ROUTE);
      return;
    }

    navigation.navigate(MIS_TURNOS_ROUTE);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.headerTitle}>{strings.notifications.notifications}</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => {
          const iconConfig = iconByKind[item.kind];
          return (
            <Pressable style={[styles.row, item.isRead ? styles.readRow : null]} onPress={() => openMyAppointments(item)}>
              <View style={[styles.iconBox, { backgroundColor: iconConfig.bg }]}>
                <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody} numberOfLines={2}>
                  {item.message}
                </Text>
              </View>

              <Text style={styles.time}>{item.timeLabel}</Text>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF4FA'
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 12
  },
  headerTitle: {
    fontSize: 26,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold'
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 110
  },
  sectionTitle: {
    fontSize: 15,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
    marginTop: 6
  },
  row: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow.light
  },
  readRow: {
    opacity: 0.72
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  textWrap: {
    flex: 1,
    paddingRight: 10
  },
  itemTitle: {
    fontSize: 15,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold'
  },
  itemBody: {
    marginTop: 3,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular',
    fontSize: 12
  },
  time: {
    color: colors.textSoft,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11
  },
  separator: {
    height: 10
  }
});
