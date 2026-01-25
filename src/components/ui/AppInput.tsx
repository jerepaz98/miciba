import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = TextInputProps & {
  label?: string;
  icon?: string;
};

export const AppInput = ({ label, icon, ...props }: Props) => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={[styles.inputWrapper, icon ? styles.inputWithIcon : null]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textSoft}
        style={[styles.input, icon ? styles.inputInner : null]}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: colors.textDark,
    fontFamily: 'Nunito_600SemiBold'
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md
  },
  icon: {
    marginRight: theme.spacing.sm,
    fontSize: 16
  },
  input: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: 'Nunito_400Regular'
  },
  inputInner: {
    flex: 1,
    paddingHorizontal: 0
  }
});