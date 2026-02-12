import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Appointment } from '../../types';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';
import { formatAppointmentDate, formatAppointmentTime } from '../../utils/date';

type Props = {
  appointment: Appointment;
  variant: 'upcoming' | 'past';
  specialty: string;
  place: string;
  onCancel: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  parsedDate: Date | null;
};

export const AppointmentCard = ({
  appointment,
  variant,
  specialty,
  place,
  onCancel,
  onReschedule,
  parsedDate
}: Props) => {
  const dateValue = parsedDate ? formatAppointmentDate(parsedDate) : appointment.date;
  const timeValue = parsedDate ? formatAppointmentTime(parsedDate) : appointment.time;
  const actionLabel = variant === 'upcoming' ? 'Cancelar' : 'Reprogramar';

  return (
    <View style={styles.card}>
      <View style={styles.syncRow}>
        <View style={[styles.badge, appointment.pendingSync === 1 ? styles.pending : styles.synced]}>
          <Text style={styles.badgeText}>
            {appointment.pendingSync === 1 ? strings.appointments.pendingOffline : strings.appointments.synced}
          </Text>
        </View>
      </View>

      <View style={styles.topGrid}>
        <View style={styles.topCell}>
          <Text style={styles.metaLabel}>Fecha</Text>
          <Text style={styles.metaValue}>{dateValue}</Text>
        </View>
        <View style={styles.topCell}>
          <Text style={styles.metaLabel}>Hora</Text>
          <Text style={styles.metaValue}>{timeValue}</Text>
        </View>
        <View style={styles.topCell}>
          <Text style={styles.metaLabel}>Doctor</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {appointment.doctorName}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.bottomGrid}>
          <View style={styles.bottomCell}>
            <Text style={styles.metaLabel}>Especialidad</Text>
            <Text style={styles.metaValue}>{specialty}</Text>
          </View>
          <View style={styles.bottomCell}>
            <Text style={styles.metaLabel}>Lugar</Text>
            <Text style={styles.metaValue}>{place}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.actionButton, variant === 'upcoming' ? styles.cancelButton : styles.rescheduleButton]}
          onPress={() => (variant === 'upcoming' ? onCancel(appointment) : onReschedule(appointment))}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    ...theme.shadow.light
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10
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
  },
  topGrid: {
    flexDirection: 'row',
    marginBottom: 12
  },
  topCell: {
    flex: 1,
    paddingRight: 8
  },
  metaLabel: {
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textSoft,
    fontSize: 12,
    marginBottom: 2
  },
  metaValue: {
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    fontSize: 14
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomGrid: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 10
  },
  bottomCell: {
    flex: 1,
    paddingRight: 8
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 112,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B1E2D',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  cancelButton: {
    backgroundColor: colors.danger
  },
  rescheduleButton: {
    backgroundColor: colors.primary
  },
  actionText: {
    color: colors.white,
    fontFamily: 'Nunito_700Bold',
    fontSize: 13
  }
});
