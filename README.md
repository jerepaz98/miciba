# DOCTOR'S POINT

App mobile para buscar especialistas, ver perfiles de doctores, reservar turnos y gestionar perfil con sincronizacion offline. Construida con Expo + React Native + TypeScript, Redux Toolkit, Firebase REST y SQLite.

## Requisitos
- Node.js + npm
- Expo CLI (`npm install -g expo-cli`)

## Instalacion
```bash
npm install
```

## Ejecutar
```bash
npm run start
```

## Configuracion Firebase
Editar `src/services/firebase/config.ts`:
- `FIREBASE_API_KEY`: API key de Firebase
- `AUTH_URL`: `https://identitytoolkit.googleapis.com/v1`
- `DB_URL`: URL de Realtime Database, ejemplo `https://tu-proyecto.firebaseio.com`

Estructura RTDB recomendada:
- `/doctors.json`
- `/users/{localId}/profile.json`
- `/users/{localId}/appointments.json`
- `/notifications/{localId}.json`

## Expo Router
- Entry point configurado como `expo-router/entry`.
- `app/_layout.tsx` envuelve toda la app con Redux Provider y renderiza el arbol de React Navigation.

## Offline sync
- Doctores: online se descargan desde Firebase y se cachean en SQLite, offline se leen desde `doctors_cache`.
- Turnos: si no hay conexion se guardan con `pendingSync = 1` y se sincronizan al recuperar internet.
- Perfil: siempre se guarda localmente en SQLite; solo se sube a Firebase si hay internet.

## SQLite (tablas locales)
- `sessions`: token, localId, email
- `doctors_cache`: cache de doctores
- `appointments`: turnos con `pendingSync`
- `user_profile`: perfil local

## Permisos requeridos
Asegurate de otorgar permisos de:
- Camara (foto de perfil)
- Galeria
- Ubicacion (reverse geocode)

## Estructura del proyecto
```
app/
  _layout.tsx
src/
  components/
    ui/
    doctors/
    appointments/
    notifications/
  screens/
    auth/
    home/
    doctors/
    appointments/
    notification/
    menu/
    profile/
    settings/
    placeholders/
  navigation/
  store/
    slices/
  services/
    firebase/
  database/
  constants/
  utils/
  types/
```

## Scripts
- `npm run start`: iniciar Expo
- `npm run android`: abrir en Android
- `npm run ios`: abrir en iOS
- `npm run web`: abrir en Web

## Notas
- Usa fuente Nunito mediante `@expo-google-fonts/nunito`.
- El Tab Bar usa iconos estilo emoji y muestra un dot activo.
- Reemplazar los assets de `assets/` por imagenes reales.