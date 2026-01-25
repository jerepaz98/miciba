import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { MenuStackParamList } from '../../navigation/MenuStack';
import { AppButton } from '../../components/ui/AppButton';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { logout } from '../../store/slices/authSlice';
import { clearProfile } from '../../store/slices/userSlice';
import { deleteSession } from '../../database/db';

type Props = NativeStackScreenProps<MenuStackParamList, 'MenuHome'>;

export const MenuScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await deleteSession();
    dispatch(logout());
    dispatch(clearProfile());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.actions}>
        <AppButton title="Profile" onPress={() => navigation.navigate('Profile')} style={styles.buttonSpacing} />
        <AppButton title="My Appointments" onPress={() => navigation.navigate('MyAppointments')} style={styles.buttonSpacing} />
        <AppButton title="Settings" onPress={() => navigation.navigate('Settings')} style={styles.buttonSpacing} />
        <AppButton title="Logout" onPress={handleLogout} style={styles.logout} />
      </View>
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
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.lg
  },
  actions: {
    marginBottom: theme.spacing.md
  },
  buttonSpacing: {
    marginBottom: theme.spacing.md
  },
  logout: {
    backgroundColor: colors.danger
  }
});