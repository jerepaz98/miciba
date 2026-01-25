import * as SQLite from 'expo-sqlite';
import { Appointment, Session, UserProfile, Doctor } from '../types';

const db = SQLite.openDatabase('doctorspoint.db');

const executeSqlAsync = (sql: string, params: any[] = []) =>
  new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });

const mapAppointment = (row: any): Appointment => ({
  ...row,
  id: String(row.id)
});

export const initDatabase = async () => {
  await executeSqlAsync(
    'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, localId TEXT, email TEXT);'
  );
  await executeSqlAsync(
    'CREATE TABLE IF NOT EXISTS doctors_cache (id TEXT PRIMARY KEY NOT NULL, name TEXT, specialty TEXT, rating REAL, image TEXT, category TEXT, bio TEXT);'
  );
  await executeSqlAsync(
    'CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, localId TEXT, doctorId TEXT, doctorName TEXT, date TEXT, time TEXT, notes TEXT, status TEXT, pendingSync INTEGER, firebaseId TEXT);'
  );
  await executeSqlAsync(
    'CREATE TABLE IF NOT EXISTS user_profile (id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, phone TEXT, photoUri TEXT, latitude REAL, longitude REAL, address TEXT);'
  );
};

export const insertSession = async (session: Session) => {
  await executeSqlAsync('DELETE FROM sessions;');
  await executeSqlAsync('INSERT INTO sessions (token, localId, email) VALUES (?, ?, ?);', [
    session.token,
    session.localId,
    session.email
  ]);
};

export const fetchSession = async (): Promise<Session | null> => {
  const result = await executeSqlAsync('SELECT token, localId, email FROM sessions LIMIT 1;');
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows.item(0) as Session;
};

export const deleteSession = async () => {
  await executeSqlAsync('DELETE FROM sessions;');
};

export const cacheDoctors = async (doctors: Doctor[]) => {
  await executeSqlAsync('DELETE FROM doctors_cache;');
  const insertSql =
    'INSERT INTO doctors_cache (id, name, specialty, rating, image, category, bio) VALUES (?, ?, ?, ?, ?, ?, ?);';

  for (const doctor of doctors) {
    await executeSqlAsync(insertSql, [
      doctor.id,
      doctor.name,
      doctor.specialty,
      doctor.rating,
      doctor.image,
      doctor.category,
      doctor.bio
    ]);
  }
};

export const fetchCachedDoctors = async (): Promise<Doctor[]> => {
  const result = await executeSqlAsync('SELECT * FROM doctors_cache;');
  const doctors: Doctor[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    doctors.push(result.rows.item(i) as Doctor);
  }
  return doctors;
};

export const saveUserProfileLocal = async (profile: UserProfile) => {
  await executeSqlAsync('DELETE FROM user_profile;');
  await executeSqlAsync(
    'INSERT INTO user_profile (fullName, phone, photoUri, latitude, longitude, address) VALUES (?, ?, ?, ?, ?, ?);',
    [
      profile.fullName,
      profile.phone,
      profile.photoUri ?? null,
      profile.latitude ?? null,
      profile.longitude ?? null,
      profile.address ?? null
    ]
  );
};

export const fetchUserProfileLocal = async (): Promise<UserProfile | null> => {
  const result = await executeSqlAsync('SELECT * FROM user_profile LIMIT 1;');
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows.item(0) as UserProfile;
};

export const insertAppointmentLocal = async (appointment: Appointment) => {
  await executeSqlAsync(
    'INSERT INTO appointments (localId, doctorId, doctorName, date, time, notes, status, pendingSync, firebaseId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
    [
      appointment.localId,
      appointment.doctorId,
      appointment.doctorName,
      appointment.date,
      appointment.time,
      appointment.notes,
      appointment.status,
      appointment.pendingSync,
      appointment.firebaseId ?? null
    ]
  );
};

export const fetchAllAppointmentsLocal = async (): Promise<Appointment[]> => {
  const result = await executeSqlAsync('SELECT * FROM appointments ORDER BY id DESC;');
  const appointments: Appointment[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    appointments.push(mapAppointment(result.rows.item(i)));
  }
  return appointments;
};

export const fetchPendingAppointmentsLocal = async (): Promise<Appointment[]> => {
  const result = await executeSqlAsync('SELECT * FROM appointments WHERE pendingSync = 1;');
  const appointments: Appointment[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    appointments.push(mapAppointment(result.rows.item(i)));
  }
  return appointments;
};

export const markAppointmentSyncedLocal = async (id: string, firebaseId: string) => {
  await executeSqlAsync('UPDATE appointments SET pendingSync = 0, status = ?, firebaseId = ? WHERE id = ?;', [
    'synced',
    firebaseId,
    id
  ]);
};