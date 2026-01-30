import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { MenuStackParamList } from '../../navigation/MenuStack';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { logout } from '../../store/slices/authSlice';
import { clearProfile } from '../../store/slices/userSlice';
import { deleteSession } from '../../database/db';

type Props = NativeStackScreenProps<MenuStackParamList, 'MenuHome'>;

export const MenuScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.92, 380);

  const handleLogout = async () => {
    await deleteSession();
    dispatch(logout());
    dispatch(clearProfile());
  };

  const items = [
    {
      id: 'appointments',
      label: 'Mis turnos',
      icon: 'calendar-outline',
      onPress: () => {
        console.log('Mis turnos');
        navigation.navigate('MyAppointments');
      }
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: 'person-outline',
      onPress: () => {
        console.log('Perfil');
        navigation.navigate('Profile');
      }
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: 'settings-outline',
      onPress: () => {
        console.log('Ajustes');
        navigation.navigate('Settings');
      }
    },
    {
      id: 'logout',
      label: 'Cerrar sesión',
      icon: 'log-out-outline',
      onPress: () => {
        console.log('Cerrar sesión');
        handleLogout();
      }
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.overlay} />
      <View
        style={[
          styles.panel,
          {
            width: panelWidth,
            bottom: 90 + insets.bottom
          }
        ]}
      >
        {items.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity style={styles.row} activeOpacity={0.75} onPress={item.onPress}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={18} color={styles.iconColor.color} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={styles.chevronColor.color} />
            </TouchableOpacity>
            {index < items.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  panel: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#3D6BD9',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#0B1E2D',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  iconColor: {
    color: '#3D6BD9'
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold'
  },
  chevronColor: {
    color: '#FFFFFF'
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginLeft: 46
  }
});
