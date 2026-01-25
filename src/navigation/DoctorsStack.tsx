import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorsScreen } from '../screens/doctors/DoctorsScreen';
import { DoctorDetailScreen } from '../screens/doctors/DoctorDetailScreen';
import { AppointmentFormScreen } from '../screens/doctors/AppointmentFormScreen';

export type DoctorsStackParamList = {
  DoctorsList: undefined;
  DoctorDetail: { doctorId: string };
  AppointmentForm: { doctorId: string };
};

const Stack = createNativeStackNavigator<DoctorsStackParamList>();

export const DoctorsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="DoctorsList" component={DoctorsScreen} options={{ title: 'Doctors' }} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: 'Doctor' }} />
    <Stack.Screen
      name="AppointmentForm"
      component={AppointmentFormScreen}
      options={{ title: 'Book Appointment' }}
    />
  </Stack.Navigator>
);