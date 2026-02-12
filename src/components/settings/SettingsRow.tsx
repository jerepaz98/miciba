import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const SettingsRow = ({ iconName, iconBgColor, iconColor, title, value, onValueChange }: Props) => (
  <Pressable style={styles.row} onPress={() => onValueChange(!value)}>
    <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
      <Ionicons name={iconName} size={20} color={iconColor} />
    </View>

    <Text style={styles.title}>{title}</Text>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#D6DEE6', true: '#6EC6D4' }}
      thumbColor={value ? '#FFFFFF' : '#F4F7FA'}
      ios_backgroundColor="#D6DEE6"
      accessibilityLabel={`Activar o desactivar ${title}`}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadow.light
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  title: {
    flex: 1,
    color: colors.textDark,
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold'
  }
});
