import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppInput } from '../../components/ui/AppInput';
import { DoctorCardUI } from '../../components/doctors/DoctorCardUI';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { DoctorsStackParamList } from '../../navigation/DoctorsStack';
import { RootState } from '../../store/store';
import { setDoctors } from '../../store/slices/doctorsSlice';
import { fetchDoctorsFromFirebase } from '../../services/firebase/dbService';
import { cacheDoctors, fetchCachedDoctors } from '../../database/db';
import { mockDoctors } from '../../utils/mockDoctors';
import { Doctor } from '../../types';
import { strings } from '../../constants/strings';

type Props = NativeStackScreenProps<DoctorsStackParamList, 'DoctorsList'>;

export const DoctorsScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const doctors = useSelector((state: RootState) => state.doctors.doctors);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        try {
          const remoteDoctors = await fetchDoctorsFromFirebase();
          const normalized = remoteDoctors.length > 0 ? remoteDoctors : mockDoctors;
          dispatch(setDoctors(normalized));
          await cacheDoctors(normalized);
          return;
        } catch (error) {
          const fallback = mockDoctors;
          dispatch(setDoctors(fallback));
          await cacheDoctors(fallback);
          return;
        }
      }

      const cached = await fetchCachedDoctors();
      dispatch(setDoctors(cached.length ? cached : mockDoctors));
    };

    loadDoctors();
  }, [dispatch]);

  const filtered = useMemo(() => {
    return doctors.filter((doctor) => doctor.name.toLowerCase().includes(search.toLowerCase()));
  }, [doctors, search]);

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <DoctorCardUI doctor={item} onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })} />
  );

  return (
    <View style={styles.container}>
      <AppInput value={search} onChangeText={setSearch} placeholder={strings.doctors.searchDoctor} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
  list: {
    paddingTop: theme.spacing.md,
    paddingBottom: 120
  }
});
