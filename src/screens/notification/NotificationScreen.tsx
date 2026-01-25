import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

export const NotificationScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Notifications</Text>
    <NotificationCard title="Appointment confirmed" message="Your appointment was confirmed." />
    <NotificationCard title="New doctor" message="A new specialist is available near you." />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.md
  }
});