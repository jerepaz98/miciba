import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppointmentCard } from '../../components/appointments/AppointmentCard';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import {
  fetchAllAppointmentsLocal,
  fetchPendingAppointmentsLocal,
  markAppointmentSyncedLocal
} from '../../database/db';
import { setAppointments, markAsSynced } from '../../store/slices/appointmentsSlice';
import { createAppointmentFirebase } from '../../services/firebase/dbService';
import { Appointment } from '../../types';

export const MyAppointmentsScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const [syncing, setSyncing] = useState(false);

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

    setSyncing(true);
    const pending = await fetchPendingAppointmentsLocal();
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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Appointments</Text>
        {syncing ? <Text style={styles.syncing}>Syncing...</Text> : null}
      </View>
      <FlatList
        data={appointments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <AppointmentCard appointment={item as Appointment} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No appointments yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  syncing: {
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold'
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