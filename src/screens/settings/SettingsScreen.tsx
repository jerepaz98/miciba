import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';

export const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{strings.menu.settings}</Text>
    <Text style={styles.subtitle}>{strings.menu.settingsSubtitle}</Text>
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
