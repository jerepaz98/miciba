import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

type Props = {
  title: string;
  message: string;
};

export const NotificationCard = ({ title, message }: Props) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadow.light
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: 4
  },
  message: {
    fontFamily: 'Nunito_400Regular',
    color: colors.textSoft
  }
});