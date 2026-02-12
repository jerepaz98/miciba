import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { RootState } from '../store/store';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MyAppointmentsScreen } from '../screens/appointments/MyAppointmentsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { strings } from '../constants/strings';
import { navigationRef } from './navigationRef';

export type AuthenticatedStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  MyAppointments: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AuthenticatedStackParamList>();

const AuthenticatedStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: strings.profile.profile }} />
    <Stack.Screen
      name="MyAppointments"
      component={MyAppointmentsScreen}
      options={{ title: strings.appointments.myAppointments }}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: strings.menu.settings }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer ref={navigationRef}>{isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}</NavigationContainer>
  );
};
