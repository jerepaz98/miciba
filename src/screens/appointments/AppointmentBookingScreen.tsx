import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { DoctorsStackParamList } from '../../navigation/DoctorsStack';
import { RootState } from '../../store/store';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { addAppointment } from '../../store/slices/appointmentsSlice';
import { insertAppointmentLocal } from '../../database/db';
import { createAppointmentFirebase } from '../../services/firebase/dbService';
import { Appointment } from '../../types';
import { AppButton } from '../../components/ui/AppButton';
import { strings } from '../../constants/strings';
import { mockDoctors } from '../../data/mockDoctors';

const weekDayShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const slotSections = [
  { id: 'morning', title: 'Turnos de la mañana', slots: ['10:10', '10:30', '10:50', '11:20', '11:40'] },
  { id: 'afternoon', title: 'Turnos de la tarde', slots: ['14:00', '14:20', '14:40'] },
  { id: 'night', title: 'Turnos de la noche', slots: ['19:00', '19:20', '19:40', '20:00', '20:20'] }
] as const;

type Props = NativeStackScreenProps<DoctorsStackParamList, 'AppointmentForm'>;

const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDateISO = (date: Date) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatMonthTitle = (date: Date) => {
  const raw = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const parseTimeToToday = (time: string, baseDate: Date) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return date;
};

export const AppointmentBookingScreen = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const auth = useSelector((state: RootState) => state.auth);
  const doctors = useSelector((state: RootState) => state.doctors.doctors);
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const doctor =
    doctors.find((item) => item.id === route.params.doctorId) ?? mockDoctors.find((item) => item.id === route.params.doctorId);
  const [baseWeekStart, setBaseWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(baseWeekStart, index)), [baseWeekStart]);
  const monthTitle = useMemo(() => formatMonthTitle(selectedDate), [selectedDate]);
  const extraBottom = tabBarHeight + insets.bottom + 24;

  const selectedDateISO = formatDateISO(selectedDate);
  const now = new Date();

  const isSlotDisabled = (slot: string) => {
    const slotDate = parseTimeToToday(slot, selectedDate);
    const pastSlot = isSameDay(selectedDate, now) && slotDate.getTime() <= now.getTime();
    const bookedSlot = appointments.some(
      (appointment) =>
        appointment.doctorId === doctor?.id && appointment.date === selectedDateISO && appointment.time === slot
    );
    return pastSlot || bookedSlot;
  };

  const handleWeekMove = (direction: -1 | 1) => {
    const nextBase = addDays(baseWeekStart, direction * 7);
    setBaseWeekStart(nextBase);
    setSelectedDate(nextBase);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!doctor || !auth.localId || !selectedTime || saving) {
      return;
    }

    setSaving(true);
    const netState = await NetInfo.fetch();
    const slotDate = parseTimeToToday(selectedTime, selectedDate);
    const appointment: Appointment = {
      id: Date.now().toString(),
      localId: auth.localId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDateISO,
      time: selectedTime,
      notes: 'MiCIBA',
      status: netState.isConnected ? 'synced' : 'pending',
      pendingSync: netState.isConnected ? 0 : 1,
      firebaseId: null
    };

    if (netState.isConnected && auth.token) {
      try {
        const firebaseId = await createAppointmentFirebase(auth.localId, auth.token, {
          ...appointment,
          // Metadatos adicionales para futuras integraciones.
          timestamp: slotDate.toISOString(),
          specialty: doctor.specialty,
          bookingStatus: 'proximo'
        } as Appointment);
        appointment.firebaseId = firebaseId;
      } catch (error) {
        appointment.status = 'pending';
        appointment.pendingSync = 1;
      }
    }

    await insertAppointmentLocal(appointment);
    dispatch(addAppointment(appointment));
    Alert.alert('Turno confirmado', 'Tu turno se reservó correctamente.');
    setSaving(false);

    const rootNavigator = navigation.getParent()?.getParent();
    if (rootNavigator) {
      (rootNavigator as any).navigate('MyAppointments');
      return;
    }
    navigation.goBack();
  };

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.container}>
          <Text style={styles.errorText}>{strings.doctors.notFound}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: extraBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doctorHeader}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        </View>

        <View style={styles.monthRow}>
          <Pressable style={styles.monthButton} onPress={() => handleWeekMove(-1)}>
            <Ionicons name="chevron-back" size={18} color={colors.primary} />
          </Pressable>
          <Text style={styles.monthTitle}>{monthTitle}</Text>
          <Pressable style={styles.monthButton} onPress={() => handleWeekMove(1)}>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={weekDays}
          keyExtractor={(item) => formatDateISO(item)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysList}
          renderItem={({ item }) => {
            const selected = isSameDay(item, selectedDate);
            return (
              <Pressable
                style={[styles.dayChip, selected ? styles.dayChipSelected : null]}
                onPress={() => {
                  setSelectedDate(item);
                  setSelectedTime(null);
                }}
              >
                <Text style={[styles.dayLabel, selected ? styles.dayLabelSelected : null]}>{weekDayShort[item.getDay()]}</Text>
                <Text style={[styles.dayNumber, selected ? styles.dayLabelSelected : null]}>{item.getDate()}</Text>
              </Pressable>
            );
          }}
        />

        {slotSections.map((section) => (
          <View key={section.id} style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.slotGrid}>
              {section.slots.map((slot) => {
                const selected = selectedTime === slot;
                const disabled = isSlotDisabled(slot);
                return (
                  <Pressable
                    key={slot}
                    style={[
                      styles.slotChip,
                      selected ? styles.slotChipSelected : null,
                      disabled ? styles.slotChipDisabled : null
                    ]}
                    disabled={disabled}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text style={[styles.slotText, selected ? styles.slotTextSelected : null]}>{slot}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.buttonWrap}>
          <AppButton
            title={saving ? 'Confirmando...' : 'Confirmar turno'}
            onPress={() => {
              void handleConfirm();
            }}
            disabled={!selectedTime || saving}
            style={!selectedTime || saving ? styles.confirmButtonDisabled : styles.confirmButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  doctorHeader: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.light
  },
  doctorName: {
    fontSize: 19,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold'
  },
  doctorSpecialty: {
    marginTop: 2,
    color: colors.textSoft,
    fontFamily: 'Nunito_600SemiBold'
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.light
  },
  monthTitle: {
    fontSize: 18,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold'
  },
  daysList: {
    paddingBottom: theme.spacing.sm
  },
  dayChip: {
    width: 62,
    borderRadius: 14,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border
  },
  dayChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSoft,
    fontFamily: 'Nunito_600SemiBold'
  },
  dayNumber: {
    marginTop: 2,
    fontSize: 16,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold'
  },
  dayLabelSelected: {
    color: colors.white
  },
  sectionWrap: {
    marginTop: theme.spacing.sm
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: theme.spacing.sm
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  slotChip: {
    minWidth: 82,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  slotChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  slotChipDisabled: {
    opacity: 0.45
  },
  slotText: {
    color: colors.textDark,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14
  },
  slotTextSelected: {
    color: colors.white
  },
  buttonWrap: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14
  },
  confirmButtonDisabled: {
    borderRadius: 16,
    paddingVertical: 14
  },
  errorText: {
    color: colors.textDark,
    fontSize: 18,
    fontFamily: 'Nunito_700Bold'
  }
});
