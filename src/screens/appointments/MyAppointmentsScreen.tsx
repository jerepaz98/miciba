import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppointmentCard } from '../../components/appointments/AppointmentCard';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import {
  deleteAppointmentLocal,
  fetchAllAppointmentsLocal,
  fetchPendingAppointmentsLocal,
  markAppointmentSyncedLocal
} from '../../database/db';
import { setAppointments, markAsSynced, removeAppointment } from '../../store/slices/appointmentsSlice';
import { createAppointmentFirebase } from '../../services/firebase/dbService';
import { Appointment } from '../../types';
import { strings } from '../../constants/strings';
import { parseAppointmentDateTime } from '../../utils/date';

export const MyAppointmentsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const auth = useSelector((state: RootState) => state.auth);
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const doctors = useSelector((state: RootState) => state.doctors.doctors);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const loadFromSQLite = useCallback(async () => {
    const localAppointments = await fetchAllAppointmentsLocal();
    dispatch(setAppointments(localAppointments));
  }, [dispatch]);

  const syncPending = useCallback(async () => {
    if (!auth.localId || !auth.token) {
      return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected || syncing) {
      return;
    }

    const pending = await fetchPendingAppointmentsLocal();
    if (!pending.length) {
      return;
    }

    setSyncing(true);
    for (const appointment of pending) {
      try {
        const firebaseId = await createAppointmentFirebase(auth.localId, auth.token, appointment);
        await markAppointmentSyncedLocal(String(appointment.id), firebaseId);
        dispatch(markAsSynced({ id: String(appointment.id), firebaseId }));
      } catch (error) {
        // Keep pending if sync fails.
      }
    }
    setSyncing(false);
  }, [auth.localId, auth.token, dispatch, syncing]);

  useEffect(() => {
    loadFromSQLite();
  }, [loadFromSQLite]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncPending();
      }
    });

    return () => unsubscribe();
  }, [syncPending]);

  const appointmentsByTab = useMemo(() => {
    const now = Date.now();
    const normalized = appointments.map((appointment) => {
      const parsedDate = parseAppointmentDateTime(appointment.date, appointment.time);
      const timestamp = parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY;
      const bucket = parsedDate && parsedDate.getTime() < now ? 'past' : 'upcoming';
      return { appointment, parsedDate, timestamp, bucket };
    });

    const upcoming = normalized
      .filter((item) => item.bucket === 'upcoming')
      .sort((a, b) => a.timestamp - b.timestamp);
    const past = normalized
      .filter((item) => item.bucket === 'past')
      .sort((a, b) => b.timestamp - a.timestamp);

    return { upcoming, past };
  }, [appointments]);

  const handleCancel = useCallback(
    (appointment: Appointment) => {
      Alert.alert('¿Cancelar turno?', 'Esta acción quitará el turno de tu lista.', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            await deleteAppointmentLocal(appointment.id);
            dispatch(removeAppointment(appointment.id));
          }
        }
      ]);
    },
    [dispatch]
  );

  const handleReschedule = useCallback(
    (appointment: Appointment) => {
      if (!appointment.doctorId) {
        Alert.alert('Función en desarrollo', 'No pudimos encontrar el médico para reprogramar este turno.');
        return;
      }

      navigation.navigate('MainTabs', {
        screen: 'DoctorsTab',
        params: {
          screen: 'AppointmentForm',
          params: { doctorId: appointment.doctorId }
        }
      });
    },
    [navigation]
  );

  const currentData = activeTab === 'upcoming' ? appointmentsByTab.upcoming : appointmentsByTab.past;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.syncRow}>
          <Text style={[styles.syncing, !syncing ? styles.syncingHidden : null]}>
            {syncing ? strings.appointments.syncing : ' '}
          </Text>
        </View>

      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('upcoming')}
          style={[styles.tabButton, activeTab === 'upcoming' ? styles.tabActive : null]}
        >
          <Text style={[styles.tabLabel, activeTab === 'upcoming' ? styles.tabLabelActive : null]}>Próximos</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('past')} style={[styles.tabButton, activeTab === 'past' ? styles.tabActive : null]}>
          <Text style={[styles.tabLabel, activeTab === 'past' ? styles.tabLabelActive : null]}>Pasados</Text>
        </Pressable>
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => String(item.appointment.id)}
        renderItem={({ item }) => {
          const doctor = doctors.find((entry) => entry.id === item.appointment.doctorId);
          const specialty = doctor?.specialty ?? 'Consulta';
          const place = item.appointment.notes?.trim() ? item.appointment.notes.trim() : 'MiCIBA';

          return (
            <AppointmentCard
              appointment={item.appointment as Appointment}
              parsedDate={item.parsedDate}
              specialty={specialty}
              place={place}
              variant={activeTab}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {activeTab === 'upcoming' ? 'No tenés turnos próximos.' : 'No tenés turnos pasados.'}
          </Text>
        }
      />
      </View>
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
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: colors.bg
  },
  syncRow: {
    alignItems: 'flex-end',
    minHeight: 22,
    marginBottom: theme.spacing.sm
  },
  syncing: {
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold'
  },
  syncingHidden: {
    opacity: 0
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: theme.spacing.md
  },
  tabButton: {
    paddingBottom: 10,
    marginRight: 26,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomColor: colors.primary
  },
  tabLabel: {
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textSoft,
    fontSize: 15
  },
  tabLabelActive: {
    color: colors.primary,
    fontFamily: 'Nunito_700Bold'
  },
  list: {
    paddingBottom: 120
  },
  empty: {
    marginTop: theme.spacing.lg,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  }
});
