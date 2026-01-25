import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppInput } from '../../components/ui/AppInput';
import { CategoryCard } from '../../components/doctors/CategoryCard';
import { DoctorCardUI } from '../../components/doctors/DoctorCardUI';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import { setDoctors } from '../../store/slices/doctorsSlice';
import { fetchDoctorsFromFirebase } from '../../services/firebase/dbService';
import { cacheDoctors, fetchCachedDoctors } from '../../database/db';
import { mockDoctors } from '../../utils/mockDoctors';
import { MainTabsParamList } from '../../navigation/MainTabs';
import { Doctor } from '../../types';

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const { doctors, categories } = useSelector((state: RootState) => state.doctors);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    return doctors.filter((doctor) => {
      const matchesCategory = selectedCategory === 'All' || doctor.category === selectedCategory;
      const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [doctors, selectedCategory, search]);

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <DoctorCardUI
      doctor={item}
      onPress={() =>
        navigation.navigate('DoctorsTab', {
          screen: 'DoctorDetail',
          params: { doctorId: item.id }
        } as never)
      }
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find your Specialist</Text>
      <AppInput value={search} onChangeText={setSearch} placeholder="Search doctor" icon="??" />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard label={item} active={item === selectedCategory} onPress={() => setSelectedCategory(item)} />
        )}
        contentContainerStyle={styles.categories}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Doctors</Text>
      </View>
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
  header: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.md
  },
  sectionHeader: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    fontSize: 18
  },
  categories: {
    paddingBottom: theme.spacing.sm
  },
  list: {
    paddingBottom: 120
  }
});