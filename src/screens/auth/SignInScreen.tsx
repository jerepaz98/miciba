import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { AppButton } from '../../components/ui/AppButton';
import { AppInput } from '../../components/ui/AppInput';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { login } from '../../services/firebase/authService';
import { setAuth } from '../../store/slices/authSlice';
import { insertSession } from '../../database/db';
import { strings } from '../../constants/strings';

const schema = yup.object({
  email: yup.string().email(strings.auth.validations.invalidEmail).required(strings.auth.validations.emailRequired),
  password: yup
    .string()
    .min(6, strings.auth.validations.minPassword)
    .required(strings.auth.validations.passwordRequired)
});

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export const SignInScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      await schema.validate({ email, password });
      setLoading(true);
      const response = await login(email.trim(), password);
      const session = { token: response.idToken, localId: response.localId, email: response.email };
      dispatch(setAuth(session));
      await insertSession(session);
    } catch (err: any) {
      setError(err?.message || strings.errors.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.auth.welcomeBack}</Text>
      <AppInput label={strings.auth.email} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <AppInput label={strings.auth.password} value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton
        title={loading ? strings.auth.signingIn : strings.auth.signIn}
        onPress={onSubmit}
        disabled={loading}
      />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        {strings.auth.newHere}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: colors.bg
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.lg
  },
  error: {
    color: colors.danger,
    marginBottom: theme.spacing.md,
    fontFamily: 'Nunito_600SemiBold'
  },
  link: {
    marginTop: theme.spacing.md,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold'
  }
});
