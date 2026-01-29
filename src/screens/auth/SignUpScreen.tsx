import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ImageBackground
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { AuthStackParamList } from '../../navigation/AuthStack';
import { AppButton } from '../../components/ui/AppButton';
import { AppInput } from '../../components/ui/AppInput';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { signup } from '../../services/firebase/authService';
import { setAuth } from '../../store/slices/authSlice';
import { insertSession } from '../../database/db';
import { strings } from '../../constants/strings';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .required('El nombre de usuario es obligatorio'),
  email: yup.string().email(strings.auth.validations.invalidEmail).required(strings.auth.validations.emailRequired),
  phone: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/^\+?[0-9]{8,}$/, 'Teléfono inválido')
    .required('El teléfono es obligatorio'),
  password: yup
    .string()
    .min(6, strings.auth.validations.minPassword)
    .required(strings.auth.validations.passwordRequired),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmá tu contraseña')
});

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async () => {
    try {
      setError(null);
      await schema.validate({ username, email, phone, password, confirmPassword });
      setLoading(true);
      const response = await signup(email.trim(), password);
      const session = { token: response.idToken, localId: response.localId, email: response.email };
      dispatch(setAuth(session));
      await insertSession(session);
    } catch (err: any) {
      setError(err?.message || strings.errors.signupFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../../../assets/o5.png')}
        resizeMode="cover"
        style={styles.bg}
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              {
                paddingTop: insets.top + theme.spacing.lg,
                paddingBottom: insets.bottom + theme.spacing.lg
              }
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.title}>{strings.auth.createAccount}</Text>
              <Text style={styles.subtitle}>
                ¿Ya tenés cuenta?{' '}
                <Text style={styles.linkInline} onPress={() => navigation.navigate('SignIn')}>
                  Iniciá sesión
                </Text>
              </Text>

              <View style={{ height: theme.spacing.lg }} />

              <AppInput
                label="Usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <AppInput
                label={strings.auth.email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AppInput
                label="Teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />

              <View style={styles.passwordWrap}>
                <AppInput
                  label={strings.auth.password}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={[styles.inputText, styles.inputWithEye]}
                />

                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textSoft}
                  />
                </Pressable>
              </View>

              <View style={styles.passwordWrap}>
                <AppInput
                  label={strings.auth.repeatPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={[styles.inputText, styles.inputWithEye]}
                />

                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={12}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textSoft}
                  />
                </Pressable>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton
                title={loading ? strings.auth.creatingAccount : strings.auth.createAccount}
                onPress={onSubmit}
                disabled={loading}
                style={styles.primaryBtn}
                textStyle={styles.primaryText}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg
  },
  flex: {
    flex: 1
  },
  bg: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 20,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: colors.textSoft
  },
  linkInline: {
    color: colors.primary,
    fontFamily: 'Nunito_700Bold'
  },
  passwordWrap: {
    position: 'relative'
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  inputText: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontFamily: 'Nunito_400Regular'
  },
  inputWithEye: {
    paddingRight: 46
  },
  error: {
    color: colors.danger,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Nunito_600SemiBold'
  },
  primaryBtn: {
    backgroundColor: '#74E0D0',
    borderRadius: 14,
    paddingVertical: 14
  },
  primaryText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#0B3A4A'
  }
});

