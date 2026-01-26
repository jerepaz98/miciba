import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Doctor } from '../../types';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';

type Props = {
  doctor: Doctor;
  onPress: () => void;
};

export const DoctorCardUI = ({ doctor, onPress }: Props) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.85}>
    <Image source={{ uri: doctor.image }} style={styles.avatar} />
    <View style={styles.info}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>
        {strings.doctors.specialtyLabels[doctor.specialty as keyof typeof strings.doctors.specialtyLabels] ??
          doctor.specialty}
      </Text>
      <Text style={styles.rating}>? {doctor.rating.toFixed(1)}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.light
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md
  },
  info: {
    flex: 1,
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  specialty: {
    color: colors.textSoft,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular'
  },
  rating: {
    marginTop: 4,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold'
  }
});
