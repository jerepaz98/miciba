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
import { strings } from '../../constants/strings';

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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setMessage(strings.permissions.gallery);
      return;
    }
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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setMessage(strings.permissions.camera);
      return;
    }
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
      setMessage(strings.permissions.locationDenied);
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
    setMessage(strings.profile.savedLocal);

    const netState = await NetInfo.fetch();
    if (netState.isConnected && auth.localId && auth.token) {
      try {
        await saveUserProfileFirebase(auth.localId, auth.token, profile);
        setMessage(strings.profile.syncedFirebase);
      } catch (error) {
        setMessage(strings.profile.syncFailed);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.profile.profile}</Text>
      <View style={styles.avatarWrapper}>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.avatar} /> : <View style={styles.placeholder} />}
      </View>
      <View style={styles.photoActions}>
        <AppButton title={strings.profile.chooseFromGallery} onPress={pickFromGallery} style={styles.photoButton} />
        <AppButton
          title={strings.profile.frontCamera}
          onPress={() => takePhoto(ImagePicker.CameraType.front)}
          style={styles.photoButton}
        />
        <AppButton
          title={strings.profile.backCamera}
          onPress={() => takePhoto(ImagePicker.CameraType.back)}
          style={styles.photoButton}
        />
      </View>
      <AppInput label={strings.profile.fullName} value={fullName} onChangeText={setFullName} />
      <AppInput label={strings.profile.phone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <View style={styles.locationRow}>
        <AppButton title={strings.profile.getLocation} onPress={handleLocation} style={styles.locationButton} />
        <Text style={styles.locationText}>{address ?? strings.profile.noAddress}</Text>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <AppButton title={strings.profile.saveProfile} onPress={onSave} />
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
