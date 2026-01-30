import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../../types';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  doctor: Doctor;
  onPress: () => void;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const DoctorCardUI = ({ doctor, onPress }: Props) => (
  <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.85}>
    {doctor.image ? (
      <Image source={{ uri: doctor.image }} style={styles.avatar} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{getInitials(doctor.name)}</Text>
      </View>
    )}
    <View style={styles.info}>
      <View style={styles.row}>
        <Text style={styles.name}>{doctor.name}</Text>
        <View style={styles.ratingWrap}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <View style={styles.metaRow}>
        {typeof doctor.experienceYears === 'number' ? (
          <Text style={styles.metaText}>{doctor.experienceYears} anios</Text>
        ) : null}
        {doctor.patients ? <Text style={styles.metaText}>{doctor.patients} pacientes</Text> : null}
      </View>
      <Text style={styles.cta}>Ver perfil</Text>
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
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...theme.shadow.light
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
    fontSize: 16
  },
  info: {
    flex: 1,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    marginLeft: 4,
    color: colors.textDark,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4
  },
  metaText: {
    fontSize: 12,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular',
    marginRight: 12
  },
  cta: {
    marginTop: 6,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12
  }
});
