export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  category: string;
  bio: string;
};

export type AppointmentStatus = 'pending' | 'synced';

export type Appointment = {
  id: string;
  localId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  pendingSync: number;
  firebaseId?: string | null;
};

export type UserProfile = {
  fullName: string;
  phone: string;
  photoUri?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
};

export type Session = {
  token: string;
  localId: string;
  email: string;
};