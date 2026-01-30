import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryCard } from '../../components/doctors/CategoryCard';
import { DoctorCardUI } from '../../components/doctors/DoctorCardUI';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import { setDoctors } from '../../store/slices/doctorsSlice';
import { fetchDoctorsFromFirebase } from '../../services/firebase/dbService';
import { cacheDoctors, fetchCachedDoctors } from '../../database/db';
import { mockDoctors } from '../../data/mockDoctors';
import { mockCategories } from '../../data/mockCategories';
import { MainTabsParamList } from '../../navigation/MainTabs';
import { Doctor } from '../../types';
import { strings } from '../../constants/strings';

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const { doctors } = useSelector((state: RootState) => state.doctors);
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      const matchesCategory =
        selectedCategory === 'all' ||
        doctor.specialty === selectedCategory ||
        doctor.category === selectedCategory;
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

  const ListHeader = (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>{strings.home.findYourSpecialist}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color={colors.textDark} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.iconButtonSpacer]} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={colors.textSoft} />
        <TextInput
          placeholder={strings.home.searchPlaceholder}
          placeholderTextColor={colors.textSoft}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.banner}>
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>{strings.home.bannerTitle}</Text>
            <Text style={styles.bannerSubtitle}>{strings.home.bannerSubtitle}</Text>
          </View>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>Dr.</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{strings.home.categories}</Text>
        <Text style={styles.sectionAction}>{strings.home.seeAll}</Text>
      </View>
      <FlatList
        data={mockCategories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            label={item.label}
            icon={item.icon}
            iconFamily={item.iconFamily}
            active={item.id === selectedCategory}
            onPress={() => setSelectedCategory(item.id)}
          />
        )}
        contentContainerStyle={styles.categories}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{strings.home.availableDoctors}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top + 4 }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  headerActions: {
    flexDirection: 'row'
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  iconButtonSpacer: {
    marginLeft: theme.spacing.sm
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    marginBottom: theme.spacing.lg
  },
  searchInput: {
    marginLeft: theme.spacing.sm,
    fontFamily: 'Nunito_400Regular',
    flex: 1,
    color: colors.textDark
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadow.medium
  },
  bannerOverlay: {
    position: 'absolute',
    right: -60,
    top: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryAlt,
    opacity: 0.6
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bannerText: {
    flex: 1,
    paddingRight: theme.spacing.md
  },
  bannerTitle: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'Nunito_700Bold'
  },
  bannerSubtitle: {
    marginTop: 4,
    color: colors.white,
    opacity: 0.9,
    fontFamily: 'Nunito_400Regular'
  },
  bannerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerAvatarText: {
    color: colors.white,
    fontFamily: 'Nunito_700Bold',
    fontSize: 18
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    fontSize: 18
  },
  sectionAction: {
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12
  },
  categories: {
    paddingBottom: theme.spacing.sm
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
    backgroundColor: colors.bg
  }
});
