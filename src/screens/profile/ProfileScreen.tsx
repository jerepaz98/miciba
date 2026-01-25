import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppButton } from '../../components/ui/AppButton';
import { AppInput } from '../../components/ui/AppInput';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { RootState } from '../../store/store';
import { setProfile } from '../../store/slices/userSlice';
import { fetchUserProfileLocal, saveUserProfileLocal } from '../../database/db';
import { saveUserProfileFirebase } from '../../services/firebase/dbService';
import { UserProfile } from '../../types';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const storedProfile = useSelector((state: RootState) => state.user.profile);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const localProfile = await fetchUserProfileLocal();
      const profile = localProfile ?? storedProfile;
      if (profile) {
        setFullName(profile.fullName);
        setPhone(profile.phone);
        setPhotoUri(profile.photoUri ?? null);
        setAddress(profile.address ?? null);
        setCoords({ latitude: profile.latitude ?? null, longitude: profile.longitude ?? null });
        dispatch(setProfile(profile));
      }
    };

    loadProfile();
  }, [dispatch, storedProfile]);

  const pickFromGallery = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async (cameraType: ImagePicker.CameraType) => {
    await ImagePicker.requestCameraPermissionsAsync();
    const result = await ImagePicker.launchCameraAsync({
      cameraType,
      allowsEditing: true,
      quality: 0.7
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMessage('Location permission denied');
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    const geocode = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    const entry = geocode[0];
    const addressText = entry ? `${entry.street ?? ''} ${entry.name ?? ''}, ${entry.city ?? ''}`.trim() : null;

    setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    setAddress(addressText);
  };

  const onSave = async () => {
    const profile: UserProfile = {
      fullName,
      phone,
      photoUri,
      latitude: coords.latitude,
      longitude: coords.longitude,
      address
    };

    await saveUserProfileLocal(profile);
    dispatch(setProfile(profile));
    setMessage('Profile saved locally');

    const netState = await NetInfo.fetch();
    if (netState.isConnected && auth.localId && auth.token) {
      try {
        await saveUserProfileFirebase(auth.localId, auth.token, profile);
        setMessage('Profile synced to Firebase');
      } catch (error) {
        setMessage('Saved locally. Firebase sync failed.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.avatarWrapper}>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.avatar} /> : <View style={styles.placeholder} />}
      </View>
      <View style={styles.photoActions}>
        <AppButton title="Gallery" onPress={pickFromGallery} style={styles.photoButton} />
        <AppButton title="Front Cam" onPress={() => takePhoto(ImagePicker.CameraType.front)} style={styles.photoButton} />
        <AppButton title="Back Cam" onPress={() => takePhoto(ImagePicker.CameraType.back)} style={styles.photoButton} />
      </View>
      <AppInput label="Full Name" value={fullName} onChangeText={setFullName} />
      <AppInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <View style={styles.locationRow}>
        <AppButton title="Get Location" onPress={handleLocation} style={styles.locationButton} />
        <Text style={styles.locationText}>{address ?? 'No address yet'}</Text>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <AppButton title="Save Profile" onPress={onSave} />
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
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: theme.spacing.md
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border
  },
  photoActions: {
    marginBottom: theme.spacing.md
  },
  photoButton: {
    backgroundColor: colors.teal,
    marginBottom: theme.spacing.sm
  },
  locationRow: {
    marginBottom: theme.spacing.md
  },
  locationButton: {
    backgroundColor: colors.green
  },
  locationText: {
    marginTop: theme.spacing.sm,
    color: colors.textSoft,
    fontFamily: 'Nunito_400Regular'
  },
  message: {
    marginBottom: theme.spacing.md,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold'
  }
});