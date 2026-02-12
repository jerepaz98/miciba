import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { colors } from '../src/constants/colors';
import { deleteSession } from '../src/database/db';
import { navigateFromModal } from '../src/navigation/navigationRef';
import { logout } from '../src/store/slices/authSlice';
import { clearProfile } from '../src/store/slices/userSlice';

type MenuTarget = 'MyAppointments' | 'Profile' | 'Settings';

export default function MenuModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(width * 0.88, 390);

  const closeModal = () => {
    router.back();
  };

  const closeAndNavigate = (target: MenuTarget) => {
    router.back();
    setTimeout(() => {
      navigateFromModal(target);
    }, 0);
  };

  const handleLogout = async () => {
    await deleteSession();
    dispatch(logout());
    dispatch(clearProfile());
    closeModal();
  };

  const items = [
    { id: 'appointments', label: 'Mis turnos', icon: 'calendar-outline', action: () => closeAndNavigate('MyAppointments') },
    { id: 'profile', label: 'Perfil', icon: 'person-outline', action: () => closeAndNavigate('Profile') },
    { id: 'settings', label: 'Ajustes', icon: 'settings-outline', action: () => closeAndNavigate('Settings') },
    { id: 'logout', label: 'Cerrar sesión', icon: 'log-out-outline', action: handleLogout, danger: true }
  ];

  return (
    <View style={styles.container}>
      <BlurView intensity={58} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay} />
      <Pressable style={StyleSheet.absoluteFillObject} onPress={closeModal} />

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={[styles.panel, { width: panelWidth, marginBottom: Math.max(insets.bottom, 14) + 70 }]}>
          <Pressable style={styles.closeButton} onPress={closeModal} hitSlop={8}>
            <Ionicons name="close" size={20} color={colors.white} />
          </Pressable>

          {items.map((item, index) => (
            <View key={item.id}>
              <Pressable style={styles.row} onPress={item.action}>
                <View style={[styles.iconCircle, item.danger ? styles.iconCircleDanger : null]}>
                  <Ionicons name={item.icon as any} size={18} color={colors.white} />
                </View>
                <Text style={[styles.label, item.danger ? styles.labelDanger : null]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={item.danger ? '#FFD5D5' : colors.white} />
              </Pressable>
              {index < items.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)'
  },
  panel: {
    borderRadius: 20,
    backgroundColor: '#237DC4',
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
    shadowColor: '#0B1E2D',
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 4
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
    backgroundColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  iconCircleDanger: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  label: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold'
  },
  labelDanger: {
    color: '#FFE3E3'
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginLeft: 46
  }
});
