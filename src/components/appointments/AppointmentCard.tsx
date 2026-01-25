import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appointment } from '../../types';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  appointment: Appointment;
};

export const AppointmentCard = ({ appointment }: Props) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.doctor}>{appointment.doctorName}</Text>
      <View style={[styles.badge, appointment.pendingSync === 1 ? styles.pending : styles.synced]}>
        <Text style={styles.badgeText}>{appointment.pendingSync === 1 ? 'Pending' : 'Synced'}</Text>
      </View>
    </View>
    <Text style={styles.detail}>{appointment.date} · {appointment.time}</Text>
    {appointment.notes ? <Text style={styles.notes}>{appointment.notes}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.light
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  doctor: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: colors.textDark
  },
  detail: {
    marginTop: 6,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  },
  notes: {
    marginTop: 6,
    color: colors.textDark,
    fontFamily: 'Nunito_400Regular'
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.pill
  },
  badgeText: {
    color: colors.white,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12
  },
  pending: {
    backgroundColor: colors.danger
  },
  synced: {
    backgroundColor: colors.green
  }
});