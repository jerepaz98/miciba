import React, { useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  iconBg: string;
};

const todayItems: NotificationItem[] = [
  {
    id: 't1',
    title: 'Remind For Serial',
    body: 'It is a long established fact that a reader and will be distracted.',
    time: '11 Min',
    iconBg: '#7FA7FF'
  },
  {
    id: 't2',
    title: 'Notification From Dr. Istiak',
    body: 'It is a long established fact that a reader and will be distracted.',
    time: '23 Min',
    iconBg: '#9B8CFF'
  },
  {
    id: 't3',
    title: 'Notification From Dr. Shofik',
    body: 'It is a long established fact that a reader and will be distracted.',
    time: '1 Hours',
    iconBg: '#FF86B6'
  }
];

const yesterdayItems: NotificationItem[] = [
  {
    id: 'y1',
    title: 'Remind For Serial',
    body: 'It is a long established fact that a reader and will be distracted.',
    time: '2 Hours',
    iconBg: '#7FA7FF'
  },
  {
    id: 'y2',
    title: 'Notification From Dr. Istiak',
    body: 'It is a long established fact that a reader and will be distracted.',
    time: '5 Hours',
    iconBg: '#9B8CFF'
  }
];

export const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const sections = useMemo(
    () => [
      { title: 'Today', data: todayItems },
      { title: 'Yesterday', data: yesterdayItems }
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1E2430" style={styles.headerIcon} />
      </View>
      <View style={styles.headerSpacer} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item, index, section }) => (
          <View>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Ionicons name="notifications" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemBody}>{item.body}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {index < section.data.length - 1 ? <View style={styles.divider} /> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF3FF'
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2430'
  },
  headerIcon: {
    position: 'absolute',
    right: 20,
    bottom: 14
  },
  headerSpacer: {
    height: 12,
    backgroundColor: '#EEF3FF'
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E2430',
    marginTop: 8,
    marginBottom: 10
  },
  row: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  textWrap: {
    flex: 1
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E2430'
  },
  itemBody: {
    marginTop: 4,
    fontSize: 12,
    color: '#8A90A6'
  },
  time: {
    fontSize: 11,
    color: '#9AA2B5',
    marginLeft: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#E9EDF7',
    marginHorizontal: 16
  }
});
