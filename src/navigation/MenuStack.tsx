import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuScreen } from '../screens/menu/MenuScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MyAppointmentsScreen } from '../screens/appointments/MyAppointmentsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { strings } from '../constants/strings';

export type MenuStackParamList = {
  MenuHome: undefined;
  Profile: undefined;
  MyAppointments: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MenuStackParamList>();

export const MenuStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MenuHome" component={MenuScreen} options={{ title: strings.menu.menu }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: strings.profile.profile }} />
    <Stack.Screen
      name="MyAppointments"
      component={MyAppointmentsScreen}
      options={{ title: strings.appointments.myAppointments }}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: strings.menu.settings }} />
  </Stack.Navigator>
);
