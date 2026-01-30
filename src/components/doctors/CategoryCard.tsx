import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  label: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  active: boolean;
  onPress: () => void;
};

const renderIcon = (iconFamily: Props['iconFamily'], name: string, color: string) => {
  if (iconFamily === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={name as any} size={18} color={color} />;
  }
  return <Ionicons name={name as any} size={18} color={color} />;
};

export const CategoryCard = ({ label, icon, iconFamily, active, onPress }: Props) => {
  const tintColor = active ? colors.white : colors.primary;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, active && styles.activeCard]} activeOpacity={0.85}>
      <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
        {renderIcon(iconFamily, icon, tintColor)}
      </View>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm
  },
  iconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  label: {
    color: colors.textDark,
    fontFamily: 'Nunito_600SemiBold'
  },
  activeLabel: {
    color: colors.white
  }
});
