import axios from 'axios';
import { firebaseConfig } from './config';
import { Appointment, Doctor, UserProfile } from '../../types';

const dbApi = axios.create({
  baseURL: firebaseConfig.dbUrl
});

export const fetchDoctorsFromFirebase = async (): Promise<Doctor[]> => {
  const response = await dbApi.get('/doctors.json');
  const data = response.data || {};
  return Object.keys(data).map((key) => ({
    id: key,
    name: data[key].name,
    specialty: data[key].specialty,
    rating: data[key].rating,
    image: data[key].image,
    category: data[key].category,
    bio: data[key].bio
  }));
};

export const saveUserProfileFirebase = async (localId: string, token: string, profile: UserProfile) => {
  await dbApi.put(`/users/${localId}/profile.json?auth=${token}`, profile);
};

export const createAppointmentFirebase = async (
  localId: string,
  token: string,
  appointment: Appointment
) => {
  const response = await dbApi.post(`/users/${localId}/appointments.json?auth=${token}`, appointment);
  return response.data.name as string;
};

export const fetchAppointmentsFirebase = async (localId: string, token: string) => {
  const response = await dbApi.get(`/users/${localId}/appointments.json?auth=${token}`);
  return response.data;
};

export const fetchDoctors = fetchDoctorsFromFirebase;
export const saveProfile = saveUserProfileFirebase;
export const createAppointment = createAppointmentFirebase;