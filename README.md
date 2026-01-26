# MiCIBA

Aplicación móvil para encontrar especialistas, reservar turnos y gestionar el perfil del paciente con soporte sin conexión. El proyecto está desarrollado con Expo + React Native + TypeScript y contempla persistencia local con SQLite y sincronización con Firebase.

## Funcionalidades
- Autenticación con correo y contraseña.
- Listado y detalle de doctores.
- Reserva y gestión de turnos.
- Perfil con foto desde cámara/galería y ubicación.
- Caché local con SQLite.
- Sincronización sin conexión/con conexión de turnos y perfil.

## Tecnologías
- Expo
- React Native
- TypeScript
- Redux Toolkit
- Firebase REST API
- Firebase Realtime Database (RTDB)
- SQLite (expo-sqlite)
- NetInfo
- ImagePicker
- Location

## Instalación (Windows)
1) Instalar dependencias:
```bash
npm install
```
2) Iniciar el proyecto:
```bash
npx expo start -c
```

## Configuración Firebase
En `src/services/firebase/config.ts`:
- Reemplazar `apiKey` con `FIREBASE_API_KEY`.
- Reemplazar `dbUrl` con `FIREBASE_DB_URL`.
- Mantener `authUrl` con el valor de Identity Toolkit: `https://identitytoolkit.googleapis.com/v1`.

Pasos en Firebase:
1) Activar autenticación Email/Password (correo y contraseña).
2) Crear una Realtime Database.

Estructura RTDB recomendada:
- `/doctors.json`
- `/users/{localId}/profile.json`
- `/users/{localId}/appointments.json`
- `/notifications/{localId}.json`

## Persistencia local y sincronización sin conexión
- MiCiba: se descargan desde Firebase cuando hay conexión y se cachean en SQLite. En modo sin conexión se leen desde `doctors_cache`.
- Turnos: si no hay conexión, se guardan con `pendingSync = 1` y se sincronizan al recuperar internet.
- Perfil: siempre se guarda localmente en SQLite y se sincroniza con Firebase cuando hay conexión.

## Permisos (Android)
- Cámara (foto de perfil).
- Galería.
- Ubicación (geolocalización y geocodificación inversa).

## Estructura del proyecto
```
app/
  _layout.tsx
src/
  components/
    appointments/
    doctors/
    notifications/
    ui/
  constants/
  database/
  navigation/
  screens/
    appointments/
    auth/
    doctors/
    home/
    menu/
    notification/
    placeholders/
    profile/
    settings/
  services/
    firebase/
  store/
    slices/
  types/
  utils/
```

## Capturas
Pegar aquí las capturas de pantalla del flujo principal de la app.

## Curso
Coderhouse - Desarrollo de Aplicaciones
