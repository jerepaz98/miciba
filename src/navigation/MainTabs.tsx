import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { DoctorsStack } from './DoctorsStack';
import { NotificationScreen } from '../screens/notification/NotificationScreen';
import { MenuStack } from './MenuStack';
import { colors } from '../constants/colors';
import { strings } from '../constants/strings';

export type MainTabsParamList = {
  HomeTab: undefined;
  DoctorsTab: undefined;
  NotificationTab: undefined;
  MenuTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabIcon = ({
  name,
  focused,
  family = 'Ionicons'
}: {
  name: string;
  focused: boolean;
  family?: 'Ionicons' | 'MaterialCommunityIcons';
}) => {
  const color = focused ? colors.primary : colors.textSoft;
  if (family === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={name as any} size={24} color={color} />;
  }
  return <Ionicons name={name as any} size={24} color={color} />;
};

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSoft,
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        tabBarLabel: strings.home.tabLabel,
        title: strings.home.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />
      }}
    />
    <Tab.Screen
      name="DoctorsTab"
      component={DoctorsStack}
      options={{
        tabBarLabel: strings.doctors.doctors,
        title: strings.doctors.doctors,
        tabBarIcon: ({ focused }) => <TabIcon name="stethoscope" family="MaterialCommunityIcons" focused={focused} />
      }}
    />
    <Tab.Screen
      name="NotificationTab"
      component={NotificationScreen}
      options={{
        tabBarLabel: strings.notifications.notifications,
        title: strings.notifications.notifications,
        tabBarIcon: ({ focused }) => <TabIcon name="notifications" focused={focused} />
      }}
    />
    <Tab.Screen
      name="MenuTab"
      component={MenuStack}
      options={{
        tabBarLabel: strings.menu.menu,
        title: strings.menu.menu,
        tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    height: 78,
    paddingBottom: 12,
    paddingTop: 12,
    borderRadius: 22,
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    shadowColor: '#0B1E2D',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 4
  }
});
