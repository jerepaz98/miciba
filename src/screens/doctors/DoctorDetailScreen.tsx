import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { DoctorsStackParamList } from '../../navigation/DoctorsStack';
import { RootState } from '../../store/store';
import { AppButton } from '../../components/ui/AppButton';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { mockDoctors } from '../../utils/mockDoctors';
import { strings } from '../../constants/strings';

const actionButtons = [strings.doctors.call, strings.doctors.videoCall, strings.doctors.message];

type Props = NativeStackScreenProps<DoctorsStackParamList, 'DoctorDetail'>;

export const DoctorDetailScreen = ({ route, navigation }: Props) => {
  const doctors = useSelector((state: RootState) => state.doctors.doctors);
  const doctor = useMemo(() => {
    return doctors.find((item) => item.id === route.params.doctorId) ||
      mockDoctors.find((item) => item.id === route.params.doctorId);
  }, [doctors, route.params.doctorId]);

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{strings.doctors.notFound}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: doctor.image }} style={styles.avatar} />
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>
          {strings.doctors.specialtyLabels[doctor.specialty as keyof typeof strings.doctors.specialtyLabels] ??
            doctor.specialty}
        </Text>
        <Text style={styles.bio}>
          {strings.doctors.bioByDoctorId[doctor.id as keyof typeof strings.doctors.bioByDoctorId] ?? doctor.bio}
        </Text>
      </View>
      <View style={styles.actions}>
        {actionButtons.map((label) => (
          <TouchableOpacity key={label} style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <AppButton
        title={strings.doctors.bookAppointment}
        onPress={() => navigation.navigate('AppointmentForm', { doctorId: doctor.id })}
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
  card: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.light
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md
  },
  name: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  specialty: {
    color: colors.textSoft,
    marginTop: 4,
    fontFamily: 'Nunito_600SemiBold'
  },
  bio: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    marginHorizontal: 4,
    ...theme.shadow.light
  },
  actionText: {
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  }
});
