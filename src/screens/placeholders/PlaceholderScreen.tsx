import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export const PlaceholderScreen = ({ title, subtitle }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  }
});