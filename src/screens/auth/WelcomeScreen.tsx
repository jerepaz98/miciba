import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { AppButton } from '../../components/ui/AppButton';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { strings } from '../../constants/strings';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = ({ navigation }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{strings.auth.welcomeTitle}</Text>
    <Text style={styles.subtitle}>{strings.auth.welcomeSubtitle}</Text>
    <View style={styles.actions}>
      <AppButton title={strings.auth.signIn} onPress={() => navigation.navigate('SignIn')} style={styles.buttonSpacing} />
      <AppButton
        title={strings.auth.createAccount}
        onPress={() => navigation.navigate('SignUp')}
        style={styles.secondaryButton}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.bg
  },
  title: {
    fontSize: 32,
    color: colors.textDark,
    fontFamily: 'Nunito_700Bold',
    marginBottom: theme.spacing.md
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  },
  actions: {
    marginTop: theme.spacing.xl
  },
  buttonSpacing: {
    marginBottom: theme.spacing.md
  },
  secondaryButton: {
    backgroundColor: colors.teal
  }
});
