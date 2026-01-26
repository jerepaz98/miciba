import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { AppNavigator } from './navigation/AppNavigator';
import { initDatabase, fetchSession } from './database/db';
import { setAuth } from './store/slices/authSlice';
import { colors } from './constants/colors';
import { strings } from './constants/strings';

export const RootApp = () => {
  const dispatch = useDispatch();
  const [dbReady, setDbReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold
  });

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      const session = await fetchSession();
      if (session) {
        dispatch(setAuth(session));
      }
      setDbReady(true);
    };

    init();
  }, [dispatch]);

  if (!fontsLoaded || !dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSoft }}>
          {strings.common.loading} {strings.auth.welcomeTitle}...
        </Text>
      </View>
    );
  }

  return <AppNavigator />;
};
