import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store } from './src/store/store';
import { initDatabase, fetchSession } from './src/database/db';
import { setAuth } from './src/store/slices/authSlice';
import { colors } from './src/constants/colors';

enableScreens();

const AppBootstrap = () => {
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
        <Text style={{ marginTop: 12, color: colors.textSoft }}>Loading MiCIBA...</Text>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}
