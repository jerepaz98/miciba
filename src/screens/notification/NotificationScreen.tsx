import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';

export const NotificationScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{strings.notifications.notifications}</Text>
    <NotificationCard
      title={strings.notifications.appointmentConfirmedTitle}
      message={strings.notifications.appointmentConfirmedMessage}
    />
    <NotificationCard title={strings.notifications.newDoctorTitle} message={strings.notifications.newDoctorMessage} />
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
