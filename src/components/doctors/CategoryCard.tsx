import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export const CategoryCard = ({ label, active, onPress }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.card, active && styles.activeCard]}
    activeOpacity={0.8}
  >
    <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.sm
  },
  activeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  label: {
    color: colors.textDark,
    fontFamily: 'Nunito_600SemiBold'
  },
  activeLabel: {
    color: colors.white
  }
});