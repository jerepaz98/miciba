import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

export const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.subtitle}>Notifications, privacy, and app preferences.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg
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