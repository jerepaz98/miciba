import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/home/HomeScreen';
import { DoctorsStack } from './DoctorsStack';
import { NotificationScreen } from '../screens/notification/NotificationScreen';
import { MenuStack } from './MenuStack';
import { colors } from '../constants/colors';

export type MainTabsParamList = {
  HomeTab: undefined;
  DoctorsTab: undefined;
  NotificationTab: undefined;
  MenuTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabIcon = ({ emoji, focused }: { emoji: string; focused: boolean }) => (
  <View style={styles.tabIconWrapper}>
    <Text style={[styles.emoji, focused && styles.emojiActive]}>{emoji}</Text>
    {focused ? <View style={styles.dot} /> : null}
  </View>
);

export const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="??" focused={focused} />
      }}
    />
    <Tab.Screen
      name="DoctorsTab"
      component={DoctorsStack}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="??" focused={focused} />
      }}
    />
    <Tab.Screen
      name="NotificationTab"
      component={NotificationScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="??" focused={focused} />
      }}
    />
    <Tab.Screen
      name="MenuTab"
      component={MenuStack}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="?" focused={focused} />
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: {
    fontSize: 20
  },
  emojiActive: {
    color: colors.primary
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4
  }
});