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
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

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

  const [showPassword, setShowPassword] = useState(false);

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
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../../../assets/login-bg.png')}
        resizeMode="cover"
        style={styles.bg}
      >
        {/* overlay para que se lea todo bien */}
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.title}>Iniciar sesión</Text>

              <Text style={styles.subtitle}>
                ¿No tenés cuenta?{' '}
                <Text style={styles.linkInline} onPress={() => navigation.navigate('SignUp')}>
                  Registrate
                </Text>
              </Text>

              <View style={{ height: theme.spacing.lg }} />

              <AppInput
                label={strings.auth.email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password con icono ojito */}
              <View style={styles.passwordWrap}>
                <AppInput
                  label={strings.auth.password}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton
                title={loading ? strings.auth.signingIn : strings.auth.signIn}
                onPress={onSubmit}
                disabled={loading}
                style={styles.primaryBtn}
              />

              {/* Opcional: "Olvidaste tu contraseña?" (mock) */}
              <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
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
    flex: 1,
    justifyContent: 'center'
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)'
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.86)',
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
    fontSize: 30,
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

  error: {
    color: colors.danger,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontFamily: 'Nunito_600SemiBold'
  },

  primaryBtn: {
    marginTop: theme.spacing.md
  },

  forgot: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    color: colors.textSoft,
    fontFamily: 'Nunito_600SemiBold'
  }
});


