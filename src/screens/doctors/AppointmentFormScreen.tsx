import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { DoctorsStackParamList } from '../../navigation/DoctorsStack';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import { addAppointment } from '../../store/slices/appointmentsSlice';
import { insertAppointmentLocal } from '../../database/db';
import { createAppointmentFirebase } from '../../services/firebase/dbService';
import { Appointment } from '../../types';

const slots = ['09:00', '11:00', '13:00', '15:00'];

type Props = NativeStackScreenProps<DoctorsStackParamList, 'AppointmentForm'>;

export const AppointmentFormScreen = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const doctors = useSelector((state: RootState) => state.doctors.doctors);
  const doctor = doctors.find((item) => item.id === route.params.doctorId);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(slots[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!date || !time || !doctor || !auth.localId) {
      setError('Complete the required fields.');
      return;
    }

    setError(null);
    const netState = await NetInfo.fetch();
    const appointment: Appointment = {
      id: Date.now().toString(),
      localId: auth.localId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      notes,
      status: netState.isConnected ? 'synced' : 'pending',
      pendingSync: netState.isConnected ? 0 : 1,
      firebaseId: null
    };

    if (netState.isConnected && auth.token) {
      try {
        const firebaseId = await createAppointmentFirebase(auth.localId, auth.token, appointment);
        appointment.firebaseId = firebaseId;
        appointment.pendingSync = 0;
        appointment.status = 'synced';
      } catch (err) {
        appointment.pendingSync = 1;
        appointment.status = 'pending';
      }
    }

    await insertAppointmentLocal(appointment);
    dispatch(addAppointment(appointment));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book with {doctor?.name ?? 'Doctor'}</Text>
      <AppInput label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
      <View style={styles.slotRow}>
        {slots.map((slot) => (
          <Text
            key={slot}
            style={[styles.slot, slot === time && styles.slotActive]}
            onPress={() => setTime(slot)}
          >
            {slot}
          </Text>
        ))}
      </View>
      <AppInput label="Notes" placeholder="Write a note" value={notes} onChangeText={setNotes} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="Confirm Appointment" onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.md
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md
  },
  slot: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textDark,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  slotActive: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderColor: colors.primary
  },
  error: {
    color: colors.danger,
    marginBottom: theme.spacing.md,
    fontFamily: 'Nunito_600SemiBold'
  }
});